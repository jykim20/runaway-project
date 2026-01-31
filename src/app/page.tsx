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
      "Keep your breath close to the light",
      "Count the steps between the doors",
      "If the hallway turns to water",
      "Swim it back to where you were"
    ]
  },
  {
    id: "lock-pick",
    title: "Lock Pick",
    lyrics: [
      "Tin sound, soft sparks, silent key",
      "Every latch is listening",
      "The night leans in, the metal sings",
      "We leave no trace, no name, no ring"
    ]
  },
  {
    id: "have-fun",
    title: "Have Fun",
    lyrics: [
      "Laugh in the dark, off the grid",
      "Run in the rain, barefooted",
      "If we get caught, just say we won",
      "No map tonight, just have fun"
    ]
  },
  {
    id: "off-bones",
    title: "Off Bones",
    lyrics: [
      "We are lighter than the names we wear",
      "We are wind caught in the stairs",
      "Lose the weight of every word",
      "Let the marrow learn to turn"
    ]
  },
  {
    id: "eraser",
    title: "Eraser",
    lyrics: [
      "Soft dust on your sleeve again",
      "Erase the line, redraw the end",
      "If I disappear in chalk",
      "Trace me back with your own walk"
    ]
  },
  {
    id: "forbidden-fruit",
    title: "Forbidden Fruit (Interlude)",
    lyrics: [
      "Bitten light and sugar dark",
      "Garden gates without a guard",
      "Hold the fire, taste the proof",
      "I’m the bruise, you’re the truth"
    ]
  },
  {
    id: "helium",
    title: "Helium",
    lyrics: [
      "Voice goes thin, balloon heart",
      "Float the room, pull apart",
      "If the ceiling lets us go",
      "We will never come down slow"
    ]
  },
  {
    id: "afraid",
    title: "What are you afraid of?",
    lyrics: [
      "Shadows singing in the sink",
      "Creaks that sound like second thoughts",
      "Every mirror tells on us",
      "Every window keeps our dots"
    ]
  },
  {
    id: "seoul",
    title: "Seoul (Bonus)",
    lyrics: [
      "Neon rain on Han River",
      "Taxi lights like falling stars",
      "We fold time on narrow streets",
      "Home is where the echoes are"
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
  const [scrambledTitles, setScrambledTitles] = useState(() => ({
    outer: tracks.map((track) => track.title),
    innerA: tracks.map((track) => track.title),
    innerB: tracks.map((track) => track.title),
    innerC: tracks.map((track) => track.title)
  }));
  const [scrambleActive, setScrambleActive] = useState(true);
  const [hoveredLabel, setHoveredLabel] = useState<{
    ring: "outer" | "innerA" | "innerB" | "innerC";
    index: number;
  } | null>(null);
  const [revealedLabels, setRevealedLabels] = useState(() => ({
    outer: Array(tracks.length).fill(false) as boolean[],
    innerA: Array(tracks.length).fill(false) as boolean[],
    innerB: Array(tracks.length).fill(false) as boolean[],
    innerC: Array(tracks.length).fill(false) as boolean[]
  }));
  const revealedLabelsRef = useRef(revealedLabels);
  // Refs for <textPath> nodes per ring so text lengths can be measured
  const outerRefs = useRef<Array<SVGTextPathElement | null>>([]);
  const innerARefs = useRef<Array<SVGTextPathElement | null>>([]);
  const innerBRefs = useRef<Array<SVGTextPathElement | null>>([]);
  const innerCRefs = useRef<Array<SVGTextPathElement | null>>([]);
  const outerMeasureRefs = useRef<Array<SVGTextPathElement | null>>([]);
  const innerAMeasureRefs = useRef<Array<SVGTextPathElement | null>>([]);
  const innerBMeasureRefs = useRef<Array<SVGTextPathElement | null>>([]);
  const innerCMeasureRefs = useRef<Array<SVGTextPathElement | null>>([]);
  const circleGroupRefs = useRef<Array<HTMLElement | SVGElement | null>>([]);
  // State for rasterized SVG layers (inner A/B/C)
  const svgRef = useRef<SVGSVGElement | null>(null);
  const fontDataRef = useRef<string | null>(null);
  const [rasterLayers, setRasterLayers] = useState<{
    innerA: string;
    innerB: string;
    innerC: string;
  } | null>(null);
  // Base geometry
  const outerRadius = 240;
  const padding = 24;
  const innerGap = 52;
  // Font sizes for inner rings
  const innerFontSizeA = 16;
  const innerFontSizeB = 12;
  const innerFontSizeC = 8;
  // Radii for inner rings computed from outer radius and gaps
  const innerRadiusA = outerRadius - innerGap;
  const innerRadiusB = outerRadius - innerGap * 2;
  const innerRadiusC = outerRadius - innerGap * 3;
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
        )
      };
      setScrambledTitles((prev) => {
        const same =
          prev.outer.join("") === next.outer.join("") &&
          prev.innerA.join("") === next.innerA.join("") &&
          prev.innerB.join("") === next.innerB.join("") &&
          prev.innerC.join("") === next.innerC.join("");
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
      if (!nextInnerA || !nextInnerB || !nextInnerC) return;
      setOffsetsOuter(nextOuter);
      setOffsetsInnerA(nextInnerA);
      setOffsetsInnerB(nextInnerB);
      setOffsetsInnerC(nextInnerC);
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
  }, [innerRadiusA, innerRadiusB, innerRadiusC, outerRadius, rasterLayers]);

  // Assigns randomized pulse scale/speed/delay CSS variables to each ring wrapper. 
  useEffect(() => {
    const groups = circleGroupRefs.current.filter(
      (group): group is HTMLElement | SVGElement => Boolean(group)
    );
    if (!groups.length) return;

    groups.forEach((group, index) => {
      const isOuter = index === 0;
      const isInnermost = index === 2;
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
  }, [innerFontSizeA, innerFontSizeB, innerFontSizeC]);

  // Rasterizes the inner rings into images once the SVG is ready and text offsets are computed
  useEffect(() => {
    if (scrambleActive) return;
    if (rasterLayers) return;
    if (!svgRef.current) return;
    if (!offsetsInnerA.length || !offsetsInnerB.length || !offsetsInnerC.length) return;

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
      `.trim();
      clone.prepend(style);
      const svgString = serializer.serializeToString(clone);
      return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
    };

    let isCancelled = false;
    const run = async () => {
      const [innerA, innerB, innerC] = await Promise.all([
        buildLayer("circleGroupInnerA"),
        buildLayer("circleGroupInnerB"),
        buildLayer("circleGroupInnerC")
      ]);
      if (isCancelled) return;
      setRasterLayers({ innerA, innerB, innerC });
    };
    run();
    return () => {
      isCancelled = true;
    };
  }, [offsetsInnerA.length, offsetsInnerB.length, offsetsInnerC.length, rasterLayers, scrambleActive]);

  const markRevealed = (
    ring: "outer" | "innerA" | "innerB" | "innerC",
    index: number
  ) => {
    setRevealedLabels((prev) => {
      if (prev[ring][index]) return prev;
      const next = {
        outer: [...prev.outer],
        innerA: [...prev.innerA],
        innerB: [...prev.innerB],
        innerC: [...prev.innerC]
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

  const size = outerRadius * 2 + padding * 2;

  return (
    <main className="page">
      {/* <ParticleLayer className="particleLayer" /> */}

      <div className="layout">
        <div
          className="circleWrap"
          style={
            {
              "--circle-size": `${size}px`,
              "--inner-font-size-a": `${innerFontSizeA}px`,
              "--inner-font-size": `${innerFontSizeB}px`,
              "--inner-font-size-c": `${innerFontSizeC}px`
            } as CSSProperties
          }
        >
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
              </g>
            )}
          </svg>
        </div>
      </div>
    </main>
  );
}
