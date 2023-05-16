import React, { useEffect, useState } from "react";
import "./Chat.css";

const TypingEffect = ({ onComplete, typingSpeed = 2000 }) => {
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsComplete(true);
      onComplete();
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [onComplete, typingSpeed]);

  return (
    <span className={`typing-effect ${isComplete ? "hidden" : ""}`}></span>
  );
};

export default TypingEffect;
