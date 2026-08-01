"use client";

import React, { useEffect, useRef, useState } from "react";
import { MeshGradient, PulsingBorder } from "@paper-design/shaders-react";
import { motion } from "framer-motion";

export default function NeuralVortexBg() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const handleMouseEnter = () => setIsActive(true);
    const handleMouseLeave = () => setIsActive(false);

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mouseenter", handleMouseEnter);
      container.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (container) {
        container.removeEventListener("mouseenter", handleMouseEnter);
        container.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
      {/* SVG Filters for Glass/Gooey effects */}
      <svg className="absolute inset-0 w-0 h-0 invisible">
        <defs>
          <filter id="glass-effect" x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence baseFrequency="0.005" numOctaves="1" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.3" />
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0.02
                      0 1 0 0 0.02
                      0 0 1 0 0.05
                      0 0 0 0.9 0"
              result="tint"
            />
          </filter>
          <filter id="gooey-filter" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
              result="gooey"
            />
            <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* Primary Mesh Gradient - Fallback bg-black handles the base canvas */}
      <MeshGradient
        className="absolute inset-0 w-full h-full opacity-90 mix-blend-screen bg-black"
        colors={["#1a1514", "#8c6a5d", "#d9d0c7", "#4a3b32", "#110e0d"]}
        speed={0.15}
      />

      {/* Secondary Mesh for Depth */}
      <MeshGradient
        className="absolute inset-0 w-full h-full opacity-30 mix-blend-overlay bg-transparent"
        colors={["#000000", "#ffffff", "#8c6a5d", "#000000"]}
        speed={0.1}
      />

      {/* Pulsing Circle & Rotating Text (Bottom Right) */}
      <div className="absolute bottom-8 right-8 z-30 pointer-events-auto hidden md:block">
        <div className="relative w-24 h-24 flex items-center justify-center">
          {/* Pulsing Border Circle */}
          <PulsingBorder
            colors={["#BEECFF", "#E77EDC", "#FF4C3E", "#00FF88", "#FFD700", "#FF6B35", "#8A2BE2"]}
            colorBack="#00000000"
            speed={1.5}
            roundness={1}
            thickness={0.08}
            softness={0.2}
            intensity={5}
            spotSize={0.1}
            pulse={0.1}
            smoke={0.5}
            smokeSize={4}
            scale={0.65}
            rotation={0}
            frame={9161408.25}
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
            }}
          />

          {/* Rotating Text Around the Pulsing Border */}
          <motion.svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 100 100"
            animate={{ rotate: 360 }}
            transition={{
              duration: 25,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            style={{ transform: "scale(1.4)" }}
          >
            <defs>
              <path id="circle" d="M 50, 50 m -38, 0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
            </defs>
            <text className="text-[7.5px] fill-white/70 font-mono tracking-[0.1em] uppercase">
              <textPath href="#circle" startOffset="0%">
                Skill Edge OS • Future Builder • Skill Edge OS • Future Builder •
              </textPath>
            </text>
          </motion.svg>
        </div>
      </div>
    </div>
  );
}
