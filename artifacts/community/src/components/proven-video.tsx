"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";

const EXPAND_AT = 0.01;
/** Large starting checkmark size */
const CHECK_SIZE = "14rem";
/** Circle size after morphing from the checkmark (before full expand) */
const CIRCLE_MID_PX = 112;

const CHECK_MASK = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="white" d="M9.2 17.4 3.8 12l1.9-1.9 3.5 3.5L18.3 4.5 20.2 6.4 9.2 17.4z"/></svg>`,
)}")`;

type Phase = "check" | "circle" | "full";

export function ProvenVideo() {
  const { t } = useTranslation();
  const trackRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [triggered, setTriggered] = useState(false);
  const [phase, setPhase] = useState<Phase>("check");
  const [coverRadius, setCoverRadius] = useState(CIRCLE_MID_PX);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const measureCover = () => {
      const stage = stageRef.current;
      const w = stage?.clientWidth ?? window.innerWidth;
      const h = stage?.clientHeight ?? window.innerHeight;
      setCoverRadius(Math.hypot(w, h) / 2);
    };

    const update = () => {
      const rect = track.getBoundingClientRect();
      const scrollable = Math.max(track.offsetHeight - window.innerHeight, 1);
      const scrolled = Math.min(Math.max(-rect.top, 0), scrollable);
      const next = scrolled / scrollable;
      measureCover();

      if (next >= EXPAND_AT) {
        setTriggered(true);
      }
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  // check → circle → full
  useEffect(() => {
    if (!triggered) return;

    setPhase("circle");
    const toFull = window.setTimeout(() => setPhase("full"), 550);
    return () => window.clearTimeout(toFull);
  }, [triggered]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = muted;
  }, [muted]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (triggered && playing) {
      void video.play().catch(() => setPlaying(false));
    } else if (!triggered) {
      video.pause();
    } else if (!playing) {
      video.pause();
    }
  }, [triggered, playing]);

  const togglePlay = () => setPlaying((prev) => !prev);
  const toggleMute = () => setMuted((prev) => !prev);

  const showControls = phase === "full";

  const revealStyle =
    phase === "check"
      ? {
          WebkitMaskImage: CHECK_MASK,
          maskImage: CHECK_MASK,
          WebkitMaskRepeat: "no-repeat" as const,
          maskRepeat: "no-repeat" as const,
          WebkitMaskPosition: "center" as const,
          maskPosition: "center" as const,
          WebkitMaskSize: CHECK_SIZE,
          maskSize: CHECK_SIZE,
          clipPath: "none",
        }
      : {
          WebkitMaskImage: "none",
          maskImage: "none",
          clipPath: `circle(${phase === "full" ? coverRadius : CIRCLE_MID_PX}px at 50% 50%)`,
        };

  return (
    <section
      ref={trackRef}
      className="proven-video-track relative w-[100vw] left-1/2 rtl:left-auto rtl:right-1/2 -translate-x-1/2 rtl:translate-x-1/2"
      aria-label={t("how_it_works.headline")}
    >
      <div className="proven-video-sticky sticky top-0 h-[100dvh] w-full overflow-hidden bg-[#FAF8F4] dark:bg-[#101F38] flex flex-col px-14 sm:px-24 md:px-36 lg:px-48 pt-14 sm:pt-20 pb-14 sm:pb-20">
        <div className="proven-video-copy relative z-20 mx-auto mb-10 sm:mb-14 w-full max-w-[1180px] text-center shrink-0">
          <p className="proven-video-eyebrow">{t("how_it_works.eyebrow")}</p>
          <h2 className="proven-video-headline">{t("how_it_works.headline")}</h2>
          <p className="proven-video-muted">{t("how_it_works.muted")}</p>
        </div>

        <div
          ref={stageRef}
          className="relative min-h-0 flex-1 w-full overflow-hidden rounded-3xl"
        >
          <div
            className={`absolute inset-0 proven-video-circle ${
              phase === "check"
                ? "proven-video-phase-check"
                : phase === "circle"
                  ? "proven-video-phase-circle"
                  : "proven-video-phase-full"
            }`}
            style={revealStyle}
          >
            <video
              ref={videoRef}
              className="absolute inset-0 h-full w-full object-cover bg-black [&::-webkit-media-controls]:hidden [&::-webkit-media-controls-enclosure]:hidden"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              controls={false}
              disablePictureInPicture
              controlsList="nodownload noplaybackrate noremoteplayback"
              aria-label={t("how_it_works.headline")}
            >
              <source src="/videos/how-proven-works.mp4" type="video/mp4" />
            </video>
          </div>

          <svg
            className={`pointer-events-none absolute left-1/2 top-1/2 z-[2] -translate-x-1/2 -translate-y-1/2 text-secondary transition-opacity duration-300 ${
              phase === "check" ? "opacity-100" : "opacity-0"
            }`}
            style={{ width: CHECK_SIZE, height: CHECK_SIZE }}
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M9.2 17.4 3.8 12l1.9-1.9 3.5 3.5L18.3 4.5 20.2 6.4 9.2 17.4z"
              stroke="currentColor"
              strokeWidth="1.65"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </svg>

          <div
            className={`absolute inset-x-0 bottom-0 z-10 flex items-end justify-between p-5 sm:p-7 bg-gradient-to-t from-black/55 via-black/15 to-transparent transition-opacity duration-500 ${
              showControls
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <button
              type="button"
              onClick={togglePlay}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md border border-white/25 hover:bg-white/25 transition-colors"
              aria-label={playing ? "Pause video" : "Play video"}
            >
              {playing ? (
                <Pause className="h-5 w-5 fill-current" />
              ) : (
                <Play className="h-5 w-5 fill-current ml-0.5" />
              )}
            </button>
            <button
              type="button"
              onClick={toggleMute}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md border border-white/25 hover:bg-white/25 transition-colors"
              aria-label={muted ? "Unmute video" : "Mute video"}
            >
              {muted ? (
                <VolumeX className="h-5 w-5" />
              ) : (
                <Volume2 className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
