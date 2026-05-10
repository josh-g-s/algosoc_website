import { defineType, defineField } from "sanity";

const TRADING_VIEW_INTERVALS = [
  { title: "1 minute", value: "1" },
  { title: "5 minutes", value: "5" },
  { title: "15 minutes", value: "15" },
  { title: "30 minutes", value: "30" },
  { title: "1 hour", value: "60" },
  { title: "4 hours", value: "240" },
  { title: "1 day", value: "D" },
  { title: "1 week", value: "W" },
  { title: "1 month", value: "M" },
];

const ASSET_CLASSES = [
  { title: "Equities", value: "equities" },
  { title: "FX", value: "fx" },
  { title: "Rates", value: "rates" },
  { title: "Commodities", value: "commodities" },
  { title: "Crypto", value: "crypto" },
  { title: "Credit", value: "credit" },
  { title: "Macro", value: "macro" },
];

export default defineType({
  name: "marketRecap",
  title: "Market Recap",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "weekStart", title: "Week Start", type: "date", validation: (r) => r.required() }),
    defineField({ name: "weekEnd", title: "Week End", type: "date", validation: (r) => r.required() }),
    defineField({
      name: "authors",
      title: "Authors",
      type: "array",
      of: [{ type: "reference", to: [{ type: "teamMember" }] }],
      validation: (r) => r.min(1),
    }),
    defineField({ name: "publishDate", title: "Publish Date", type: "date" }),
    defineField({ name: "expiryDate", title: "Expiry Date", type: "date" }),
    defineField({ name: "excerpt", title: "Excerpt", type: "text", rows: 3 }),
    defineField({
      name: "assetClasses",
      title: "Asset Classes Covered",
      type: "array",
      of: [{ type: "string", options: { list: ASSET_CLASSES } }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "readingTime",
      title: "Reading Time (minutes)",
      type: "number",
      validation: (r) => r.min(1),
    }),
    defineField({ name: "featuredImage", title: "Featured Image", type: "image", options: { hotspot: true } }),
    defineField({
      name: "ogImage",
      title: "Social Share Image",
      type: "image",
      description: "Optional. Falls back to Featured Image when empty.",
    }),
    defineField({
      name: "metaDescription",
      title: "Meta Description",
      type: "text",
      rows: 2,
      description: "Optional SEO description. Falls back to Excerpt when empty.",
      validation: (r) => r.max(200),
    }),
    defineField({
      name: "summary",
      title: "Weekly Summary",
      type: "array",
      of: [{ type: "block" }],
      description: "Top-of-page narrative summary of the week.",
    }),
    defineField({
      name: "keyMetrics",
      title: "Key Metrics",
      type: "array",
      of: [
        {
          type: "object",
          name: "metric",
          title: "Metric",
          fields: [
            defineField({ name: "ticker", title: "Ticker", type: "string", description: "e.g. SPX, ES1!, AAPL", validation: (r) => r.required() }),
            defineField({ name: "label", title: "Display Label", type: "string", description: "Shown in the table; defaults to ticker if blank." }),
            defineField({ name: "weekClose", title: "Week Close", type: "number" }),
            defineField({ name: "weekChangePct", title: "Week Change (%)", type: "number" }),
            defineField({ name: "note", title: "Note", type: "string" }),
          ],
          preview: {
            select: { ticker: "ticker", label: "label", weekChangePct: "weekChangePct" },
            prepare({ ticker, label, weekChangePct }) {
              const change = typeof weekChangePct === "number" ? `${weekChangePct.toFixed(2)}%` : "";
              return { title: label || ticker, subtitle: change };
            },
          },
        },
      ],
    }),
    defineField({
      name: "movers",
      title: "Top Movers",
      type: "array",
      of: [
        {
          type: "object",
          name: "mover",
          title: "Mover",
          fields: [
            defineField({ name: "ticker", title: "Ticker", type: "string", validation: (r) => r.required() }),
            defineField({ name: "name", title: "Name", type: "string" }),
            defineField({ name: "changePct", title: "Week Change (%)", type: "number", validation: (r) => r.required() }),
            defineField({ name: "note", title: "Note", type: "string" }),
          ],
          preview: {
            select: { ticker: "ticker", name: "name", changePct: "changePct" },
            prepare({ ticker, name, changePct }) {
              const change = typeof changePct === "number" ? `${changePct.toFixed(2)}%` : "";
              return { title: ticker, subtitle: [name, change].filter(Boolean).join(" · ") };
            },
          },
        },
      ],
    }),
    defineField({
      name: "macroEvents",
      title: "Macro Events",
      type: "array",
      of: [
        {
          type: "object",
          name: "macroEvent",
          title: "Event",
          fields: [
            defineField({ name: "date", title: "Date", type: "date", validation: (r) => r.required() }),
            defineField({ name: "event", title: "Event", type: "string", validation: (r) => r.required() }),
            defineField({ name: "note", title: "Note", type: "text", rows: 2 }),
          ],
          preview: {
            select: { date: "date", event: "event" },
            prepare({ date, event }) {
              return { title: event, subtitle: date };
            },
          },
        },
      ],
    }),
    defineField({
      name: "tradingViewCharts",
      title: "TradingView Charts",
      type: "array",
      of: [
        {
          type: "object",
          name: "tvChart",
          title: "Chart",
          fields: [
            defineField({
              name: "symbol",
              title: "Symbol",
              type: "string",
              description: "TradingView symbol, e.g. NASDAQ:AAPL, FX:EURUSD, BINANCE:BTCUSDT",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "interval",
              title: "Interval",
              type: "string",
              options: { list: TRADING_VIEW_INTERVALS },
              initialValue: "D",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "startDateTime",
              title: "Start",
              type: "datetime",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "endDateTime",
              title: "End",
              type: "datetime",
              validation: (r) => r.required(),
            }),
            defineField({ name: "caption", title: "Caption", type: "string" }),
          ],
          preview: {
            select: { symbol: "symbol", interval: "interval", caption: "caption" },
            prepare({ symbol, interval, caption }) {
              return { title: caption || symbol, subtitle: `${symbol} · ${interval}` };
            },
          },
        },
      ],
    }),
    defineField({
      name: "quantSection",
      title: "Quant Section",
      type: "array",
      of: [{ type: "block" }, { type: "image", options: { hotspot: true } }],
      description: "Factor performance, paper of the week, model notes.",
    }),
    defineField({
      name: "dataSource",
      title: "Data Source",
      type: "string",
      description: "e.g. Bloomberg, Yahoo Finance, Refinitiv",
    }),
    defineField({
      name: "disclaimer",
      title: "Disclaimer",
      type: "text",
      rows: 2,
      description: "Optional. Defaults to a standard 'not investment advice' notice when empty.",
    }),
  ],
  orderings: [
    { title: "Week start (newest first)", name: "weekStartDesc", by: [{ field: "weekStart", direction: "desc" }] },
  ],
  preview: {
    select: { title: "title", weekStart: "weekStart", weekEnd: "weekEnd", media: "featuredImage" },
    prepare({ title, weekStart, weekEnd, media }) {
      const range = [weekStart, weekEnd].filter(Boolean).join(" → ");
      return { title, subtitle: range, media };
    },
  },
});
