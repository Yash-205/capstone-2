'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function MouseTrail() {
  const [cursorXY, setCursorXY] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const moveCursor = (e) => {
      setCursorXY({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e) => {
      // Only trigger hover state for actual interactive elements, not images
      const target = e.target;
      if (target.tagName === 'IMG') {
        setIsHovering(false);
      } else if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('button') || target.closest('a') || target.tagName === 'INPUT') {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);
    document.body.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Main cursor dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        animate={{
          x: cursorXY.x - 6,
          y: cursorXY.y - 6,
          scale: isHovering ? 0.5 : 1,
          backgroundColor: isHovering ? '#ffffff' : '#f1c40f',
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 25,
          mass: 0.5
        }}
        style={{
          width: 12,
          height: 12,
          borderRadius: '50%',
          boxShadow: isHovering ? '0 0 15px rgba(255, 255, 255, 0.8)' : '0 0 20px rgba(241, 196, 15, 0.9)',
        }}
      />
      
      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full"
        animate={{
          x: cursorXY.x - 20,
          y: cursorXY.y - 20,
          scale: isHovering ? 1.5 : 1,
          opacity: isHovering ? 0.6 : 0.4,
          borderColor: isHovering ? '#ffffff' : '#f1c40f',
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 25,
          mass: 0.5
        }}
        style={{
          width: 40,
          height: 40,
          borderWidth: '2px',
          borderStyle: 'solid',
        }}
      />
    </>
  );
}
