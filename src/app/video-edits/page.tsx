"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const WORKER_URL =
  "https://video-edits-gallery.zyrell-baculi3.workers.dev";

const R2_BASE_URL =
  "https://pub-dcd3ffb0390d4c59a42236b0a9d89050.r2.dev";


//HERE LIES YOUR PROJECTS SIRE, HAHHAHAAHA//
const projects = [
  {
    number: "01",
    title: "COMPLYPLUS CPD TRACKER",
    slug: "complyplus-cpd-tracker",
    category: "CORPORATE",
    year: "2025",
  },
  {
    number: "02",
    title: "COMPLYPLUS BLACKFRIDAY SALE",
    slug: "complyplus-blackfriday-sale",
    category: "CORPORATE",
    year: "2025",
  },
  {
    number: "03",
    title: "ENERGY DRINKS",
    slug: "energy-drinks",
    category: "PROMOTIONAL",
    year: "2026",
  },
    {
    number: "04",
    title: "ZEATH SPORTSWEAR",
    slug: "zeath-sportswear",
    category: "PROMOTIONAL",
    year: "2025",
  },
   {
    number: "05",
    title: "SAMPLE TEST EDITS",
    slug: "sample-test-edits",
    category: "TEST EDITS",
    year: "2025",
  },
  {
    number: "06",
    title: "CINEMATIC VLOGS",
    slug: "cinematic-vlogs",
    category: "DOCUMENTARY",
    year: "2026",
  },
];

const categories = [
  "ALL",
  "CORPORATE",
  "TEST EDITS",
  "PROMOTIONAL",
  "DOCUMENTARY",
];

type AlbumFile = {
  key: string;
  filename: string;
};

