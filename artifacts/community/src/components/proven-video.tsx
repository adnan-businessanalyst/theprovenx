"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";

const CHECK_MASK = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="white" d="M9.2 17.4 3.8 12l1.9-1.9 3.5 3.5L18.3 4.5 20.2 6.4 9.2 17.4z"/></svg>`,
)}")`;

type Phase = "check" | "circle" | "full";

type TypeTone =
  | "plain"
  | "eyebrow-plain"
  | "brand"
  | "experience"
  | "x"
  | "headline";

type TypeChar = {
  ch: string;
  tone: TypeTone;
  /** Letter-by-letter order; X letters are assigned after all others. */
  revealIndex: number;
};

const LETTER_STAGGER_MS = 38;
const X_PAUSE_MS = 220;

const EYEBROW_PARTS: { text: string; tone: TypeTone }[] = [
  { text: "HOW ", tone: "eyebrow-plain" },
  { text: "The Proven", tone: "brand" },
  { text: "X", tone: "x" },
  { text: " WORKS", tone: "eyebrow-plain" },
];

const MUTED_PARTS: { text: string; tone: TypeTone }[] = [
  { text: "4 steps for ", tone: "plain" },
  { text: "The Proven", tone: "brand" },
  { text: " ", tone: "plain" },
  { text: "e", tone: "experience" },
  { text: "X", tone: "x" },
  { text: "perience", tone: "experience" },
];

const EYEBROW_FULL = "HOW The ProvenX WORKS";
const MUTED_FULL = "4 steps for The Proven eXperience";

function charsFromParts(parts: { text: string; tone: TypeTone }[]): Omit<TypeChar, "revealIndex">[] {
  return parts.flatMap(({ text, tone }) => [...text].map((ch) => ({ ch, tone })));
}

/** Non-X letters first (across lines), then every X at the end. */
function assignRevealOrder(lines: Omit<TypeChar, "revealIndex">[][]): TypeChar[][] {
  let next = 0;
  const ordered = lines.map((line) =>
    line.map((c) =>
      c.tone === "x" ? { ...c, revealIndex: -1 } : { ...c, revealIndex: next++ },
    ),
  );
  for (const line of ordered) {
    for (let i = 0; i < line.length; i++) {
      if (line[i].tone === "x") {
        line[i] = { ...line[i], revealIndex: next++ };
      }
    }
  }
  return ordered;
}

function toneClass(tone: TypeTone): string {
  switch (tone) {
    case "eyebrow-plain":
      return "proven-video-eyebrow-plain";
    case "brand":
      return "proven-type-brand";
    case "experience":
      return "proven-type-experience";
    case "x":
      return "proven-type-x";
    case "headline":
      return "proven-type-headline";
    default:
      return "";
  }
}

function TypedLine({
  as: Tag,
  className,
  active,
  chars,
  label,
}: {
  as: "p" | "h2";
  className: string;
  active: boolean;
  chars: TypeChar[];
  label: string;
}) {
  return (
    <Tag
      className={`${className} ${active ? "is-typing" : ""}`}
      aria-label={label}
    >
      {chars.map((c, i) => {
        const delayMs =
          c.revealIndex * LETTER_STAGGER_MS + (c.tone === "x" ? X_PAUSE_MS : 0);
        return (
          <span
            key={`${c.ch}-${i}`}
            className={`proven-type-char ${toneClass(c.tone)} ${c.tone === "x" ? "is-x" : ""}`}
            style={{ animationDelay: `${delayMs}ms` }}
            aria-hidden="true"
          >
            {c.ch === " " ? "\u00a0" : c.ch}
          </span>
        );
      })}
    </Tag>
  );
}

function sizesForStage(width: number, height: number) {
  const side = Math.min(width, height) || 320;
  const check = Math.round(Math.max(56, Math.min(side * 0.4, 224)));
  const circleMid = Math.round(Math.max(36, Math.min(side * 0.2, 112)));
  const coverRadius = Math.ceil(Math.hypot(width, height) / 2) + 12;
  return {
    checkSize: `${check}px`,
    circleMid,
    coverRadius,
  };
}

