"use client";

import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";

type CountUpProps = {
  value: number;
  format?: (n: number) => string;
  className?: string;
};

/** عدّاد رقمي متحرك يعمل عند ظهور العنصر في الشاشة */
export default function CountUp({ value, format, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { stiffness: 60, damping: 18 });

  useEffect(() => {
    if (inView) motionVal.set(value);
  }, [inView, value, motionVal]);

  useEffect(() => {
    const unsubscribe = spring.on("change", (v) => {
      if (ref.current) {
        ref.current.textContent = format
          ? format(v)
          : new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }).format(v);
      }
    });
    return unsubscribe;
  }, [spring, format]);

  return (
    <span ref={ref} className={className}>
      0
    </span>
  );
}
