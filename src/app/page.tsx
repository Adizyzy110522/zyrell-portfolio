
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import Sidebar from "@/components/layout/Sidebar";

const R2_BASE =
  "https://pub-dcd3ffb0390d4c59a42236b0a9d89050.r2.dev";

const VIDEO_EDITS_WORKER =
  "https://video-edits-gallery.zyrell-baculi3.workers.dev";

const PHOTOGRAPHY_WORKER =
  "https://photography-gallery.zyrell-baculi3.workers.dev";

type GalleryFile = {
  key: string;
  filename: string;
};

type TileIconName =
  | "video"
  | "camera"
  | "film"
  | "palette"
  | "mail"
  | "user"
  | "close"
  | "arrow";

type TileTiming = {
  open: number;
  exit: number;
};

type MenuTile = {
  id: string;
  label: string;
  href: string;
  icon?: TileIconName;
  className: string;
};

const menuTiles: MenuTile[] = [
  {
    id: "home",
    label: "Home",
    href: "/",
    className: "col-span-2 min-h-[clamp(72px,14dvh,108px)]",
  },
  {
    id: "videography",
    label: "Videography",
    href: "/videography",
    icon: "video",
    className: "min-h-[clamp(56px,11dvh,80px)]",
  },
  {
    id: "photography",
    label: "Photography",
    href: "/photography",
    icon: "camera",
    className: "min-h-[clamp(56px,11dvh,80px)]",
  },
  {
    id: "video-edits",
    label: "Video Edits",
    href: "/video-edits",
    icon: "film",
    className: "min-h-[clamp(56px,11dvh,80px)]",
  },
  {
    id: "graphic-designs",
    label: "Graphic Designs",
    href: "/graphics-design",
    icon: "palette",
    className: "min-h-[clamp(56px,11dvh,80px)]",
  },
  {
    id: "contact",
    label: "Contact Me",
    href: "/contact",
    icon: "mail",
    className: "col-span-2 min-h-[clamp(42px,7dvh,54px)]",
  },
  {
    id: "about",
    label: "About Me",
    href: "/about",
    icon: "user",
    className: "col-span-2 min-h-[clamp(42px,7dvh,54px)]",
  },
];

function TileIcon({
  name,
  className = "h-6 w-6",
}: {
  name: TileIconName;
  className?: string;
}) {
  const common = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };

  switch (name) {
    case "video":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="13" height="14" rx="1" />
          <path d="m16 10 5-3v10l-5-3" />
        </svg>
      );

    case "camera":
      return (
        <svg {...common}>
          <path d="M4 7h4l2-2h4l2 2h4a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1Z" />
          <circle cx="12" cy="13" r="3.5" />
        </svg>
      );

    case "film":
      return (
        <svg {...common}>
          <rect x="4" y="3" width="16" height="18" rx="1" />
          <path d="M8 3v18M16 3v18M4 8h4m-4 8h4m8-8h4m-4 8h4" />
        </svg>
      );

    case "palette":
      return (
        <svg {...common}>
          <path d="M12 3a9 9 0 1 0 0 18h1a2 2 0 0 0 1.5-3.3 1.8 1.8 0 0 1 1.4-3h1.2A4.9 4.9 0 0 0 22 9.8C22 6 17.5 3 12 3Z" />
          <circle cx="7.5" cy="10" r="1" />
          <circle cx="10" cy="6.8" r="1" />
          <circle cx="15" cy="7" r="1" />
        </svg>
      );

    case "mail":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" rx="1" />
          <path d="m4 7 8 6 8-6" />
        </svg>
      );

    case "user":
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21a8 8 0 0 1 16 0" />
        </svg>
      );

    case "close":
      return (
        <svg {...common}>
          <path d="m6 6 12 12M18 6 6 18" />
        </svg>
      );

    case "arrow":
      return (
        <svg {...common}>
          <path d="M7 17 17 7M7 7h10v10" />
        </svg>
      );
  }
}

function MobileTileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [timings, setTimings] = useState<Record<string, TileTiming>>({});
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  function openMenu() {
    const entranceOrder = [...menuTiles].sort(
      () => Math.random() - 0.5,
    );

    const exitOrder = [...menuTiles].sort(
      () => Math.random() - 0.5,
    );

    const nextTimings: Record<string, TileTiming> = {};

    menuTiles.forEach((tile) => {
      nextTimings[tile.id] = {
        open: shouldReduceMotion
          ? 0
          : entranceOrder.findIndex((item) => item.id === tile.id) *
            0.035,
        exit: shouldReduceMotion
          ? 0
          : exitOrder.findIndex((item) => item.id === tile.id) *
            0.025,
      };
    });

    setTimings(nextTimings);
    setIsClosing(false);
    setIsOpen(true);
  }

  function closeMenu() {
    if (!isOpen || isClosing) return;

    setIsClosing(true);

    const exitDelay = shouldReduceMotion
      ? 0
      : (menuTiles.length - 1) * 25;

    window.setTimeout(
      () => {
        setIsOpen(false);
        setIsClosing(false);
      },
      exitDelay + (shouldReduceMotion ? 120 : 240),
    );
  }

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isClosing]);

  const tileVariants = {
    hidden: (timing: TileTiming) => ({
      opacity: 0,
      scale: 0.88,
      transition: {
        duration: shouldReduceMotion ? 0.1 : 0.22,
        delay: timing.exit,
        ease: [0.4, 0, 1, 1] as const,
      },
    }),
    visible: (timing: TileTiming) => ({
      opacity: 1,
      scale: 1,
      transition: {
        duration: shouldReduceMotion ? 0.1 : 0.42,
        delay: timing.open,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    }),
  };

  return (
    <>
      <button
        type="button"
        onClick={isOpen ? closeMenu : openMenu}
        aria-label={
          isOpen ? "Close navigation menu" : "Open navigation menu"
        }
        aria-expanded={isOpen}
        className="fixed right-4 top-4 z-[130] flex h-11 w-11 items-center justify-center border border-white/15 bg-[#151516] text-[#F8F8F5] shadow-lg transition-all duration-300 hover:border-[#B82134] hover:bg-[#B82134] lg:hidden"
      >
        {isOpen && !isClosing ? (
          <TileIcon name="close" />
        ) : (
          <img
            src="/logo.svg"
            alt=""
            className="h-7 w-7 object-contain"
          />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="tile-navigation"
            initial={{ opacity: 0 }}
            animate={{ opacity: isClosing ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: shouldReduceMotion ? 0.1 : 0.28,
              ease: [0.22, 1, 0.36, 1],
            }}
            onClick={closeMenu}
            className="fixed inset-0 z-[120] flex items-center justify-center overflow-hidden bg-[#0B0B0C]/[0.97] px-3 pb-3 pt-16 backdrop-blur-md lg:hidden"
          >
            <div
              onClick={(event) => event.stopPropagation()}
              className="flex max-h-full w-full max-w-[390px] flex-col"
            >
              <div className="mb-2 flex shrink-0 items-center justify-between">
                <div>
                  <p className="text-[9px] font-semibold tracking-[0.28em] text-[#E85A6A]">
                    CAZMIRECREATES
                  </p>
                  <h2 className="mt-0.5 text-xs font-medium tracking-[0.16em] text-[#F8F8F5]">
                    NAVIGATION
                  </h2>
                </div>
              </div>

              <div className="grid shrink-0 grid-cols-2 gap-1.5">
                {menuTiles.map((tile) => {
                  const isActive =
                    pathname === tile.href ||
                    (tile.href !== "/" &&
                      pathname.startsWith(`${tile.href}/`));

                  const timing = timings[tile.id] ?? {
                    open: 0,
                    exit: 0,
                  };

                  const isHome = tile.id === "home";

                  return (
                    <motion.div
                      key={tile.id}
                      custom={timing}
                      variants={tileVariants}
                      initial="hidden"
                      animate={isClosing ? "hidden" : "visible"}
                      className={tile.className}
                    >
                      <Link
                        href={tile.href}
                        onClick={closeMenu}
                        aria-current={isActive ? "page" : undefined}
                        className={[
                          "group relative flex h-full min-h-0 w-full flex-col justify-between overflow-hidden p-3 text-left sm:p-4",
                          "border transition-[background-color,color,border-color] duration-300",
                          isActive
                            ? "border-[#B82134] bg-[#F8F8F5] text-[#151516] shadow-[inset_0_0_0_1px_#B82134]"
                            : isHome
                              ? "border-[#B82134] bg-[#B82134] text-white hover:bg-[#CE2C41]"
                              : "border-white/10 bg-[#242426] text-[#F8F8F5] hover:border-[#B82134] hover:bg-[#35161C]",
                        ].join(" ")}
                      >
                        {isHome ? (
                          <>
                            <div className="flex items-start justify-between">
                              <img
                                src="/logo.svg"
                                alt="CazmireCreates"
                                className={[
                                  "h-9 w-9 object-contain sm:h-11 sm:w-11",
                                  isActive ? "brightness-0" : "",
                                ].join(" ")}
                              />
                              <TileIcon
                                name="arrow"
                                className={[
                                  "h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5",
                                  isActive
                                    ? "text-[#B82134]"
                                    : "text-white",
                                ].join(" ")}
                              />
                            </div>

                            <div>
                              <p
                                className={[
                                  "text-[9px] font-medium tracking-[0.2em]",
                                  isActive
                                    ? "text-[#B82134]"
                                    : "text-white/90",
                                ].join(" ")}
                              >
                                CAZMIRECREATES
                              </p>
                              <span className="mt-0.5 block text-xl font-semibold tracking-tight sm:text-2xl">
                                Home
                              </span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex items-center justify-between">
                              {tile.icon && (
                                <TileIcon
                                  name={tile.icon}
                                  className={[
                                    "h-5 w-5 transition-transform duration-300 group-hover:scale-110 sm:h-6 sm:w-6",
                                    isActive
                                      ? "text-[#B82134]"
                                      : "text-[#E85A6A]",
                                  ].join(" ")}
                                />
                              )}

                              <TileIcon
                                name="arrow"
                                className={[
                                  "h-3.5 w-3.5 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5",
                                  isActive
                                    ? "text-[#B82134]"
                                    : "text-white/65",
                                ].join(" ")}
                              />
                            </div>

                            <span
                              className={[
                                "mt-2 text-xs font-semibold leading-tight tracking-wide sm:text-sm",
                                isActive
                                  ? "text-[#151516]"
                                  : "text-[#F8F8F5]",
                              ].join(" ")}
                            >
                              {tile.label}
                            </span>
                          </>
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              <p className="mt-2 shrink-0 text-center text-[8px] tracking-[0.16em] text-white/50">
                VISUAL ARCHIVE · © 2026 CAZMIRECREATES
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

const featuredWork = {
  videoEdits: {
    title: "Video Edits",
    number: "01",
    description: "Editing / Post-production",
    href: "/video-edits",
    album: "energy-drinks",
  },

  videography: {
    title: "Videography",
    number: "02",
    description: "Filmmaking / Visual storytelling",
    href: "/videography",
  },

  photography: [
    {
      title: "Photography",
      description: "Selected images",
      href: "/photography",
      album: "maasin-fiesta-2026",
    },
    {
      title: "Photo Stories",
      description: "More from the archive",
      href: "/photography",
      album: "blue-deep-resort",
    },
  ],

  graphics: [
    {
      title: "Charles x Alexandra",
      href: "/graphics-design/charles-x-alexandra",
      image: `${R2_BASE}/graphic-designs/charles-x-alexandra/charlesxalexandra_cover.png`,
    },
    {
      title: "FCSO Officer Cards 2024",
      href: "/graphics-design/fcso-cards-2024",
      image: `${R2_BASE}/graphic-designs/fcso-cards-2024/fcsocards2024_cover.jpg`,
    },
  ],
};

function useGalleryMedia(
  workerUrl: string,
  album: string,
  type: "image" | "video" = "image",
) {
  const [media, setMedia] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function loadMedia() {
      try {
        const response = await fetch(
          `${workerUrl}?album=${encodeURIComponent(album)}`,
        );

        if (!response.ok) {
          throw new Error(`Gallery request failed: ${response.status}`);
        }

        const data: { files?: GalleryFile[] } = await response.json();

        const files = (data.files ?? []).filter((file) => {
          const filename = file.filename.toLowerCase();

          return type === "video"
            ? /\.(mp4|webm|mov|m4v|ogv)$/i.test(filename)
            : /\.(jpe?g|png|webp|avif|gif)$/i.test(filename);
        });

        if (!cancelled) {
          setMedia(
            files.map((file) => {
              const encodedKey = file.key
                .split("/")
                .map((part) => encodeURIComponent(part))
                .join("/");

              return `${R2_BASE}/${encodedKey}`;
            }),
          );
        }
      } catch (error) {
        console.error(`Could not load gallery "${album}":`, error);

        if (!cancelled) {
          setMedia([]);
        }
      }
    }

    setMedia([]);
    void loadMedia();

    return () => {
      cancelled = true;
    };
  }, [workerUrl, album, type]);

  return media;
}

function ImageSlideshow({
  images,
  alt,
  interval = 4000,
}: {
  images: string[];
  alt: string;
  interval?: number;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (images.length < 2) {
      setActiveIndex(0);
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length);
    }, interval);

    return () => window.clearInterval(timer);
  }, [images.length, interval]);

  useEffect(() => {
    if (activeIndex >= images.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, images.length]);

  if (images.length === 0) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-[#E8E5DF]">
        <span className="h-px w-10 bg-[#B82134]/40" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#E8E5DF]">
      {images.map((src, index) => (
        <div
          key={src}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === activeIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={src}
            alt={`${alt} ${index + 1}`}
            loading={index === 0 ? "eager" : "lazy"}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        </div>
      ))}

      {images.length > 1 && (
        <div className="absolute bottom-3 right-3 z-10 flex gap-1.5">
          {images.map((_, index) => (
            <span
              key={index}
              className={`h-1 rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? "w-5 bg-[#B82134]"
                  : "w-1.5 bg-white/70"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function GallerySlideshow({
  workerUrl,
  album,
  alt,
  type = "image",
  interval = 4000,
}: {
  workerUrl: string;
  album: string;
  alt: string;
  type?: "image" | "video";
  interval?: number;
}) {
  const media = useGalleryMedia(workerUrl, album, type);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [album]);

  useEffect(() => {
    if (media.length < 2) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % media.length);
    }, interval);

    return () => window.clearInterval(timer);
  }, [media.length, interval]);

  if (media.length === 0) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-[#E8E5DF]">
        <span className="h-px w-10 bg-[#B82134]/40" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#E8E5DF]">
      {media.map((src, index) => (
        <div
          key={src}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === activeIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          {type === "video" ? (
            <video
              src={src}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label={`${alt} ${index + 1}`}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
          ) : (
            <img
              src={src}
              alt={`${alt} ${index + 1}`}
              loading={index === 0 ? "eager" : "lazy"}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
          )}
        </div>
      ))}

      {media.length > 1 && (
        <div className="absolute bottom-3 right-3 z-10 flex gap-1.5">
          {media.map((_, index) => (
            <span
              key={index}
              className={`h-1 rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? "w-5 bg-[#B82134]"
                  : "w-1.5 bg-white/70"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function WorkLabel({
  number,
  title,
  description,
  light = false,
}: {
  number: string;
  title: string;
  description: string;
  light?: boolean;
}) {
  return (
    <div className="relative z-10 flex items-end justify-between gap-3">
      <div className="min-w-0">
        <p
          className={`text-[8px] tracking-[0.22em] ${
            light ? "text-white/50" : "text-[#151516]/45"
          }`}
        >
          {number} / FEATURED
        </p>

        <h3
          className={`mt-1.5 text-sm font-semibold tracking-[-0.02em] md:text-base ${
            light ? "text-[#F8F8F5]" : "text-[#151516]"
          }`}
        >
          {title}
        </h3>

        <p
          className={`mt-1 text-[10px] ${
            light ? "text-white/65" : "text-[#151516]/45"
          }`}
        >
          {description}
        </p>
      </div>

      <span
        className={`mb-0.5 flex h-8 w-8 shrink-0 items-center justify-center border ${
          light
            ? "border-white/20 text-white"
            : "border-[#151516]/15 text-[#151516]"
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-3.5 w-3.5"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M7 17 17 7M7 7h10v10" />
        </svg>
      </span>
    </div>
  );
}

export default function Home() {
  const graphicImages = featuredWork.graphics.map((project) => project.image);

  return (
    <main className="min-h-screen bg-[#F8F8F5] text-[#151516] lg:pl-[270px]">
      <Sidebar />

      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-8 top-24 text-[130px] font-light leading-none tracking-[-0.08em] text-[#151516]/[0.025] md:right-8 md:text-[180px]">
            映像
          </div>

          <div className="absolute bottom-16 left-4 text-[80px] font-light leading-none text-[#B82134]/[0.025] md:left-10 md:text-[100px]">
            作品
          </div>

          <div className="absolute right-7 top-8 h-16 w-px bg-[#B82134]/20 md:right-12 md:top-12 md:h-20" />
          <div className="absolute right-7 top-24 h-px w-12 bg-[#B82134]/20 md:right-12 md:top-32 md:w-20" />
        </div>

        {/* Mobile navigation */}
        <MobileTileMenu />

        {/* Header */}
        <header className="relative flex items-center justify-between px-5 pb-4 pt-5 sm:px-8 md:px-12 md:pb-5 md:pt-7 lg:px-16">
          <div>
            <p className="text-[8px] tracking-[0.25em] text-[#151516]/40 md:text-[9px] md:tracking-[0.3em]">
              PORTFOLIO / 001
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-[-0.05em] text-[#B82134] sm:text-4xl md:text-5xl">
              HOME
            </h1>
          </div>

          <div className="hidden text-right sm:block">
            <p className="text-[8px] tracking-[0.2em] text-[#151516]/35">
              MULTIMEDIA DESIGNER
            </p>
            <p className="mt-1 text-[8px] tracking-[0.15em] text-[#151516]/25">
              PHOTOGRAPHY / VIDEO / DESIGN
            </p>
          </div>
        </header>

        {/* Bento portfolio */}
        <div className="relative px-5 pb-0 sm:px-8 md:px-12 md:pb-0 lg:px-16">
          <div className="mb-3 flex items-end justify-between gap-4 md:mb-4">
            <div>
              <p className="text-[8px] tracking-[0.28em] text-[#B82134] md:text-[9px]">
                A CURATED COLLECTION
              </p>
              <h2 className="mt-1.5 text-xl font-semibold tracking-[-0.04em] sm:text-2xl">
                Selected Works
              </h2>
            </div>

            <p className="hidden max-w-[170px] text-right text-[10px] leading-5 text-[#151516]/45 sm:block">
              A selection of projects across my creative disciplines.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-6">
            {/* Video Edits */}
            <Link
              href={featuredWork.videoEdits.href}
              className="group relative col-span-2 flex min-h-[230px] flex-col justify-between overflow-hidden bg-[#E8E5DF] p-4 sm:min-h-[260px] sm:p-5 lg:col-span-3 lg:min-h-[300px]"
            >
              <GallerySlideshow
                workerUrl={VIDEO_EDITS_WORKER}
                album={featuredWork.videoEdits.album}
                alt="Energy Drinks video edit"
                type="video"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/25" />

              <div className="relative z-10 flex items-center justify-between">
                <span className="border border-white/35 px-2 py-1 text-[8px] tracking-[0.2em] text-white">
                  VIDEO
                </span>
                <span className="text-[9px] tracking-[0.2em] text-white/70">
                  01
                </span>
              </div>

              <WorkLabel
                number="01"
                title="Video Edits"
                description="Editing / Post-production"
                light
              />
            </Link>

            {/* Videography */}
            <Link
              href={featuredWork.videography.href}
              className="group relative col-span-2 flex min-h-[180px] flex-col justify-between overflow-hidden bg-[#E8E5DF] p-4 sm:min-h-[200px] sm:p-5 lg:col-span-3 lg:min-h-[300px]"
            >
              <GallerySlideshow
                workerUrl={VIDEO_EDITS_WORKER}
                album="cinematic-vlogs"
                alt="Cinematic video preview"
                type="video"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/25" />

              <div className="relative z-10 flex items-center justify-between">
                <span className="border border-white/35 px-2 py-1 text-[8px] tracking-[0.2em] text-white">
                  VIDEOGRAPHY
                </span>
                <span className="text-[9px] tracking-[0.2em] text-white/70">
                  02
                </span>
              </div>

              <WorkLabel
                number="02"
                title="Videography"
                description="Filmmaking / Visual storytelling"
                light
              />
            </Link>

            {/* Photography preview 1 */}
            <Link
              href={featuredWork.photography[0].href}
              className="group relative col-span-1 flex min-h-[190px] flex-col justify-between overflow-hidden bg-[#E8E5DF] p-3.5 sm:min-h-[230px] sm:p-5 lg:col-span-2 lg:min-h-[240px]"
            >
              <GallerySlideshow
                workerUrl={PHOTOGRAPHY_WORKER}
                album={featuredWork.photography[0].album}
                alt={featuredWork.photography[0].title}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20" />

              <div className="relative z-10 flex items-center justify-between">
                <span className="border border-white/35 px-2 py-1 text-[7px] tracking-[0.15em] text-white sm:text-[8px]">
                  PHOTO
                </span>
                <span className="text-[9px] tracking-[0.15em] text-white/70">
                  03
                </span>
              </div>

              <WorkLabel
                number="03"
                title={featuredWork.photography[0].title}
                description={featuredWork.photography[0].description}
                light
              />
            </Link>

            {/* Photography preview 2 */}
            <Link
              href={featuredWork.photography[1].href}
              className="group relative col-span-1 flex min-h-[190px] flex-col justify-between overflow-hidden bg-[#E8E5DF] p-3.5 sm:min-h-[230px] sm:p-5 lg:col-span-2 lg:min-h-[240px]"
            >
              <GallerySlideshow
                workerUrl={PHOTOGRAPHY_WORKER}
                album={featuredWork.photography[1].album}
                alt={featuredWork.photography[1].title}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20" />

              <div className="relative z-10 flex items-center justify-between">
                <span className="border border-white/35 px-2 py-1 text-[7px] tracking-[0.15em] text-white sm:text-[8px]">
                  PHOTO
                </span>
                <span className="text-[9px] tracking-[0.15em] text-white/70">
                  04
                </span>
              </div>

              <WorkLabel
                number="04"
                title={featuredWork.photography[1].title}
                description={featuredWork.photography[1].description}
                light
              />
            </Link>

            {/* Graphics Design */}
            <Link
              href="/graphics-design"
              className="group relative col-span-2 flex min-h-[210px] flex-col justify-between overflow-hidden bg-[#E8E5DF] p-4 sm:min-h-[250px] sm:p-5 lg:col-span-2 lg:min-h-[240px]"
            >
              <ImageSlideshow
                images={graphicImages}
                alt="Graphic design portfolio preview"
                interval={3500}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/20" />

              <div className="relative z-10 flex items-center justify-between">
                <span className="border border-white/35 px-2 py-1 text-[8px] tracking-[0.15em] text-white">
                  GRAPHIC DESIGN
                </span>
                <span className="text-[9px] tracking-[0.15em] text-white/70">
                  05
                </span>
              </div>

              <WorkLabel
                number="05"
                title="Graphics Design"
                description="Visuals / Art direction"
                light
              />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
