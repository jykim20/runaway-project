"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type MutableRefObject,
  type PointerEvent as ReactPointerEvent
} from "react";
import ParticleLayer from "./components/ParticleLayer";

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
  const circleGroupRefs = useRef<Array<HTMLElement | SVGElement | null>>([]);
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
  const outerRadius = 420;
  const padding = 24;
  const innerGap = 45;
  // Font sizes for inner rings
  const innerFontSizeA = 16;
  const innerFontSizeB = 13;
  const innerFontSizeC = 12;
  const innerFontSizeD = 11;
  const innerFontSizeE = 10;
  const innerFontSizeF = 9;
  const innerFontSizeG = 8;
  const innerFontSizeH = 7;
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

  useEffect(() => {
    revealedLabelsRef.current = revealedLabels;
  }, [revealedLabels]);

  useEffect(() => {
    const symbols = "!@#$%^&*+-=?:;<>[]{}~";
    const scrambleInterval = 90;
    setScrambleActive(true);
    setRasterLayers(null);
    let intervalId: number | null = null;

    const scrambleText = (text: string) =>
      text
        .split("")
        .map((char) => (char === " " ? " " : symbols[Math.floor(Math.random() * symbols.length)]))
        .join("");

    const updateTitles = () => {
      const revealed = revealedLabelsRef.current;
      const next = {
        outer: tracks.map((track, index) =>
          revealed.outer[index] ? track.title : scrambleText(track.title)
        ),
        innerA: tracks.map((track, index) =>
          revealed.innerA[index] ? track.title : scrambleText(track.title)
        ),
        innerB: tracks.map((track, index) =>
          revealed.innerB[index] ? track.title : scrambleText(track.title)
        ),
        innerC: tracks.map((track, index) =>
          revealed.innerC[index] ? track.title : scrambleText(track.title)
        ),
        innerD: tracks.map((track, index) =>
          revealed.innerD[index] ? track.title : scrambleText(track.title)
        ),
        innerE: tracks.map((track, index) =>
          revealed.innerE[index] ? track.title : scrambleText(track.title)
        ),
        innerF: tracks.map((track, index) =>
          revealed.innerF[index] ? track.title : scrambleText(track.title)
        ),
        innerG: tracks.map((track, index) =>
          revealed.innerG[index] ? track.title : scrambleText(track.title)
        ),
        innerH: tracks.map((track, index) =>
          revealed.innerH[index] ? track.title : scrambleText(track.title)
        )
      };
      setScrambledTitles((prev) => {
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

  // Assigns randomized pulse scale/speed/delay CSS variables to each ring wrapper. 
  useEffect(() => {
    const groups = circleGroupRefs.current.filter(
      (group): group is HTMLElement | SVGElement => Boolean(group)
    );
    if (!groups.length) return;

    const lastIndex = groups.length - 1;
    groups.forEach((group, index) => {
      const isOuter = index === 0;
      const isInnermost = index === lastIndex;
      const min = isOuter
        ? 1
        : (isInnermost ? 0.9 : 0.95) + Math.random() * 0.02;
      const max = isOuter
        ? 1
        : min + (isInnermost ? 0.1 : 0.06) + Math.random() * 0.02;
      const speed = 5 + Math.random() * 4;
      const delay = -Math.random() * speed;
      group.style.setProperty("--pulse-min", min.toFixed(3));
      group.style.setProperty("--pulse-max", max.toFixed(3));
      group.style.setProperty("--pulse-speed", `${speed.toFixed(2)}s`);
      group.style.setProperty("--pulse-delay", `${delay.toFixed(2)}s`);
    });
  }, [rasterLayers]);

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

  const handlePointerMove = (event: ReactPointerEvent<SVGSVGElement>) => {
    const target = (event.target as Element | null)?.closest?.("[data-ring]");
    if (!target) {
      if (hoveredLabel) setHoveredLabel(null);
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
      if (hoveredLabel) setHoveredLabel(null);
      return;
    }
    if (!hoveredLabel || hoveredLabel.ring !== ring || hoveredLabel.index !== index) {
      setHoveredLabel({ ring, index });
    }
    markRevealed(ring, index);
  };

  const resetScramble = () => {
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

  const handleOuterClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    trackId: string
  ) => {
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
    }, 500);
  };

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
            <div className="rasterStack" aria-hidden="true">
              <div
                className="rasterLayerWrap circleGroupWrap"
                ref={(node) => {
                  circleGroupRefs.current[0] = node;
                }}
              >
                <div className="rasterLayer rasterInnerA">
                  <img src={rasterLayers.innerA} alt="" />
                </div>
              </div>
              <div
                className="rasterLayerWrap circleGroupWrap"
                ref={(node) => {
                  circleGroupRefs.current[1] = node;
                }}
              >
                <div className="rasterLayer rasterInnerB">
                  <img src={rasterLayers.innerB} alt="" />
                </div>
              </div>
              <div
                className="rasterLayerWrap circleGroupWrap"
                ref={(node) => {
                  circleGroupRefs.current[2] = node;
                }}
              >
                <div className="rasterLayer rasterInnerC">
                  <img src={rasterLayers.innerC} alt="" />
                </div>
              </div>
              <div
                className="rasterLayerWrap circleGroupWrap"
                ref={(node) => {
                  circleGroupRefs.current[3] = node;
                }}
              >
                <div className="rasterLayer rasterInnerD">
                  <img src={rasterLayers.innerD} alt="" />
                </div>
              </div>
              <div
                className="rasterLayerWrap circleGroupWrap"
                ref={(node) => {
                  circleGroupRefs.current[4] = node;
                }}
              >
                <div className="rasterLayer rasterInnerE">
                  <img src={rasterLayers.innerE} alt="" />
                </div>
              </div>
              <div
                className="rasterLayerWrap circleGroupWrap"
                ref={(node) => {
                  circleGroupRefs.current[5] = node;
                }}
              >
                <div className="rasterLayer rasterInnerF">
                  <img src={rasterLayers.innerF} alt="" />
                </div>
              </div>
              <div
                className="rasterLayerWrap circleGroupWrap"
                ref={(node) => {
                  circleGroupRefs.current[6] = node;
                }}
              >
                <div className="rasterLayer rasterInnerG">
                  <img src={rasterLayers.innerG} alt="" />
                </div>
              </div>
              <div
                className="rasterLayerWrap circleGroupWrap"
                ref={(node) => {
                  circleGroupRefs.current[7] = node;
                }}
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
                          {revealedLabels.outer[index] ||
                          (hoveredLabel?.ring === "outer" && hoveredLabel.index === index)
                            ? track.title
                            : scrambledTitles.outer[index] ?? track.title}
                        </textPath>
                      </text>
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
                <g
                  className="circleGroupWrap"
                  ref={(node) => {
                    circleGroupRefs.current[0] = node;
                  }}
                >
                  <g className="circleGroup circleGroupInnerA">
                    {displayedTracks.map((track, index) => {
                      const fallbackOffset = `${(index + 0.5) * segmentPercent}%`;
                      const offset = offsetsInnerA[index] ?? fallbackOffset;
                      return (
                        <text
                          key={`${track.id}-inner-a`}
                          className="circleLabel circleLabelInner"
                          data-ring="innerA"
                          data-index={index}
                        >
                          <textPath
                            href="#trackCirclePathInnerA"
                            startOffset={offset}
                          >
                            {revealedLabels.innerA[index] ||
                            (hoveredLabel?.ring === "innerA" && hoveredLabel.index === index)
                              ? track.title
                              : scrambledTitles.innerA[index] ?? track.title}
                          </textPath>
                        </text>
                      );
                    })}
                  </g>
                </g>
                <g
                  className="circleGroupWrap"
                  ref={(node) => {
                    circleGroupRefs.current[1] = node;
                  }}
                >
                  <g className="circleGroup circleGroupInnerB">
                    {displayedTracks.map((track, index) => {
                      const fallbackOffset = `${(index + 0.5) * segmentPercent}%`;
                      const offset = offsetsInnerB[index] ?? fallbackOffset;
                      return (
                        <text
                          key={`${track.id}-inner-b`}
                          className="circleLabel circleLabelInner"
                          data-ring="innerB"
                          data-index={index}
                        >
                          <textPath
                            href="#trackCirclePathInnerB"
                            startOffset={offset}
                          >
                            {revealedLabels.innerB[index] ||
                            (hoveredLabel?.ring === "innerB" && hoveredLabel.index === index)
                              ? track.title
                              : scrambledTitles.innerB[index] ?? track.title}
                          </textPath>
                        </text>
                      );
                    })}
                  </g>
                </g>
                <g
                  className="circleGroupWrap"
                  ref={(node) => {
                    circleGroupRefs.current[2] = node;
                  }}
                >
                  <g className="circleGroup circleGroupInnerC">
                    {displayedTracks.map((track, index) => {
                      const fallbackOffset = `${(index + 0.5) * segmentPercent}%`;
                      const offset = offsetsInnerC[index] ?? fallbackOffset;
                      return (
                        <text
                          key={`${track.id}-inner-c`}
                          className="circleLabel circleLabelInner"
                          data-ring="innerC"
                          data-index={index}
                        >
                          <textPath
                            href="#trackCirclePathInnerC"
                            startOffset={offset}
                          >
                            {revealedLabels.innerC[index] ||
                            (hoveredLabel?.ring === "innerC" && hoveredLabel.index === index)
                              ? track.title
                              : scrambledTitles.innerC[index] ?? track.title}
                          </textPath>
                        </text>
                      );
                    })}
                  </g>
                </g>
                <g
                  className="circleGroupWrap"
                  ref={(node) => {
                    circleGroupRefs.current[3] = node;
                  }}
                >
                  <g className="circleGroup circleGroupInnerD">
                    {displayedTracks.map((track, index) => {
                      const fallbackOffset = `${(index + 0.5) * segmentPercent}%`;
                      const offset = offsetsInnerD[index] ?? fallbackOffset;
                      return (
                        <text
                          key={`${track.id}-inner-d`}
                          className="circleLabel circleLabelInner"
                          data-ring="innerD"
                          data-index={index}
                        >
                          <textPath
                            href="#trackCirclePathInnerD"
                            startOffset={offset}
                          >
                            {revealedLabels.innerD[index] ||
                            (hoveredLabel?.ring === "innerD" && hoveredLabel.index === index)
                              ? track.title
                              : scrambledTitles.innerD[index] ?? track.title}
                          </textPath>
                        </text>
                      );
                    })}
                  </g>
                </g>
                <g
                  className="circleGroupWrap"
                  ref={(node) => {
                    circleGroupRefs.current[4] = node;
                  }}
                >
                  <g className="circleGroup circleGroupInnerE">
                    {displayedTracks.map((track, index) => {
                      const fallbackOffset = `${(index + 0.5) * segmentPercent}%`;
                      const offset = offsetsInnerE[index] ?? fallbackOffset;
                      return (
                        <text
                          key={`${track.id}-inner-e`}
                          className="circleLabel circleLabelInner"
                          data-ring="innerE"
                          data-index={index}
                        >
                          <textPath
                            href="#trackCirclePathInnerE"
                            startOffset={offset}
                          >
                            {revealedLabels.innerE[index] ||
                            (hoveredLabel?.ring === "innerE" && hoveredLabel.index === index)
                              ? track.title
                              : scrambledTitles.innerE[index] ?? track.title}
                          </textPath>
                        </text>
                      );
                    })}
                  </g>
                </g>
                <g
                  className="circleGroupWrap"
                  ref={(node) => {
                    circleGroupRefs.current[5] = node;
                  }}
                >
                  <g className="circleGroup circleGroupInnerF">
                    {displayedTracks.map((track, index) => {
                      const fallbackOffset = `${(index + 0.5) * segmentPercent}%`;
                      const offset = offsetsInnerF[index] ?? fallbackOffset;
                      return (
                        <text
                          key={`${track.id}-inner-f`}
                          className="circleLabel circleLabelInner"
                          data-ring="innerF"
                          data-index={index}
                        >
                          <textPath
                            href="#trackCirclePathInnerF"
                            startOffset={offset}
                          >
                            {revealedLabels.innerF[index] ||
                            (hoveredLabel?.ring === "innerF" && hoveredLabel.index === index)
                              ? track.title
                              : scrambledTitles.innerF[index] ?? track.title}
                          </textPath>
                        </text>
                      );
                    })}
                  </g>
                </g>
                <g
                  className="circleGroupWrap"
                  ref={(node) => {
                    circleGroupRefs.current[6] = node;
                  }}
                >
                  <g className="circleGroup circleGroupInnerG">
                    {displayedTracks.map((track, index) => {
                      const fallbackOffset = `${(index + 0.5) * segmentPercent}%`;
                      const offset = offsetsInnerG[index] ?? fallbackOffset;
                      return (
                        <text
                          key={`${track.id}-inner-g`}
                          className="circleLabel circleLabelInner"
                          data-ring="innerG"
                          data-index={index}
                        >
                          <textPath
                            href="#trackCirclePathInnerG"
                            startOffset={offset}
                          >
                            {revealedLabels.innerG[index] ||
                            (hoveredLabel?.ring === "innerG" && hoveredLabel.index === index)
                              ? track.title
                              : scrambledTitles.innerG[index] ?? track.title}
                          </textPath>
                        </text>
                      );
                    })}
                  </g>
                </g>
                <g
                  className="circleGroupWrap"
                  ref={(node) => {
                    circleGroupRefs.current[7] = node;
                  }}
                >
                  <g className="circleGroup circleGroupInnerH">
                    {displayedTracks.map((track, index) => {
                      const fallbackOffset = `${(index + 0.5) * segmentPercent}%`;
                      const offset = offsetsInnerH[index] ?? fallbackOffset;
                      return (
                        <text
                          key={`${track.id}-inner-h`}
                          className="circleLabel circleLabelInner"
                          data-ring="innerH"
                          data-index={index}
                        >
                          <textPath
                            href="#trackCirclePathInnerH"
                            startOffset={offset}
                          >
                            {revealedLabels.innerH[index] ||
                            (hoveredLabel?.ring === "innerH" && hoveredLabel.index === index)
                              ? track.title
                              : scrambledTitles.innerH[index] ?? track.title}
                          </textPath>
                        </text>
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
      </div>
    </main>
  );
}