export function ProvenVideo() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [inView, setInView] = useState(false);
  const [phase, setPhase] = useState<Phase>("check");
  const [coverRadius, setCoverRadius] = useState(200);
  const [checkSize, setCheckSize] = useState("5.5rem");
  const [circleMid, setCircleMid] = useState(64);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);

  const headlineLabel = t("how_it_works.headline");
  const [eyebrowChars, mutedChars] = useMemo(
    () =>
      assignRevealOrder([
        charsFromParts(EYEBROW_PARTS),
        charsFromParts(MUTED_PARTS),
      ]),
    [],
  );

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const measureCover = () => {
      const stage = stageRef.current;
      const w = stage?.clientWidth || window.innerWidth;
      const h = stage?.clientHeight || Math.round(window.innerHeight * 0.45);
      const next = sizesForStage(w, h);
      setCoverRadius(next.coverRadius);
      setCheckSize(next.checkSize);
      setCircleMid(next.circleMid);
    };

    measureCover();
    const ro =
      typeof ResizeObserver !== "undefined" && stageRef.current
        ? new ResizeObserver(() => measureCover())
        : null;
    if (stageRef.current && ro) ro.observe(stageRef.current);

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) measureCover();
      },
      {
        // Fire as soon as the section enters the viewport
        threshold: 0.15,
        rootMargin: "0px 0px -8% 0px",
      },
    );
    observer.observe(section);

    window.addEventListener("resize", measureCover);
    return () => {
      ro?.disconnect();
      observer.disconnect();
      window.removeEventListener("resize", measureCover);
    };
  }, []);

  // On enter: section slides in, then check → circle → full. On leave: reset.
  useEffect(() => {
    if (!inView) {
      setPhase("check");
      return;
    }

    setPhase("check");
    const toCircle = window.setTimeout(() => setPhase("circle"), 420);
    const toFull = window.setTimeout(() => setPhase("full"), 960);
    return () => {
      window.clearTimeout(toCircle);
      window.clearTimeout(toFull);
    };
  }, [inView]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = muted;
    video.loop = true;
  }, [muted]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.loop = true;

    const restart = () => {
      video.currentTime = 0;
      void video.play().catch(() => setPlaying(false));
    };

    video.addEventListener("ended", restart);

    if (inView && phase === "full" && playing) {
      void video.play().catch(() => setPlaying(false));
    } else if (!inView || phase !== "full" || !playing) {
      video.pause();
    }

    return () => video.removeEventListener("ended", restart);
  }, [inView, phase, playing]);

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
          WebkitMaskSize: checkSize,
          maskSize: checkSize,
          clipPath: "none",
        }
      : {
          WebkitMaskImage: "none",
          maskImage: "none",
          clipPath: `circle(${phase === "full" ? coverRadius : circleMid}px at 50% 50%)`,
        };

  return (
    <section
      ref={sectionRef}
      className="proven-video-track relative w-full overflow-x-clip"
      aria-label={t("how_it_works.headline")}
    >
      <div className="proven-video-sticky w-full overflow-x-clip bg-[#FAF8F4] dark:bg-[#101F38] flex flex-col proven-video-pad">
        <div className={`proven-video-enter ${inView ? "is-in" : ""}`}>
        <div className="proven-video-copy relative z-20 mx-auto mb-2 sm:mb-4 w-full max-w-[40rem] sm:max-w-[48rem] text-center shrink-0 px-1">
          <TypedLine
            as="p"
            className="proven-video-eyebrow"
            active={inView}
            chars={eyebrowChars}
            label={EYEBROW_FULL}
          />
          <h2 className="proven-video-headline">{headlineLabel}</h2>
          <TypedLine
            as="p"
            className="proven-video-muted"
            active={inView}
            chars={mutedChars}
            label={MUTED_FULL}
          />
        </div>

        <div className="proven-video-stage-wrap relative z-10 flex min-h-0 items-center justify-center w-full">
          <div
            ref={stageRef}
            className="proven-video-stage relative w-full overflow-hidden rounded-xl sm:rounded-2xl md:rounded-3xl bg-black"
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
                className="absolute inset-0 h-full w-full object-cover object-center bg-black [&::-webkit-media-controls]:hidden [&::-webkit-media-controls-enclosure]:hidden"
                autoPlay
                loop={true}
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
              style={{ width: checkSize, height: checkSize }}
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
              className={`absolute inset-x-0 bottom-0 z-10 flex items-end justify-between p-2.5 sm:p-5 md:p-7 bg-gradient-to-t from-black/55 via-black/15 to-transparent transition-opacity duration-500 ${
                showControls
                  ? "opacity-100 pointer-events-auto"
                  : "opacity-0 pointer-events-none"
              }`}
            >
              <button
                type="button"
                onClick={togglePlay}
                className="inline-flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md border border-white/25 hover:bg-white/25 transition-colors"
                aria-label={playing ? "Pause video" : "Play video"}
              >
                {playing ? (
                  <Pause className="h-4 w-4 sm:h-5 sm:w-5 fill-current" />
                ) : (
                  <Play className="h-4 w-4 sm:h-5 sm:w-5 fill-current ml-0.5" />
                )}
              </button>
              <button
                type="button"
                onClick={toggleMute}
                className="inline-flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md border border-white/25 hover:bg-white/25 transition-colors"
                aria-label={muted ? "Unmute video" : "Mute video"}
              >
                {muted ? (
                  <VolumeX className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  <Volume2 className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
