import type { ReactNode } from "react";

// Keep this list in sync with the projects array in src/app/video-edits/page.tsx
export function generateStaticParams() {
  return [
    { project: "complyplus-cpd-tracker" },
    { project: "complyplus-blackfriday-sale" },
    { project: "energy-drinks" },
    { project: "zeath-sportswear" },
    { project: "sample-test-edits" },
    { project: "cinematic-vlogs" },
  ];
}

export const dynamicParams = false;

export default function VideoProjectLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
