"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const albums = [
  {
    number: "01",
    title: "PROJECT ONE",
    category: "FILM / PRODUCTION",
    year: "2026",
  },
  {
    number: "02",
    title: "PROJECT TWO",
    category: "EVENT / DOCUMENTARY",
    year: "2026",
  },
  {
    number: "03",
    title: "PROJECT THREE",
    category: "COMMERCIAL",
    year: "2025",
  },
  {
    number: "04",
    title: "PROJECT FOUR",
    category: "CINEMATOGRAPHY",
    year: "2025",
  },
  {
    number: "05",
    title: "PROJECT FIVE",
    category: "SOCIAL / CONTENT",
    year: "2025",
  },
  {
    number: "06",
    title: "PROJECT SIX",
    category: "PRODUCTION",
    year: "2024",
  },
];

const categories = [
  "ALL",
  "FILM / PRODUCTION",
  "EVENT / DOCUMENTARY",
  "COMMERCIAL",
  "CINEMATOGRAPHY",
  "SOCIAL / CONTENT",
  "PRODUCTION",
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



/* Mobile tile navigation */

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

export default function VideographyPage() {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const filteredAlbums =
    activeCategory === "ALL"
      ? albums
      : albums.filter((album) => album.category === activeCategory);

  return (
    <main className="h-[100dvh] overflow-hidden bg-[#F8F8F5] lg:pl-[270px]">
      <section className="relative flex h-full flex-col overflow-hidden">
        {/* Japanese background element */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, x: 20 }}
          animate={{ opacity: 0.025, scale: 1, x: 0 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none absolute -right-10 top-24 z-0 text-[120px] font-light leading-none tracking-[-0.08em] text-[#151516] md:text-[170px]"
        >
          映像
        </motion.div>

        <MobileTileMenu />

        {/* Fixed header area */}
        <header className="relative z-30 shrink-0 px-4 pb-0 pt-6 sm:px-6 md:px-12 md:pt-10 lg:px-16">
          <div className="flex items-end justify-between">
            {/* Left header */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-[8px] tracking-[0.3em] text-[#151516]/30 md:text-[9px]">
                PORTFOLIO / 002
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-[#B82134] sm:text-4xl md:mt-3 md:text-5xl">
                VIDEOGRAPHY
              </h1>
            </motion.div>

            {/* Right header */}
            <motion.div
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.18, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="hidden text-right md:block"
            >
              <p className="text-[8px] tracking-[0.2em] text-[#151516]/30">
                MOVING IMAGE
              </p>
              <p className="mt-1 text-[8px] tracking-[0.2em] text-[#151516]/20">
                PRODUCTION / CINEMATOGRAPHY
              </p>
            </motion.div>
          </div>

          {/* Category filters */}
          <div className="relative z-[60] mt-5 sm:mt-6 md:mt-8">
            {/* Compact dropdown — mobile only */}
            <div className="relative z-[100] w-full md:hidden">
              <button
                type="button"
                onClick={() => setIsCategoryOpen((open) => !open)}
                aria-expanded={isCategoryOpen}
                aria-haspopup="listbox"
                className="flex h-9 w-full items-center justify-between border border-[#151516]/15 bg-[#F8F8F5] px-3 text-left text-[9px] tracking-[0.12em] text-[#151516] transition-colors hover:border-[#B82134]"
              >
                <span>
                  <span className="mr-2 text-[#151516]/40">CATEGORY /</span>
                  <span className="font-semibold text-[#B82134]">
                    {activeCategory}
                  </span>
                </span>
                <svg
                  className={`h-3.5 w-3.5 text-[#B82134] transition-transform duration-200 ${
                    isCategoryOpen ? "rotate-180" : ""
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>

              {isCategoryOpen && (
                <div
                  role="listbox"
                  aria-label="Videography categories"
                  className="absolute inset-x-0 top-full z-[100] mt-1 max-h-44 overflow-y-auto border border-[#151516]/15 bg-[#F8F8F5] py-1 shadow-lg"
                >
                  {categories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      role="option"
                      aria-selected={activeCategory === category}
                      onClick={() => {
                        setActiveCategory(category);
                        setIsCategoryOpen(false);
                      }}
                      className={`flex min-h-8 w-full items-center justify-between px-3 py-2 text-left text-[9px] tracking-[0.1em] transition-colors ${
                        activeCategory === category
                          ? "bg-[#B82134]/[0.06] font-semibold text-[#B82134]"
                          : "text-[#151516]/60 hover:bg-[#151516]/[0.04] hover:text-[#151516]"
                      }`}
                    >
                      <span>{category}</span>
                      {activeCategory === category && (
                        <span className="text-[#B82134]">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Horizontal filters — desktop only */}
            <motion.nav
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              aria-label="Filter videography albums"
              className="hidden flex-wrap gap-x-4 gap-y-2 pb-3 md:flex sm:gap-x-5"
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
                  className={`text-[7px] tracking-[0.08em] transition-colors duration-300 sm:text-[8px] sm:tracking-[0.12em] md:tracking-[0.14em] ${
                    activeCategory === category
                      ? "text-[#B82134]"
                      : "text-[#151516]/40 hover:text-[#151516]"
                  }`}
                >
                  {category}
                </motion.button>
              ))}
            </motion.nav>
          </div>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 0.48, duration: 0.65, ease: [0.77, 0, 0.175, 1] }}
            style={{ transformOrigin: "left" }}
            className="h-px w-full bg-[#151516]/10"
          />
        </header>

        {/* Scrollable album area */}
        <section className="custom-scrollbar relative z-10 min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-7 md:px-12 md:py-10 lg:px-16">
          {/* Two-column layout at every screen size */}
          <motion.div layout className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-5 sm:gap-y-9 md:gap-x-6 md:gap-y-12">
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
                  href={`/videography/${album.title.toLowerCase().replace(/\s+/g, "-")}`}
                  className="group block cursor-pointer"
                >
                  {/* Album frame */}
                  <div className="relative aspect-video overflow-hidden bg-[#151516]">
                    {/* Album number */}
                    <div className="absolute left-2 top-2 z-10 text-[8px] tracking-[0.15em] text-[#F8F8F5]/50 sm:left-4 sm:top-4 sm:text-[9px] sm:tracking-[0.2em]">
                      {album.number}
                    </div>

                    {/* Album information */}
                    <div className="absolute inset-x-0 bottom-0 z-10 p-2.5 sm:p-4 md:p-5">
                      <h2 className="text-[10px] font-bold leading-tight tracking-[0.01em] text-[#F8F8F5] sm:text-xs md:text-sm md:tracking-[0.03em]">
                        {album.title}
                      </h2>
                      <p className="mt-1.5 text-[6px] tracking-[0.08em] text-[#F8F8F5]/70 sm:mt-2 sm:text-[8px] sm:tracking-[0.18em]">
                        {album.category}
                      </p>
                      <p className="mt-1.5 text-[6px] tracking-[0.1em] text-[#F8F8F5]/50 sm:mt-2 sm:text-[7px] sm:tracking-[0.15em]">
                        {album.year}
                      </p>
                    </div>

                    {/* Dark gradient behind album information */}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-20 bg-gradient-to-t from-[#151516] via-[#151516]/60 to-transparent sm:h-28" />

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
