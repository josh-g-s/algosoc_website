// Browser-only sign-in for the pokerbots tournament admin page. Cognito hosted UI, authorization
// code flow with PKCE (the app client has no secret). The ID token is sent to the control API
// because it carries the verified email claim; access tokens do not. Tokens live in
// sessionStorage and die with the tab.

export interface PokerbotsConfig {
  hostedUiDomain: string;
  clientId: string;
  controlApiUrl: string;
}

const CALLBACK_PATH = "/pokerbots/auth/";
const K_TOKEN = "pb_id_token";
const K_VERIFIER = "pb_verifier";
const K_STATE = "pb_state";
const K_RETURN = "pb_return";

function store(): Storage | null {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

export async function loadConfig(): Promise<PokerbotsConfig | null> {
  try {
    const r = await fetch("/pokerbots-config.json", { cache: "no-store" });
    if (!r.ok) return null;
    const c = (await r.json()) as PokerbotsConfig;
    return c.hostedUiDomain && c.clientId && c.controlApiUrl ? c : null;
  } catch {
    return null;
  }
}

function b64url(bytes: Uint8Array): string {
  let s = "";
  bytes.forEach((b) => (s += String.fromCharCode(b)));
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function randomString(n = 32): string {
  const a = new Uint8Array(n);
  crypto.getRandomValues(a);
  return b64url(a);
}

export async function startSignIn(cfg: PokerbotsConfig, returnTo: string): Promise<void> {
  const s = store();
  if (!s) throw new Error("Session storage is blocked in this browser. Allow it for this site and try again.");
  const verifier = randomString(48);
  const state = randomString(16);
  const challenge = b64url(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier))));
  s.setItem(K_VERIFIER, verifier);
  s.setItem(K_STATE, state);
  s.setItem(K_RETURN, returnTo);
  const q = new URLSearchParams({
    response_type: "code",
    client_id: cfg.clientId,
    redirect_uri: location.origin + CALLBACK_PATH,
    scope: "openid email",
    state,
    code_challenge: challenge,
    code_challenge_method: "S256",
  });
  location.assign(`https://${cfg.hostedUiDomain}/oauth2/authorize?${q}`);
}

// Called on the callback page. Returns the path to go back to.
export async function finishSignIn(cfg: PokerbotsConfig): Promise<string> {
  const s = store();
  if (!s) throw new Error("Session storage is blocked in this browser.");
  const p = new URLSearchParams(location.search);
  const wantState = s.getItem(K_STATE) || "";
  const verifier = s.getItem(K_VERIFIER) || "";
  const clear = () => {
    s.removeItem(K_VERIFIER);
    s.removeItem(K_STATE);
  };
  const err = p.get("error");
  if (err) {
    clear();
    throw new Error("Sign-in was refused" + (/^[a-z_]{1,40}$/.test(err) ? " (" + err + ")." : "."));
  }
  const code = p.get("code");
  if (!code || !wantState || !verifier || p.get("state") !== wantState) {
    clear();
    throw new Error("Sign-in response did not match. Start again.");
  }
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: cfg.clientId,
    code,
    redirect_uri: location.origin + CALLBACK_PATH,
    code_verifier: verifier,
  });
  const r = await fetch(`https://${cfg.hostedUiDomain}/oauth2/token`, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!r.ok) throw new Error("Could not complete sign-in (" + r.status + "). Start again.");
  const j = await r.json();
  s.setItem(K_TOKEN, j.id_token);
  const back = s.getItem(K_RETURN) || "/pokerbots/admin/";
  s.removeItem(K_VERIFIER);
  s.removeItem(K_STATE);
  s.removeItem(K_RETURN);
  return back.startsWith("/pokerbots/") ? back : "/pokerbots/admin/";
}

function claims(token: string): Record<string, unknown> {
  try {
    const b = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(decodeURIComponent(escape(atob(b))));
  } catch {
    return {};
  }
}

// Returns the ID token, or null when absent or expired.
export function idToken(): { token: string; email: string } | null {
  const t = store()?.getItem(K_TOKEN);
  if (!t) return null;
  const c = claims(t);
  if (typeof c.exp !== "number" || c.exp * 1000 < Date.now() + 30000) return null;
  return { token: t, email: String(c.email || "") };
}

export function signOut(cfg: PokerbotsConfig): void {
  store()?.removeItem(K_TOKEN);
  const q = new URLSearchParams({ client_id: cfg.clientId, logout_uri: location.origin + "/pokerbots/" });
  location.assign(`https://${cfg.hostedUiDomain}/logout?${q}`);
}

export function dropToken(): void {
  store()?.removeItem(K_TOKEN);
}
