import { useId } from "react";
import { cn } from "@/lib/utils";

const STAMP_TEXT = "PROVEN · CONFIRMED BY REAL EXPERIENCE · ";

type SpinnerProps = {
  className?: string;
  /** Pixel size of the seal (width & height). Defaults to 72. */
  size?: number;
};

function Spinner({ className, size = 72 }: SpinnerProps) {
  const uid = useId().replace(/:/g, "");
  const pathId = `proven-spin-circle-${uid}`;
  const text = STAMP_TEXT.repeat(2);

  return (
    <svg
      role="status"
      aria-label="Loading"
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={cn(
        "animate-proven-spin shrink-0",
        className,
      )}
    >
      <defs>
        <path
          id={pathId}
          d="M100,100 m-72,0 a72,72 0 1,1 144,0 a72,72 0 1,1 -144,0"
          fill="none"
        />
      </defs>
      <circle cx="100" cy="100" r="96" fill="none" stroke="#FF6A13" strokeWidth="6" />
      <circle cx="100" cy="100" r="78" fill="#FFE8D6" />
      <g transform="translate(100 100)">
        <path
          d="M-18 2 L-6 14 L20 -14"
          fill="none"
          stroke="#FF6A13"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <text
        fill="#C74400"
        fontSize="11"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
        letterSpacing="2.2"
      >
        <textPath href={`#${pathId}`} startOffset="0%">
          {text}
        </textPath>
      </text>
    </svg>
  );
}

function LoadingScreen({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex min-h-[50vh] w-full flex-col items-center justify-center gap-4",
        className,
      )}
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <Spinner size={160} />
      <span className="sr-only">Loading…</span>
    </div>
  );
}

export { Spinner, LoadingScreen };
