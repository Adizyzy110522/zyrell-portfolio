
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const disciplines = [
  "VIDEO EDITING",
  "MOTION DESIGN",
  "GRAPHIC DESIGN",
  "PHOTOGRAPHY",
  "VIDEOGRAPHY",
];

const software = [
  { name: "PREMIERE PRO", icon: "/adobe/Pr.svg" },
  { name: "AFTER EFFECTS", icon: "/adobe/Ae.svg" },
  { name: "PHOTOSHOP", icon: "/adobe/Ps.svg" },
  { name: "LIGHTROOM CLASSIC", icon: "/adobe/LrC.svg" },
  { name: "MEDIA ENCODER", icon: "/adobe/Me.svg" },
  { name: "ILLUSTRATOR", icon: "/adobe/Ai.svg" },
];

const documents = [
  {
    id: "cv",
    title: "Curriculum Vitae",
    short: "CV",
    file: "/documents/curriculum-vitae.pdf",
  },
  {
    id: "resume",
    title: "Resume",
    short: "RESUME",
    file: "/documents/resume.pdf",
  },
];

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
          : entranceOrder.findIndex((item) => item.id === tile.id) * 0.035,
        exit: shouldReduceMotion
          ? 0
          : exitOrder.findIndex((item) => item.id === tile.id) * 0.025,
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
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
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

