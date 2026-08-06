"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";

export function ProvenVideo() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [inView, setInView] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.35 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = muted;
  }, [muted]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!inView) {
      video.pause();
      return;
    }

    if (playing) {
      void video.play().catch(() => setPlaying(false));
    } else {
      video.pause();
    }
  }, [inView, playing]);

  const togglePlay = () => {
    setPlaying((prev) => !prev);
  };

  const toggleMute = () => {
    setMuted((prev) => !prev);
  };

  return (
    <section
      ref={sectionRef}
      className={`w-[100vw] relative left-1/2 rtl:left-auto rtl:right-1/2 -translate-x-1/2 rtl:translate-x-1/2 bg-[#FAF8F4] dark:bg-muted/30 py-12 mb-10 transition-all duration-700 ease-out ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="max-w-[1180px] mx-auto px-[28px]">
        <div className="bg-[#FFFFFF] dark:bg-card border border-[#E4E1DA] dark:border-border rounded-[18px] p-[32px] shadow-sm">
          <div className="text-center mb-8 flex flex-col items-center">
            <p className="uppercase text-[11.5px] font-semibold tracking-[0.12em] text-[#E4640D] dark:text-primary mb-3">
              {t("how_it_works.eyebrow")}
            </p>
            <h2 className="font-serif text-[27px] font-semibold tracking-[-0.02em] text-[#101F38] dark:text-foreground mb-3 leading-tight">
              {t("how_it_works.headline")}
            </h2>
            <p className="text-[13.5px] text-[#5A6B85] dark:text-muted-foreground">
              {t("how_it_works.muted")}
            </p>
          </div>

          <div className="relative w-full overflow-hidden rounded-[14px] border border-[#E4E1DA] dark:border-border bg-black">
            <video
              ref={videoRef}
              className="w-full h-auto max-h-[min(70vh,720px)] object-contain bg-black [&::-webkit-media-controls]:hidden [&::-webkit-media-controls-enclosure]:hidden"
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

            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4 bg-gradient-to-t from-black/55 via-black/20 to-transparent">
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
      </div>
    </section>
  );
}
