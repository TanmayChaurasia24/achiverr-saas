
import { motion } from "framer-motion";
import React from "react";

type FadeProps = {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
  once?: boolean;
};

export function FadeIn({ 
  children, 
  delay = 0, 
  duration = 0.5, 
  className = "", 
  direction = "up", 
  distance = 20,
  once = true
}: FadeProps) {
  const getDirectionOffset = () => {
    switch (direction) {
      case "up": return { y: distance };
      case "down": return { y: -distance };
      case "left": return { x: distance };
      case "right": return { x: -distance };
      default: return {};
    }
  };

  return (
    <motion.div
      initial={{ 
        opacity: 0,
        ...getDirectionOffset()
      }}
      whileInView={{ 
        opacity: 1,
        x: 0,
        y: 0,
        transition: {
          duration,
          delay,
          ease: "easeOut"
        }
      }}
      viewport={{ once }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function ScaleIn({
  children,
  delay = 0,
  duration = 0.5,
  className = "",
  once = true
}: Omit<FadeProps, "direction" | "distance">) {
  return (
    <motion.div
      initial={{ 
        opacity: 0,
        scale: 0.95
      }}
      whileInView={{ 
        opacity: 1,
        scale: 1,
        transition: {
          duration,
          delay,
          ease: "easeOut"
        }
      }}
      viewport={{ once }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({
  children,
  delay = 0,
  staggerDelay = 0.1,
  className = "",
  once = true
}: {
  children: React.ReactNode;
  delay?: number;
  staggerDelay?: number;
  className?: string;
  once?: boolean;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            delayChildren: delay,
            staggerChildren: staggerDelay
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  direction = "up",
  distance = 20,
  className = ""
}: Omit<FadeProps, "delay" | "duration" | "once">) {
  const getDirectionOffset = () => {
    switch (direction) {
      case "up": return { y: distance };
      case "down": return { y: -distance };
      case "left": return { x: distance };
      case "right": return { x: -distance };
      default: return {};
    }
  };

  return (
    <motion.div
      variants={{
        hidden: { 
          opacity: 0,
          ...getDirectionOffset()
        },
        visible: { 
          opacity: 1,
          x: 0,
          y: 0,
          transition: {
            duration: 0.5,
            ease: "easeOut"
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedGradient({ 
  className 
}: { 
  className?: string 
}) {
  return (
    <motion.div
      className={`absolute inset-0 -z-10 ${className}`}
      animate={{
        background: [
          "radial-gradient(circle at 20% 30%, rgba(123, 97, 255, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(97, 218, 251, 0.15) 0%, transparent 50%)",
          "radial-gradient(circle at 70% 20%, rgba(123, 97, 255, 0.15) 0%, transparent 50%), radial-gradient(circle at 30% 80%, rgba(97, 218, 251, 0.15) 0%, transparent 50%)",
          "radial-gradient(circle at 20% 30%, rgba(123, 97, 255, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(97, 218, 251, 0.15) 0%, transparent 50%)",
        ]
      }}
      transition={{
        duration: 15,
        repeat: Infinity,
        ease: "linear"
      }}
    />
  );
}

export function HoverCard({ 
  children,
  className = "" 
}: { 
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      whileHover={{ 
        y: -5,
        transition: { duration: 0.2 }
      }}
      whileTap={{ 
        y: 0, 
        scale: 0.98,
        transition: { duration: 0.2 }
      }}
    >
      {children}
    </motion.div>
  );
}
