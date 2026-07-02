"use client";

import { useEffect, useState } from "react";

/** 文字送り (タップでスキップ可能) */
export function useTypewriter(text: string, speed = 40) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(0);
    const id = window.setInterval(() => {
      setCount((c) => {
        if (c >= text.length) {
          window.clearInterval(id);
          return c;
        }
        return c + 1;
      });
    }, speed);
    return () => window.clearInterval(id);
  }, [text, speed]);

  return {
    shown: text.slice(0, count),
    done: count >= text.length,
    skip: () => setCount(text.length),
  };
}
