"use client";

import {
  memo,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type MutableRefObject,
  type MouseEvent as ReactMouseEvent
} from "react";
import ParticleLayer from "./components/ParticleLayer";

const ASCII_CHARS = Array.from({ length: 94 }, (_, i) => String.fromCharCode(33 + i)).join("");
const SCRAMBLE_SYMBOLS = "!@#$%^&*+-=?:;<>[]{}~";
const SCRAMBLE_VARIANTS = 24;

const scrambleText = (text: string) =>
  text
    .split("")
    .map((char) =>
      char === " " ? " " : SCRAMBLE_SYMBOLS[Math.floor(Math.random() * SCRAMBLE_SYMBOLS.length)]
    )
    .join("");

type RingKey =
  | "outer"
  | "innerA"
  | "innerB"
  | "innerC"
  | "innerD"
  | "innerE"
  | "innerF"
  | "innerG"
  | "innerH";

type TrackLabelProps = {
  className: string;
  dataRing?: RingKey;
  dataIndex?: number;
  displayText: string;
  hrefId: string;
  startOffset: string | number;
  onClick?: (event: ReactMouseEvent<SVGTextElement>) => void;
};

const TrackLabel = memo(function TrackLabel({
  className,
  dataRing,
  dataIndex,
  displayText,
  hrefId,
  startOffset,
  onClick
}: TrackLabelProps) {
  return (
    <text
      className={className}
      data-ring={dataRing}
      data-index={dataIndex}
      onClick={onClick}
    >
      <textPath href={hrefId} startOffset={startOffset}>
        {displayText}
      </textPath>
    </text>
  );
});

const tracks = [
  {
    id: "safety-guide",
    title: "1 Safety Guide",
    lyrics: [
      "{Instrumental}"
    ]
  },
  {
    id: "lock-pick",
    title: "2 Lock Pick",
    lyrics: [
      "Every time it doesn't feel right",
      "Wash my face with acid",
      "This time I know it should be fine",
      "All alone I know I’m gonna be alright",
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
    title: "3 Have Fun",
    lyrics: [
      "(It’s going to)",
      "I have a mission I’m on my way to star",
      "I have a mission I gotta have some fun",
      "I gotta have some fun",
      "(I gotta have some fun)",
      "Break the rules like nothing",
      "(I run away from this real life)",
      "Guilty pleasure that’s nothing",
      "(Nothing in to nothing)",
      "This is my last time",
      "It’s not gonna happen twice",
      "This is my secret escapade",
      "You should keep this to my grave",
      "(Is this what you want)",
      "(Is this what you want)",
      "Rocket pills are not fun is not fun (anymore)",
      "White powders are not fun is not fun anymore",
      "Something feels wrong",
      "Something feels wrong",
      "~",
      "I have a mission I’m on my way to star",
      "I have a mission I gotta have some fun",
      "I gotta have some fun",
      "(I gotta have some fun)",
    ]
  },
  {
    id: "off-bones",
    title: "4 Off Bones",
    lyrics: [
      "Please wake me up when it’s over",
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
      "It’s loop",
      "~",
      "Maybe it’s not what I expected",
      "(Can’t handle this no more)",
      "I need somebody to help me",
      "Tearing my skin off bones",
      "Off bones, off bones",
      "(Off bones - Off bones)",
      "Tearing my skin off bones",
      "Off bones, off bones",
      "(Off bones - Off bones)",
      "~"
    ]
  },
  {
    id: "eraser",
    title: "5 Eraser",
    lyrics: [
      "(It’s going to)",
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
      "You can use me",
      "You can hurt me",
      "But be careful not to lose me",
      "(Not to lose me x2)",
      "~",
      "Mixed emotions I have it in my pocket x2",
      "~",
      "You can use me",
      "You can hurt me",
      "But be careful not to lose me",
      "You can use me",
      "You can hurt me",
      "(You can hurt me x2)",
      "~",
      "Since I meet you I look for something that is true",
      "You can take my everything I never doubt you",
      "Blurry on my mind Silver Color I seek clues",
      "(Silver color I seek clues x2)",
      "(It’s going to)",
      "~"
    ]
  },
  {
    id: "forbidden-fruit",
    title: "6 Forbidden Fruit (Interlude)",
    lyrics: [
      "{Instrumental}"
    ]
  },
  {
    id: "helium",
    title: "7 Helium",
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
      "Lost in the memories I carry on",
      "Do you really know me if you weren’t really there x2",
      "I can’t take this damage over you",
      "I can’t take this loss over you",
      "(loss over you x2)",
      "(Double necklace, I think you know what it means x2)",
      "I'm just tryna peel it off",
      "She played me dirty, so I play it worse",
      "(worse, worse)",
      "Feel like helium",
      "Floating too high, unmixed, alien",
      "~",
      "If she notices me one time",
      "The scales will tip two times",
      "So baby, I’m not your savior, maybe",
      "Fatal kind of mercy",
      "I’ll rewrite the last line",
      "(It’s going to)"
    ]
  },
  {
    id: "afraid",
    title: "8 What are you afraid of?",
    lyrics: [
      "(It’s going to)",
      "3 days in London",
      "Hotel I stay up all night feeling drugs",
      "3 days in London",
      "Hotel I stay up all night feeling drugs",
      "I’m running in circles",
      "running in circles",
      "running in circles",
      "We are running in circles",
      "running in circles",
      "running in circles",
      "There’s something I can’t tell",
      "But you know its been this way",
      "You can fill up voids with my voice",
      "“So what are you afraid of?“",
      "~",
      "Please take care of me when",
      "every time I fall back “its okay“",
      "Please take care of me when",
      "every time I fall back “its okay“",
      "It’s okay",
      "It’s okay",
      "It’s okay",
      "Please take care of me x4",
      "~"
    ]
  },
  {
    id: "seoul",
    title: "9 Seoul (Bonus)",
    lyrics: [
      "{Instrumental}"
    ]
  }
];

const getCircleTitle = (title: string) =>
  title.replace(/^\s*\d+\s*[-.)]?\s*/u, "");

const getLyricsTitle = (title: string) =>
  title.replace(/^\s*(\d+)\s*([.)-]?\s*)?/u, "$1. ");

const SCRAMBLE_FRAMES = tracks.map((track) =>
  Array.from({ length: SCRAMBLE_VARIANTS }, () => scrambleText(track.title))
);