export default function VideoEditsPage() {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>(
    {}
  );

  useEffect(() => {
    let cancelled = false;

    async function loadPreviews() {
      const results = await Promise.all(
        projects.map(async (project) => {
          try {
            const endpoint = new URL(WORKER_URL);
            endpoint.searchParams.set("album", project.slug);

            const response = await fetch(endpoint.toString());

            if (!response.ok) {
              throw new Error(
                `Failed to load ${project.title}: ${response.status}`
              );
            }

            const data: { files?: AlbumFile[] } =
              await response.json();

            const firstVideo = data.files?.[0];

            if (!firstVideo?.key) {
              return {
                slug: project.slug,
                url: "",
              };
            }

            const encodedKey = firstVideo.key
              .split("/")
              .map((part) => encodeURIComponent(part))
              .join("/");

            return {
              slug: project.slug,
              url: `${R2_BASE_URL}/${encodedKey}`,
            };
          } catch (error) {
            console.error(
              `Could not load preview for ${project.title}:`,
              error
            );

            return {
              slug: project.slug,
              url: "",
            };
          }
        })
      );

      if (cancelled) return;

      setPreviewUrls(
        Object.fromEntries(
          results.map((result) => [result.slug, result.url])
        )
      );
    }

    loadPreviews();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredProjects =
    activeCategory === "ALL"
      ? projects
      : projects.filter(
          (project) => project.category === activeCategory
        );

  return (
    <main className="h-screen overflow-hidden bg-[#F8F8F5] lg:pl-[270px]">
      <section className="relative flex h-full flex-col overflow-hidden">
        {/* Japanese background element */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, x: 20 }}
          animate={{ opacity: 0.025, scale: 1, x: 0 }}
          transition={{
            duration: 1.1,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="pointer-events-none absolute -right-10 top-24 z-0 text-[170px] font-light leading-none tracking-[-0.08em] text-[#151516]"
        >
          編集
        </motion.div>

        {/* Fixed Header Area */}
        <header className="relative z-10 shrink-0 px-8 pb-0 pt-10 md:px-12 lg:px-16">
          <div className="flex items-end justify-between">
            {/* Left header */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.65,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <p className="text-[9px] tracking-[0.3em] text-[#151516]/30">
                PORTFOLIO / 004
              </p>

              <h1 className="mt-3 text-4xl font-bold tracking-[-0.04em] text-[#B82134] md:text-5xl">
                VIDEO EDITS
              </h1>
            </motion.div>

            {/* Right header */}
            <motion.div
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 0.18,
                duration: 0.55,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="hidden text-right md:block"
            >
              <p className="text-[8px] tracking-[0.2em] text-[#151516]/30">
                EDITED VIDEOS
              </p>

              <p className="mt-1 text-[8px] tracking-[0.2em] text-[#151516]/20">
                MOTION GRAPHICS / ANIMATIONS
              </p>
            </motion.div>
          </div>

          {/* Functional Category Tabs */}
          <motion.nav
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.25,
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
            aria-label="Filter video editing projects by category"
            className="mt-8 flex gap-5 overflow-x-auto pb-3"
          >
            {categories.map((category, index) => {
              const isActive = activeCategory === category;

              return (
                <motion.button
                  key={category}
                  type="button"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.28 + index * 0.055,
                    duration: 0.4,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  onClick={() => setActiveCategory(category)}
                  aria-pressed={isActive}
                  className={`shrink-0 text-[8px] tracking-[0.14em] transition-all duration-300 ${
                    isActive
                      ? "text-[#B82134]"
                      : "text-[#151516]/35 hover:text-[#151516]"
                  }`}
                >
                  {category}
                </motion.button>
              );
            })}
          </motion.nav>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{
              delay: 0.48,
              duration: 0.65,
              ease: [0.77, 0, 0.175, 1],
            }}
            style={{ transformOrigin: "left" }}
            className="h-px w-full bg-[#151516]/10"
          />
        </header>

        {/* Scrollable Project Area */}
        <section className="custom-scrollbar relative z-10 min-h-0 flex-1 overflow-y-auto px-8 py-10 md:px-12 lg:px-16">
          {filteredProjects.length > 0 ? (
            <div className="grid gap-x-6 gap-y-12 md:grid-cols-2 xl:grid-cols-3">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.slug}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.12 + index * 0.09,
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <Link
                    href={`/video-edits/${project.slug}`}
                    className="group block cursor-pointer"
                  >
                    {/* Project Frame */}
                    <div
                    className="relative aspect-video overflow-hidden bg-[#151516]"
                    onContextMenu={(event) => event.preventDefault()}
                  >
                      {/* Muted video preview from R2 */}
                      {previewUrls[project.slug] && (
                        
                      <video
                        key={previewUrls[project.slug]}
                        src={previewUrls[project.slug]}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                        aria-hidden="true"
                        tabIndex={-1}
                        draggable={false}
                        controlsList="nodownload"
                        disablePictureInPicture
                        onContextMenu={(event) => event.preventDefault()}
                      />

                      )}

                      {/* Project number */}
                      <div className="absolute left-4 top-4 z-10 text-[9px] tracking-[0.2em] text-[#F8F8F5]/40">
                        {project.number}
                      </div>

                      {/* Project information */}
                      <div className="absolute inset-x-0 bottom-0 z-10 p-5">
                        <h2 className="text-sm font-bold tracking-[0.03em] text-[#F8F8F5]">
                          {project.title}
                        </h2>

                        <p className="mt-2 text-[8px] tracking-[0.18em] text-[#F8F8F5]/45">
                          {project.category}
                        </p>

                        <p className="mt-2 text-[7px] tracking-[0.15em] text-[#F8F8F5]/30">
                          {project.year}
                        </p>
                      </div>

                      {/* Dark gradient */}
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-28 bg-gradient-to-t from-[#151516] via-[#151516]/60 to-transparent" />

                      {/* Hover line */}
                      <div className="absolute bottom-0 left-0 z-20 h-[2px] w-0 bg-[#B82134] transition-all duration-500 group-hover:w-full" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="py-8 text-[9px] tracking-[0.18em] text-[#151516]/40">
              NO PROJECTS IN THIS CATEGORY YET.
            </p>
          )}
        </section>
      </section>
    </main>
  );
}