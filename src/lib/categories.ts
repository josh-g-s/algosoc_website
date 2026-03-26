/**
 * Shared category label and colour maps used across blog, events, and resource pages.
 */

export const blogCategoryColours: Record<string, string> = {
  "market-recap": "bg-blue-100 text-blue-700",
  research: "bg-emerald-100 text-emerald-700",
  newsletter: "bg-amber-100 text-amber-700",
  announcement: "bg-purple-100 text-purple-700",
};

export const blogCategoryLabels: Record<string, string> = {
  "market-recap": "Market Recap",
  research: "Research",
  newsletter: "Newsletter",
  announcement: "Announcement",
};

export const eventCategoryColours: Record<string, string> = {
  social: "bg-purple-100 text-purple-700",
  bootcamp: "bg-blue-100 text-blue-700",
  competition: "bg-amber-100 text-amber-700",
  algocourse: "bg-green-100 text-green-700",
  workshop: "bg-rose-100 text-rose-700",
  "quant-session": "bg-cyan-100 text-cyan-700",
  qtc: "bg-indigo-100 text-indigo-700",
  icwit: "bg-pink-100 text-pink-700",
  "company-presentation": "bg-gray-100 text-gray-700",
};

export const eventCategoryLabels: Record<string, string> = {
  social: "Social",
  bootcamp: "Bootcamp",
  competition: "Competition",
  algocourse: "AlgoCourse",
  workshop: "Workshop",
  "quant-session": "Quant Session",
  qtc: "QTC",
  icwit: "ICWiT",
  "company-presentation": "Company Presentation",
};

export const resourceTypeStyles: Record<string, string> = {
  pdf: "text-red-600 bg-red-50",
  slides: "text-blue-600 bg-blue-50",
  jupyter: "text-orange-600 bg-orange-50",
  "reading-list": "text-green-600 bg-green-50",
  code: "text-violet-600 bg-violet-50",
};

export const resourceTypeLabels: Record<string, string> = {
  pdf: "PDF",
  slides: "Slides",
  jupyter: "Jupyter",
  "reading-list": "Reading List",
  code: "Code",
};

export const resourceCategoryLabels: Record<string, string> = {
  career: "Career",
  bootcamp: "Bootcamp",
  algocourse: "AlgoCourse",
  qtc: "QTC",
  "quant-sessions": "Quant Sessions",
  edufund: "EduFund",
  "reading-list": "Reading List",
  slides: "Slides",
};
