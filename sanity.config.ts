import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./src/sanity/schemas";

// Singleton documents: exactly one instance each. They are edited in place
// (under "Pages" / "Site Configuration") and hidden from the global "Create"
// menu so editors cannot make duplicates, which would break the `[0]` queries
// the site uses to fetch them.
const singletons = ["aboutPage", "joinPage", "siteConfig"];

export default defineConfig({
  name: "algosoc",
  title: "AlgoSoc Website",
  projectId: "bd3zp068",
  dataset: "production",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Pages")
              .child(
                S.list()
                  .title("Pages")
                  .items([
                    // Page singletons have fixed document IDs, so open them
                    // directly. New per-route page docs get added here.
                    S.listItem()
                      .title("About Page")
                      .child(S.document().schemaType("aboutPage").documentId("aboutPage")),
                    S.listItem()
                      .title("Join Page")
                      .child(S.document().schemaType("joinPage").documentId("joinPage")),
                  ]),
              ),
            S.divider(),
            S.documentTypeListItem("programme").title("Programmes"),
            S.documentTypeListItem("event").title("Events"),
            S.listItem()
              .title("News & Research")
              .child(
                S.list()
                  .title("News & Research")
                  .items([
                    S.documentTypeListItem("post").title("Posts"),
                    S.documentTypeListItem("newsletter").title("Newsletters"),
                    S.documentTypeListItem("marketRecap").title("Market Recaps"),
                  ]),
              ),
            S.documentTypeListItem("teamMember").title("Team Members"),
            S.listItem()
              .title("Sponsors")
              .child(
                S.list()
                  .title("Sponsors")
                  .items([
                    S.documentTypeListItem("sponsor").title("Sponsors"),
                    S.documentTypeListItem("sponsorAlgothon").title("Algothon Sponsors"),
                  ]),
              ),
            S.documentTypeListItem("algothon").title("Algothon"),
            S.documentTypeListItem("resource").title("Resources"),
            S.documentTypeListItem("witEvent").title("WiT Events"),
            S.divider(),
            // siteConfig has an auto-generated ID, so reference it by type
            // rather than hardcoding the ID.
            S.documentTypeListItem("siteConfig").title("Site Configuration"),
          ]),
    }),
  ],
  schema: {
    types: schemaTypes,
  },
  document: {
    newDocumentOptions: (prev, { creationContext }) =>
      creationContext.type === "global"
        ? prev.filter((item) => !singletons.includes(item.templateId))
        : prev,
  },
});
