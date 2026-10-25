export type Album = {
  title: string;
  number: string;
  category: string;
  description: string;
};

export const albums: Record<string, Album> = {
  "adrian-john": {
    title: "ADRIAN JOHN",
    number: "001",
    category: "PORTRAIT",
    description:
      "A portrait photography collection capturing the subject through a series of images.",
  },
  "alvienna-louise": {
    title: "Alvienna Louise",
    number: "002",
    category: "PORTRAIT",
    description: "A collection of portraits featuring Alvienna Louise.",
  },
  "brainwave-portraits": {
    title: "Brainwave BPO Boys",
    number: "003",
    category: "PORTRAIT",
    description: "A collection of portraits featuring Brainwave BPO Boys.",
  },
  "marc-dominic": {
    title: "Marc Dominic",
    number: "004",
    category: "PORTRAIT",
    description: "A collection of portraits featuring Marc Dominic.",
  },
  "maasin-fiesta-2026": {
    title: "Maasin City Fiesta 2026",
    number: "001",
    category: "EVENT / DOCUMENTARY",
    description: "A collection of shots from Maasin City Fiesta 2026.",
  },
  "blue-deep-resort": {
    title: "Blue Deep Resort",
    number: "001",
    category: "COMMERCIAL",
    description: "A collection of shots from Blue Deep Resort.",
  },
  "southern-leyte": {
    title: "Southern Leyte",
    number: "001",
    category: "STREET",
    description: "A collection of shots from Southern Leyte streets.",
  },
};
