"use client";

import { useEffect, useRef, useState } from "react";

export default function LampLogin() {
  const [isOn, setIsOn] = useState(false);
  const [hue, setHue] = useState(320);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const lampRef = useRef(null);
  const dummyCordRef = useRef(null);
  const hitRef = useRef(null);
  const audioRef = useRef(null);
  const gsapLoadedRef = useRef(false);

  useEffect(() => {
    if (gsapLoadedRef.current) return;

    audioRef.current = new Audio("https://assets.codepen.io/605876/click.mp3");

    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    };

    const initAnimation = async () => {
      try {
        await loadScript("https://unpkg.co/gsap@3/dist/gsap.min.js");
        await loadScript("https://unpkg.com/gsap@3/dist/Draggable.min.js");
        await loadScript(
          "https://assets.codepen.io/16327/MorphSVGPlugin3.min.js"
        );

        gsapLoadedRef.current = true;
        setTimeout(initGSAP, 100);
      } catch (error) {
        console.error("Failed to load GSAP:", error);
      }
    };

    initAnimation();
  }, []);

  const initGSAP = () => {
    if (!window.gsap || !window.MorphSVGPlugin || !window.Draggable) return;

    const { gsap } = window;
    const { registerPlugin, set, to, timeline } = gsap;
    registerPlugin(window.MorphSVGPlugin);

    const CORDS = gsap.utils.toArray(".cords path");
    const DUMMY_CORD = dummyCordRef.current;
    const HIT = hitRef.current;
    const ENDX = 124;
    const ENDY = 348;
    const CORD_DURATION = 0.1;

    let startX, startY;
    let currentState = false;
    const PROXY = document.createElement("div");

    set([".cords", HIT], { x: -10 });
    set(".lamp__eye", {
      rotate: 180,
      transformOrigin: "50% 50%",
      yPercent: 50,
    });

    const RESET = () => {
      set(PROXY, { x: ENDX, y: ENDY });
    };

    RESET();

    const CORD_TL = timeline({
      paused: true,
      onStart: () => {
        currentState = !currentState;
        const newHue = Math.floor(Math.random() * 360);

        setIsOn(currentState);
        setHue(newHue);

        set(document.documentElement, { "--on": currentState ? 1 : 0 });
        set(document.documentElement, { "--shade-hue": newHue });
        set(document.documentElement, {
          "--glow-color": `hsl(${newHue}, 40%, 45%)`,
        });
        set(document.documentElement, {
          "--glow-color-dark": `hsl(${newHue}, 40%, 35%)`,
        });

        set(".lamp__eye", { rotate: currentState ? 0 : 180 });
        set([DUMMY_CORD, HIT], { display: "none" });
        set(CORDS[0], { display: "block" });

        if (audioRef.current) {
          audioRef.current.play().catch(() => {});
        }
      },
      onComplete: () => {
        set([DUMMY_CORD, HIT], { display: "block" });
        set(CORDS[0], { display: "none" });
        RESET();
      },
    });

    for (let i = 1; i < CORDS.length; i++) {
      CORD_TL.add(
        to(CORDS[0], {
          morphSVG: CORDS[i],
          duration: CORD_DURATION,
          repeat: 1,
          yoyo: true,
        })
      );
    }

    window.Draggable.create(PROXY, {
      trigger: HIT,
      type: "x,y",
      onPress: (e) => {
        startX = e.x;
        startY = e.y;
      },
      onDrag: function () {
        set(DUMMY_CORD, {
          attr: {
            x2: this.x,
            y2: Math.max(400, this.y),
          },
        });
      },
      onRelease: function (e) {
        const DISTX = Math.abs(e.x - startX);
        const DISTY = Math.abs(e.y - startY);
        const TRAVELLED = Math.sqrt(DISTX * DISTX + DISTY * DISTY);
        to(DUMMY_CORD, {
          attr: { x2: ENDX, y2: ENDY },
          duration: CORD_DURATION,
          onComplete: () => {
            if (TRAVELLED > 50) {
              CORD_TL.restart();
            } else {
              RESET();
            }
          },
        });
      },
    });

    set(".lamp", { display: "block" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Login submitted!\nUsername: ${username}\nPassword: ${password}`);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-[#121921] p-8"
      style={{
        "--on": isOn ? 1 : 0,
        "--shade-hue": hue,
        "--glow-color": `hsl(${hue}, 40%, 45%)`,
        "--glow-color-dark": `hsl(${hue}, 40%, 35%)`,
      }}
    >
      <style jsx>{`
        .lamp {
          height: 40vmin;
          overflow: visible !important;
          display: none;
        }
        .cord {
          stroke: hsl(210, 0%, ${40 + (isOn ? 50 : 0)}%);
        }
        .cord--rig {
          display: none;
        }
        .lamp__tongue {
          fill: #e06952;
        }
        .lamp__hit {
          cursor: pointer;
          opacity: 0;
        }
        .lamp__feature {
          fill: #0a0a0a;
        }
        .lamp__stroke {
          stroke: #0a0a0a;
        }
        .lamp__mouth,
        .lamp__light {
          opacity: ${isOn ? 1 : 0};
        }
        .shade__opening {
          fill: hsl(50, ${10 + (isOn ? 80 : 0)}%, ${20 + (isOn ? 70 : 0)}%);
        }
        .shade__opening-shade {
          opacity: ${isOn ? 0 : 1};
        }
        .post__body {
          fill: hsl(210, 0%, ${20 + (isOn ? 40 : 0)}%);
        }
        .base__top {
          fill: hsl(210, 0%, ${40 + (isOn ? 40 : 0)}%);
        }
        .base__side {
          fill: hsl(210, 0%, ${20 + (isOn ? 40 : 0)}%);
        }
        .top__body {
          fill: hsl(${hue}, ${isOn ? 20 : 0}%, ${isOn ? 30 : 10}%);
        }
      `}</style>

      <div className="flex items-center justify-center gap-[8vmin] flex-wrap">
        <svg
          ref={lampRef}
          className="lamp"
          viewBox="0 0 333 484"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g className="lamp__shade shade">
            <ellipse
              className="shade__opening"
              cx="165"
              cy="220"
              rx="130"
              ry="20"
            />
            <ellipse
              className="shade__opening-shade"
              cx="165"
              cy="220"
              rx="130"
              ry="20"
              fill="url(#opening-shade)"
            />
          </g>
          <g className="lamp__base base">
            <path
              className="base__side"
              d="M165 464c44.183 0 80-8.954 80-20v-14h-22.869c-14.519-3.703-34.752-6-57.131-6-22.379 0-42.612 2.297-57.131 6H85v14c0 11.046 35.817 20 80 20z"
            />
            <path
              d="M165 464c44.183 0 80-8.954 80-20v-14h-22.869c-14.519-3.703-34.752-6-57.131-6-22.379 0-42.612 2.297-57.131 6H85v14c0 11.046 35.817 20 80 20z"
              fill="url(#side-shading)"
            />
            <ellipse className="base__top" cx="165" cy="430" rx="80" ry="20" />
            <ellipse
              cx="165"
              cy="430"
              rx="80"
              ry="20"
              fill="url(#base-shading)"
            />
          </g>
          <g className="lamp__post post">
            <path
              className="post__body"
              d="M180 142h-30v286c0 3.866 6.716 7 15 7 8.284 0 15-3.134 15-7V142z"
            />
            <path
              d="M180 142h-30v286c0 3.866 6.716 7 15 7 8.284 0 15-3.134 15-7V142z"
              fill="url(#post-shading)"
            />
          </g>
          <g className="lamp__cords cords">
            <path
              className="cord cord--rig"
              d="M124 187.033V347"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <path
              className="cord cord--rig"
              d="M124 187.023s17.007 21.921 17.007 34.846c0 12.925-11.338 23.231-17.007 34.846-5.669 11.615-17.007 21.921-17.007 34.846 0 12.925 17.007 34.846 17.007 34.846"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <path
              className="cord cord--rig"
              d="M124 187.017s-21.259 17.932-21.259 30.26c0 12.327 14.173 20.173 21.259 30.26 7.086 10.086 21.259 17.933 21.259 30.26 0 12.327-21.259 30.26-21.259 30.26"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <path
              className="cord cord--rig"
              d="M124 187s29.763 8.644 29.763 20.735-19.842 13.823-29.763 20.734c-9.921 6.912-29.763 8.644-29.763 20.735S124 269.939 124 269.939"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <path
              className="cord cord--rig"
              d="M124 187.029s-10.63 26.199-10.63 39.992c0 13.794 7.087 26.661 10.63 39.992 3.543 13.331 10.63 26.198 10.63 39.992 0 13.793-10.63 39.992-10.63 39.992"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <path
              className="cord cord--rig"
              d="M124 187.033V347"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <line
              ref={dummyCordRef}
              className="cord cord--dummy"
              x1="124"
              y2="348"
              x2="124"
              y1="190"
              strokeWidth="6"
              strokeLinecap="round"
            />
          </g>
          <path
            className="lamp__light"
            d="M290.5 193H39L0 463.5c0 11.046 75.478 20 165.5 20s167-11.954 167-23l-42-267.5z"
            fill="url(#light)"
          />
          <g className="lamp__top top">
            <path
              className="top__body"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M164.859 0c55.229 0 100 8.954 100 20l29.859 199.06C291.529 208.451 234.609 200 164.859 200S38.189 208.451 35 219.06L64.859 20c0-11.046 44.772-20 100-20z"
            />
            <path
              className="top__shading"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M164.859 0c55.229 0 100 8.954 100 20l29.859 199.06C291.529 208.451 234.609 200 164.859 200S38.189 208.451 35 219.06L64.859 20c0-11.046 44.772-20 100-20z"
              fill="url(#top-shading)"
            />
          </g>
          <g className="lamp__face face">
            <g className="lamp__mouth">
              <path
                d="M165 178c19.882 0 36-16.118 36-36h-72c0 19.882 16.118 36 36 36z"
                fill="#141414"
              />
              <clipPath className="lamp__feature" id="mouth">
                <path
                  d="M165 178c19.882 0 36-16.118 36-36h-72c0 19.882 16.118 36 36 36z"
                  fill="#141414"
                />
              </clipPath>
              <g clipPath="url(#mouth)">
                <circle className="lamp__tongue" cx="179.4" cy="172.6" r="18" />
              </g>
            </g>
            <g className="lamp__eyes">
              <path
                className="lamp__eye lamp__stroke"
                d="M115 135c0-5.523-5.82-10-13-10s-13 4.477-13 10"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                className="lamp__eye lamp__stroke"
                d="M241 135c0-5.523-5.82-10-13-10s-13 4.477-13 10"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </g>
          <defs>
            <linearGradient
              id="opening-shade"
              x1="35"
              y1="220"
              x2="295"
              y2="220"
              gradientUnits="userSpaceOnUse"
            >
              <stop />
              <stop offset="1" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id="base-shading"
              x1="85"
              y1="444"
              x2="245"
              y2="444"
              gradientUnits="userSpaceOnUse"
            >
              <stop
                stopColor={`hsla(45, 0%, ${50 + (isOn ? 50 : 0)}%, 0.85)`}
              />
              <stop
                offset="0.8"
                stopColor={`hsla(45, 0%, ${20 + (isOn ? 30 : 0)}%, 0.25)`}
                stopOpacity="0"
              />
            </linearGradient>
            <linearGradient
              id="side-shading"
              x1="119"
              y1="430"
              x2="245"
              y2="430"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor={`hsla(45, 0%, ${20 + (isOn ? 30 : 0)}%, 0.5)`} />
              <stop
                offset="1"
                stopColor={`hsla(45, 0%, ${20 + (isOn ? 30 : 0)}%, 0.25)`}
                stopOpacity="0"
              />
            </linearGradient>
            <linearGradient
              id="post-shading"
              x1="150"
              y1="288"
              x2="180"
              y2="288"
              gradientUnits="userSpaceOnUse"
            >
              <stop
                stopColor={`hsla(45, 0%, ${50 + (isOn ? 50 : 0)}%, 0.85)`}
              />
              <stop
                offset="1"
                stopColor={`hsla(45, 0%, ${20 + (isOn ? 30 : 0)}%, 0.25)`}
                stopOpacity="0"
              />
            </linearGradient>
            <linearGradient
              id="light"
              x1="165.5"
              y1="218.5"
              x2="165.5"
              y2="483.5"
              gradientUnits="userSpaceOnUse"
            >
              <stop
                stopColor={`hsla(45, ${isOn ? 20 : 0}%, ${
                  50 + (isOn ? 50 : 0)
                }%, 0.85)`}
                stopOpacity=".2"
              />
              <stop
                offset="1"
                stopColor={`hsla(45, ${isOn ? 20 : 0}%, ${
                  50 + (isOn ? 50 : 0)
                }%, 0.85)`}
                stopOpacity="0"
              />
            </linearGradient>
            <linearGradient
              id="top-shading"
              x1="56"
              y1="110"
              x2="295"
              y2="110"
              gradientUnits="userSpaceOnUse"
            >
              <stop
                stopColor={`hsl(${hue}, ${isOn ? 20 : 0}%, ${
                  30 + (isOn ? 60 : 0)
                }%)`}
                stopOpacity=".8"
              />
              <stop
                offset="1"
                stopColor={`hsl(${hue}, ${isOn ? 20 : 0}%, ${
                  20 + (isOn ? 35 : 0)
                }%)`}
                stopOpacity="0"
              />
            </linearGradient>
          </defs>
          <circle
            ref={hitRef}
            className="lamp__hit"
            cx="124"
            cy="347"
            r="66"
            fill="#C4C4C4"
            fillOpacity=".1"
          />
        </svg>

        <div
          className={`bg-[rgba(18,25,33,0.9)] p-12 rounded-[20px] min-w-[320px] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] border-2 ${
            isOn
              ? "opacity-100 scale-100 translate-y-0 pointer-events-auto shadow-[0_0_15px_rgba(255,255,255,0.1),0_0_30px_var(--glow-color),inset_0_0_15px_rgba(255,255,255,0.05)]"
              : "opacity-0 scale-[0.8] translate-y-5 pointer-events-none shadow-none"
          }`}
          style={{
            borderColor: isOn ? `var(--glow-color)` : "transparent",
          }}
        >
          <h2
            className="text-white text-4xl m-0 mb-8 text-center"
            style={{ textShadow: "0 0 8px var(--glow-color)" }}
          >
            Welcome Back
          </h2>
          <div>
            <div className="mb-6">
              <label
                htmlFor="username"
                className="block text-[#aaa] text-sm mb-2"
                style={{ textShadow: "0 0 5px var(--glow-color)" }}
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-[rgba(255,255,255,0.05)] border-2 border-[rgba(255,255,255,0.1)] rounded-[10px] text-white text-base transition-all duration-300 focus:outline-none focus:bg-[rgba(255,255,255,0.08)] placeholder:text-[#666]"
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--glow-color)";
                  e.target.style.boxShadow = "0 0 10px var(--glow-color)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(255, 255, 255, 0.1)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-[#aaa] text-sm mb-2"
                style={{ textShadow: "0 0 5px var(--glow-color)" }}
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[rgba(255,255,255,0.05)] border-2 border-[rgba(255,255,255,0.1)] rounded-[10px] text-white text-base transition-all duration-300 focus:outline-none focus:bg-[rgba(255,255,255,0.08)] placeholder:text-[#666]"
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--glow-color)";
                  e.target.style.boxShadow = "0 0 10px var(--glow-color)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(255, 255, 255, 0.1)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full py-3.5 border-none rounded-[10px] text-white text-base font-semibold cursor-pointer transition-all duration-300 mt-2 shadow-[0_4px_15px_rgba(0,0,0,0.2)] hover:translate-y-[-2px] hover:shadow-[0_6px_20px_rgba(0,0,0,0.3),0_0_20px_var(--glow-color)] active:translate-y-0"
              style={{
                background: `linear-gradient(135deg, var(--glow-color), var(--glow-color-dark))`,
              }}
            >
              Login
            </button>
            <div className="mt-6 text-center">
              <a
                href="#"
                className="text-[#888] text-sm no-underline transition-all duration-300 hover:text-[var(--glow-color)]"
                onMouseEnter={(e) => {
                  e.target.style.color = "var(--glow-color)";
                  e.target.style.textShadow = "0 0 10px var(--glow-color)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = "#888";
                  e.target.style.textShadow = "none";
                }}
              >
                Forgot Password?
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
