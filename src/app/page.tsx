"use client";

import {
  memo,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type MutableRefObject,
  type PointerEvent as ReactPointerEvent
} from "react";
import ParticleLayer from "./components/ParticleLayer";

let cachedFontData: string | null = null;
const textLengthCache = new Map<string, number>();

// Track metadata used to render ring labels and link targets.
const tracks = [
  {
    id: "safety-guide",
    title: "Safety Guide",
    lyrics: [
      "{Instrumental}"
    ]
  },
  {
    id: "lock-pick",
    title: "Lock Pick",
    lyrics: [
      "Every time it doesn't feel right",
      "Wash my face with acid",
      "This time I know it should be fine",
      "All alone I know Im gonna be alright",
      "~",
      "Trees waving at me do a high-five",
      "Do you miss me I missed you",
      "(Missed you x2)",
      "Lock picks on a chain make a timeline",
      "And I hide the keys In your room",
      "(I wanna lose it forever x2)",
      "Its too much when I know its too much",
      "Its too much when I know it too much",
      "~"
      
    ]
  },
  {
    id: "have-fun",
    title: "Have Fun",
    lyrics: [
      "(Its going to)",
      "I have a mission Im on my way to star",
      "I have a mission I gotta have some fun",
      "I gotta have some fun",
      "(I gotta have some fun)",
      "Break the rules like nothing",
      "(I run away from this real life)",
      "Guilty pleasure that’s nothing",
      "(Nothing in to nothing)",
      "This is my last time",
      "Its not gonna happen twice",
      "This is my secret escapade",
      "You should keep this to my grave",
      "Is this what you want",
      "Is this what you want",
      "Rocket pills are not fun is not fun (anymore)",
      "White powders are not fun is not fun anymore",
      "Something feels wrong",
      "Something feels wrong",
      "~",
      "I have a mission Im on my way to star",
      "I have a mission I gotta have some fun"
    ]
  },
  {
    id: "off-bones",
    title: "Off Bones",
    lyrics: [
      "Please wake me up when Its over",
      "I'll do the same when Im sober",
      "I'll do the same x3",
      "Last time when I wake up",
      "Its loop glued to mental x2",
      "Its loop",
      "(Can't get over myself)",
      "Run away from own shell",
      "Run away from this hell",
      "Last time when I wake up",
      "Wake up x3",
      "Its loop",
      "~",
      "Maybe its not what I expected",
      "(Can’t handle this no more)",
      "I need somebody to help me",
      "Tearing my skin off bones",
      "(Off bones - Off bones)",
      "~"
    ]
  },
  {
    id: "eraser",
    title: "Eraser",
    lyrics: [
      "Since I meet you I look for something that is true",
      "You can take my everything I never doubt you",
      "Blurry on my mind Silver Color I seek clues",
      "(Silver color I seek clues x2)",
      "Since I meet you I look for something that is true",
      "You can take my everything I never doubt you",
      "Blurry on my head I seek color that is true",
      "(I seek color that is true)",
      "I blow the dust away before she finds out",
      "Because my heart is like eraser x3",
      "You can use me",
      "You can hurt me",
      "But be careful not to lose me",
      "x2",
      "(Not to lose me x2)",
      "~",
      "Mixed emotions I have it in my pocket x2",
      "You can use me",
      "You can hurt me",
      "But be careful not to lose me",
      "You can use me",
      "You can hurt me",,
      "~"
    ]
  },
  {
    id: "forbidden-fruit",
    title: "Forbidden Fruit (Interlude)",
    lyrics: [
      "{Instrumental}"
    ]
  },
  {
    id: "helium",
    title: "Helium",
    lyrics: [
      "Memory breaks like piñata",
      "Don’t care anymore",
      "I just can’t fall in love when it’s beautiful",
      "So I can’t recall your name",
      "Even if I want,",
      "The blindfold of Justitia",
      "I'm just tryna peel it off",
      "She played me dirty, so I play it worse",
      "Feel like helium",
      "Floating too high, unmixed, alien",
      "If she notices me one time",
      "The scales will tip two times",
      "So baby, I’m not your savior, maybe",
      "Fatal kind of mercy",
      "I’ll rewrite the last line",
      "~",
      "I’m chasing places I can’t ever reach",
      "Just like a kid who runs for the rainbow",
      "I’m turning you mythic in everything you preach",
      "Just like a fanboy, just like a fanboy",
      "Do you really know me, inside out?",
      "Just like the passwords I told you before",
      "Will I learn to breathe without holding my breath?",
      "Just like a diver who’s ready for more",
      "~",
      "Lost it the second I had it all",
      "Lost in the memories can I carry on",
      "Do you really know me if you weren’t really there x2",
      "I can't take this damage over you",
      "I can’t take this loss over you",
      "Double necklace, I think you know what it means x2",
      "I'm just tryna peel it off",
      "She played me dirty, so I play it worse",
      "Feel like helium",
      "Floating too high, unmixed, alien",
      "~",
      "If she notices me one time",
      "The scales will tip two times",
      "So baby, I’m not your savior, maybe",
      "Fatal kind of mercy",
      "I’ll rewrite the last line"
    ]
  },
  {
    id: "afraid",
    title: "What are you afraid of?",
    lyrics: [
      "3 days in London ",
      "Hotel I stay up all night feeling drugs",
      "x2",
      "Im running in circles",
      "running in circles",
      "running in circles",
      "We are running in circles",
      "running in circles",
      "running in circles",
      "There’s something I can’t tell",
      "But you know its been this way",
      "You can fill up  voids with my voice",
      "So what are you afraid of?",
      "~",
      "Please take care of me when",
      "every time I fall back “its  okay“",
      "x2",
      "(It's okay x3)",
      "Please  take care of me x4",
      "~"
    ]
  },
  {
    id: "seoul",
    title: "Seoul (Bonus)",
    lyrics: [
      "{Instrumental}"
    ]
  }
];

