
import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FlipCardProps {
  frontContent: React.ReactNode;
  backContent: React.ReactNode;
  className?: string;
}

const FlipCard = ({ frontContent, backContent, className }: FlipCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleFlip = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setIsFlipped(!isFlipped);
    }
  };

  return (
    <div 
      className={cn(
        "relative cursor-pointer perspective-1000 w-full h-[300px]",
        className
      )}
      onClick={handleFlip}
    >
      <motion.div
        className="relative w-full h-full preserve-3d transition-all duration-500"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.3, animationDirection: "normal" }} 
        onAnimationComplete={() => setIsAnimating(false)}
      >
        {/* Front of card */}
        <motion.div
          className={cn(
            "absolute w-full h-full backface-hidden rounded-xl border bg-card p-6 shadow-md",
            isFlipped ? "pointer-events-none" : "pointer-events-auto"
          )}
        >
          {frontContent}
        </motion.div>
        
        {/* Back of card */}
        <motion.div
          className={cn(
            "absolute w-full h-full backface-hidden rounded-xl border bg-card p-6 shadow-md transform rotate-y-180",
            isFlipped ? "pointer-events-auto" : "pointer-events-none"
          )}
        >
          {backContent}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default FlipCard;