export default function AboutPage() {
  const [resumeModalOpen, setResumeModalOpen] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);

  const toggleDocument = (id: string) => {
    setSelectedDocuments((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  const selectedFiles = documents.filter((document) =>
    selectedDocuments.includes(document.id),
  );

  const handleView = () => {
    selectedFiles.forEach((document) => {
      window.open(document.file, "_blank", "noopener,noreferrer");
    });
  };

  const handleDownload = () => {
    selectedFiles.forEach((document) => {
      const link = window.document.createElement("a");
      link.href = document.file;
      link.download = document.file.split("/").pop() || document.short;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
    });
  };

  return (
    <main className="h-screen overflow-hidden bg-[#F8F8F5] lg:pl-[270px]">
      <section className="relative flex h-full flex-col overflow-hidden">
        {/* MOBILE TILE NAVIGATION */}
        <MobileTileMenu />

        {/* BACKGROUND PROFILE IMAGE */}
        <motion.div
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 1.2,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="pointer-events-none absolute right-0 top-0 z-0 h-[82%] w-[62%] overflow-hidden"
        >
          <Image
            src="/profile.jpg"
            alt=""
            fill
            className="object-cover object-center grayscale opacity-[0.24]"
            sizes="62vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#F8F8F5] via-[#F8F8F5]/25 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#F8F8F5]" />
          <div className="absolute inset-0 bg-[#F8F8F5]/5" />
        </motion.div>

        {/* JAPANESE BACKGROUND */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, x: 20 }}
          animate={{ opacity: 0.025, scale: 1, x: 0 }}
          transition={{
            duration: 1.1,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="pointer-events-none absolute -right-14 top-24 z-0 text-[180px] font-light leading-none tracking-[-0.08em] text-[#151516]"
        >
          私
        </motion.div>

        {/* HEADER */}
        <header className="relative z-10 shrink-0 px-5 pb-0 pt-7 sm:px-8 sm:pt-10 md:px-12 lg:px-16">
          <div className="flex items-end justify-between gap-4">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.65,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <p className="text-[8px] tracking-[0.3em] text-[#151516]/30 sm:text-[9px]">
                PORTFOLIO / 007
              </p>
              <h1 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-[#B82134] sm:text-4xl md:text-5xl">
                ABOUT ME
              </h1>
            </motion.div>

            {/* DESKTOP CV / RESUME BUTTON */}
            <motion.button
              type="button"
              onClick={() => setResumeModalOpen(true)}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 0.18,
                duration: 0.55,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mb-1 hidden shrink-0 bg-[#B82134] px-4 py-3 text-[8px] font-semibold tracking-[0.18em] text-white shadow-[0_4px_18px_rgba(184,33,52,0.16)] transition-all duration-300 hover:bg-[#991B2B] hover:shadow-[0_0_25px_rgba(184,33,52,0.3)] active:scale-[0.98] sm:inline-flex"
            >
              CV × RESUME
            </motion.button>
          </div>

          {/* HEADER DIVIDER */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{
              delay: 0.3,
              duration: 0.65,
              ease: [0.77, 0, 0.175, 1],
            }}
            style={{ transformOrigin: "left" }}
            className="mt-6 h-px w-full bg-[#151516]/10 sm:mt-8"
          />
        </header>

        {/* SCROLLABLE CONTENT */}
        <section className="custom-scrollbar relative z-10 min-h-0 flex-1 overflow-y-auto px-5 py-7 sm:px-8 sm:py-10 md:px-12 lg:px-16">
          <div className="max-w-5xl">
            {/* INTRODUCTION */}
            <div className="grid gap-7 md:grid-cols-[280px_1fr] md:gap-10 lg:grid-cols-[320px_1fr]">
              {/* PROFILE IMAGE */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.35,
                  duration: 0.65,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-[#151516]">
                  <Image
                    src="/profile.jpg"
                    alt="Zyrell Baculi"
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 100vw, 320px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#151516]/70 via-transparent to-transparent" />
                  <div className="absolute bottom-5 left-5">
                    <p className="text-[8px] font-medium tracking-[0.2em] text-[#F8F8F5]/50">
                      MULTIMEDIA DESIGNER
                    </p>
                    <div className="mt-3 h-px w-8 bg-[#B82134]" />
                  </div>
                </div>
              </motion.div>

              {/* INTRODUCTION TEXT */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.45,
                  duration: 0.65,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="flex flex-col justify-center"
              >
                <p className="text-[9px] font-semibold tracking-[0.25em] text-[#B82134]">
                  HELLO, I&apos;M ZYRELL
                </p>
                <h2 className="mt-4 max-w-2xl text-2xl font-bold leading-tight tracking-[-0.03em] text-[#151516] md:text-3xl">
                  I create visual work that brings ideas, stories, and
                  experiences to life.
                </h2>
                <p className="mt-6 max-w-2xl text-[11px] font-medium leading-6 tracking-[0.02em] text-[#151516]/65">
                  I&apos;m a multimedia designer working across video,
                  photography, motion graphics, and graphic design. I enjoy
                  combining visual storytelling with thoughtful design to
                  create work that communicates clearly and feels intentional.
                </p>
                <p className="mt-4 max-w-2xl text-[10px] leading-6 tracking-[0.02em] text-[#151516]/45">
                  This portfolio is a collection of selected work, experiments,
                  and projects that reflect the way I approach visual
                  communication.
                </p>
              </motion.div>
            </div>

            {/* DISCIPLINES */}
            <motion.section
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.6,
                duration: 0.65,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-12 border-t border-[#151516]/10 pt-7 sm:mt-16 sm:pt-8"
            >
              <div className="flex flex-col gap-6 md:flex-row md:justify-between md:gap-8">
                <div>
                  <p className="text-[8px] font-semibold tracking-[0.2em] text-[#151516]/40">
                    WHAT I DO
                  </p>
                  <h2 className="mt-3 text-xl font-bold tracking-[-0.02em] text-[#151516]">
                    CREATIVE DISCIPLINES
                  </h2>
                </div>

                <div className="grid flex-1 gap-x-8 gap-y-4 md:max-w-xl md:grid-cols-2">
                  {disciplines.map((discipline, index) => (
                    <motion.div
                      key={discipline}
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.65 + index * 0.07,
                        duration: 0.45,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="flex items-center gap-3"
                    >
                      <span className="h-px w-5 bg-[#B82134]" />
                      <span className="text-[9px] font-semibold tracking-[0.15em] text-[#151516]/65">
                        {discipline}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.section>

            {/* APPROACH */}
            <motion.section
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.8,
                duration: 0.65,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-12 border-t border-[#151516]/10 pt-7 sm:mt-16 sm:pt-8"
            >
              <div className="grid gap-6 md:grid-cols-[220px_1fr] md:gap-8">
                <div>
                  <p className="text-[8px] font-semibold tracking-[0.2em] text-[#151516]/40">
                    APPROACH
                  </p>
                  <h2 className="mt-3 text-xl font-bold tracking-[-0.02em] text-[#151516]">
                    HOW I WORK
                  </h2>
                </div>

                <div className="max-w-2xl">
                  <p className="text-[11px] font-medium leading-6 tracking-[0.02em] text-[#151516]/65">
                    Good visual work starts with understanding the message.
                    Whether I&apos;m editing a video, designing a graphic, or
                    creating a visual sequence, I focus on clarity, pacing,
                    composition, and purpose.
                  </p>
                  <p className="mt-4 text-[10px] leading-6 tracking-[0.02em] text-[#151516]/45">
                    I like working through ideas from concept to final output,
                    refining the small details while keeping the bigger picture
                    in mind.
                  </p>
                </div>
              </div>
            </motion.section>

            {/* SOFTWARE */}
            <motion.section
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.95,
                duration: 0.65,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-12 border-t border-[#151516]/10 pt-7 pb-8 sm:mt-16 sm:pt-8 sm:pb-12"
            >
              <div className="flex flex-col gap-6 md:flex-row md:justify-between md:gap-8">
                <div>
                  <p className="text-[8px] font-semibold tracking-[0.2em] text-[#151516]/40">
                    TOOLKIT
                  </p>
                  <h2 className="mt-3 text-xl font-bold tracking-[-0.02em] text-[#151516]">
                    ADOBE
                  </h2>
                </div>

                <div className="grid flex-1 grid-cols-2 gap-3 sm:grid-cols-3 md:max-w-xl">
                  {software.map((tool, index) => (
                    <motion.div
                      key={tool.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 1 + index * 0.06,
                        duration: 0.4,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="group flex items-center gap-3 border border-[#151516]/15 px-3 py-3 transition-all duration-300 hover:border-[#B82134]/50"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center transition-transform duration-300 group-hover:scale-105">
                        <Image
                          src={tool.icon}
                          alt={`${tool.name} icon`}
                          width={36}
                          height={36}
                          className="h-9 w-9 object-contain"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="break-words text-[8px] font-semibold tracking-[0.08em] text-[#151516]/70">
                          {tool.name}
                        </p>
                        <p className="mt-1 text-[7px] tracking-[0.12em] text-[#151516]/30">
                          ADOBE
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.section>

            {/* MOBILE CV / RESUME BUTTON */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 1.1,
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex justify-center pb-6 sm:hidden"
            >
              <button
                type="button"
                onClick={() => setResumeModalOpen(true)}
                className="w-full bg-[#B82134] px-5 py-4 text-[9px] font-semibold tracking-[0.2em] text-white shadow-[0_4px_18px_rgba(184,33,52,0.18)] transition-all duration-300 hover:bg-[#991B2B] hover:shadow-[0_0_25px_rgba(184,33,52,0.3)] active:scale-[0.98]"
              >
                VIEW CV × RESUME
              </button>
            </motion.div>
          </div>
        </section>

        {/* CV / RESUME MODAL */}
        {resumeModalOpen && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#151516]/40 px-5 py-6 backdrop-blur-[5px]"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setResumeModalOpen(false);
              }
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.35,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative my-auto w-full max-w-2xl overflow-hidden border border-[#151516]/10 bg-[#F8F8F5]/95 p-5 shadow-[0_20px_80px_rgba(21,21,22,0.18)] backdrop-blur-xl sm:p-7 md:p-10"
            >
              {/* MODAL JAPANESE BACKGROUND */}
              <div className="pointer-events-none absolute -right-8 -top-10 text-[140px] font-light leading-none tracking-[-0.08em] text-[#151516]/[0.025]">
                書類
              </div>

              {/* MODAL HEADER */}
              <div className="relative z-10 flex items-start justify-between gap-4">
                <div>
                  <p className="text-[8px] font-semibold tracking-[0.22em] text-[#151516]/40">
                    DOCUMENTS
                  </p>
                  <h2 className="mt-2 text-xl font-bold tracking-[-0.02em] text-[#151516]">
                    CV × RESUME
                  </h2>
                  <p className="mt-2 text-[8px] leading-5 tracking-[0.05em] text-[#151516]/35">
                    Select one or both documents.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setResumeModalOpen(false)}
                  className="text-xl font-light leading-none text-[#151516]/30 transition-colors duration-300 hover:text-[#B82134]"
                  aria-label="Close modal"
                >
                  ×
                </button>
              </div>

              {/* DOCUMENT SELECTION */}
              <div className="relative z-10 mt-6 grid gap-3 sm:mt-8 sm:grid-cols-2">
                {documents.map((document) => {
                  const selected = selectedDocuments.includes(document.id);

                  return (
                    <button
                      key={document.id}
                      type="button"
                      onClick={() => toggleDocument(document.id)}
                      aria-pressed={selected}
                      className={`group relative flex items-center gap-5 overflow-hidden border p-5 text-left transition-all duration-500 ${
                        selected
                          ? "border-[#B82134] bg-[#B82134]/[0.035]"
                          : "border-[#151516]/10 hover:border-[#B82134]/50"
                      }`}
                    >
                      <div className="relative h-14 w-12 shrink-0">
                        <Image
                          src="/file.svg"
                          alt="File"
                          fill
                          className={`object-contain transition-all duration-300 ${
                            selected
                              ? "opacity-100"
                              : "opacity-65 group-hover:opacity-100"
                          }`}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span
                            className={`text-[7px] font-bold tracking-[0.08em] transition-colors duration-300 ${
                              selected
                                ? "text-[#B82134]"
                                : "text-[#151516]/55"
                            }`}
                          >
                            {document.short}
                          </span>
                        </div>
                      </div>

                      <div>
                        <p className="text-[9px] font-semibold tracking-[0.08em] text-[#151516]/75">
                          {document.title}
                        </p>
                        <p className="mt-1 text-[7px] tracking-[0.12em] text-[#151516]/35">
                          PDF DOCUMENT
                        </p>
                      </div>

                      <span
                        className={`absolute right-4 top-4 h-2 w-2 rounded-full border transition-all duration-300 ${
                          selected
                            ? "border-[#B82134] bg-[#B82134]"
                            : "border-[#151516]/15"
                        }`}
                      />

                      <div
                        className={`absolute bottom-0 left-0 h-[2px] bg-[#B82134] transition-all duration-500 ${
                          selected ? "w-full" : "w-0 group-hover:w-full"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              {/* MODAL FOOTER */}
              <div className="relative z-10 mt-6 flex flex-col gap-4 border-t border-[#151516]/10 pt-5 sm:mt-8 sm:flex-row sm:items-center sm:justify-between sm:gap-5 sm:pt-6">
                <p className="text-[7px] tracking-[0.14em] text-[#151516]/30">
                  {selectedFiles.length === 0
                    ? "SELECT A DOCUMENT"
                    : `${selectedFiles.length} DOCUMENT${
                        selectedFiles.length > 1 ? "S" : ""
                      } SELECTED`}
                </p>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleView}
                    disabled={selectedFiles.length === 0}
                    className="border border-[#151516]/15 px-5 py-3 text-[7px] font-semibold tracking-[0.18em] text-[#151516]/60 transition-all duration-300 hover:border-[#B82134] hover:text-[#B82134] hover:shadow-[0_0_20px_rgba(184,33,52,0.10)] disabled:cursor-not-allowed disabled:opacity-20"
                  >
                    VIEW
                  </button>

                  <button
                    type="button"
                    onClick={handleDownload}
                    disabled={selectedFiles.length === 0}
                    className="bg-[#151516] px-5 py-3 text-[7px] font-semibold tracking-[0.18em] text-[#F8F8F5] transition-all duration-300 hover:bg-[#B82134] hover:shadow-[0_0_20px_rgba(184,33,52,0.15)] disabled:cursor-not-allowed disabled:opacity-20"
                  >
                    DOWNLOAD
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </section>
    </main>
  );
}