type InnerRingKey =
  | "innerA"
  | "innerB"
  | "innerC"
  | "innerD"
  | "innerE"
  | "innerF"
  | "innerG"
  | "innerH";

const InnerRing = memo(function InnerRing({
  ringKey,
  className,
  pathId,
  offsets,
  titles,
  displayedTracks,
  segmentPercent
}: {
  ringKey: InnerRingKey;
  className: string;
  pathId: string;
  offsets: number[];
  titles: string[];
  displayedTracks: typeof tracks;
  segmentPercent: number;
}) {
  return (
    <g className={`circleGroup ${className}`}>
      {displayedTracks.map((track, index) => {
        const fallbackOffset = `${(index + 0.5) * segmentPercent}%`;
        const offset = offsets[index] ?? fallbackOffset;
        return (
          <text key={`${track.id}-${ringKey}`} className="circleLabel circleLabelInner">
            <textPath href={pathId} startOffset={offset}>
              {titles[index] ?? track.title}
            </textPath>
          </text>
        );
      })}
    </g>
  );
});

export default function Page() {
  // Computed startOffset values for each ring's <textPath> elements.
  const [offsetsOuter, setOffsetsOuter] = useState<number[]>([]);
  const [offsetsInnerA, setOffsetsInnerA] = useState<number[]>([]);
  const [offsetsInnerB, setOffsetsInnerB] = useState<number[]>([]);
  const [offsetsInnerC, setOffsetsInnerC] = useState<number[]>([]);
  const [offsetsInnerD, setOffsetsInnerD] = useState<number[]>([]);
  const [offsetsInnerE, setOffsetsInnerE] = useState<number[]>([]);
  const [offsetsInnerF, setOffsetsInnerF] = useState<number[]>([]);
  const [offsetsInnerG, setOffsetsInnerG] = useState<number[]>([]);
  const [offsetsInnerH, setOffsetsInnerH] = useState<number[]>([]);
  // When set, the whole page scales/pans to zoom into the circle for focus.
  const [zoomTarget, setZoomTarget] = useState<{
    scale: number;
    x: number;
    y: number;
  } | null>(null);
  // Scrambled titles (per ring) are swapped for real titles once revealed/hovered.
  const [scrambledTitles, setScrambledTitles] = useState(() => ({
    outer: tracks.map((track) => track.title),
    innerA: tracks.map((track) => track.title),
    innerB: tracks.map((track) => track.title),
    innerC: tracks.map((track) => track.title),
    innerD: tracks.map((track) => track.title),
    innerE: tracks.map((track) => track.title),
    innerF: tracks.map((track) => track.title),
    innerG: tracks.map((track) => track.title),
    innerH: tracks.map((track) => track.title)
  }));
  const [scrambleActive, setScrambleActive] = useState(true);
  const lastInteractionRef = useRef<number>(Date.now());
  const [showAllRings, setShowAllRings] = useState(false);
  const [revealProgressOuter, setRevealProgressOuter] = useState(
    () => Array(tracks.length).fill(0) as number[]
  );
  const revealInFlightOuterRef = useRef<Array<boolean>>(
    Array(tracks.length).fill(false)
  );
  // Current hover target used to reveal the label temporarily.
  const [hoveredLabel, setHoveredLabel] = useState<{
    ring:
      | "outer"
      | "innerA"
      | "innerB"
      | "innerC"
      | "innerD"
      | "innerE"
      | "innerF"
      | "innerG"
      | "innerH";
    index: number;
  } | null>(null);
  const zoomTargetRef = useRef<typeof zoomTarget>(null);
  const hoveredLabelRef = useRef<{
    ring:
      | "outer"
      | "innerA"
      | "innerB"
      | "innerC"
      | "innerD"
      | "innerE"
      | "innerF"
      | "innerG"
      | "innerH";
    index: number;
  } | null>(null);
  const pendingHoverRef = useRef<typeof hoveredLabel>(null);
  const hoverRafRef = useRef<number | null>(null);
  // Permanent reveal state (set on hover) to stop scrambling for that label.
  const [revealedLabels, setRevealedLabels] = useState(() => ({
    outer: Array(tracks.length).fill(false) as boolean[],
    innerA: Array(tracks.length).fill(false) as boolean[],
    innerB: Array(tracks.length).fill(false) as boolean[],
    innerC: Array(tracks.length).fill(false) as boolean[],
    innerD: Array(tracks.length).fill(false) as boolean[],
    innerE: Array(tracks.length).fill(false) as boolean[],
    innerF: Array(tracks.length).fill(false) as boolean[],
    innerG: Array(tracks.length).fill(false) as boolean[],
    innerH: Array(tracks.length).fill(false) as boolean[]
  }));
  // Keep a ref so the scramble interval reads the latest revealed state.
  const revealedLabelsRef = useRef(revealedLabels);
  useEffect(() => {
    const body = document.body;
    const root = document.documentElement;
    // Lock page scrolling while zoomed.
    if (zoomTarget) {
      body.classList.add("noScroll");
      root.classList.add("noScroll");
    } else {
      body.classList.remove("noScroll");
      root.classList.remove("noScroll");
    }
    return () => {
      body.classList.remove("noScroll");
      root.classList.remove("noScroll");
    };
  }, [zoomTarget]);
  // Refs for <textPath> nodes per ring so text lengths can be measured.
  const outerRefs = useRef<Array<SVGTextPathElement | null>>([]);
  const innerARefs = useRef<Array<SVGTextPathElement | null>>([]);
  const innerBRefs = useRef<Array<SVGTextPathElement | null>>([]);
  const innerCRefs = useRef<Array<SVGTextPathElement | null>>([]);
  const innerDRefs = useRef<Array<SVGTextPathElement | null>>([]);
  const innerERefs = useRef<Array<SVGTextPathElement | null>>([]);
  const innerFRefs = useRef<Array<SVGTextPathElement | null>>([]);
  const innerGRefs = useRef<Array<SVGTextPathElement | null>>([]);
  const innerHRefs = useRef<Array<SVGTextPathElement | null>>([]);
  const outerMeasureRefs = useRef<Array<SVGTextPathElement | null>>([]);
  const circleWrapRef = useRef<HTMLDivElement | null>(null);
  // State for rasterized SVG layers (inner A-H) used for performance.
  const svgRef = useRef<SVGSVGElement | null>(null);
  const fontDataRef = useRef<string | null>(null);
  const [rasterLayers, setRasterLayers] = useState<{
    innerA: string;
    innerB: string;
    innerC: string;
    innerD: string;
    innerE: string;
    innerF: string;
    innerG: string;
    innerH: string;
  } | null>(null);
  const rasterEnabled = true;
  // Base geometry for the outer ring.
  const outerRadius = 420;
  const padding = 24;
  const innerGap = 45;
  // Font sizes for inner rings.
  const innerFontSizeA = 16;
  const innerFontSizeB = 13;
  const innerFontSizeC = 12;
  const innerFontSizeD = 11;
  const innerFontSizeE = 10;
  const innerFontSizeF = 9;
  const innerFontSizeG = 8;
  const innerFontSizeH = 7;
  // Radii for inner rings computed from outer radius and gaps.
  const innerRadiusA = outerRadius - innerGap;
  const innerRadiusB = outerRadius - innerGap * 2;
  const innerRadiusC = outerRadius - innerGap * 3;
  const innerRadiusD = outerRadius - innerGap * 4;
  const innerRadiusE = outerRadius - innerGap * 5;
  const innerRadiusF = outerRadius - innerGap * 6;
  const innerRadiusG = outerRadius - innerGap * 7;
  const innerRadiusH = outerRadius - innerGap * 8;
  const displayedTracks = tracks;
  const segmentPercent = 100 / displayedTracks.length;

  useEffect(() => {
    revealedLabelsRef.current = revealedLabels;
  }, [revealedLabels]);

  useEffect(() => {
    hoveredLabelRef.current = hoveredLabel;
  }, [hoveredLabel]);

  useEffect(() => {
    zoomTargetRef.current = zoomTarget;
  }, [zoomTarget]);

  useEffect(() => {
    return () => {
      if (hoverRafRef.current !== null) {
        cancelAnimationFrame(hoverRafRef.current);
      }
    };
  }, []);

  useEffect(() => {
    let rafId: number | null = null;
    if (typeof (window as typeof window & { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback === "function") {
      const id = (window as typeof window & { requestIdleCallback: (cb: () => void) => number }).requestIdleCallback(() => {
        setShowAllRings(true);
      });
      return () => {
        if (typeof (window as typeof window & { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback === "function") {
          (window as typeof window & { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(id);
        }
      };
    }
    rafId = requestAnimationFrame(() => {
      setShowAllRings(true);
    });
    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    // Scramble titles continuously until revealed.
    const symbols = "!@#$%^&*+-=?:;<>[]{}~";
    const scrambleInterval = 150;
    const idleTimeoutMs = 6000;
    setScrambleActive(true);
    setRasterLayers(null);
    let intervalId: number | null = null;
    let ringCursor = 0;

    const scrambleText = (text: string) =>
      text
        .split("")
        .map((char) => (char === " " ? " " : symbols[Math.floor(Math.random() * symbols.length)]))
        .join("");

    const ringOrder = [
      "outer",
      "innerA",
      "innerB",
      "innerC",
      "innerD",
      "innerE",
      "innerF",
      "innerG",
      "innerH"
    ] as const;
    type RingKey = (typeof ringOrder)[number];
    const getRingNext = (ring: RingKey, revealed: typeof revealedLabelsRef.current) =>
      tracks.map((track, index) =>
        revealed[ring][index] ? track.title : scrambleText(track.title)
      );

    const updateTitles = () => {
      if (zoomTargetRef.current) return;
      const now = Date.now();
      if (now - lastInteractionRef.current > idleTimeoutMs) return;
      const revealed = revealedLabelsRef.current;
      const allRevealed = Object.values(revealed).every((ring) =>
        ring.every(Boolean)
      );
      if (allRevealed) return;
      const ringA = ringOrder[ringCursor % ringOrder.length];
      const ringB = ringOrder[(ringCursor + 1) % ringOrder.length];
      ringCursor = (ringCursor + 2) % ringOrder.length;

      setScrambledTitles((prev) => {
        const next = { ...prev };
        next[ringA] = getRingNext(ringA, revealed);
        if (ringB !== ringA) {
          next[ringB] = getRingNext(ringB, revealed);
        }
        const same =
          prev.outer.join("") === next.outer.join("") &&
          prev.innerA.join("") === next.innerA.join("") &&
          prev.innerB.join("") === next.innerB.join("") &&
          prev.innerC.join("") === next.innerC.join("") &&
          prev.innerD.join("") === next.innerD.join("") &&
          prev.innerE.join("") === next.innerE.join("") &&
          prev.innerF.join("") === next.innerF.join("") &&
          prev.innerG.join("") === next.innerG.join("") &&
          prev.innerH.join("") === next.innerH.join("");
        return same ? prev : next;
      });
    };

    const start = () => {
      if (intervalId !== null) return;
      intervalId = window.setInterval(updateTitles, scrambleInterval);
      updateTitles();
    };
    const stop = () => {
      if (intervalId === null) return;
      window.clearInterval(intervalId);
      intervalId = null;
    };

    const handleVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    document.addEventListener("visibilitychange", handleVisibility);
    start();
    updateTitles();

    return () => {
      stop();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  useLayoutEffect(() => {
    // Measure label lengths and compute evenly spaced start offsets around a ring.
    const computeOffsetsForRadius = (
      refs: MutableRefObject<Array<SVGTextPathElement | null>>,
      radius: number
    ) => {
      const lengths = refs.current.map((node) => {
        if (!node) return 0;
        const text = node.textContent ?? "";
        const fontSize = window.getComputedStyle(node).fontSize;
        const key = `${text}|${fontSize}`;
        const cached = textLengthCache.get(key);
        if (cached !== undefined) return cached;
        const length = node.getComputedTextLength();
        textLengthCache.set(key, length);
        return length;
      });
      if (lengths.some((length) => length === 0)) return null;

      const circumference = 2 * Math.PI * radius;
      const totalLength = lengths.reduce((sum, length) => sum + length, 0);
      const gap = Math.max((circumference - totalLength) / displayedTracks.length, 0);
      let cursor = 0;
      return lengths.map((length) => {
        const start = cursor + gap / 2;
        cursor += length + gap;
        return start;
      });
    };

    // Computes and stores the startOffset arrays for each ring.
    const computeOffsets = () => {
      const nextOuter = computeOffsetsForRadius(outerMeasureRefs, outerRadius);
      if (!nextOuter) return;
      setOffsetsOuter(nextOuter);

      // Inner rings use fixed percent offsets (no text-length measurement).
    };

    // Schedules offset calculation at the right time and cleans up.
    // Waits for layout + fonts to settle before measuring text lengths.
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(computeOffsets);
    });
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        requestAnimationFrame(() => requestAnimationFrame(computeOffsets));
      });
    }
    return () => cancelAnimationFrame(raf);
  }, [
    innerRadiusA,
    innerRadiusB,
    innerRadiusC,
    innerRadiusD,
    innerRadiusE,
    innerRadiusF,
    innerRadiusG,
    innerRadiusH,
    outerRadius,
    rasterLayers,
    showAllRings
  ]);

  // Reset rasterized inner ring images when any inner font size changes.
  useEffect(() => {
    setRasterLayers(null);
  }, [
    innerFontSizeA,
    innerFontSizeB,
    innerFontSizeC,
    innerFontSizeD,
    innerFontSizeE,
    innerFontSizeF,
    innerFontSizeG,
    innerFontSizeH
  ]);

  // Rasterize the inner rings into images once the SVG is ready and text offsets are computed.
  useEffect(() => {
    if (!rasterEnabled) return;
    if (scrambleActive) return;
    if (rasterLayers) return;
    if (!svgRef.current) return;
    if (!offsetsOuter.length) return;

    const serializer = new XMLSerializer();
    const ensureFont = async () => {
      // Inline the font so the rasterized SVGs render correctly as images.
      if (cachedFontData) return cachedFontData;
      if (fontDataRef.current) return fontDataRef.current;
      const res = await fetch("/fonts/SuisseIntl-Thin.otf");
      const buffer = await res.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      let binary = "";
      bytes.forEach((b) => {
        binary += String.fromCharCode(b);
      });
      const base64 = btoa(binary);
      cachedFontData = base64;
      fontDataRef.current = base64;
      return base64;
    };

    const buildLayer = async (className: string) => {
      // Clone the SVG and keep only a single ring to create a focused layer.
      const clone = svgRef.current!.cloneNode(true) as SVGSVGElement;
      clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      const wraps = clone.querySelectorAll(".circleGroupWrap");
      wraps.forEach((wrap) => {
        if (!wrap.querySelector(`.${className}`)) {
          wrap.remove();
        }
      });
      clone.querySelectorAll(".circleMeasure").forEach((node) => node.remove());
      const base64 = await ensureFont();
      const style = document.createElementNS("http://www.w3.org/2000/svg", "style");
      style.textContent = `
@font-face {
  font-family: "Suisse Intl";
  src: url(data:font/otf;base64,${base64}) format("opentype");
  font-weight: 200;
  font-style: normal;
}
svg { font-family: "Suisse Intl", sans-serif; font-weight: 200; }
.circleLabelInner { font-size: ${innerFontSizeB}px; font-weight: 200; }
.circleLabelInner { opacity: 0.7; }
.circleGroupInnerA .circleLabelInner { font-size: ${innerFontSizeA}px; }
.circleGroupInnerC .circleLabelInner { font-size: ${innerFontSizeC}px; }
.circleGroupInnerD .circleLabelInner { font-size: ${innerFontSizeD}px; }
.circleGroupInnerE .circleLabelInner { font-size: ${innerFontSizeE}px; }
.circleGroupInnerF .circleLabelInner { font-size: ${innerFontSizeF}px; }
.circleGroupInnerG .circleLabelInner { font-size: ${innerFontSizeG}px; }
.circleGroupInnerH .circleLabelInner { font-size: ${innerFontSizeH}px; }
      `.trim();
      clone.prepend(style);
      const svgString = serializer.serializeToString(clone);
      return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
    };

    let isCancelled = false;
    const run = async () => {
      // Build 8 ring images in parallel.
      const [innerA, innerB, innerC, innerD, innerE, innerF, innerG, innerH] = await Promise.all([
        buildLayer("circleGroupInnerA"),
        buildLayer("circleGroupInnerB"),
        buildLayer("circleGroupInnerC"),
        buildLayer("circleGroupInnerD"),
        buildLayer("circleGroupInnerE"),
        buildLayer("circleGroupInnerF"),
        buildLayer("circleGroupInnerG"),
        buildLayer("circleGroupInnerH")
      ]);
      if (isCancelled) return;
      setRasterLayers({ innerA, innerB, innerC, innerD, innerE, innerF, innerG, innerH });
    };
    if (typeof (window as typeof window & { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback === "function") {
      const id = (window as typeof window & { requestIdleCallback: (cb: () => void) => number }).requestIdleCallback(run);
      return () => {
        isCancelled = true;
        if (typeof (window as typeof window & { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback === "function") {
          (window as typeof window & { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(id);
        }
      };
    }
    run();
    return () => {
      isCancelled = true;
    };
  }, [
    offsetsOuter.length,
    rasterLayers,
    scrambleActive
  ]);

  const startOuterReveal = (index: number) => {
    if (revealInFlightOuterRef.current[index]) return;
    revealInFlightOuterRef.current[index] = true;
    const titleLength = tracks[index]?.title?.length ?? 0;
    if (titleLength === 0) {
      revealInFlightOuterRef.current[index] = false;
      return;
    }
    let lastTime = performance.now();
    const charIntervalMs = 10000;
    const tick = (now: number) => {
      const delta = now - lastTime;
      lastTime = now;
      setRevealProgressOuter((prev) => {
        const next = [...prev];
        const current = next[index] ?? 0;
        const increment = Math.max(1, Math.floor(delta / charIntervalMs));
        const updated = Math.min(titleLength, current + increment);
        next[index] = updated;
        if (updated >= titleLength) {
          revealInFlightOuterRef.current[index] = false;
          setRevealedLabels((prevLabels) => {
            if (prevLabels.outer[index]) return prevLabels;
            const nextLabels = { ...prevLabels, outer: [...prevLabels.outer] };
            nextLabels.outer[index] = true;
            revealedLabelsRef.current = nextLabels;
            return nextLabels;
          });
          return next;
        }
        return next;
      });
      if (revealInFlightOuterRef.current[index]) {
        requestAnimationFrame(tick);
      }
    };
    requestAnimationFrame(tick);
  };

  const markRevealed = (
    ring:
      | "outer"
      | "innerA"
      | "innerB"
      | "innerC"
      | "innerD"
      | "innerE"
      | "innerF"
      | "innerG"
      | "innerH",
    index: number
  ) => {
    if (ring === "outer") {
      startOuterReveal(index);
      return;
    }
    setRevealedLabels((prev) => {
      if (prev[ring][index]) return prev;
      const next = {
        outer: [...prev.outer],
        innerA: [...prev.innerA],
        innerB: [...prev.innerB],
        innerC: [...prev.innerC],
        innerD: [...prev.innerD],
        innerE: [...prev.innerE],
        innerF: [...prev.innerF],
        innerG: [...prev.innerG],
        innerH: [...prev.innerH]
      };
      next[ring][index] = true;
      revealedLabelsRef.current = next;
      return next;
    });
  };

  const scheduleHoverUpdate = (
    next:
      | {
          ring:
            | "outer"
            | "innerA"
            | "innerB"
            | "innerC"
            | "innerD"
            | "innerE"
            | "innerF"
            | "innerG"
            | "innerH";
          index: number;
        }
      | null
  ) => {
    pendingHoverRef.current = next;
    if (hoverRafRef.current !== null) return;
    hoverRafRef.current = requestAnimationFrame(() => {
      hoverRafRef.current = null;
      const pending = pendingHoverRef.current;
      const current = hoveredLabelRef.current;
      if (
        pending?.ring === current?.ring &&
        pending?.index === current?.index
      ) {
        return;
      }
      setHoveredLabel(pending);
      if (pending) {
        markRevealed(pending.ring, pending.index);
      }
    });
  };

  const handlePointerMove = (event: ReactPointerEvent<SVGSVGElement>) => {
    // Resolve which ring/label is under the pointer and update reveal state.
    lastInteractionRef.current = Date.now();
    const target = (event.target as Element | null)?.closest?.("[data-ring]");
    if (!target) {
      scheduleHoverUpdate(null);
      return;
    }
    const ring = target.getAttribute("data-ring") as
      | "outer"
      | "innerA"
      | "innerB"
      | "innerC"
      | "innerD"
      | "innerE"
      | "innerF"
      | "innerG"
      | "innerH"
      | null;
    const indexAttr = target.getAttribute("data-index");
    const index = indexAttr ? Number(indexAttr) : Number.NaN;
    if (!ring || Number.isNaN(index)) {
      scheduleHoverUpdate(null);
      return;
    }
    scheduleHoverUpdate({ ring, index });
  };

  const resetScramble = () => {
    // Return all labels to scrambled state.
    setRevealedLabels({
      outer: Array(tracks.length).fill(false),
      innerA: Array(tracks.length).fill(false),
      innerB: Array(tracks.length).fill(false),
      innerC: Array(tracks.length).fill(false),
      innerD: Array(tracks.length).fill(false),
      innerE: Array(tracks.length).fill(false),
      innerF: Array(tracks.length).fill(false),
      innerG: Array(tracks.length).fill(false),
      innerH: Array(tracks.length).fill(false)
    });
    setHoveredLabel(null);
    setRevealProgressOuter(Array(tracks.length).fill(0));
    revealInFlightOuterRef.current = Array(tracks.length).fill(false);
    setScrambledTitles({
      outer: tracks.map((track) => track.title),
      innerA: tracks.map((track) => track.title),
      innerB: tracks.map((track) => track.title),
      innerC: tracks.map((track) => track.title),
      innerD: tracks.map((track) => track.title),
      innerE: tracks.map((track) => track.title),
      innerF: tracks.map((track) => track.title),
      innerG: tracks.map((track) => track.title),
      innerH: tracks.map((track) => track.title)
    });
  };

  const size = outerRadius * 2 + padding * 2;
  const needsMeasure = offsetsOuter.length !== displayedTracks.length;

  const getOuterDisplayTitle = (index: number, fallback: string) => {
    const title = tracks[index]?.title ?? fallback;
    const scrambled = scrambledTitles.outer[index] ?? title;
    const progress = revealProgressOuter[index] ?? 0;
    if (progress <= 0) return scrambled;
    if (progress >= title.length) return title;
    return `${title.slice(0, progress)}${scrambled.slice(progress)}`;
  };

  const handleOuterClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    trackId: string
  ) => {
    // First click zooms the whole ring; second click follows the hash.
    event.preventDefault();
    const wrap = circleWrapRef.current;
    if (!wrap) return;
    const rect = wrap.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const targetScale = 1.35;
    const viewportHeight = window.innerHeight;
    const x = 0 - centerX / targetScale;
    const y = viewportHeight / targetScale - centerY;
    setZoomTarget({ scale: targetScale, x, y });
    window.setTimeout(() => {
      window.location.hash = trackId;
    }, 820);
  };

  useEffect(() => {
    // Click outside the circle to exit zoom and clear hash.
    if (!zoomTarget) return;
    const handleBodyClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      if (target?.closest(".circleLink")) return;
      setZoomTarget(null);
      if (window.location.hash) {
        window.history.replaceState(
          null,
          "",
          window.location.pathname + window.location.search
        );
      }
    };
    document.addEventListener("click", handleBodyClick);
    return () => {
      document.removeEventListener("click", handleBodyClick);
    };
  }, [zoomTarget]);

  return (
    <main
      className={`page${zoomTarget ? " pageZoomed" : ""}`}
      style={
        {
          "--zoom-scale": zoomTarget?.scale ?? 1,
          "--zoom-x": zoomTarget ? `${zoomTarget.x}px` : "0px",
          "--zoom-y": zoomTarget ? `${zoomTarget.y}px` : "0px"
        } as CSSProperties
      }
    >
      {/* <ParticleLayer className="particleLayer" /> */}

      <div className="layout">
        <div
          ref={circleWrapRef}
          className="circleWrap"
          style={
            {
              "--circle-size": `${size}px`,
              "--inner-font-size-a": `${innerFontSizeA}px`,
              "--inner-font-size": `${innerFontSizeB}px`,
              "--inner-font-size-c": `${innerFontSizeC}px`,
              "--inner-font-size-d": `${innerFontSizeD}px`,
              "--inner-font-size-e": `${innerFontSizeE}px`,
              "--inner-font-size-f": `${innerFontSizeF}px`,
              "--inner-font-size-g": `${innerFontSizeG}px`,
              "--inner-font-size-h": `${innerFontSizeH}px`
            } as CSSProperties
          }
        >
          {/* <div
            className="circleCenterLabel"
            style={{ "--center-size": `${innerRadiusC * 2 * 0.9}px` } as CSSProperties}
            onClick={resetScramble}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") resetScramble();
            }}
          >
            <span className="centerTitle">Runaway Project</span>
            <span className="centerYear">(2025)</span>
          </div> */}
          {rasterLayers && (
            // When rasterized, draw image layers instead of live SVG text.
            <div className="rasterStack" aria-hidden="true">
              <div
                className="rasterLayerWrap circleGroupWrap"
              >
                <div className="rasterLayer rasterInnerA">
                  <img src={rasterLayers.innerA} alt="" />
                </div>
              </div>
              <div
                className="rasterLayerWrap circleGroupWrap"
              >
                <div className="rasterLayer rasterInnerB">
                  <img src={rasterLayers.innerB} alt="" />
                </div>
              </div>
              <div
                className="rasterLayerWrap circleGroupWrap"
              >
                <div className="rasterLayer rasterInnerC">
                  <img src={rasterLayers.innerC} alt="" />
                </div>
              </div>
              <div
                className="rasterLayerWrap circleGroupWrap"
              >
                <div className="rasterLayer rasterInnerD">
                  <img src={rasterLayers.innerD} alt="" />
                </div>
              </div>
              <div
                className="rasterLayerWrap circleGroupWrap"
              >
                <div className="rasterLayer rasterInnerE">
                  <img src={rasterLayers.innerE} alt="" />
                </div>
              </div>
              <div
                className="rasterLayerWrap circleGroupWrap"
              >
                <div className="rasterLayer rasterInnerF">
                  <img src={rasterLayers.innerF} alt="" />
                </div>
              </div>
              <div
                className="rasterLayerWrap circleGroupWrap"
              >
                <div className="rasterLayer rasterInnerG">
                  <img src={rasterLayers.innerG} alt="" />
                </div>
              </div>
              <div
                className="rasterLayerWrap circleGroupWrap"
              >
                <div className="rasterLayer rasterInnerH">
                  <img src={rasterLayers.innerH} alt="" />
                </div>
              </div>
            </div>
          )}
          <svg
            ref={svgRef}
            className="circleSvg"
            viewBox={`0 0 ${size} ${size}`}
            aria-hidden="true"
            onPointerMove={handlePointerMove}
            onMouseLeave={() => setHoveredLabel(null)}
            onPointerLeave={() => setHoveredLabel(null)}
          >
            <defs>
              {/* Path definitions for each ring; labels follow these circles. */}
              <path
                id="trackCirclePathOuter"
                d={`M ${outerRadius + padding},${outerRadius + padding} m -${outerRadius},0 a ${outerRadius},${outerRadius} 0 1,1 ${outerRadius * 2},0 a ${outerRadius},${outerRadius} 0 1,1 -${outerRadius * 2},0`}
              />
              <path
                id="trackCirclePathInnerA"
                d={`M ${outerRadius + padding},${outerRadius + padding} m -${innerRadiusA},0 a ${innerRadiusA},${innerRadiusA} 0 1,1 ${innerRadiusA * 2},0 a ${innerRadiusA},${innerRadiusA} 0 1,1 -${innerRadiusA * 2},0`}
              />
              <path
                id="trackCirclePathInnerB"
                d={`M ${outerRadius + padding},${outerRadius + padding} m -${innerRadiusB},0 a ${innerRadiusB},${innerRadiusB} 0 1,1 ${innerRadiusB * 2},0 a ${innerRadiusB},${innerRadiusB} 0 1,1 -${innerRadiusB * 2},0`}
              />
              <path
                id="trackCirclePathInnerC"
                d={`M ${outerRadius + padding},${outerRadius + padding} m -${innerRadiusC},0 a ${innerRadiusC},${innerRadiusC} 0 1,1 ${innerRadiusC * 2},0 a ${innerRadiusC},${innerRadiusC} 0 1,1 -${innerRadiusC * 2},0`}
              />
              <path
                id="trackCirclePathInnerD"
                d={`M ${outerRadius + padding},${outerRadius + padding} m -${innerRadiusD},0 a ${innerRadiusD},${innerRadiusD} 0 1,1 ${innerRadiusD * 2},0 a ${innerRadiusD},${innerRadiusD} 0 1,1 -${innerRadiusD * 2},0`}
              />
              <path
                id="trackCirclePathInnerE"
                d={`M ${outerRadius + padding},${outerRadius + padding} m -${innerRadiusE},0 a ${innerRadiusE},${innerRadiusE} 0 1,1 ${innerRadiusE * 2},0 a ${innerRadiusE},${innerRadiusE} 0 1,1 -${innerRadiusE * 2},0`}
              />
              <path
                id="trackCirclePathInnerF"
                d={`M ${outerRadius + padding},${outerRadius + padding} m -${innerRadiusF},0 a ${innerRadiusF},${innerRadiusF} 0 1,1 ${innerRadiusF * 2},0 a ${innerRadiusF},${innerRadiusF} 0 1,1 -${innerRadiusF * 2},0`}
              />
              <path
                id="trackCirclePathInnerG"
                d={`M ${outerRadius + padding},${outerRadius + padding} m -${innerRadiusG},0 a ${innerRadiusG},${innerRadiusG} 0 1,1 ${innerRadiusG * 2},0 a ${innerRadiusG},${innerRadiusG} 0 1,1 -${innerRadiusG * 2},0`}
              />
              <path
                id="trackCirclePathInnerH"
                d={`M ${outerRadius + padding},${outerRadius + padding} m -${innerRadiusH},0 a ${innerRadiusH},${innerRadiusH} 0 1,1 ${innerRadiusH * 2},0 a ${innerRadiusH},${innerRadiusH} 0 1,1 -${innerRadiusH * 2},0`}
              />
            </defs>
            <g className="circleGroupWrap circleGroupWrapOuter">
              <g className="circleGroup circleGroupOuter">
                {displayedTracks.map((track, index) => {
                  // Outer ring uses link anchors and supports zoom-on-first-click.
                  const fallbackOffset = `${(index + 0.5) * segmentPercent}%`;
                  const offset = offsetsOuter[index] ?? fallbackOffset;
                  return (
                    <a
                      key={track.id}
                      href={`#${track.id}`}
                      className="circleLink"
                      data-ring="outer"
                      data-index={index}
                      onClick={(event) => handleOuterClick(event, track.id)}
                    >
                      <text className="circleLabel">
                        <textPath
                          href="#trackCirclePathOuter"
                          startOffset={offset}
                        >
                          {revealedLabels.outer[index]
                            ? track.title
                            : getOuterDisplayTitle(index, track.title)}
                        </textPath>
                      </text>
                    </a>
                  );
                })}
              </g>
            </g>
            {needsMeasure && (
              <g className="circleMeasure" aria-hidden="true">
                {displayedTracks.map((track, index) => {
                  // Hidden labels used to measure text length for offsets.
                  const fallbackOffset = `${(index + 0.5) * segmentPercent}%`;
                  const offset = offsetsOuter[index] ?? fallbackOffset;
                  return (
                    <text key={`${track.id}-outer-measure`} className="circleLabel">
                      <textPath
                        href="#trackCirclePathOuter"
                        startOffset={offset}
                        ref={(node) => {
                          outerMeasureRefs.current[index] = node;
                        }}
                      >
                        {track.title}
                      </textPath>
                    </text>
                  );
                })}
              </g>
            )}
            {!rasterLayers && (
              <>
                <g
                  className="circleGroupWrap"
                >
                  <InnerRing
                    ringKey="innerA"
                    className="circleGroupInnerA"
                    pathId="#trackCirclePathInnerA"
                    offsets={[]}
                    titles={scrambledTitles.innerA}
                    displayedTracks={displayedTracks}
                    segmentPercent={segmentPercent}
                  />
                </g>
                {showAllRings && (
                  <>
                    <g className="circleGroupWrap">
                      <InnerRing
                        ringKey="innerB"
                        className="circleGroupInnerB"
                        pathId="#trackCirclePathInnerB"
                        offsets={[]}
                        titles={scrambledTitles.innerB}
                        displayedTracks={displayedTracks}
                        segmentPercent={segmentPercent}
                      />
                    </g>
                    <g className="circleGroupWrap">
                      <InnerRing
                        ringKey="innerC"
                        className="circleGroupInnerC"
                        pathId="#trackCirclePathInnerC"
                        offsets={[]}
                        titles={scrambledTitles.innerC}
                        displayedTracks={displayedTracks}
                        segmentPercent={segmentPercent}
                      />
                    </g>
                    <g className="circleGroupWrap">
                      <InnerRing
                        ringKey="innerD"
                        className="circleGroupInnerD"
                        pathId="#trackCirclePathInnerD"
                        offsets={[]}
                        titles={scrambledTitles.innerD}
                        displayedTracks={displayedTracks}
                        segmentPercent={segmentPercent}
                      />
                    </g>
                    <g className="circleGroupWrap">
                      <InnerRing
                        ringKey="innerE"
                        className="circleGroupInnerE"
                        pathId="#trackCirclePathInnerE"
                        offsets={[]}
                        titles={scrambledTitles.innerE}
                        displayedTracks={displayedTracks}
                        segmentPercent={segmentPercent}
                      />
                    </g>
                    <g className="circleGroupWrap">
                      <InnerRing
                        ringKey="innerF"
                        className="circleGroupInnerF"
                        pathId="#trackCirclePathInnerF"
                        offsets={[]}
                        titles={scrambledTitles.innerF}
                        displayedTracks={displayedTracks}
                        segmentPercent={segmentPercent}
                      />
                    </g>
                    <g className="circleGroupWrap">
                      <InnerRing
                        ringKey="innerG"
                        className="circleGroupInnerG"
                        pathId="#trackCirclePathInnerG"
                        offsets={[]}
                        titles={scrambledTitles.innerG}
                        displayedTracks={displayedTracks}
                        segmentPercent={segmentPercent}
                      />
                    </g>
                    <g className="circleGroupWrap">
                      <InnerRing
                        ringKey="innerH"
                        className="circleGroupInnerH"
                        pathId="#trackCirclePathInnerH"
                        offsets={[]}
                        titles={scrambledTitles.innerH}
                        displayedTracks={displayedTracks}
                        segmentPercent={segmentPercent}
                      />
                    </g>
                  </>
                )}
              </>
            )}
            {/* No inner-ring measurement; only outer ring uses precise offsets. */}
          </svg>
        </div>
      </div>
    </main>
  );
}
