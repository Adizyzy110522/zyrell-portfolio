
"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  AnimatePresence,
  motion,
} from "framer-motion";
import {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type WheelEvent as ReactWheelEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";

const R2_BASE_URL =
  "https://pub-dcd3ffb0390d4c59a42236b0a9d89050.r2.dev";

const IMAGE_LIST_URL =
  "https://photography-gallery.zyrell-baculi3.workers.dev";

type Photo = {
  key: string;
  filename: string;
};

type Album = {
  title: string;
  number: string;
  category: string;
  description: string;
};

const albums: Record<string, Album> = {
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

function getImageUrl(key: string) {
  return `${R2_BASE_URL}/${key
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/")}`;
}

function ArrowIcon({
  direction,
  size = 20,
}: {
  direction: "left" | "right";
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      {direction === "left" ? (
        <>
          <path
            d="M19 12H5"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <path
            d="M11 6L5 12L11 18"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      ) : (
        <>
          <path
            d="M5 12H19"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <path
            d="M13 6L19 12L13 18"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}
    </svg>
  );
}

function KeyboardIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <path
        d="M7 9H7.01M11 9H11.01M15 9H15.01M7 12H7.01M11 12H11.01M15 12H15.01M9 15H15"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ScrollIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="7"
        y="3"
        width="10"
        height="18"
        rx="5"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <path
        d="M12 7V10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DragIcon({ dragging = false }: { dragging?: boolean }) {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={`transition-transform duration-150 ${
        dragging ? "scale-95" : ""
      }`}
    >
      <path
        d="M8 11V6.5a1.5 1.5 0 0 1 3 0V10V5.5a1.5 1.5 0 0 1 3 0V10V7a1.5 1.5 0 0 1 3 0v6l.8-1.1a1.7 1.7 0 0 1 3 1L19 19a3 3 0 0 1-3 2h-4a4 4 0 0 1-3-1.4L5.5 16a1.6 1.6 0 0 1 2.5-2l2 2"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HelpTooltip({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <div className="group relative flex items-center">
      <div
        tabIndex={0}
        aria-label={label}
        className="flex h-9 w-9 cursor-help items-center justify-center rounded-full border border-white/10 text-white/65 transition hover:border-white/30 hover:text-white focus:outline-none focus:ring-1 focus:ring-white/50"
      >
        {children}
      </div>

      <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-3 w-max max-w-[220px] -translate-x-1/2 translate-y-1 rounded bg-[#F8F8F5] px-3 py-2 text-[9px] leading-4 tracking-[0.08em] text-[#151516] opacity-0 shadow-xl transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
        {label}
      </div>
    </div>
  );
}

const PhotoGrid = memo(function PhotoGrid({
  photos,
  album,
  onSelect,
}: {
  photos: Photo[];
  album: Album;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {photos.map((photo, index) => (
        <motion.button
          type="button"
          key={photo.key}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.08 }}
          transition={{
            delay: Math.min(index * 0.035, 0.35),
            duration: 0.55,
            ease: [0.22, 1, 0.36, 1],
          }}
          onClick={() => onSelect(index)}
          aria-label={`View photograph ${photo.filename}`}
          className="group block w-full cursor-zoom-in text-left"
        >
          <div className="relative aspect-[4/3] overflow-hidden bg-[#151516]">
            <motion.img
              src={getImageUrl(photo.key)}
              alt={`${album.title} — ${photo.filename}`}
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
                  PHOTO {String(index + 1).padStart(2, "0")}
                </h2>
                <p className="mt-2 text-[8px] tracking-[0.18em] text-[#F8F8F5]/65">
                  {album.category}
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
  );
});

export default function PhotographyAlbumPage() {
  const params = useParams<{ album: string }>();
  const albumSlug = params.album;
  const album = albums[albumSlug];

  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [backgroundIndex, setBackgroundIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const dragStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
  const isPanning = useRef(false);

  const selectedPhoto =
    selectedIndex === null ? null : photos[selectedIndex] ?? null;

  const focusMode = zoom > 1.05;

  useEffect(() => {
    if (!album) return;

    const controller = new AbortController();

    async function loadPhotos() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `${IMAGE_LIST_URL}?album=${encodeURIComponent(albumSlug)}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Could not retrieve album images.");
        }

        const data: { files: Photo[] } = await response.json();

        setPhotos(data.files);
        setBackgroundIndex(0);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;

        setError(
          "Unable to load photographs. Please check the Worker URL and try again."
        );
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void loadPhotos();

    return () => controller.abort();
  }, [albumSlug, album, reloadKey]);

  useEffect(() => {
    if (photos.length <= 1) return;

    const interval = window.setInterval(() => {
      setBackgroundIndex((current) => (current + 1) % photos.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [photos.length]);

  const resetZoom = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setDragging(false);
    isPanning.current = false;
  }, []);

  const closeViewer = useCallback(() => {
    setSelectedIndex(null);
    resetZoom();
  }, [resetZoom]);

  const moveTo = useCallback(
    (nextDirection: number) => {
      if (photos.length <= 1) return;

      setDirection(nextDirection);
      setSelectedIndex((current) => {
        if (current === null) return null;
        return (current + nextDirection + photos.length) % photos.length;
      });
      resetZoom();
    },
    [photos.length, resetZoom]
  );

  const showPrevious = useCallback(() => moveTo(-1), [moveTo]);
  const showNext = useCallback(() => moveTo(1), [moveTo]);

  useEffect(() => {
    if (selectedIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeViewer();
      if (event.key === "ArrowLeft" && !focusMode) showPrevious();
      if (event.key === "ArrowRight" && !focusMode) showNext();
      if (event.key === "0") resetZoom();
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    selectedIndex,
    closeViewer,
    showPrevious,
    showNext,
    resetZoom,
    focusMode,
  ]);

  useEffect(() => {
    if (selectedIndex === null) return;

    thumbnailRefs.current[selectedIndex]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [selectedIndex]);

  const handleWheel = useCallback(
    (event: ReactWheelEvent<HTMLDivElement>) => {
      if (!selectedPhoto) return;

      event.preventDefault();
      event.stopPropagation();

      const nextZoom = Math.min(
        4,
        Math.max(1, zoom - event.deltaY * 0.002)
      );

      setZoom(nextZoom);

      if (nextZoom <= 1.05) {
        setPan({ x: 0, y: 0 });
      }
    },
    [selectedPhoto, zoom]
  );

  const handleImageMouseDown = (
    event: ReactMouseEvent<HTMLImageElement>
  ) => {
    if (!focusMode || event.button !== 0) return;

    event.preventDefault();
    event.stopPropagation();

    isPanning.current = true;
    setDragging(true);

    dragStart.current = {
      x: event.clientX,
      y: event.clientY,
      panX: pan.x,
      panY: pan.y,
    };
  };

  useEffect(() => {
    if (!dragging) return;

    const handleMouseMove = (event: MouseEvent) => {
      if (!isPanning.current) return;

      setPan({
        x: dragStart.current.panX + event.clientX - dragStart.current.x,
        y: dragStart.current.panY + event.clientY - dragStart.current.y,
      });
    };

    const handleMouseUp = () => {
      isPanning.current = false;
      setDragging(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging]);

  if (!album) {
    return (
      <main className="flex h-screen items-center justify-center bg-[#F8F8F5] lg:pl-[270px]">
        <div className="text-center">
          <p className="text-[9px] tracking-[0.3em] text-[#151516]/40">
            PHOTOGRAPHY / 404
          </p>
          <h1 className="mt-3 text-3xl font-bold text-[#B82134]">
            ALBUM NOT FOUND
          </h1>
          <Link
            href="/photography"
            className="mt-6 inline-block text-[9px] tracking-[0.2em] text-[#151516]/60 transition hover:text-[#B82134]"
          >
            ← BACK TO PHOTOGRAPHY
          </Link>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="h-screen overflow-hidden bg-[#F8F8F5] lg:pl-[270px]">
        <section className="relative flex h-full flex-col overflow-hidden">
          {/* Faded album background slideshow */}
          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
            <AnimatePresence mode="sync">
              {photos.length > 0 && (
                <motion.img
                  key={photos[backgroundIndex]?.key}
                  src={getImageUrl(photos[backgroundIndex].key)}
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
            写真
          </div>

          {/* Fixed header */}
          <header className="relative z-10 shrink-0 border-b border-[#151516]/10 px-8 pb-8 pt-10 md:px-12 lg:px-16">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[9px] tracking-[0.3em] text-[#151516]/30">
                  PHOTOGRAPHY / ALBUM {album.number}
                </p>
                <h1 className="mt-3 text-4xl font-bold tracking-[-0.04em] text-[#B82134] md:text-5xl">
                  {album.title}
                </h1>
              </div>

              <Link
                href="/photography"
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
                {album.description}
              </p>

              {!loading && !error && (
                <p className="mt-3 text-[8px] tracking-[0.18em] text-[#151516]/35">
                  {photos.length} PHOTOS
                </p>
              )}
            </div>
          </header>

          {/* Photography grid */}
          <section className="custom-scrollbar relative z-10 min-h-0 flex-1 overflow-y-auto px-8 py-10 md:px-12 lg:px-16">
            {loading && (
              <p className="py-12 text-center text-[9px] tracking-[0.2em] text-[#151516]/45">
                LOADING PHOTOGRAPHS...
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

            {!loading && !error && photos.length === 0 && (
              <p className="py-12 text-center text-[9px] tracking-[0.2em] text-[#151516]/45">
                NO PHOTOGRAPHS FOUND IN THIS ALBUM
              </p>
            )}

            {!loading && !error && photos.length > 0 && (
              <PhotoGrid
                photos={photos}
                album={album}
                onSelect={(index) => {
                  setDirection(1);
                  setSelectedIndex(index);
                  resetZoom();
                }}
              />
            )}
          </section>
        </section>
      </main>

      {/* Full-screen image viewer */}
      <AnimatePresence>
        {selectedPhoto && selectedIndex !== null && (
          <motion.div
            key="image-viewer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] overflow-hidden bg-[#090909]/[0.98]"
            role="dialog"
            aria-modal="true"
            aria-label="Photograph viewer"
            onClick={closeViewer}
            onWheel={handleWheel}
          >
            {/* Top controls */}
            <motion.div
              animate={{
                opacity: focusMode ? 0 : 1,
                y: focusMode ? -12 : 0,
              }}
              transition={{ duration: 0.25 }}
              className={`pointer-events-none absolute inset-x-0 top-0 z-40 flex items-center justify-between px-5 py-5 md:px-8 ${
                focusMode ? "invisible" : ""
              }`}
            >
              <p className="text-[9px] tracking-[0.2em] text-white/55">
                {String(selectedIndex + 1).padStart(2, "0")} /{" "}
                {String(photos.length).padStart(2, "0")}
              </p>

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  closeViewer();
                }}
                aria-label="Close image viewer"
                className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full border border-white/15 text-3xl font-light text-white/75 transition hover:border-white/50 hover:bg-white/10 hover:text-white"
              >
                ×
              </button>
            </motion.div>

            {/* Zoom indicator and reset */}
            <AnimatePresence>
              {focusMode && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  onClick={(event) => event.stopPropagation()}
                  className="absolute left-1/2 top-5 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full border border-white/15 bg-black/65 px-4 py-2.5 text-[9px] tracking-[0.12em] text-white/75 backdrop-blur-md"
                >
                  <span>{Math.round(zoom * 100)}%</span>
                  <span className="h-3 w-px bg-white/20" />
                  <button
                    type="button"
                    onClick={resetZoom}
                    className="transition hover:text-white"
                  >
                    RESET
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Three-photo carousel stage */}
            <div
              className={`absolute inset-x-0 bottom-[136px] top-[70px] flex items-center justify-center overflow-hidden transition-[top,bottom] duration-300 ${
                focusMode ? "!bottom-0 !top-0" : ""
              }`}
              onClick={(event) => event.stopPropagation()}
            >
              {/* Previous preview */}
              {photos.length > 1 && !focusMode && (
                <motion.button
                  type="button"
                  aria-label="Previous photograph"
                  onClick={showPrevious}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  whileHover={{ opacity: 0.95, scale: 1.02 }}
                  className="absolute left-[3%] z-10 hidden h-[54%] w-[22%] overflow-hidden md:block lg:left-[6%] lg:w-[24%]"
                >
                  <img
                    src={getImageUrl(
                      photos[
                        (selectedIndex - 1 + photos.length) % photos.length
                      ].key
                    )}
                    alt="Previous photograph preview"
                    draggable={false}
                    className="h-full w-full select-none object-contain"
                    style={{
                      maskImage:
                        "linear-gradient(to right, transparent 0%, black 25%, black 75%, transparent 100%)",
                      WebkitMaskImage:
                        "linear-gradient(to right, transparent 0%, black 25%, black 75%, transparent 100%)",
                    }}
                  />
                </motion.button>
              )}

              {/* Main image: wrapper animates slides, image handles zoom and pan */}
              <AnimatePresence mode="popLayout" custom={direction}>
                <motion.div
                  key={selectedPhoto.key}
                  custom={direction}
                  initial={{
                    opacity: 0,
                    x: direction * 70,
                  }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{
                    opacity: 0,
                    x: direction * -70,
                  }}
                  transition={{
                    duration: dragging ? 0 : 0.3,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="relative z-20 flex h-full w-full items-center justify-center overflow-hidden"
                >
                  <motion.img
                    src={getImageUrl(selectedPhoto.key)}
                    alt={`${album.title} — ${selectedPhoto.filename}`}
                    draggable={false}
                    onMouseDown={handleImageMouseDown}
                    animate={{ opacity: 1 }}
                    className={`max-h-[78vh] max-w-[86vw] select-none object-contain md:max-h-[82vh] md:max-w-[76vw] ${
                      focusMode
                        ? dragging
                          ? "cursor-grabbing"
                          : "cursor-grab"
                        : "cursor-zoom-in"
                    }`}
                    style={{
                      x: pan.x,
                      y: pan.y,
                      scale: zoom,
                      transformOrigin: "center center",
                      touchAction: "none",
                    }}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Next preview */}
              {photos.length > 1 && !focusMode && (
                <motion.button
                  type="button"
                  aria-label="Next photograph"
                  onClick={showNext}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  whileHover={{ opacity: 0.95, scale: 1.02 }}
                  className="absolute right-[3%] z-10 hidden h-[54%] w-[22%] overflow-hidden md:block lg:right-[6%] lg:w-[24%]"
                >
                  <img
                    src={getImageUrl(
                      photos[(selectedIndex + 1) % photos.length].key
                    )}
                    alt="Next photograph preview"
                    draggable={false}
                    className="h-full w-full select-none object-contain"
                    style={{
                      maskImage:
                        "linear-gradient(to right, transparent 0%, black 25%, black 75%, transparent 100%)",
                      WebkitMaskImage:
                        "linear-gradient(to right, transparent 0%, black 25%, black 75%, transparent 100%)",
                    }}
                  />
                </motion.button>
              )}
            </div>

            {/* Large circular previous/next controls */}
            <AnimatePresence>
              {!focusMode && photos.length > 1 && (
                <>
                  <motion.button
                    type="button"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    aria-label="Previous photograph"
                    onClick={(event) => {
                      event.stopPropagation();
                      showPrevious();
                    }}
                    className="absolute left-4 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/30 text-white/75 backdrop-blur-sm transition hover:border-white/40 hover:bg-white/10 hover:text-white md:left-8 md:h-14 md:w-14"
                  >
                    <ArrowIcon direction="left" size={22} />
                  </motion.button>

                  <motion.button
                    type="button"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    aria-label="Next photograph"
                    onClick={(event) => {
                      event.stopPropagation();
                      showNext();
                    }}
                    className="absolute right-4 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/30 text-white/75 backdrop-blur-sm transition hover:border-white/40 hover:bg-white/10 hover:text-white md:right-8 md:h-14 md:w-14"
                  >
                    <ArrowIcon direction="right" size={22} />
                  </motion.button>
                </>
              )}
            </AnimatePresence>

            {/* Bottom thumbnail carousel */}
            <motion.div
              animate={{
                opacity: focusMode ? 0 : 1,
                y: focusMode ? 18 : 0,
              }}
              transition={{ duration: 0.25 }}
              className={`absolute bottom-6 left-1/2 z-30 w-[min(48vw,680px)] -translate-x-1/2 transition-opacity duration-300 ${
                focusMode ? "pointer-events-none invisible" : ""
              }`}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center gap-2 overflow-x-auto px-[calc(50%-26px)] py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {photos.map((photo, index) => (
                  <button
                    key={photo.key}
                    ref={(element) => {
                      thumbnailRefs.current[index] = element;
                    }}
                    type="button"
                    aria-label={`View photograph ${index + 1}`}
                    aria-current={index === selectedIndex ? "true" : undefined}
                    onClick={() => {
                      setDirection(index > selectedIndex ? 1 : -1);
                      setSelectedIndex(index);
                      resetZoom();
                    }}
                    className={`relative h-12 w-12 flex-none overflow-hidden transition-all duration-300 md:h-[52px] md:w-[52px] ${
                      index === selectedIndex
                        ? "scale-110 opacity-100"
                        : "opacity-40 hover:opacity-80"
                    }`}
                  >
                    <img
                      src={getImageUrl(photo.key)}
                      alt=""
                      draggable={false}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                    {index === selectedIndex && (
                      <span className="absolute inset-0 border border-[#F8F8F5]" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Bottom-left navigation icons and tooltips */}
            <motion.div
              animate={{
                opacity: focusMode ? 0 : 1,
                x: focusMode ? -10 : 0,
              }}
              transition={{ duration: 0.25 }}
              className={`absolute bottom-6 left-5 z-40 flex items-center gap-1 md:left-8 md:gap-2 ${
                focusMode ? "pointer-events-none invisible" : ""
              }`}
              onClick={(event) => event.stopPropagation()}
            >
              <HelpTooltip label="Use the left and right arrow keys to navigate photographs.">
                <KeyboardIcon />
              </HelpTooltip>

              <HelpTooltip label="Scroll up or down to zoom in and out.">
                <ScrollIcon />
              </HelpTooltip>

              <HelpTooltip label="Click and drag the image to move around when zoomed in.">
                <DragIcon dragging={dragging} />
              </HelpTooltip>
            </motion.div>

            {/* Bottom-right logo */}
            <motion.div
              animate={{
                opacity: focusMode ? 0 : 1,
                x: focusMode ? 10 : 0,
              }}
              transition={{ duration: 0.25 }}
              className={`absolute bottom-6 right-5 z-40 flex h-9 items-center md:right-8 ${
                focusMode ? "pointer-events-none invisible" : ""
              }`}
            >
              <Link
                href="/"
                aria-label="CazmireCreates home"
                onClick={(event) => event.stopPropagation()}
                className="flex h-full items-center"
              >
                <img
                  src="/logo.svg"
                  alt="CazmireCreates"
                  className="max-h-8 w-auto max-w-[120px] object-contain opacity-75 transition hover:opacity-100 md:max-w-[145px]"
                />
              </Link>
            </motion.div>

            {/* Filename */}
            <motion.p
              animate={{
                opacity: focusMode ? 0 : 1,
                y: focusMode ? 8 : 0,
              }}
              transition={{ duration: 0.25 }}
              className={`pointer-events-none absolute bottom-[104px] left-0 right-0 z-20 text-center text-[8px] tracking-[0.15em] text-white/40 ${
                focusMode ? "invisible" : ""
              }`}
            >
              {selectedPhoto.filename}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