export default function Page() {
  // React state arrays that hold the computed startOffset values for each ring's <textPath> elements
  // offsetsOuter is an array of numbers for the outer ring. Each entry matches a track and represents where along the path its label should start. 
  const [offsetsOuter, setOffsetsOuter] = useState<number[]>([]);
  const [offsetsInnerA, setOffsetsInnerA] = useState<number[]>([]);
  const [offsetsInnerB, setOffsetsInnerB] = useState<number[]>([]);
  const [offsetsInnerC, setOffsetsInnerC] = useState<number[]>([]);
  const [offsetsInnerD, setOffsetsInnerD] = useState<number[]>([]);
  const [offsetsInnerE, setOffsetsInnerE] = useState<number[]>([]);
  const [offsetsInnerF, setOffsetsInnerF] = useState<number[]>([]);
  const [offsetsInnerG, setOffsetsInnerG] = useState<number[]>([]);
  const [offsetsInnerH, setOffsetsInnerH] = useState<number[]>([]);
  const [zoomTarget, setZoomTarget] = useState<{
    scale: number;
    x: number;
    y: number;
  } | null>(null);
  const [activeTrackId, setActiveTrackId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [lyricsScrambleFrame, setLyricsScrambleFrame] = useState(0);
  const [lyricsScrambleActive, setLyricsScrambleActive] = useState(false);
  const [showLyricsContent, setShowLyricsContent] = useState(false);
  const [showCredits, setShowCredits] = useState(false);
  const [scrambledTitles, setScrambledTitles] = useState(() => ({
    outer: tracks.map((track) => getCircleTitle(track.title)),
    innerA: tracks.map((track) => getCircleTitle(track.title)),
    innerB: tracks.map((track) => getCircleTitle(track.title)),
    innerC: tracks.map((track) => getCircleTitle(track.title)),
    innerD: tracks.map((track) => getCircleTitle(track.title)),
    innerE: tracks.map((track) => getCircleTitle(track.title)),
    innerF: tracks.map((track) => getCircleTitle(track.title)),
    innerG: tracks.map((track) => getCircleTitle(track.title)),
    innerH: tracks.map((track) => getCircleTitle(track.title))
  }));
  const [scrambleActive, setScrambleActive] = useState(true);
  const [revealStage, setRevealStage] = useState(0);
  const [autoRevealRunning, setAutoRevealRunning] = useState(false);
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
  const revealedLabelsRef = useRef(revealedLabels);
  useEffect(() => {
    const body = document.body;
    const root = document.documentElement;
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

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(max-width: 640px)");
    const handleChange = () => setIsMobile(media.matches);
    handleChange();
    if (media.addEventListener) {
      media.addEventListener("change", handleChange);
    } else {
      media.addListener(handleChange);
    }
    return () => {
      if (media.removeEventListener) {
        media.removeEventListener("change", handleChange);
      } else {
        media.removeListener(handleChange);
      }
    };
  }, []);
  // Refs for <textPath> nodes per ring so text lengths can be measured
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
  const innerAMeasureRefs = useRef<Array<SVGTextPathElement | null>>([]);
  const innerBMeasureRefs = useRef<Array<SVGTextPathElement | null>>([]);
  const innerCMeasureRefs = useRef<Array<SVGTextPathElement | null>>([]);
  const innerDMeasureRefs = useRef<Array<SVGTextPathElement | null>>([]);
  const innerEMeasureRefs = useRef<Array<SVGTextPathElement | null>>([]);
  const innerFMeasureRefs = useRef<Array<SVGTextPathElement | null>>([]);
  const innerGMeasureRefs = useRef<Array<SVGTextPathElement | null>>([]);
  const innerHMeasureRefs = useRef<Array<SVGTextPathElement | null>>([]);
  const circleWrapRef = useRef<HTMLDivElement | null>(null);
  // State for rasterized SVG layers (inner A/B/C)
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
  // Base geometry
  const scaleFactor = 0.8;
  const outerRadius = 420 * scaleFactor;
  const padding = 24 * scaleFactor;
  const innerGap = 45 * scaleFactor;
  const ringRotationDegrees = {
    outer: 0,
    innerA: 30,
    innerB: 75,
    innerC: 120,
    innerD: 165,
    innerE: 210,
    innerF: 255,
    innerG: 300,
    innerH: 345
  };
  // Font sizes for inner rings
  const innerFontSizeA = 16 * scaleFactor;
  const innerFontSizeB = 13 * scaleFactor;
  const innerFontSizeC = 12 * scaleFactor;
  const innerFontSizeD = 11 * scaleFactor;
  const innerFontSizeE = 10 * scaleFactor;
  const innerFontSizeF = 9 * scaleFactor;
  const innerFontSizeG = 8 * scaleFactor;
  const innerFontSizeH = 5 * scaleFactor;
  // Radii for inner rings computed from outer radius and gaps
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
  const buildScrambledStateFromFrame = (frame: number) => ({
    outer: tracks.map((track, index) =>
      revealedLabelsRef.current.outer[index]
        ? getCircleTitle(track.title)
        : SCRAMBLE_FRAMES[index][frame]
    ),
    innerA: tracks.map((track, index) =>
      revealedLabelsRef.current.innerA[index]
        ? getCircleTitle(track.title)
        : SCRAMBLE_FRAMES[index][frame]
    ),
    innerB: tracks.map((track, index) =>
      revealedLabelsRef.current.innerB[index]
        ? getCircleTitle(track.title)
        : SCRAMBLE_FRAMES[index][frame]
    ),
    innerC: tracks.map((track, index) =>
      revealedLabelsRef.current.innerC[index]
        ? getCircleTitle(track.title)
        : SCRAMBLE_FRAMES[index][frame]
    ),
    innerD: tracks.map((track, index) =>
      revealedLabelsRef.current.innerD[index]
        ? getCircleTitle(track.title)
        : SCRAMBLE_FRAMES[index][frame]
    ),
    innerE: tracks.map((track, index) =>
      revealedLabelsRef.current.innerE[index]
        ? getCircleTitle(track.title)
        : SCRAMBLE_FRAMES[index][frame]
    ),
    innerF: tracks.map((track, index) =>
      revealedLabelsRef.current.innerF[index]
        ? getCircleTitle(track.title)
        : SCRAMBLE_FRAMES[index][frame]
    ),
    innerG: tracks.map((track, index) =>
      revealedLabelsRef.current.innerG[index]
        ? getCircleTitle(track.title)
        : SCRAMBLE_FRAMES[index][frame]
    ),
    innerH: tracks.map((track, index) =>
      revealedLabelsRef.current.innerH[index]
        ? getCircleTitle(track.title)
        : SCRAMBLE_FRAMES[index][frame]
    )
  });

  useEffect(() => {
    revealedLabelsRef.current = revealedLabels;
  }, [revealedLabels]);

  useEffect(() => {
    return () => {};
  }, []);

  useEffect(() => {
    if (overlayOpen && isMobile) return;
    const scrambleInterval = 90;
    const outerPattern = [true];
    const innerPattern = [true];
    setScrambleActive(true);
    setRasterLayers(null);
    let rafId: number | null = null;
    let lastTime = 0;
    let tick = 0;
    let frame = 0;

    const pushFrame = (frameIndex: number, updateOuter: boolean, updateInner: boolean) => {
      const revealed = revealedLabelsRef.current;
      setScrambledTitles((prev) => {
        let changed = false;
        const next = { ...prev };
        if (updateOuter) {
        const nextOuter = tracks.map((track, index) =>
          revealed.outer[index] ? getCircleTitle(track.title) : SCRAMBLE_FRAMES[index][frameIndex]
        );
          if (prev.outer.join("") !== nextOuter.join("")) {
            next.outer = nextOuter;
            changed = true;
          }
        }
        if (updateInner) {
          const nextInnerA = tracks.map((track, index) =>
            revealed.innerA[index] ? getCircleTitle(track.title) : SCRAMBLE_FRAMES[index][frameIndex]
          );
          const nextInnerB = tracks.map((track, index) =>
            revealed.innerB[index] ? getCircleTitle(track.title) : SCRAMBLE_FRAMES[index][frameIndex]
          );
          const nextInnerC = tracks.map((track, index) =>
            revealed.innerC[index] ? getCircleTitle(track.title) : SCRAMBLE_FRAMES[index][frameIndex]
          );
          const nextInnerD = tracks.map((track, index) =>
            revealed.innerD[index] ? getCircleTitle(track.title) : SCRAMBLE_FRAMES[index][frameIndex]
          );
          const nextInnerE = tracks.map((track, index) =>
            revealed.innerE[index] ? getCircleTitle(track.title) : SCRAMBLE_FRAMES[index][frameIndex]
          );
          const nextInnerF = tracks.map((track, index) =>
            revealed.innerF[index] ? getCircleTitle(track.title) : SCRAMBLE_FRAMES[index][frameIndex]
          );
          const nextInnerG = tracks.map((track, index) =>
            revealed.innerG[index] ? getCircleTitle(track.title) : SCRAMBLE_FRAMES[index][frameIndex]
          );
          const nextInnerH = tracks.map((track, index) =>
            revealed.innerH[index] ? getCircleTitle(track.title) : SCRAMBLE_FRAMES[index][frameIndex]
          );
          if (prev.innerA.join("") !== nextInnerA.join("")) {
            next.innerA = nextInnerA;
            changed = true;
          }
          if (prev.innerB.join("") !== nextInnerB.join("")) {
            next.innerB = nextInnerB;
            changed = true;
          }
          if (prev.innerC.join("") !== nextInnerC.join("")) {
            next.innerC = nextInnerC;
            changed = true;
          }
          if (prev.innerD.join("") !== nextInnerD.join("")) {
            next.innerD = nextInnerD;
            changed = true;
          }
          if (prev.innerE.join("") !== nextInnerE.join("")) {
            next.innerE = nextInnerE;
            changed = true;
          }
          if (prev.innerF.join("") !== nextInnerF.join("")) {
            next.innerF = nextInnerF;
            changed = true;
          }
          if (prev.innerG.join("") !== nextInnerG.join("")) {
            next.innerG = nextInnerG;
            changed = true;
          }
          if (prev.innerH.join("") !== nextInnerH.join("")) {
            next.innerH = nextInnerH;
            changed = true;
          }
        }
        return changed ? next : prev;
      });
    };

    const step = (now: number) => {
      if (!lastTime) lastTime = now;
      if (!document.hidden && now - lastTime >= scrambleInterval) {
        lastTime = now;
        frame = (frame + 1) % SCRAMBLE_VARIANTS;
        tick += 1;
        pushFrame(
          frame,
          outerPattern[tick % outerPattern.length],
          innerPattern[tick % innerPattern.length]
        );
      }
      rafId = requestAnimationFrame(step);
    };

    pushFrame(frame, true, true);
    rafId = requestAnimationFrame(step);

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [overlayOpen, isMobile]);

  useLayoutEffect(() => {
    // Measure label lengths and compute evenly spaced start offsets around a ring
    const computeOffsetsForRadius = (
      refs: MutableRefObject<Array<SVGTextPathElement | null>>,
      radius: number
    ) => {
      const lengths = refs.current.map((node) =>
        node ? node.getComputedTextLength() : 0
      );
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

    // computes and stores the startOffset arrays for each ring
    const computeOffsets = () => {
      const nextOuter = computeOffsetsForRadius(outerMeasureRefs, outerRadius);
      if (!nextOuter) return;
      if (rasterLayers) {
        setOffsetsOuter(nextOuter);
        return;
      }
      const nextInnerA = computeOffsetsForRadius(innerAMeasureRefs, innerRadiusA);
      const nextInnerB = computeOffsetsForRadius(innerBMeasureRefs, innerRadiusB);
      const nextInnerC = computeOffsetsForRadius(innerCMeasureRefs, innerRadiusC);
      const nextInnerD = computeOffsetsForRadius(innerDMeasureRefs, innerRadiusD);
      const nextInnerE = computeOffsetsForRadius(innerEMeasureRefs, innerRadiusE);
      const nextInnerF = computeOffsetsForRadius(innerFMeasureRefs, innerRadiusF);
      const nextInnerG = computeOffsetsForRadius(innerGMeasureRefs, innerRadiusG);
      const nextInnerH = computeOffsetsForRadius(innerHMeasureRefs, innerRadiusH);
      if (
        !nextInnerA ||
        !nextInnerB ||
        !nextInnerC ||
        !nextInnerD ||
        !nextInnerE ||
        !nextInnerF ||
        !nextInnerG ||
        !nextInnerH
      ) return;
      setOffsetsOuter(nextOuter);
      setOffsetsInnerA(nextInnerA);
      setOffsetsInnerB(nextInnerB);
      setOffsetsInnerC(nextInnerC);
      setOffsetsInnerD(nextInnerD);
      setOffsetsInnerE(nextInnerE);
      setOffsetsInnerF(nextInnerF);
      setOffsetsInnerG(nextInnerG);
      setOffsetsInnerH(nextInnerH);
    };

    // Schedules offset calculation at the right time and cleans up. Waits for the layout and fonts to fully settled before measuring text lengths (fonts and SVG paths can take an extra frame to resolve)
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
    rasterLayers
  ]);

  // Resets the rasterized inner ring images whenever any inner font size changes
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

  // Rasterizes the inner rings into images once the SVG is ready and text offsets are computed
  useEffect(() => {
    if (!rasterEnabled) return;
    if (scrambleActive) return;
    if (rasterLayers) return;
    if (!svgRef.current) return;
    if (
      !offsetsInnerA.length ||
      !offsetsInnerB.length ||
      !offsetsInnerC.length ||
      !offsetsInnerD.length ||
      !offsetsInnerE.length ||
      !offsetsInnerF.length ||
      !offsetsInnerG.length ||
      !offsetsInnerH.length
    ) return;

    const serializer = new XMLSerializer();
    const ensureFont = async () => {
      if (fontDataRef.current) return fontDataRef.current;
      const res = await fetch("/fonts/SuisseIntl-Thin.otf");
      const buffer = await res.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      let binary = "";
      bytes.forEach((b) => {
        binary += String.fromCharCode(b);
      });
      const base64 = btoa(binary);
      fontDataRef.current = base64;
      return base64;
    };

    const buildLayer = async (className: string) => {
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
    run();
    return () => {
      isCancelled = true;
    };
  }, [
    offsetsInnerA.length,
    offsetsInnerB.length,
    offsetsInnerC.length,
    offsetsInnerD.length,
    offsetsInnerE.length,
    offsetsInnerF.length,
    offsetsInnerG.length,
    offsetsInnerH.length,
    rasterLayers,
    scrambleActive
  ]);

  const getDisplayTitle = (
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
    index: number,
    title: string
  ) => {
    if (revealedLabels[ring][index]) return title;
    return scrambledTitles[ring][index] ?? title;
  };

  const ringOrder: RingKey[] = [
    "outer",
    "innerA",
    "innerB",
    "innerC",
    "innerD",
    "innerE",
    "innerF",
    "innerG",
    "innerH"
  ];

  const revealRing = (ring: RingKey) => {
    setRevealedLabels((prev) => {
      if (prev[ring].every(Boolean)) return prev;
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
      next[ring] = next[ring].map(() => true);
      revealedLabelsRef.current = next;
      return next;
    });
  };

  const handleWhitespaceClick = (event: ReactMouseEvent<HTMLElement>) => {
    if (showOverlay) return;
    const target = event.target as Element | null;
    if (target?.closest?.(".lyricsPanel, .lyricsOverlay")) {
      return;
    }
    if (autoRevealRunning || revealStage >= ringOrder.length) return;
    setAutoRevealRunning(true);
    let index = revealStage;
    revealRing(ringOrder[index]);
    index += 1;
    setRevealStage(index);
    const intervalId = window.setInterval(() => {
      if (index >= ringOrder.length) {
        window.clearInterval(intervalId);
        setAutoRevealRunning(false);
        return;
      }
      revealRing(ringOrder[index]);
      index += 1;
      setRevealStage(index);
    }, 260);
  };

  const resetScramble = () => {
    const nextRevealed = {
      outer: Array(tracks.length).fill(false),
      innerA: Array(tracks.length).fill(false),
      innerB: Array(tracks.length).fill(false),
      innerC: Array(tracks.length).fill(false),
      innerD: Array(tracks.length).fill(false),
      innerE: Array(tracks.length).fill(false),
      innerF: Array(tracks.length).fill(false),
      innerG: Array(tracks.length).fill(false),
      innerH: Array(tracks.length).fill(false)
    };
    revealedLabelsRef.current = nextRevealed;
    setRevealedLabels(nextRevealed);
    setRevealStage(0);
    setAutoRevealRunning(false);
    setScrambledTitles({
      outer: SCRAMBLE_FRAMES.map((frames, index) => frames[0] ?? getCircleTitle(tracks[index].title)),
      innerA: SCRAMBLE_FRAMES.map((frames, index) => frames[0] ?? getCircleTitle(tracks[index].title)),
      innerB: SCRAMBLE_FRAMES.map((frames, index) => frames[0] ?? getCircleTitle(tracks[index].title)),
      innerC: SCRAMBLE_FRAMES.map((frames, index) => frames[0] ?? getCircleTitle(tracks[index].title)),
      innerD: SCRAMBLE_FRAMES.map((frames, index) => frames[0] ?? getCircleTitle(tracks[index].title)),
      innerE: SCRAMBLE_FRAMES.map((frames, index) => frames[0] ?? getCircleTitle(tracks[index].title)),
      innerF: SCRAMBLE_FRAMES.map((frames, index) => frames[0] ?? getCircleTitle(tracks[index].title)),
      innerG: SCRAMBLE_FRAMES.map((frames, index) => frames[0] ?? getCircleTitle(tracks[index].title)),
      innerH: SCRAMBLE_FRAMES.map((frames, index) => frames[0] ?? getCircleTitle(tracks[index].title))
    });
  };

  const size = outerRadius * 2 + padding * 2;
  const center = outerRadius + padding;
  const circlePath = (radius: number, angleDeg: number) => {
    const theta = (angleDeg * Math.PI) / 180;
    const startX = center + radius * Math.cos(theta);
    const startY = center + radius * Math.sin(theta);
    const dx = -2 * radius * Math.cos(theta);
    const dy = -2 * radius * Math.sin(theta);
    return `M ${startX},${startY} a ${radius},${radius} 0 1,1 ${dx},${dy} a ${radius},${radius} 0 1,1 ${-dx},${-dy}`;
  };

  const zoomToTrack = (trackId: string, withHash: boolean) => {
    setActiveTrackId(trackId);
    if (zoomTarget) {
      if (withHash) window.location.hash = trackId;
      return;
    }
    const wrap = circleWrapRef.current;
    if (!wrap) return;
    const rect = wrap.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const targetScale = 1.35;
    const viewportHeight = window.innerHeight;
    const x = 0 - centerX / targetScale - 100;
    const y = viewportHeight / targetScale - centerY + 80;
    setShowLyricsContent(false);
    setZoomTarget({ scale: targetScale, x, y });
    if (withHash) {
      window.setTimeout(() => {
        window.location.hash = trackId;
      }, 820);
    }
  };

  const handleOuterClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    trackId: string
  ) => {
    event.preventDefault();
    if (isMobile) {
      setActiveTrackId(trackId);
      setOverlayOpen(true);
      setZoomTarget(null);
      setShowLyricsContent(true);
      return;
    }
    zoomToTrack(trackId, true);
  };

  const handleInnerClick = (
    event: ReactMouseEvent<SVGTextElement>,
    trackId: string
  ) => {
    event.preventDefault();
    event.stopPropagation();
    if (isMobile) {
      setActiveTrackId(trackId);
      setOverlayOpen(true);
      setZoomTarget(null);
      setShowLyricsContent(true);
      return;
    }
    zoomToTrack(trackId, false);
  };

  useEffect(() => {
    if (!zoomTarget) return;
    const handleBodyClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      if (target?.closest(".circleLink")) return;
      if (target?.closest(".lyricsPanel")) return;
      if (target?.closest(".streamingLinks, .streamingStack")) return;
      if (showCredits || target?.closest(".creditsOverlay, .creditsContent")) return;
      const wrap = circleWrapRef.current;
      if (wrap && target && wrap.contains(target)) return;
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
  }, [zoomTarget, showCredits]);

  const activeTrack = activeTrackId
    ? tracks.find((track) => track.id === activeTrackId)
    : null;
  const showOverlay = Boolean(isMobile && overlayOpen && activeTrack);
  const showLyrics = Boolean(activeTrack && (zoomTarget || showOverlay));

  const scrambleLine = (line: string, frame: number) =>
    line
      .split("")
      .map((char, index) => {
        if (char === " ") return " ";
        const seed = (char.charCodeAt(0) + index * 13 + frame * 31) % SCRAMBLE_SYMBOLS.length;
        return SCRAMBLE_SYMBOLS[seed];
      })
      .join("");

  useEffect(() => {
    if (!showLyricsContent) {
      setLyricsScrambleActive(false);
      setLyricsScrambleFrame(0);
      return;
    }
    let frame = 0;
    setLyricsScrambleActive(true);
    setLyricsScrambleFrame(0);
    const intervalId = window.setInterval(() => {
      frame += 1;
      if (frame >= 12) {
        setLyricsScrambleActive(false);
        window.clearInterval(intervalId);
        return;
      }
      setLyricsScrambleFrame(frame);
    }, 60);
    return () => {
      window.clearInterval(intervalId);
    };
  }, [activeTrackId, showLyricsContent]);

  useEffect(() => {
    if (!showLyrics) {
      setShowLyricsContent(false);
    }
  }, [showLyrics]);

  return (
    <>
      {activeTrack && zoomTarget && !showOverlay && (
        <>
          <div className="streamingStack">
            <div className="streamingLinks" aria-label="Streaming links">
              <a href="https://open.spotify.com/album/1r7LsYEkCa4ZxtezhMZcWS?si=yNDHo3BJTgSZgQvhqq_lrg" aria-label="Spotify" target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()}>Spotify</a>
              <a href="https://music.apple.com/kr/album/runaway-project/1862149571?l=en-GB" aria-label="Apple Music" target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()}>Apple Music</a>
              <a href="https://www.youtube.com/playlist?list=OLAK5uy_mqTTMcmSBpe1nKKgVa6-Eia6rWF_4cqww" aria-label="YouTube" target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()}>YouTube</a>
              <a href="https://xave2001.bandcamp.com/album/runaway-project" aria-label="Bandcamp" target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()}>Bandcamp</a>
              <a href="https://www.ninaprotocol.com/profiles/xave?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQMMjU2MjgxMDQwNTU4AAGnmOZS3G4-1BjrUQJyq4SJ_AWANf1vdQRpAJNPFwxNFhnwqHKpjlyJtWbMU9o_aem_0gq60vaW8VwOSZGdqqb5Uw&tab=releases&page=1&sort=desc" aria-label="Nina Protocol" target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()}>Nina Protocol</a>
              <a href="https://soundcloud.com/carenotcure" aria-label="SoundCloud" target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()}>SoundCloud</a>
            </div>
            <a
              className="streamingCredit"
              href="#"
              aria-label="Credit"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                setShowCredits(true);
              }}
            >
              credit
            </a>
          </div>
          {showLyricsContent && (
            <aside className="lyricsPanel" aria-live="polite">
              <div className="lyricsTitle">{getLyricsTitle(activeTrack.title)}</div>
              <div className="lyricsBody">
                {activeTrack.lyrics.map((line, index) => (
                  <p key={`${activeTrack.id}-line-${index}`}>
                    {lyricsScrambleActive
                      ? scrambleLine(line ?? "", lyricsScrambleFrame)
                      : line}
                  </p>
                ))}
              </div>
              <img className="lyricsGif" src="/gifs/butterfly2.gif" alt="" />
            </aside>
          )}
        </>
      )}
      {showOverlay && showLyricsContent && (
        <div
          className="lyricsOverlay"
          role="dialog"
          aria-modal="true"
          onClick={() => setOverlayOpen(false)}
        >
          <div className="lyricsOverlayContent">
            <div className="lyricsTitle">
              {activeTrack?.title ? getLyricsTitle(activeTrack.title) : ""}
            </div>
            <div className="lyricsBody">
              {activeTrack?.lyrics.map((line, index) => (
                <p key={`${activeTrack.id}-line-${index}`}>
                  {lyricsScrambleActive
                    ? scrambleLine(line ?? "", lyricsScrambleFrame)
                    : line}
                </p>
              ))}
            </div>
            <img className="lyricsGif" src="/gifs/butterfly2.gif" alt="" />
            <div className="streamingLinks streamingLinksOverlay" aria-label="Streaming links">
              <a href="https://open.spotify.com/album/1r7LsYEkCa4ZxtezhMZcWS?si=yNDHo3BJTgSZgQvhqq_lrg" aria-label="Spotify" target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()}>Spotify</a>
              <a href="https://music.apple.com/kr/album/runaway-project/1862149571?l=en-GB" aria-label="Apple Music" target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()}>Apple Music</a>
              <a href="https://www.youtube.com/playlist?list=OLAK5uy_mqTTMcmSBpe1nKKgVa6-Eia6rWF_4cqww" aria-label="YouTube" target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()}>YouTube</a>
              <a href="https://xave2001.bandcamp.com/album/runaway-project" aria-label="Bandcamp" target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()}>Bandcamp</a>
              <a href="https://www.ninaprotocol.com/profiles/xave?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQMMjU2MjgxMDQwNTU4AAGnmOZS3G4-1BjrUQJyq4SJ_AWANf1vdQRpAJNPFwxNFhnwqHKpjlyJtWbMU9o_aem_0gq60vaW8VwOSZGdqqb5Uw&tab=releases&page=1&sort=desc" aria-label="Nina Protocol" target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()}>Nina Protocol</a>
              <a href="https://soundcloud.com/carenotcure" aria-label="SoundCloud" target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()}>SoundCloud</a>
            </div>
            <a
              className="streamingCredit streamingCreditOverlay"
              href="#"
              aria-label="Credit"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                setShowCredits(true);
              }}
            >
              credit
            </a>
          </div>
        </div>
      )}
      {showCredits && (
        <div
          className="creditsOverlay"
          role="dialog"
          aria-modal="true"
          onClick={() => setShowCredits(false)}
        >
          <div
            className="creditsContent"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="creditsColumn">
              <div className="creditsTitle">Runaway Project (19/12/2025)</div>
              <div className="creditsLine">Mixed &amp; Mastered by Yang Woo Jo</div>
              <div className="creditsDivider">~</div>
              <div className="creditsLine">Runaway Project 2025 ©</div>
              <a
                className="creditsLink"
                href="/cover.png"
                target="_blank"
                rel="noreferrer"
              >
                cover
              </a>
            </div>
            <div className="creditsColumn">
              <div className="creditsSectionTitle">Safety Guide</div>
              <div className="creditsLine">produced by Jiwoo Hong, Tae Hyung Koo</div>
              <div className="creditsSectionTitle">Lock Pick</div>
              <div className="creditsLine">produced by Jiwoo Hong</div>
              <div className="creditsLine">written by Jiwoo Hong</div>
              <div className="creditsSectionTitle">Have Fun</div>
              <div className="creditsLine">produced by Jiwoo Hong</div>
              <div className="creditsLine">written by Jiwoo Hong</div>
              <div className="creditsSectionTitle">Off Bones</div>
              <div className="creditsLine">produced by Jiwoo Hong, Tae Hyung Koo</div>
              <div className="creditsLine">written by Jiwoo Hong</div>
              <div className="creditsSectionTitle">Eraser</div>
              <div className="creditsLine">produced by Jiwoo Hong</div>
              <div className="creditsLine">written by Jiwoo Hong</div>
              <div className="creditsSectionTitle">Forbidden Fruit (interlude)</div>
              <div className="creditsLine">produced by Jiwoo Hong</div>
              <div className="creditsSectionTitle">Helium feat. jinnin</div>
              <div className="creditsLine">produced by Jiwoo Hong</div>
              <div className="creditsLine">written by Jiwoo Hong, Jimin Lee</div>
              <div className="creditsSectionTitle">What are you afraid of?</div>
              <div className="creditsLine">produced by Jiwoo Hong, Tae Hyung Koo</div>
              <div className="creditsLine">written by Jiwoo Hong</div>
              <div className="creditsSectionTitle">Seoul (Bonus)</div>
              <div className="creditsLine">produced by Jiwoo Hong, Tae Hyung Koo</div>
            </div>
          </div>
        </div>
      )}
      <main
        className={`page${zoomTarget ? " pageZoomed" : ""}${showOverlay ? " pagePaused" : ""}`}
        style={
          {
            "--zoom-scale": zoomTarget?.scale ?? 1,
            "--zoom-x": zoomTarget ? `${zoomTarget.x}px` : "0px",
            "--zoom-y": zoomTarget ? `${zoomTarget.y}px` : "0px"
          } as CSSProperties
        }
        onClick={handleWhitespaceClick}
        onTransitionEnd={(event) => {
          if (event.propertyName === "transform" && zoomTarget) {
            setShowLyricsContent(true);
          }
        }}
      >
        {/* <ParticleLayer className="particleLayer" />   */}

        {!showOverlay && <div className="layout">
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
            } as CSSProperties // 
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
          >
            <defs>
              <path
                id="trackCirclePathOuter"
                d={circlePath(outerRadius, ringRotationDegrees.outer)}
              />
              <path
                id="trackCirclePathInnerA"
                d={circlePath(innerRadiusA, ringRotationDegrees.innerA)}
              />
              <path
                id="trackCirclePathInnerB"
                d={circlePath(innerRadiusB, ringRotationDegrees.innerB)}
              />
              <path
                id="trackCirclePathInnerC"
                d={circlePath(innerRadiusC, ringRotationDegrees.innerC)}
              />
              <path
                id="trackCirclePathInnerD"
                d={circlePath(innerRadiusD, ringRotationDegrees.innerD)}
              />
              <path
                id="trackCirclePathInnerE"
                d={circlePath(innerRadiusE, ringRotationDegrees.innerE)}
              />
              <path
                id="trackCirclePathInnerF"
                d={circlePath(innerRadiusF, ringRotationDegrees.innerF)}
              />
              <path
                id="trackCirclePathInnerG"
                d={circlePath(innerRadiusG, ringRotationDegrees.innerG)}
              />
              <path
                id="trackCirclePathInnerH"
                d={circlePath(innerRadiusH, ringRotationDegrees.innerH)}
              />
            </defs>
            <g className="circleGroupWrap circleGroupWrapOuter">
              <g className="circleGroup circleGroupOuter">
                {displayedTracks.map((track, index) => {
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
                      style={{
                        pointerEvents: revealedLabels.outer[index] ? "auto" : "none"
                      }}
                      aria-disabled={!revealedLabels.outer[index]}
                    >
                      <TrackLabel
                        className="circleLabel"
                          displayText={getDisplayTitle("outer", index, getCircleTitle(track.title))}
                        hrefId="#trackCirclePathOuter"
                        startOffset={offset}
                      />
                    </a>
                  );
                })}
              </g>
            </g>
            <g className="circleMeasure" aria-hidden="true">
              {displayedTracks.map((track, index) => {
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
            {!rasterLayers && (
              <>
                <g className="circleGroupWrap">
                  <g className="circleGroup circleGroupInnerA">
                    {displayedTracks.map((track, index) => {
                      const fallbackOffset = `${(index + 0.5) * segmentPercent}%`;
                      const offset = offsetsInnerA[index] ?? fallbackOffset;
                      return (
                        <TrackLabel
                          key={`${track.id}-inner-a`}
                          className="circleLabel circleLabelInner circleLink"
                          dataRing="innerA"
                          dataIndex={index}
                            displayText={getDisplayTitle("innerA", index, getCircleTitle(track.title))}
                          hrefId="#trackCirclePathInnerA"
                          startOffset={offset}
                          onClick={
                            revealedLabels.innerA[index]
                              ? (event) => handleInnerClick(event, track.id)
                              : undefined
                          }
                        />
                      );
                    })}
                  </g>
                </g>
                <g className="circleGroupWrap">
                  <g className="circleGroup circleGroupInnerB">
                    {displayedTracks.map((track, index) => {
                      const fallbackOffset = `${(index + 0.5) * segmentPercent}%`;
                      const offset = offsetsInnerB[index] ?? fallbackOffset;
                      return (
                        <TrackLabel
                          key={`${track.id}-inner-b`}
                          className="circleLabel circleLabelInner circleLink"
                          dataRing="innerB"
                          dataIndex={index}
                            displayText={getDisplayTitle("innerB", index, getCircleTitle(track.title))}
                          hrefId="#trackCirclePathInnerB"
                          startOffset={offset}
                          onClick={
                            revealedLabels.innerB[index]
                              ? (event) => handleInnerClick(event, track.id)
                              : undefined
                          }
                        />
                      );
                    })}
                  </g>
                </g>
                <g className="circleGroupWrap">
                  <g className="circleGroup circleGroupInnerC">
                    {displayedTracks.map((track, index) => {
                      const fallbackOffset = `${(index + 0.5) * segmentPercent}%`;
                      const offset = offsetsInnerC[index] ?? fallbackOffset;
                      return (
                        <TrackLabel
                          key={`${track.id}-inner-c`}
                          className="circleLabel circleLabelInner circleLink"
                          dataRing="innerC"
                          dataIndex={index}
                            displayText={getDisplayTitle("innerC", index, getCircleTitle(track.title))}
                          hrefId="#trackCirclePathInnerC"
                          startOffset={offset}
                          onClick={
                            revealedLabels.innerC[index]
                              ? (event) => handleInnerClick(event, track.id)
                              : undefined
                          }
                        />
                      );
                    })}
                  </g>
                </g>
                <g className="circleGroupWrap">
                  <g className="circleGroup circleGroupInnerD">
                    {displayedTracks.map((track, index) => {
                      const fallbackOffset = `${(index + 0.5) * segmentPercent}%`;
                      const offset = offsetsInnerD[index] ?? fallbackOffset;
                      return (
                        <TrackLabel
                          key={`${track.id}-inner-d`}
                          className="circleLabel circleLabelInner circleLink"
                          dataRing="innerD"
                          dataIndex={index}
                            displayText={getDisplayTitle("innerD", index, getCircleTitle(track.title))}
                          hrefId="#trackCirclePathInnerD"
                          startOffset={offset}
                          onClick={
                            revealedLabels.innerD[index]
                              ? (event) => handleInnerClick(event, track.id)
                              : undefined
                          }
                        />
                      );
                    })}
                  </g>
                </g>
                <g className="circleGroupWrap">
                  <g className="circleGroup circleGroupInnerE">
                    {displayedTracks.map((track, index) => {
                      const fallbackOffset = `${(index + 0.5) * segmentPercent}%`;
                      const offset = offsetsInnerE[index] ?? fallbackOffset;
                      return (
                        <TrackLabel
                          key={`${track.id}-inner-e`}
                          className="circleLabel circleLabelInner circleLink"
                          dataRing="innerE"
                          dataIndex={index}
                            displayText={getDisplayTitle("innerE", index, getCircleTitle(track.title))}
                          hrefId="#trackCirclePathInnerE"
                          startOffset={offset}
                          onClick={
                            revealedLabels.innerE[index]
                              ? (event) => handleInnerClick(event, track.id)
                              : undefined
                          }
                        />
                      );
                    })}
                  </g>
                </g>
                <g className="circleGroupWrap">
                  <g className="circleGroup circleGroupInnerF">
                    {displayedTracks.map((track, index) => {
                      const fallbackOffset = `${(index + 0.5) * segmentPercent}%`;
                      const offset = offsetsInnerF[index] ?? fallbackOffset;
                      return (
                        <TrackLabel
                          key={`${track.id}-inner-f`}
                          className="circleLabel circleLabelInner circleLink"
                          dataRing="innerF"
                          dataIndex={index}
                            displayText={getDisplayTitle("innerF", index, getCircleTitle(track.title))}
                          hrefId="#trackCirclePathInnerF"
                          startOffset={offset}
                          onClick={
                            revealedLabels.innerF[index]
                              ? (event) => handleInnerClick(event, track.id)
                              : undefined
                          }
                        />
                      );
                    })}
                  </g>
                </g>
                <g className="circleGroupWrap">
                  <g className="circleGroup circleGroupInnerG">
                    {displayedTracks.map((track, index) => {
                      const fallbackOffset = `${(index + 0.5) * segmentPercent}%`;
                      const offset = offsetsInnerG[index] ?? fallbackOffset;
                      return (
                        <TrackLabel
                          key={`${track.id}-inner-g`}
                          className="circleLabel circleLabelInner circleLink"
                          dataRing="innerG"
                          dataIndex={index}
                            displayText={getDisplayTitle("innerG", index, getCircleTitle(track.title))}
                          hrefId="#trackCirclePathInnerG"
                          startOffset={offset}
                          onClick={
                            revealedLabels.innerG[index]
                              ? (event) => handleInnerClick(event, track.id)
                              : undefined
                          }
                        />
                      );
                    })}
                  </g>
                </g>
                <g className="circleGroupWrap">
                  <g className="circleGroup circleGroupInnerH">
                    {displayedTracks.map((track, index) => {
                      const fallbackOffset = `${(index + 0.5) * segmentPercent}%`;
                      const offset = offsetsInnerH[index] ?? fallbackOffset;
                      return (
                        <TrackLabel
                          key={`${track.id}-inner-h`}
                          className="circleLabel circleLabelInner circleLink"
                          dataRing="innerH"
                          dataIndex={index}
                            displayText={getDisplayTitle("innerH", index, getCircleTitle(track.title))}
                          hrefId="#trackCirclePathInnerH"
                          startOffset={offset}
                          onClick={
                            revealedLabels.innerH[index]
                              ? (event) => handleInnerClick(event, track.id)
                              : undefined
                          }
                        />
                      );
                    })}
                  </g>
                </g>
              </>
            )}
            {!rasterLayers && (
              <g className="circleMeasure" aria-hidden="true">
                <g className="circleGroup circleGroupInnerA">
                  {displayedTracks.map((track, index) => {
                    const fallbackOffset = `${(index + 0.5) * segmentPercent}%`;
                    const offset = offsetsInnerA[index] ?? fallbackOffset;
                    return (
                      <text key={`${track.id}-inner-a-measure`} className="circleLabel circleLabelInner">
                        <textPath
                          href="#trackCirclePathInnerA"
                          startOffset={offset}
                          ref={(node) => {
                            innerAMeasureRefs.current[index] = node;
                          }}
                        >
                          {track.title}
                        </textPath>
                      </text>
                    );
                  })}
                </g>
                <g className="circleGroup circleGroupInnerB">
                  {displayedTracks.map((track, index) => {
                    const fallbackOffset = `${(index + 0.5) * segmentPercent}%`;
                    const offset = offsetsInnerB[index] ?? fallbackOffset;
                    return (
                      <text key={`${track.id}-inner-b-measure`} className="circleLabel circleLabelInner">
                        <textPath
                          href="#trackCirclePathInnerB"
                          startOffset={offset}
                          ref={(node) => {
                            innerBMeasureRefs.current[index] = node;
                          }}
                        >
                          {track.title}
                        </textPath>
                      </text>
                    );
                  })}
                </g>
                <g className="circleGroup circleGroupInnerC">
                  {displayedTracks.map((track, index) => {
                    const fallbackOffset = `${(index + 0.5) * segmentPercent}%`;
                    const offset = offsetsInnerC[index] ?? fallbackOffset;
                    return (
                      <text key={`${track.id}-inner-c-measure`} className="circleLabel circleLabelInner">
                        <textPath
                          href="#trackCirclePathInnerC"
                          startOffset={offset}
                          ref={(node) => {
                            innerCMeasureRefs.current[index] = node;
                          }}
                        >
                          {track.title}
                        </textPath>
                      </text>
                    );
                  })}
                </g>
                <g className="circleGroup circleGroupInnerD">
                  {displayedTracks.map((track, index) => {
                    const fallbackOffset = `${(index + 0.5) * segmentPercent}%`;
                    const offset = offsetsInnerD[index] ?? fallbackOffset;
                    return (
                      <text key={`${track.id}-inner-d-measure`} className="circleLabel circleLabelInner">
                        <textPath
                          href="#trackCirclePathInnerD"
                          startOffset={offset}
                          ref={(node) => {
                            innerDMeasureRefs.current[index] = node;
                          }}
                        >
                          {track.title}
                        </textPath>
                      </text>
                    );
                  })}
                </g>
                <g className="circleGroup circleGroupInnerE">
                  {displayedTracks.map((track, index) => {
                    const fallbackOffset = `${(index + 0.5) * segmentPercent}%`;
                    const offset = offsetsInnerE[index] ?? fallbackOffset;
                    return (
                      <text key={`${track.id}-inner-e-measure`} className="circleLabel circleLabelInner">
                        <textPath
                          href="#trackCirclePathInnerE"
                          startOffset={offset}
                          ref={(node) => {
                            innerEMeasureRefs.current[index] = node;
                          }}
                        >
                          {track.title}
                        </textPath>
                      </text>
                    );
                  })}
                </g>
                <g className="circleGroup circleGroupInnerF">
                  {displayedTracks.map((track, index) => {
                    const fallbackOffset = `${(index + 0.5) * segmentPercent}%`;
                    const offset = offsetsInnerF[index] ?? fallbackOffset;
                    return (
                      <text key={`${track.id}-inner-f-measure`} className="circleLabel circleLabelInner">
                        <textPath
                          href="#trackCirclePathInnerF"
                          startOffset={offset}
                          ref={(node) => {
                            innerFMeasureRefs.current[index] = node;
                          }}
                        >
                          {track.title}
                        </textPath>
                      </text>
                    );
                  })}
                </g>
                <g className="circleGroup circleGroupInnerG">
                  {displayedTracks.map((track, index) => {
                    const fallbackOffset = `${(index + 0.5) * segmentPercent}%`;
                    const offset = offsetsInnerG[index] ?? fallbackOffset;
                    return (
                      <text key={`${track.id}-inner-g-measure`} className="circleLabel circleLabelInner">
                        <textPath
                          href="#trackCirclePathInnerG"
                          startOffset={offset}
                          ref={(node) => {
                            innerGMeasureRefs.current[index] = node;
                          }}
                        >
                          {track.title}
                        </textPath>
                      </text>
                    );
                  })}
                </g>
                <g className="circleGroup circleGroupInnerH">
                  {displayedTracks.map((track, index) => {
                    const fallbackOffset = `${(index + 0.5) * segmentPercent}%`;
                    const offset = offsetsInnerH[index] ?? fallbackOffset;
                    return (
                      <text key={`${track.id}-inner-h-measure`} className="circleLabel circleLabelInner">
                        <textPath
                          href="#trackCirclePathInnerH"
                          startOffset={offset}
                          ref={(node) => {
                            innerHMeasureRefs.current[index] = node;
                          }}
                        >
                          {track.title}
                        </textPath>
                      </text>
                    );
                  })}
                </g>
              </g>
            )}
          </svg>
        </div>
        </div>}
      </main>
    </>
  );
}
