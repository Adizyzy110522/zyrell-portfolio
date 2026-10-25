export type Project = {
  title: string;
  number: string;
  category: string;
  description: string;
};

export const projects: Record<string, Project> = {
  "charles-x-alexandra": {
    title: "Charles x Alexandra",
    number: "001",
    category: "POSTERS",
    description: "A sample album for Charles.",
  },
  "fcso-cards-2024": {
    title: "FCSO Officer Cards 2024",
    number: "002",
    category: "CORPORATE/EVENTS",
    description: "A set of officer cards for the FCSO in 2024.",
  },
};