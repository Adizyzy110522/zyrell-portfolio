```tsx
"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const R2_BASE_URL =
  "https://pub-dcd3ffb0390d4c59a42236b0a9d89050.r2.dev";

const IMAGE_LIST_URL =
  "https://photography-gallery.zyrell-baculi3.workers.dev";

type Design = {
  key: string;
  filename: string;
};

type Project = {
  title: string;
  number: string;
  category: string;
  description: string;
};

const projects: Record<string, Project> = {
  "charles-x-alexandra": {
    title: "Charles x Alexandra",
    number: "001",
    category: "POSTERS",
    description: "A sample album for Charles.",
  },
};

function getImageUrl(key: string) {
  return `${R2_BASE_URL}/${key
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/")}`;
}

export default function GraphicsDesignProjectPage() {
  const params = useParams<{ project: string }>();
  const projectSlug = params.project;
  const project = projects[projectSlug];

  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [backgroundIndex, setBackgroundIndex] = useState(0);

  const selectedDesign =
    selectedIndex === null ? null : designs[selectedIndex] ?? null;

  useEffect(() => {
    if (!project) return;

    const controller = new AbortController();

    async function loadDesigns() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `${IMAGE_LIST_URL}?album=${encodeURIComponent(projectSlug)}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Could not retrieve project designs.");
        }

        const data: { files: Design[] } = await response.json();

        setDesigns(data.files);
        setBackgroundIndex(0);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;

        setError("Unable to load designs. Please check the Worker URL and try again.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void loadDesigns();

    return () => controller.abort();
  }, [projectSlug, project, reloadKey]);

  useEffect(() => {
    if (designs.length <= 1) return;

    const interval = window.setInterval(() => {
      setBackgroundIndex((current) => (current + 1) % designs.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [designs.length]);

  useEffect(() => {
    if (selectedIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setSelectedIndex(null);

      if (event.key === "ArrowLeft") {
        setSelectedIndex((current) =>
          current === null
            ? null
            : (current - 1 + designs.length) % designs.length
        );
      }

      if (event.key === "ArrowRight") {
        setSelectedIndex((current) =>
          current === null
            ? null
            : (current + 1) % designs.length
        );
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedIndex, designs.length]);

  if (!project) {
    return (
      <main className="flex h-screen items-center justify-center bg-[#F8F8F5] lg:pl-[270px]">
        <div className="text-center">
          <p className="text-[9px] tracking-[0.3em] text-[#151516]/40">
            GRAPHICS DESIGN / 404
          </p>
          <h1 className="mt-3 text-3xl font-bold text-[#B82134]">
            PROJECT NOT FOUND
          </h1>
          <Link
            href="/graphics-design"
            className="mt-6 inline-block text-[9px] tracking-[0.2em] text-[#151516]/60 transition hover:text-[#B82134]"
          >
            ← BACK TO GRAPHICS DESIGN
          </Link>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="h-screen overflow-hidden bg-[#F8F8F5] lg:pl-[270px]">
        <section className="relative flex h-full flex-col overflow-hidden">
          {/* Faded project background slideshow */}
          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
            <AnimatePresence mode="sync">
              {designs.length > 0 && (
                <motion.img
                  key={designs[backgroundIndex]?.key}
                  src={getImageUrl(designs[backgroundIndex].key)}
                  alt=""
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.4 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    opacity: { duration: 1.8, ease: "easeInOut" },
                  }}
                  className="absolute inset-0 h-full w-full object-cover grayscale"
                />
              )}
            </AnimatePresence>
            <div className="absolute inset-0 bg-[#F8F8F5]/35" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#F8F8F5]/35 via-transparent to-[#F8F8F5]/35" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#F8F8F5]/25 via-transparent to-[#F8F8F5]/45" />
          </div>

          <div className="pointer-events-none absolute -right-10 top-24 z-0 text-[170px] font-light leading-none tracking-[-0.08em] text-[#151516] opacity-[0.025]">
            グラフィック
          </div>

          {/* Fixed header */}
          <header className="relative z-10 shrink-0 border-b border-[#151516]/10 px-8 pb-8 pt-10 md:px-12 lg:px-16">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[9px] tracking-[0.3em] text-[#151516]/30">
                  GRAPHICS DESIGN / PROJECT {project.number}
                </p>
                <h1 className="mt-3 text-4xl font-bold tracking-[-0.04em] text-[#B82134] md:text-5xl">
                  {project.title}
                </h1>
              </div>

              <Link
                href="/graphics-design"
                className="group mb-1 flex items-center gap-3 text-[8px] tracking-[0.18em] text-[#151516]/50 transition-all duration-300 hover:text-[#151516]"
              >
                <span className="text-xl font-light leading-none transition-transform duration-300 group-hover:-translate-x-1">
                  ‹
                </span>
                <span>GO BACK</span>
              </Link>
            </div>

            <div className="mt-8">
              <p className="max-w-2xl text-[9px] leading-5 tracking-[0.08em] text-[#151516]/45">
                {project.description}
              </p>

              {!loading && !error && (
                <p className="mt-3 text-[8px] tracking-[0.18em] text-[#151516]/35">
                  {designs.length} DESIGNS
                </p>
              )}
            </div>

            <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
              <div>
                <p className="text-[6px] tracking-[0.2em] text-[#151516]/25">
                  CATEGORY
                </p>
                <p className="mt-1 text-[8px] tracking-[0.12em] text-[#151516]/50">
                  {project.category}
                </p>
              </div>

              <div>
                <p className="text-[6px] tracking-[0.2em] text-[#151516]/25">
                  YEAR
                </p>
                <p className="mt-1 text-[8px] tracking-[0.12em] text-[#151516]/50">
                  2026
                </p>
              </div>

              <div>
                <p className="text-[6px] tracking-[0.2em] text-[#151516]/25">
                  ROLE
                </p>
                <p className="mt-1 text-[8px] tracking-[0.12em] text-[#151516]/50">
                  GRAPHIC DESIGNER
                </p>
              </div>
            </div>
          </header>

          {/* Scrollable design grid */}
          <section className="custom-scrollbar relative z-10 min-h-0 flex-1 overflow-y-auto px-8 py-10 md:px-12 lg:px-16">
            {loading && (
              <p className="py-12 text-center text-[9px] tracking-[0.2em] text-[#151516]/45">
                LOADING DESIGNS...
              </p>
            )}

            {!loading && error && (
              <div className="py-12 text-center">
                <p className="text-sm text-[#B82134]">{error}</p>
                <button
                  type="button"
                  onClick={() => setReloadKey((key) => key + 1)}
                  className="mt-4 text-[9px] tracking-[0.2em] text-[#151516]/60 transition hover:text-[#B82134]"
                >
                  TRY AGAIN
                </button>
              </div>
            )}

            {!loading && !error && designs.length === 0 && (
              <p className="py-12 text-center text-[9px] tracking-[0.2em] text-[#151516]/45">
                NO DESIGNS FOUND IN THIS PROJECT
              </p>
            )}

            {!loading && !error && designs.length > 0 && (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {designs.map((design, index) => (
                  <motion.button
                    type="button"
                    key={design.key}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.08 }}
                    transition={{
                      delay: Math.min(index * 0.035, 0.35),
                      duration: 0.55,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    onClick={() => setSelectedIndex(index)}
                    aria-label={`View design ${design.filename}`}
                    className="group block w-full cursor-zoom-in text-left"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#151516]">
                      <motion.img
                        src={getImageUrl(design.key)}
                        alt={`${project.title} — ${design.filename}`}
                        loading={index < 3 ? "eager" : "lazy"}
                        decoding="async"
                        whileHover={{ scale: 1.035 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="absolute inset-0 h-full w-full object-cover"
                      />

                      <div className="absolute left-4 top-4 z-10 text-[9px] tracking-[0.2em] text-[#F8F8F5]/75">
                        {String(index + 1).padStart(2, "0")}
                      </div>

                      <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between p-5">
                        <div>
                          <h2 className="text-sm font-bold tracking-[0.03em] text-[#F8F8F5]">
                            DESIGN {String(index + 1).padStart(2, "0")}
                          </h2>
                          <p className="mt-2 text-[8px] tracking-[0.18em] text-[#F8F8F5]/65">
                            {project.category}
                          </p>
                        </div>
                        <span className="text-lg text-[#F8F8F5]/80 transition-transform duration-300 group-hover:scale-110">
                          ↗
                        </span>
                      </div>

                      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-28 bg-gradient-to-t from-[#151516] via-[#151516]/60 to-transparent" />
                      <div className="absolute bottom-0 left-0 z-20 h-[2px] w-0 bg-[#B82134] transition-all duration-500 group-hover:w-full" />
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </section>
        </section>
      </main>

      {/* Full-screen design viewer */}
      <AnimatePresence>
        {selectedDesign && selectedIndex !== null && (
          <motion.div
            key="design-viewer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#090909]/[0.98]"
            role="dialog"
            aria-modal="true"
            aria-label="Design viewer"
            onClick={() => setSelectedIndex(null)}
          >
            <div className="absolute inset-x-0 top-0 z-40 flex items-center justify-between px-5 py-5 md:px-8">
              <p className="text-[9px] tracking-[0.2em] text-white/55">
                {String(selectedIndex + 1).padStart(2, "0")} /{" "}
                {String(designs.length).padStart(2, "0")}
              </p>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setSelectedIndex(null);
                }}
                aria-label="Close design viewer"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 text-3xl font-light text-white/75 transition hover:border-white/50 hover:bg-white/10 hover:text-white"
              >
                ×
              </button>
            </div>

            {designs.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Previous design"
                  onClick={(event) => {
                    event.stopPropagation();
                    setSelectedIndex(
                      (selectedIndex - 1 + designs.length) % designs.length
                    );
                  }}
                  className="absolute left-4 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/30 text-2xl text-white/75 transition hover:border-white/40 hover:bg-white/10 hover:text-white md:left-8"
                >
                  ‹
                </button>
                <button
                  type="button"
                  aria-label="Next design"
                  onClick={(event) => {
                    event.stopPropagation();
                    setSelectedIndex((selectedIndex + 1) % designs.length);
                  }}
                  className="absolute right-4 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/30 text-2xl text-white/75 transition hover:border-white/40 hover:bg-white/10 hover:text-white md:right-8"
                >
                  ›
                </button>
              </>
            )}

            <motion.img
              key={selectedDesign.key}
              src={getImageUrl(selectedDesign.key)}
              alt={`${project.title} — ${selectedDesign.filename}`}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              onClick={(event) => event.stopPropagation()}
              className="max-h-[82vh] max-w-[86vw] select-none object-contain"
            />

            <p className="pointer-events-none absolute bottom-6 left-0 right-0 text-center text-[8px] tracking-[0.15em] text-white/40">
              {selectedDesign.filename}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
```