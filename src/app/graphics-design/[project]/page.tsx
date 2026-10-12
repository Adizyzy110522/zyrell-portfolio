
"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useParams } from "next/navigation";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
} from "react";

const R2_BASE_URL =
  "https://pub-dcd3ffb0390d4c59a42236b0a9d89050.r2.dev";

const IMAGE_LIST_URL =
  "https://graphics-design-gallery.zyrell-baculi3.workers.dev";

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
  "fcso-cards-2024": {
    title: "FCSO Officer Cards 2024",
    number: "002",
    category: "CORPORATE/EVENTS",
    description: "A set of officer cards for the FCSO in 2024.",
  },
};

function getImageUrl(key: string) {
  return `${R2_BASE_URL}/${key
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/")}`;
}

function isCoverImage(filename: string) {
  return /_cover\.(jpg|jpeg|png|webp|gif|avif)$/i.test(filename);
}

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return direction === "left" ? (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M19 12H5m7 7-7-7 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ) : (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14m-7-7 7 7-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m18 6-12 12M6 6l12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ZoomIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="10.8" cy="10.8" r="6.8" stroke="currentColor" strokeWidth="1.5" />
      <path d="M16 16l4.5 4.5M10.8 7.8v6m-3-3h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function MouseIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="6.5" y="2.5" width="11" height="19" rx="5.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 3v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function KeyboardIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2.5" y="5" width="19" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6 9h.01M10 9h.01M14 9h.01M18 9h.01M6 12h.01M10 12h.01M14 12h.01M18 12h.01M8 15.5h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
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
  const [direction, setDirection] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const thumbnailRefs = useRef<Record<number, HTMLButtonElement | null>>({});
  const hideControlsTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pointerStart = useRef({ x: 0, y: 0 });
  const panStart = useRef({ x: 0, y: 0 });
  const panPosition = useRef({ x: 0, y: 0 });

  const panX = useMotionValue(0);
  const panY = useMotionValue(0);
  const smoothPanX = useSpring(panX, { stiffness: 240, damping: 30 });
  const smoothPanY = useSpring(panY, { stiffness: 240, damping: 30 });

  const selectedDesign =
    selectedIndex === null ? null : designs[selectedIndex] ?? null;

  const resetZoom = useCallback(() => {
    setZoom(1);
    setIsDragging(false);
    panPosition.current = { x: 0, y: 0 };
    panX.set(0);
    panY.set(0);
  }, [panX, panY]);

  const closeViewer = useCallback(() => {
    setSelectedIndex(null);
    setDirection(0);
    setShowControls(true);
    resetZoom();
  }, [resetZoom]);

  const openViewer = useCallback(
    (index: number) => {
      setSelectedIndex(index);
      setDirection(0);
      setShowControls(true);
      resetZoom();
    },
    [resetZoom],
  );

  const goToImage = useCallback(
    (index: number, nextDirection: number) => {
      if (index < 0 || index >= designs.length) return;

      setDirection(nextDirection);
      setSelectedIndex(index);
      setShowControls(true);
      resetZoom();

      window.requestAnimationFrame(() => {
        thumbnailRefs.current[index]?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      });
    },
    [designs.length, resetZoom],
  );

  const goPrevious = useCallback(() => {
    if (selectedIndex === null || designs.length <= 1) return;
    const index = (selectedIndex - 1 + designs.length) % designs.length;
    goToImage(index, -1);
  }, [selectedIndex, designs.length, goToImage]);

  const goNext = useCallback(() => {
    if (selectedIndex === null || designs.length <= 1) return;
    const index = (selectedIndex + 1) % designs.length;
    goToImage(index, 1);
  }, [selectedIndex, designs.length, goToImage]);

  const scheduleControlFade = useCallback(() => {
    setShowControls(true);

    if (hideControlsTimeout.current) {
      clearTimeout(hideControlsTimeout.current);
    }

    hideControlsTimeout.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  }, []);

  useEffect(() => {
    if (!project) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    async function loadDesigns() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `${IMAGE_LIST_URL}/?album=${encodeURIComponent(projectSlug)}`,
          { signal: controller.signal, cache: "no-store" },
        );

        if (!response.ok) {
          throw new Error(`Worker returned HTTP ${response.status}`);
        }

        const data: { files?: Design[]; error?: string } =
          await response.json();

        if (!Array.isArray(data.files)) {
          throw new Error(data.error || "Invalid response from gallery Worker.");
        }

        const galleryDesigns = data.files
          .filter(
            (file) =>
              typeof file.key === "string" &&
              typeof file.filename === "string",
          )
          .filter((file) => !isCoverImage(file.filename))
          .sort((a, b) =>
            a.filename.localeCompare(b.filename, undefined, {
              numeric: true,
              sensitivity: "base",
            }),
          );

        setDesigns(galleryDesigns);
        setImageErrors({});
        setBackgroundIndex(0);
        setSelectedIndex(null);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;

        setDesigns([]);
        setError(
          "Unable to load designs. Please check the Worker and R2 image URLs, then try again.",
        );
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
      if (event.key === "Escape") {
        event.preventDefault();
        closeViewer();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrevious();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      } else if (event.key === "0") {
        event.preventDefault();
        resetZoom();
      } else if (event.key === "+" || event.key === "=") {
        event.preventDefault();
        setZoom((current) => Math.min(4, +(current + 0.25).toFixed(2)));
      } else if (event.key === "-") {
        event.preventDefault();
        setZoom((current) => Math.max(1, +(current - 0.25).toFixed(2)));
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedIndex, closeViewer, goPrevious, goNext, resetZoom]);

  useEffect(() => {
    return () => {
      if (hideControlsTimeout.current) {
        clearTimeout(hideControlsTimeout.current);
      }
    };
  }, []);

  useEffect(() => {
    if (zoom <= 1) {
      panPosition.current = { x: 0, y: 0 };
      panX.set(0);
      panY.set(0);
    }
  }, [zoom, panX, panY]);

  const handleWheel = (event: ReactWheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    setZoom((current) =>
      Math.max(
        1,
        Math.min(4, +(current + (event.deltaY < 0 ? 0.2 : -0.2)).toFixed(2)),
      ),
    );
    scheduleControlFade();
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (zoom <= 1 || event.button !== 0) return;

    setIsDragging(true);
    pointerStart.current = { x: event.clientX, y: event.clientY };
    panStart.current = { ...panPosition.current };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDragging || zoom <= 1) return;

    const x = panStart.current.x + event.clientX - pointerStart.current.x;
    const y = panStart.current.y + event.clientY - pointerStart.current.y;

    panPosition.current = { x, y };
    panX.set(x);
    panY.set(y);
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    setIsDragging(false);

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    scheduleControlFade();
  };

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
          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
            <AnimatePresence mode="sync">
              {designs.length > 0 && designs[backgroundIndex] && (
                <motion.img
                  key={designs[backgroundIndex].key}
                  src={getImageUrl(designs[backgroundIndex].key)}
                  alt=""
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.4 }}
                  exit={{ opacity: 0 }}
                  transition={{ opacity: { duration: 1.8, ease: "easeInOut" } }}
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
                    onClick={() => openViewer(index)}
                    aria-label={`View design ${design.filename}`}
                    className="group block w-full cursor-zoom-in text-left"
                  >
                    <div
                      className="relative aspect-[4/3] overflow-hidden bg-[#151516]"
                      onContextMenu={(event) => event.preventDefault()}
                    >
                      {!imageErrors[design.key] ? (
                        <motion.img
                          src={getImageUrl(design.key)}
                          alt={`${project.title} — ${design.filename}`}
                          loading={index < 3 ? "eager" : "lazy"}
                          decoding="async"
                          draggable={false}
                          onContextMenu={(event) => event.preventDefault()}
                          onError={() =>
                            setImageErrors((current) => ({
                              ...current,
                              [design.key]: true,
                            }))
                          }
                          whileHover={{ scale: 1.035 }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                          className="absolute inset-0 h-full w-full select-none object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center p-5 text-center text-[9px] tracking-[0.15em] text-white/55">
                          IMAGE UNAVAILABLE
                        </div>
                      )}

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

      <AnimatePresence>
        {selectedDesign && selectedIndex !== null && (
          <motion.div
            key="design-viewer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] overflow-hidden bg-[#090909]/[0.98] text-white"
            role="dialog"
            aria-modal="true"
            aria-label="Design viewer"
            onContextMenu={(event) => event.preventDefault()}
            onMouseMove={scheduleControlFade}
            onClick={(event) => {
              if (event.target === event.currentTarget) closeViewer();
            }}
          >
            <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
              {designs.length > 1 && (
                <>
                  <AnimatePresence initial={false}>
                    <motion.img
                      key={`prev-${selectedIndex}`}
                      src={getImageUrl(
                        designs[(selectedIndex - 1 + designs.length) % designs.length].key,
                      )}
                      alt=""
                      initial={{ opacity: 0, x: -25 }}
                      animate={{ opacity: 0.12, x: 0 }}
                      exit={{ opacity: 0, x: -15 }}
                      transition={{ duration: 0.3 }}
                      className="absolute left-0 top-1/2 hidden h-[65vh] w-[22vw] -translate-y-1/2 object-contain md:block"
                      style={{
                        maskImage: "linear-gradient(to right, transparent, black 45%, transparent)",
                        WebkitMaskImage: "linear-gradient(to right, transparent, black 45%, transparent)",
                      }}
                    />
                    <motion.img
                      key={`next-${selectedIndex}`}
                      src={getImageUrl(designs[(selectedIndex + 1) % designs.length].key)}
                      alt=""
                      initial={{ opacity: 0, x: 25 }}
                      animate={{ opacity: 0.12, x: 0 }}
                      exit={{ opacity: 0, x: 15 }}
                      transition={{ duration: 0.3 }}
                      className="absolute right-0 top-1/2 hidden h-[65vh] w-[22vw] -translate-y-1/2 object-contain md:block"
                      style={{
                        maskImage: "linear-gradient(to left, transparent, black 45%, transparent)",
                        WebkitMaskImage: "linear-gradient(to left, transparent, black 45%, transparent)",
                      }}
                    />
                  </AnimatePresence>
                </>
              )}
            </div>

            <AnimatePresence>
              {showControls && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="absolute inset-x-0 top-0 z-40 flex items-center justify-between px-5 py-5 md:px-8 md:py-7"
                >
                  <div>
                    <p className="text-[9px] tracking-[0.2em] text-white/50">
                      GRAPHICS DESIGN / PROJECT {project.number}
                    </p>
                    <p className="mt-2 text-[10px] tracking-[0.15em] text-white/80">
                      {String(selectedIndex + 1).padStart(2, "0")} / {String(designs.length).padStart(2, "0")}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {zoom > 1 && (
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          resetZoom();
                        }}
                        className="rounded-full border border-white/20 px-4 py-2 text-[9px] tracking-[0.15em] text-white/75 transition hover:border-white/50 hover:text-white"
                      >
                        RESET {Math.round(zoom * 100)}%
                      </button>
                    )}
                    <button
                      type="button"
                      aria-label="Close design viewer"
                      onClick={(event) => {
                        event.stopPropagation();
                        closeViewer();
                      }}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white/80 transition-all hover:rotate-90 hover:border-white/60 hover:bg-white/10 hover:text-white"
                    >
                      <CloseIcon />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div
              className={`absolute inset-x-0 bottom-[130px] top-[80px] z-10 flex items-center justify-center overflow-hidden px-12 sm:px-20 ${
                zoom > 1 ? (isDragging ? "cursor-grabbing" : "cursor-grab") : "cursor-default"
              }`}
              onWheel={handleWheel}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              onDoubleClick={() => {
                setZoom((current) => (current > 1 ? 1 : 2));
                scheduleControlFade();
              }}
            >
              <AnimatePresence initial={false} mode="popLayout">
                <motion.img
                  key={selectedDesign.key}
                  src={getImageUrl(selectedDesign.key)}
                  alt={`${project.title} — ${selectedDesign.filename}`}
                  initial={{
                    opacity: 0,
                    x: direction === 0 ? 0 : direction > 0 ? 70 : -70,
                    scale: 0.985,
                  }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{
                    opacity: 0,
                    x: direction === 0 ? 0 : direction > 0 ? -70 : 70,
                    scale: 0.985,
                  }}
                  transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                  draggable={false}
                  style={{
                    x: smoothPanX,
                    y: smoothPanY,
                    scale: zoom,
                    maxHeight: "100%",
                    maxWidth: "100%",
                    pointerEvents: "none",
                  }}
                  className="h-auto w-auto select-none object-contain"
                />
              </AnimatePresence>
            </div>

            <AnimatePresence>
              {showControls && zoom <= 1 && designs.length > 1 && (
                <>
                  <motion.button
                    type="button"
                    aria-label="Previous design"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    onClick={(event) => {
                      event.stopPropagation();
                      goPrevious();
                    }}
                    className="absolute left-3 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/20 text-white/75 backdrop-blur-sm transition hover:border-white/50 hover:bg-white/10 hover:text-white sm:left-7 sm:h-14 sm:w-14"
                  >
                    <ArrowIcon direction="left" />
                  </motion.button>

                  <motion.button
                    type="button"
                    aria-label="Next design"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    onClick={(event) => {
                      event.stopPropagation();
                      goNext();
                    }}
                    className="absolute right-3 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/20 text-white/75 backdrop-blur-sm transition hover:border-white/50 hover:bg-white/10 hover:text-white sm:right-7 sm:h-14 sm:w-14"
                  >
                    <ArrowIcon direction="right" />
                  </motion.button>
                </>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {showControls && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute inset-x-0 bottom-0 z-40"
                >
                  <div className="px-5 pb-3 text-center sm:px-8">
                    <p className="mx-auto max-w-[80vw] truncate text-[10px] tracking-[0.08em] text-white/65">
                      {selectedDesign.filename}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 overflow-x-auto px-5 pb-5 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:justify-center sm:px-8">
                    {designs.map((design, index) => (
                      <button
                        key={design.key}
                        ref={(element) => {
                          thumbnailRefs.current[index] = element;
                        }}
                        type="button"
                        aria-label={`View design ${index + 1}: ${design.filename}`}
                        onClick={(event) => {
                          event.stopPropagation();
                          if (index !== selectedIndex) {
                            goToImage(index, index > selectedIndex ? 1 : -1);
                          }
                        }}
                        className={`relative h-[55px] w-[70px] shrink-0 overflow-hidden border transition-all duration-200 sm:h-[64px] sm:w-[82px] ${
                          index === selectedIndex
                            ? "border-white opacity-100"
                            : "border-white/15 opacity-45 hover:border-white/50 hover:opacity-80"
                        }`}
                      >
                        <img
                          src={getImageUrl(design.key)}
                          alt=""
                          draggable={false}
                          onContextMenu={(event) => event.preventDefault()}
                          loading="lazy"
                          className="h-full w-full select-none object-cover"
                        />
                        {index === selectedIndex && (
                          <span className="absolute inset-x-0 bottom-0 h-[2px] bg-[#B82134]" />
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {showControls && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="pointer-events-none absolute bottom-[112px] left-6 z-20 hidden flex-col gap-2 text-white/40 lg:flex"
                >
                  <div className="flex items-center gap-2">
                    <KeyboardIcon />
                    <span className="text-[9px] tracking-[0.1em]">← → NAVIGATE</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MouseIcon />
                    <span className="text-[9px] tracking-[0.1em]">SCROLL TO ZOOM</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ZoomIcon />
                    <span className="text-[9px] tracking-[0.1em]">DOUBLE-CLICK TO ZOOM</span>
                  </div>
                  {zoom > 1 && (
                    <p className="ml-6 text-[9px] tracking-[0.1em]">DRAG TO MOVE / 0 TO RESET</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="pointer-events-none absolute bottom-5 right-6 z-20 flex items-center gap-2 opacity-65 sm:bottom-7 sm:right-8">
              <span className="text-[9px] tracking-[0.22em] text-white/70">ZYRELL BACULI</span>
              <img src="/logo.svg" alt="" className="h-6 w-6 object-contain" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
