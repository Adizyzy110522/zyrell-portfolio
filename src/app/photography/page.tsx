
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Replace this with your actual R2 public development URL.
// Example: https://pub-xxxxxxxx.r2.dev
const R2_BASE_URL = "https://pub-dcd3ffb0390d4c59a42236b0a9d89050.r2.dev";

type Album = {
  number: string;
  title: string;
  slug: string;
  category: string;
  year: string;
  images: string[];
};

const albums: Album[] = [
  {
    number: "01",
    title: "Adrian John",
    slug: "adrian-john",
    category: "PORTRAIT",
    year: "2026",
    images: ["1.jpg", "2.jpg", "3.jpg", "4.jpg"].map(
      (file) =>
        `${R2_BASE_URL}/photography/adrian-john/${file}`
    ),
  },
  {
    number: "02",
    title: "Alvienna Louise",
    slug: "alvienna-louise",
    category: "PORTRAIT",
    year: "2026",
    images: ["DSC_6623.jpg", "DSC_2969.jpg", "DSC_6562.jpg"].map(
     (file) =>
        `${R2_BASE_URL}/photography/alvienna-louise/${file}`
    ),
  },
];

const categories = [
  "ALL",
  "PORTRAIT",
  "EVENT / DOCUMENTARY",
  "STREET",
  "CONCEPTUAL",
];

// Album cover: automatically crossfades between its first four images.
function AlbumCover({ images }: { images: string[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length);
    }, 2800);

    return () => window.clearInterval(interval);
  }, [images]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#151516]">
      {images.map((src, index) => (
        <motion.img
          key={src}
          src={src}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          initial={false}
          animate={{
            opacity: activeIndex === index ? 1 : 0,
            scale: activeIndex === index ? 1 : 1.035,
          }}
          transition={{
            opacity: { duration: 1, ease: "easeInOut" },
            scale: { duration: 1.4, ease: "easeOut" },
          }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ))}
    </div>
  );
}

export default function PhotographyPage() {
  const [activeCategory, setActiveCategory] = useState("ALL");

  const filteredAlbums =
    activeCategory === "ALL"
      ? albums
      : albums.filter((album) => album.category === activeCategory);

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
          写真
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
                PORTFOLIO / 003
              </p>

              <h1 className="mt-3 text-4xl font-bold tracking-[-0.04em] text-[#B82134] md:text-5xl">
                PHOTOGRAPHY
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
                STILL IMAGE
              </p>

              <p className="mt-1 text-[8px] tracking-[0.2em] text-[#151516]/20">
                PORTRAIT / DOCUMENTARY / CONCEPT
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
            aria-label="Filter photography albums"
            className="mt-8 flex gap-5 overflow-x-auto pb-3"
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

        {/* Scrollable Album Area */}
        <section className="custom-scrollbar relative z-10 min-h-0 flex-1 overflow-y-auto px-8 py-10 md:px-12 lg:px-16">
          <motion.div
            layout
            className="grid gap-x-6 gap-y-12 md:grid-cols-2 xl:grid-cols-3"
          >
            {filteredAlbums.map((album, index) => (
              <motion.div
                layout
                key={album.number}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.06,
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <Link
                  href={`/photography/${album.slug}`}
                  className="group block cursor-pointer"
                >
                  {/* Album Frame */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#151516]">
                    {/* Animated cover or empty placeholder */}
                    {album.images.length > 0 && (
                      <AlbumCover images={album.images} />
                    )}

                    {/* Album number */}
                    <div className="absolute left-4 top-4 z-10 text-[9px] tracking-[0.2em] text-[#F8F8F5]/70">
                      {album.number}
                    </div>

                    {/* Album information */}
                    <div className="absolute inset-x-0 bottom-0 z-10 p-5">
                      <h2 className="text-sm font-bold tracking-[0.03em] text-[#F8F8F5]">
                        {album.title}
                      </h2>

                      <p className="mt-2 text-[8px] tracking-[0.18em] text-[#F8F8F5]/65">
                        {album.category}
                      </p>

                      <p className="mt-2 text-[7px] tracking-[0.15em] text-[#F8F8F5]/50">
                        {album.year}
                      </p>
                    </div>

                    {/* Dark gradient behind album information */}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-28 bg-gradient-to-t from-[#151516] via-[#151516]/60 to-transparent" />

                    {/* Hover line */}
                    <div className="absolute bottom-0 left-0 z-20 h-[2px] w-0 bg-[#B82134] transition-all duration-500 group-hover:w-full" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </section>
      </section>
    </main>
  );
}
