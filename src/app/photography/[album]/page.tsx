
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

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
};

function getImageUrl(key: string) {
  return `${R2_BASE_URL}/${key
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/")}`;
}

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

  // Fetch the album's images from the Cloudflare Worker.
  useEffect(() => {
    if (!album) {
      return;
    }

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
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        setError(
          "Unable to load photographs. Please check the Worker URL and try again."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadPhotos();

    return () => controller.abort();
  }, [albumSlug, album, reloadKey]);

  // Automatically cycle through all images for the faded background.
  useEffect(() => {
    if (photos.length <= 1) {
      return;
    }

    const interval = window.setInterval(() => {
      setBackgroundIndex((current) => (current + 1) % photos.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [photos.length]);

  const closeViewer = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  const showPrevious = useCallback(() => {
    setSelectedIndex((current) =>
      current === null || photos.length === 0
        ? null
        : (current - 1 + photos.length) % photos.length
    );
  }, [photos.length]);

  const showNext = useCallback(() => {
    setSelectedIndex((current) =>
      current === null || photos.length === 0
        ? null
        : (current + 1) % photos.length
    );
  }, [photos.length]);

  // Keyboard controls and scroll locking for the image viewer.
  useEffect(() => {
    if (selectedIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeViewer();
      if (event.key === "ArrowLeft") showPrevious();
      if (event.key === "ArrowRight") showNext();
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedIndex, closeViewer, showPrevious, showNext]);

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

  const selectedPhoto =
    selectedIndex === null ? null : photos[selectedIndex];

  return (
    <>
      <main className="h-screen overflow-hidden bg-[#F8F8F5] lg:pl-[270px]">
        <section className="relative flex h-full flex-col overflow-hidden">

          {/* Faded Album Background Slideshow */}
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
                    opacity: {
                      duration: 1.8,
                      ease: "easeInOut",
                    },
                  }}
                  className="absolute inset-0 h-full w-full object-cover grayscale"
                />
              )}
            </AnimatePresence>

            {/* Light overlay keeps the background subtle */}
            <div className="absolute inset-0 bg-[#F8F8F5]/35" />

            {/* Soft side fades */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#F8F8F5]/35 via-transparent to-[#F8F8F5]/35" />

            {/* Top and bottom fades */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#F8F8F5]/25 via-transparent to-[#F8F8F5]/45" />
          </div>

          {/* Japanese background element */}
          <div className="pointer-events-none absolute -right-10 top-24 z-0 text-[170px] font-light leading-none tracking-[-0.08em] text-[#151516] opacity-[0.025]">
            写真
          </div>

          {/* Fixed Header */}
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

              {/* Go back */}
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

            {/* Album description */}
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

          {/* Scrollable Photography Area */}
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

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {photos.map((photo, index) => (
                <motion.button
                  type="button"
                  key={photo.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: Math.min(index * 0.035, 0.35),
                    duration: 0.55,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  onClick={() => setSelectedIndex(index)}
                  aria-label={`View photograph ${photo.filename}`}
                  className="group block w-full cursor-zoom-in text-left"
                >
                  {/* Photo Frame */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#151516]">
                    <motion.img
                      src={getImageUrl(photo.key)}
                      onError={(event) => {
                        console.error(
                          "Image failed:",
                          event.currentTarget.src
                        );
                      }}
                      onLoad={(event) => {
                        console.log(
                          "Image loaded:",
                          event.currentTarget.src
                        );
                      }}
                      alt={`${album.title} — ${photo.filename}`}
                      loading={index < 3 ? "eager" : "lazy"}
                      decoding="async"
                      whileHover={{ scale: 1.035 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="absolute inset-0 h-full w-full object-cover"
                    />

                    {/* Photo number */}
                    <div className="absolute left-4 top-4 z-10 text-[9px] tracking-[0.2em] text-[#F8F8F5]/75">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    {/* Photo information */}
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

                    {/* Bottom gradient */}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-28 bg-gradient-to-t from-[#151516] via-[#151516]/60 to-transparent" />

                    {/* Hover line */}
                    <div className="absolute bottom-0 left-0 z-20 h-[2px] w-0 bg-[#B82134] transition-all duration-500 group-hover:w-full" />
                  </div>
                </motion.button>
              ))}
            </div>
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
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#090909]/95 p-4 md:p-10"
            role="dialog"
            aria-modal="true"
            aria-label="Photograph viewer"
            onClick={closeViewer}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={closeViewer}
              aria-label="Close image viewer"
              className="absolute right-5 top-5 z-20 flex h-10 w-10 items-center justify-center text-3xl font-light text-white/70 transition hover:text-white"
            >
              ×
            </button>

            {/* Image counter */}
            <div className="absolute left-5 top-7 z-20 text-[9px] tracking-[0.2em] text-white/60 md:left-8">
              {String(selectedIndex + 1).padStart(2, "0")} /{" "}
              {String(photos.length).padStart(2, "0")}
            </div>

            {/* Previous image */}
            {photos.length > 1 && (
              <button
                type="button"
                aria-label="Previous photograph"
                onClick={(event) => {
                  event.stopPropagation();
                  showPrevious();
                }}
                className="absolute left-2 z-20 flex h-12 w-10 items-center justify-center text-3xl font-light text-white/60 transition hover:text-white md:left-5 md:h-16 md:w-16"
              >
                ‹
              </button>
            )}

            {/* Enlarged image */}
            <AnimatePresence mode="wait">
              <motion.img
                key={selectedPhoto.key}
                src={getImageUrl(selectedPhoto.key)}
                alt={`${album.title} — ${selectedPhoto.filename}`}
                initial={{ opacity: 0, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={(event) => event.stopPropagation()}
                className="max-h-[82vh] max-w-[88vw] select-none object-contain"
                draggable={false}
              />
            </AnimatePresence>

            {/* Next image */}
            {photos.length > 1 && (
              <button
                type="button"
                aria-label="Next photograph"
                onClick={(event) => {
                  event.stopPropagation();
                  showNext();
                }}
                className="absolute right-2 z-20 flex h-12 w-10 items-center justify-center text-3xl font-light text-white/60 transition hover:text-white md:right-5 md:h-16 md:w-16"
              >
                ›
              </button>
            )}

            {/* Filename */}
            <p className="absolute bottom-5 left-0 right-0 text-center text-[9px] tracking-[0.18em] text-white/50">
              {selectedPhoto.filename}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
