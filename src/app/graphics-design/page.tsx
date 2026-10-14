
"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";

const R2_BASE_URL =
  "https://pub-dcd3ffb0390d4c59a42236b0a9d89050.r2.dev";

const projects = [
  {
    number: "01",
    title: "CHARLES X ALEXANDRA",
    slug: "charles-x-alexandra",
    category: "POSTERS",
    year: "2026",
    cover: "graphic-designs/charles-x-alexandra/charlesxalexandra_cover.png",
  },
  {
    number: "02",
    title: "FCSO Officer Cards 2024",
    slug: "fcso-cards-2024",
    category: "CORPORATE/EVENTS",
    year: "2024",
    cover: "graphic-designs/fcso-cards-2024/fcsocards2024_cover.jpg",
  },
];

const categories = [
  "ALL",
  "POSTERS",
  "BRANDING",
  "CORPORATE/EVENTS",
  "MARKETING",
  "PRINT DESIGN",
  "EDITORIAL",
  "ILLUSTRATION",
];

type Project = (typeof projects)[number];

function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const [coverUnavailable, setCoverUnavailable] = useState(false);

  const coverUrl = `${R2_BASE_URL}/${project.cover
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/")}`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.08 + index * 0.06,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Link
        href={`/graphics-design/${project.slug}`}
        className="group block cursor-pointer"
        aria-label={`View ${project.title} graphic design project`}
      >   
          <div
            className="relative aspect-[4/3] overflow-hidden bg-[#151516]"
            onContextMenu={(event) => event.preventDefault()}
          >
          {!coverUnavailable && (  
          <img
            src={coverUrl}
            alt={`${project.title} album cover`}
            loading="lazy"
            draggable={false}
            onContextMenu={(event) => event.preventDefault()}
            onError={() => setCoverUnavailable(true)}
            className="absolute inset-0 h-full w-full select-none object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
          )}

          {coverUnavailable && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#151516] px-4 text-center">
              <div className="h-px w-8 bg-[#B82134]" />
              <p className="text-[9px] tracking-[0.2em] text-[#F8F8F5]/45">
                THUMBNAIL UNAVAILABLE
              </p>
              <p className="text-[7px] tracking-[0.12em] text-[#F8F8F5]/25">
                COVER IMAGE NOT FOUND
              </p>
            </div>
          )}

          <div className="absolute left-4 top-4 z-10 text-[9px] tracking-[0.2em] text-[#F8F8F5]/70">
            {project.number}
          </div>

          <div className="absolute inset-x-0 bottom-0 z-10 p-5">
            <h2 className="text-sm font-bold tracking-[0.03em] text-[#F8F8F5]">
              {project.title}
            </h2>

            <p className="mt-2 text-[8px] tracking-[0.18em] text-[#F8F8F5]/65">
              {project.category}
            </p>

            <p className="mt-2 text-[7px] tracking-[0.15em] text-[#F8F8F5]/50">
              {project.year}
            </p>
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-28 bg-gradient-to-t from-[#151516] via-[#151516]/60 to-transparent" />

          <div className="absolute bottom-0 left-0 z-20 h-[2px] w-0 bg-[#B82134] transition-all duration-500 group-hover:w-full" />
        </div>
      </Link>
    </motion.div>
  );
}

export default function GraphicsDesignPage() {
  const [activeCategory, setActiveCategory] = useState("ALL");

  const filteredProjects =
    activeCategory === "ALL"
      ? projects
      : projects.filter((project) => project.category === activeCategory);

  return (
    <main className="h-screen overflow-hidden bg-[#F8F8F5] lg:pl-[270px]">
      <section className="relative flex h-full flex-col overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, x: 20 }}
          animate={{ opacity: 0.025, scale: 1, x: 0 }}
          transition={{
            duration: 1.1,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="pointer-events-none absolute -right-16 top-24 z-0 text-[150px] font-light leading-none tracking-[-0.08em] text-[#151516]"
        >
          グラフィック
        </motion.div>

        <header className="relative z-10 shrink-0 px-8 pb-0 pt-10 md:px-12 lg:px-16">
          <div className="flex items-end justify-between">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.65,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <p className="text-[9px] tracking-[0.3em] text-[#151516]/30">
                PORTFOLIO / 005
              </p>

              <h1 className="mt-3 text-4xl font-bold tracking-[-0.04em] text-[#B82134] md:text-5xl">
                GRAPHIC DESIGNS
              </h1>
            </motion.div>

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
                VISUAL DESIGN
              </p>

              <p className="mt-1 text-[8px] tracking-[0.2em] text-[#151516]/20">
                BRANDING / DIGITAL / PRINT
              </p>
            </motion.div>
          </div>

          <motion.nav
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.25,
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="custom-scrollbar mt-8 flex gap-5 overflow-x-auto pb-3"
            aria-label="Filter graphic design projects by category"
          >
            {categories.map((category, index) => (
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
                aria-pressed={activeCategory === category}
                className={`shrink-0 text-[8px] tracking-[0.14em] transition-all duration-300 ${
                  activeCategory === category
                    ? "text-[#B82134]"
                    : "text-[#151516]/35 hover:text-[#151516]"
                }`}
              >
                {category}
              </motion.button>
            ))}
          </motion.nav>

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

        <section className="custom-scrollbar relative z-10 min-h-0 flex-1 overflow-y-auto px-8 py-10 md:px-12 lg:px-16">
          <motion.div
            layout
            className="grid gap-x-6 gap-y-12 md:grid-cols-2 xl:grid-cols-3"
          >
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={project.number}
                project={project}
                index={index}
              />
            ))}
          </motion.div>

          {filteredProjects.length === 0 && (
            <p className="py-16 text-center text-[10px] tracking-[0.2em] text-[#151516]/40">
              NO PROJECTS IN THIS CATEGORY
            </p>
          )}
        </section>
      </section>
    </main>
  );
}
