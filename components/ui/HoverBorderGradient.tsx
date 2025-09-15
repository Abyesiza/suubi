"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Direction = "TOP" | "LEFT" | "BOTTOM" | "RIGHT";

type HoverBorderGradientProps = React.PropsWithChildren<
  {
    as?: React.ElementType;
    containerClassName?: string;
    className?: string;
    duration?: number;
    clockwise?: boolean;
    baseColor?: string; // base highlight color (default green)
    hoverColor?: string; // hover highlight color (default orange)
  } & React.HTMLAttributes<HTMLElement>
>;

export function HoverBorderGradient({
  children,
  containerClassName,
  className,
  as: Tag = "button",
  duration = 1,
  clockwise = true,
  baseColor = "#2E8B57", // Suubi green
  hoverColor = "#F7941D", // Brand orange/mustard
  ...props
}: HoverBorderGradientProps) {
  const [hovered, setHovered] = useState<boolean>(false);
  const [direction, setDirection] = useState<Direction>("TOP");

  const rotateDirection = (currentDirection: Direction): Direction => {
    const directions: Direction[] = ["TOP", "LEFT", "BOTTOM", "RIGHT"];
    const currentIndex = directions.indexOf(currentDirection);
    const nextIndex = clockwise
      ? (currentIndex - 1 + directions.length) % directions.length
      : (currentIndex + 1) % directions.length;
    return directions[nextIndex];
  };

  const movingMap: Record<Direction, string> = {
    TOP: `radial-gradient(20.7% 50% at 50% 0%, ${baseColor} 0%, rgba(46, 139, 87, 0) 100%)`,
    LEFT: `radial-gradient(16.6% 43.1% at 0% 50%, ${hoverColor} 0%, rgba(247, 148, 29, 0) 100%)`,
    BOTTOM: `radial-gradient(20.7% 50% at 50% 100%, ${baseColor} 0%, rgba(46, 139, 87, 0) 100%)`,
    RIGHT: `radial-gradient(16.2% 41.2% at 100% 50%, ${hoverColor} 0%, rgba(247, 148, 29, 0) 100%)`,
  };

  const highlight = `radial-gradient(75% 181% at 50% 50%, ${hoverColor} 0%, rgba(247, 148, 29, 0) 100%)`;

  useEffect(() => {
    if (!hovered) {
      const interval = setInterval(() => {
        setDirection((prevState) => rotateDirection(prevState));
      }, duration * 1000);
      return () => clearInterval(interval);
    }
  }, [hovered]);

  return (
    <Tag
      onMouseEnter={(event: React.MouseEvent<HTMLDivElement>) => {
        setHovered(true);
      }}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "relative flex rounded-full border content-center bg-white/90 hover:bg-white transition duration-500 dark:bg-gray-900/90 dark:hover:bg-gray-900 items-center flex-col flex-nowrap gap-10 h-min justify-center overflow-visible p-px decoration-clone w-fit",
        containerClassName
      )}
      {...props}
    >
      <div
        className={cn(
          "w-auto z-10 px-4 py-2 rounded-[inherit] bg-white text-gray-800 dark:bg-gray-900 dark:text-white transition-colors duration-300",
          className
        )}
      >
        {children}
      </div>
      
      <motion.div
        className={cn(
          "flex-none inset-0 overflow-hidden absolute z-0 rounded-[inherit]"
        )}
        style={{
          filter: "blur(2px)",
          position: "absolute",
          width: "100%",
          height: "100%",
        }}
        initial={{ background: movingMap[direction] }}
        animate={{
          background: hovered
            ? [movingMap[direction], highlight]
            : movingMap[direction],
        }}
        transition={{ ease: "linear", duration: duration ?? 1 }}
      />
      
      <div 
        className="bg-white dark:bg-gray-900 absolute z-1 flex-none inset-[2px] rounded-[100px]"
      />
    </Tag>
  );
}
