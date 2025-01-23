"use client";

import { useTypewriter, Cursor } from "react-simple-typewriter";

interface TextAnimateProps {
  textList: string[];
}

export default function TextAnimate({ textList }: TextAnimateProps) {
  const [text] = useTypewriter({
    words: textList,
    loop: 0,
    typeSpeed: 200,
    delaySpeed: 10,
  });

  return (
    <>
      {text}
      <span>
        <Cursor cursorStyle="_" />
      </span>
    </>
  );
}
