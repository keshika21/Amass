import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

export default function CountUp({ value, decimals = 2 }) {
  const motionVal = useMotionValue(0);
  const rounded = useTransform(motionVal, (v) => v.toFixed(decimals));
  const ref = useRef(null);

  useEffect(() => {
    const controls = animate(motionVal, Number(value) || 0, { duration: 1, ease: 'easeOut' });
    return controls.stop;
  }, [value]);

  useEffect(() => rounded.on('change', (v) => { if (ref.current) ref.current.textContent = v; }), [rounded]);

  return <span ref={ref}>0.00</span>;
}