
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

const WORKER_URL =
  "https://video-edits-gallery.zyrell-baculi3.workers.dev";

const R2_BASE_URL =
  "https://pub-dcd3ffb0390d4c59a42236b0a9d89050.r2.dev";


type VideoFile = {
  key: string;
  filename: string;
};

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return "0:00";

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  return `${mins}:${String(secs).padStart(2, "0")}`;
}

function getVideoTitle(filename: string) {
  return filename
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ");
}

function getVideoUrl(key: string) {
  const encodedKey = key
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");

  return `${R2_BASE_URL}/${encodedKey}`;
}

export default function VideoEditProjectPage() {
  const params = useParams<{ project: string }>();
  const projectSlug = params.project;

  const [videos, setVideos] = useState<VideoFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedVideo, setSelectedVideo] =
    useState<VideoFile | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadVideos() {
      try {
        setLoading(true);
        setError("");

        const endpoint = new URL(WORKER_URL);
        endpoint.searchParams.set("album", projectSlug);

        const response = await fetch(endpoint.toString());

        if (!response.ok) {
          throw new Error(
            `Worker request failed (${response.status}).`
          );
        }

        const data: { files?: VideoFile[] } =
          await response.json();

        if (!Array.isArray(data.files)) {
          throw new Error("The Worker returned an invalid file list.");
        }

        if (!cancelled) {
          setVideos(data.files);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load videos from Cloudflare R2."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadVideos();

    return () => {
      cancelled = true;
    };
  }, [projectSlug]);

  // Lock background scrolling while the modal is open.
  useEffect(() => {
    if (!selectedVideo) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }

      if (event.code === "Space") {
        const target = event.target as HTMLElement;

        if (
          target.tagName !== "INPUT" &&
          target.tagName !== "BUTTON"
        ) {
          event.preventDefault();
          togglePlayback();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVideo]);

  function openModal(video: VideoFile) {
    setSelectedVideo(video);
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
  }

  function closeModal() {
    videoRef.current?.pause();
    setSelectedVideo(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }

  async function togglePlayback() {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      try {
        await video.play();
      } catch {
        setIsPlaying(false);
      }
    } else {
      video.pause();
    }
  }

  function handleSeek(value: number) {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = value;
    setCurrentTime(value);
  }

  function handleVolumeChange(value: number) {
    const video = videoRef.current;
    setVolume(value);
    setIsMuted(value === 0);

    if (video) {
      video.volume = value;
      video.muted = value === 0;
    }
  }

  function toggleMute() {
    const video = videoRef.current;
    if (!video) return;

    const nextMuted = !isMuted;

    video.muted = nextMuted;
    setIsMuted(nextMuted);
  }

  async function toggleFullscreen() {
    const modal = modalRef.current;
    if (!modal) return;

    try {
      if (!document.fullscreenElement) {
        await modal.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      // Fullscreen may be unavailable in some browser contexts.
    }
  }

  const projectName = (projectSlug ?? "video-project")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <main className="h-screen overflow-hidden bg-[#F8F8F5] lg:pl-[270px]">
      <section className="relative flex h-full flex-col overflow-hidden">
        {/* Japanese background */}
        <div className="pointer-events-none absolute -right-10 top-24 z-0 text-[170px] font-light leading-none tracking-[-0.08em] text-[#151516] opacity-[0.025]">
          編集
        </div>

        {/* Fixed header */}
        <header className="relative z-10 shrink-0 border-b border-[#151516]/10 px-8 pb-8 pt-10 md:px-12 lg:px-16">
          <div className="flex items-end justify-between gap-6">
            <div className="min-w-0">
              <p className="text-[9px] tracking-[0.3em] text-[#151516]/30">
                VIDEO EDITS / PROJECT
              </p>

              <h1 className="mt-3 break-words text-3xl font-bold tracking-[-0.04em] text-[#B82134] md:text-5xl">
                {projectName}
              </h1>
            </div>

            <Link
              href="/video-edits"
              className="group mb-1 flex shrink-0 items-center gap-3 text-[8px] tracking-[0.18em] text-[#151516]/50 transition-colors hover:text-[#B82134]"
            >
              <span className="text-xl font-light leading-none transition-transform duration-300 group-hover:-translate-x-1">
                ‹
              </span>
              <span>GO BACK</span>
            </Link>
          </div>

          <p className="mt-7 max-w-2xl text-[9px] leading-5 tracking-[0.08em] text-[#151516]/45">
            A selection of video edits, main productions, and
            short-form content.
          </p>

          <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
            <div>
              <p className="text-[6px] tracking-[0.2em] text-[#151516]/25">
                CATEGORY
              </p>
              <p className="mt-1 text-[8px] tracking-[0.12em] text-[#151516]/50">
                VIDEO EDITING
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
                EDITOR
              </p>
            </div>
          </div>
        </header>

        {/* Video gallery */}
        <section className="custom-scrollbar relative z-10 min-h-0 flex-1 overflow-y-auto px-8 py-10 md:px-12 lg:px-16">
          {loading && (
            <p className="text-[9px] tracking-[0.18em] text-[#151516]/45">
              LOADING VIDEO EDITS...
            </p>
          )}

          {!loading && error && (
            <div className="max-w-xl">
              <p className="text-[10px] tracking-[0.12em] text-[#B82134]">
                UNABLE TO LOAD VIDEOS
              </p>
              <p className="mt-3 text-sm text-[#151516]/60">
                {error}
              </p>
            </div>
          )}

          {!loading && !error && videos.length === 0 && (
            <p className="text-[9px] tracking-[0.18em] text-[#151516]/45">
              NO VIDEOS FOUND IN THIS PROJECT.
            </p>
          )}

          {!loading && !error && videos.length > 0 && (
            <div className="grid gap-x-6 gap-y-12 md:grid-cols-2 xl:grid-cols-3">
              {videos.map((video, index) => (
                <motion.button
                  key={video.key}
                  type="button"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: Math.min(index * 0.07, 0.4),
                    duration: 0.55,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  onClick={() => openModal(video)}
                  className="group block w-full cursor-pointer text-left"
                  aria-label={`View video: ${getVideoTitle(video.filename)}`}
                >
                  {/* Preview frame */}
                  <div
                    className="relative aspect-video overflow-hidden bg-[#151516]"
                    onContextMenu={(event) => event.preventDefault()}
                  >
                    <video
                      className="absolute inset-0 h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                      src={getVideoUrl(video.key)}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      tabIndex={-1}
                      aria-hidden="true"
                      draggable={false}
                      onContextMenu={(event) => event.preventDefault()}
                    />
                    {/* Video number */}
                    <div className="pointer-events-none absolute left-4 top-4 z-20 text-[9px] tracking-[0.2em] text-[#F8F8F5]/70">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    {/* Minimal play icon in upper-right corner */}
                    <div className="pointer-events-none absolute right-4 top-4 z-20 text-[#F8F8F5]/75 transition-colors duration-300 group-hover:text-[#B82134]">
                      <svg
                        viewBox="0 0 24 24"
                        className="h-5 w-5 fill-current"
                        aria-hidden="true"
                      >
                        <path d="M7 4.5v15l12-7.5z" />
                      </svg>
                    </div>

                    {/* Bottom gradient */}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-28 bg-gradient-to-t from-[#151516] via-[#151516]/55 to-transparent" />

                    {/* Video information */}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 p-5">
                      <h2 className="line-clamp-2 text-xs font-bold uppercase tracking-[0.04em] text-[#F8F8F5]">
                        {getVideoTitle(video.filename)}
                      </h2>

                      <p className="mt-2 text-[8px] tracking-[0.18em] text-[#F8F8F5]/45">
                        VIDEO EDIT / {String(index + 1).padStart(2, "0")}
                      </p>
                    </div>

                    {/* Red hover line */}
                    <div className="pointer-events-none absolute bottom-0 left-0 z-30 h-[2px] w-0 bg-[#B82134] transition-all duration-500 group-hover:w-full" />
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </section>
      </section>

      {/* Branded video modal */}
      <AnimatePresence
        onExitComplete={() => {
          setIsPlaying(false);
        }}
      >
        {selectedVideo && (
          <motion.div
            key="video-modal"
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#080808]/90 p-3 backdrop-blur-md sm:p-6 lg:p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                closeModal();
              }
            }}
          >
            <motion.div
              ref={modalRef}
              role="dialog"
              aria-modal="true"
              aria-label={`Video player: ${getVideoTitle(selectedVideo.filename)}`}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.99 }}
              transition={{
                duration: 0.3,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative flex max-h-[95dvh] w-full max-w-6xl flex-col overflow-hidden border border-[#F8F8F5]/10 bg-[#151516] shadow-2xl"
            >
              {/* Modal header */}
              <div className="flex shrink-0 items-center justify-between gap-4 border-b border-[#F8F8F5]/10 px-4 py-4 sm:px-6">
                <div className="min-w-0">
                  <p className="text-[8px] tracking-[0.25em] text-[#B82134]">
                    CAZMIRECREATES / VIDEO ARCHIVE
                  </p>

                  <h2 className="mt-2 truncate text-xs font-semibold uppercase tracking-[0.08em] text-[#F8F8F5] sm:text-sm">
                    {getVideoTitle(selectedVideo.filename)}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={closeModal}
                  aria-label="Close video player"
                  className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#F8F8F5]/15 text-xl font-light text-[#F8F8F5]/70 transition-all hover:border-[#B82134] hover:bg-[#B82134] hover:text-white"
                >
                  ×
                </button>
              </div>

              {/* Player */}
             <div
                className="relative min-h-0 flex-1 overflow-hidden bg-black"
                onContextMenu={(event) => event.preventDefault()}
              >
                <video
                  key={selectedVideo.key}
                  ref={videoRef}
                  src={getVideoUrl(selectedVideo.key)}
                  autoPlay
                  playsInline
                  preload="auto"
                  controlsList="nodownload"
                  disablePictureInPicture
                  draggable={false}
                  onContextMenu={(event) => event.preventDefault()}
                  className="block h-auto max-h-[55dvh] w-full bg-black object-contain sm:max-h-[60dvh]"
                  onLoadedMetadata={(event) => {
                    const video = event.currentTarget;
                    setDuration(
                      Number.isFinite(video.duration)
                        ? video.duration
                        : 0
                    );
                    video.volume = volume;
                    video.muted = isMuted;
                  }}
                  onTimeUpdate={(event) => {
                    setCurrentTime(event.currentTarget.currentTime);
                  }}
                  onDurationChange={(event) => {
                    const nextDuration = event.currentTarget.duration;
                    setDuration(
                      Number.isFinite(nextDuration) ? nextDuration : 0
                    );
                  }}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => setIsPlaying(false)}
                >
                  Your browser does not support HTML video.
                </video>
              </div>

              {/* Branded controls */}
              <div className="shrink-0 border-t border-[#F8F8F5]/10 bg-[#151516] px-4 pb-4 pt-3 sm:px-6">
                {/* Seek bar */}
                <div className="group/seek relative mb-4 flex h-5 items-center">
                  <input
                    aria-label="Seek video"
                    type="range"
                    min={0}
                    max={duration || 0}
                    step={0.1}
                    value={Math.min(currentTime, duration || 0)}
                    onChange={(event) =>
                      handleSeek(Number(event.target.value))
                    }
                    className="h-1 w-full cursor-pointer appearance-none rounded-none bg-[#F8F8F5]/15 accent-[#B82134] transition-all group-hover/seek:h-1.5"
                    style={{
                      background: `linear-gradient(to right, #B82134 ${
                        duration ? (currentTime / duration) * 100 : 0
                      }%, rgba(248,248,245,0.15) ${
                        duration ? (currentTime / duration) * 100 : 0
                      }%)`,
                    }}
                  />
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3 sm:gap-5">
                    <button
                      type="button"
                      onClick={togglePlayback}
                      aria-label={isPlaying ? "Pause video" : "Play video"}
                      className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#B82134] text-white transition-colors hover:bg-[#d12b40]"
                    >
                      {isPlaying ? (
                        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                          <path d="M6 4h4v16H6zm8 0h4v16h-4z" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" className="ml-0.5 h-4 w-4 fill-current">
                          <path d="M7 4.5v15l12-7.5z" />
                        </svg>
                      )}
                    </button>

                    <p className="whitespace-nowrap text-[9px] tabular-nums tracking-[0.08em] text-[#F8F8F5]/60">
                      <span className="text-[#F8F8F5]">
                        {formatTime(currentTime)}
                      </span>
                      {" / "}
                      {formatTime(duration)}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-5">
                    {/* Volume */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={toggleMute}
                        aria-label={isMuted ? "Unmute video" : "Mute video"}
                        className="text-[#F8F8F5]/65 transition-colors hover:text-[#B82134]"
                      >
                        {isMuted || volume === 0 ? (
                          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="1.5">
                            <path d="M11 5 6 9H3v6h3l5 4zM16 9l5 6m0-6-5 6" />
                          </svg>
                        ) : (
                          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="1.5">
                            <path d="M11 5 6 9H3v6h3l5 4zM15 9a5 5 0 0 1 0 6m3-9a9 9 0 0 1 0 12" />
                          </svg>
                        )}
                      </button>

                      <input
                        type="range"
                        aria-label="Volume"
                        min={0}
                        max={1}
                        step={0.05}
                        value={isMuted ? 0 : volume}
                        onChange={(event) =>
                          handleVolumeChange(Number(event.target.value))
                        }
                        className="hidden w-16 cursor-pointer accent-[#B82134] sm:block"
                      />
                    </div>

                    {/* Fullscreen */}
                    <button
                      type="button"
                      onClick={toggleFullscreen}
                      aria-label="Toggle fullscreen"
                      className="text-[#F8F8F5]/65 transition-colors hover:text-[#B82134]"
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="1.5">
                        <path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-[#F8F8F5]/10 pt-3">
                  <p className="text-[7px] tracking-[0.2em] text-[#F8F8F5]/30">
                    CAZMIRECREATES
                  </p>

                  <p className="text-[7px] tracking-[0.2em] text-[#F8F8F5]/30">
                    VIDEO PLAYER / 001
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
