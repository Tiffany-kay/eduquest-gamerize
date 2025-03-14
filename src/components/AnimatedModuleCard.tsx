
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Module } from "@/utils/contractUtils";
import { ArrowRight, Award, Star, Zap, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface AnimatedModuleCardProps {
  module: Module;
  className?: string;
  onModuleSelect?: (moduleId: string) => void;
  delay?: number;
}

const AnimatedModuleCard: React.FC<AnimatedModuleCardProps> = ({
  module,
  className,
  onModuleSelect,
  delay = 0
}) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  
  // Level color mapping
  const levelColors = {
    beginner: "border-green-200 bg-green-50 dark:border-green-900/30 dark:bg-green-900/10",
    intermediate: "border-blue-200 bg-blue-50 dark:border-blue-900/30 dark:bg-blue-900/10",
    advanced: "border-purple-200 bg-purple-50 dark:border-purple-900/30 dark:bg-purple-900/10",
  };
  
  // Level icon mapping
  const levelIcons = {
    beginner: <Star className="h-4 w-4 text-green-500" />,
    intermediate: <Award className="h-4 w-4 text-blue-500" />,
    advanced: <Zap className="h-4 w-4 text-purple-500" />,
  };
  
  const handleClick = () => {
    if (onModuleSelect) {
      onModuleSelect(module.id);
    } else {
      navigate(`/modules/${module.id}`);
    }
  };

  // Animation variants
  const cardVariants = {
    hidden: { 
      opacity: 0,
      y: 20,
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.5,
        delay: delay * 0.1,
        ease: "easeOut"
      }
    },
    hover: {
      y: -8,
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const sparkleVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        delay: delay * 0.1 + 0.3,
        duration: 0.3,
        ease: "backOut"
      }
    }
  };

  const buttonVariants = {
    rest: { scale: 1 },
    hover: { 
      scale: 1.05, 
      transition: { 
        duration: 0.3,
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };
  
  return (
    <motion.div 
      className={cn(
        "relative rounded-xl border p-5 shadow-sm transition-all bg-card",
        module.completed ? "bg-muted/50 dark:bg-muted/10" : "",
        className
      )}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-1.5 mb-2.5">
              {levelIcons[module.level]}
              <span className={cn(
                "text-xs font-medium px-2 py-0.5 rounded-full capitalize",
                module.level === "beginner" && "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
                module.level === "intermediate" && "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
                module.level === "advanced" && "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400",
              )}>
                {module.level}
              </span>
              
              {module.completed && (
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 flex items-center gap-1 ml-1">
                  <Check className="h-3 w-3" /> Completed
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold">{module.title}</h3>
          </div>
          
          <motion.div
            variants={sparkleVariants}
            initial="hidden"
            animate="visible"
            className="absolute -top-2 -right-2"
          >
            <Sparkles className="h-5 w-5 text-purple-500" />
          </motion.div>
        </div>
        
        <p className="text-sm text-muted-foreground mb-6 flex-grow">
          {module.description}
        </p>
        
        <div className="mt-auto">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Zap className={cn(
                "h-4 w-4 text-amber-500",
                isHovered && "animate-bounce"
              )} />
              <span className="text-sm font-medium">{module.xpReward} XP</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className={cn(
                "h-4 w-4 text-purple-500",
                isHovered && "animate-spin-slow"
              )} />
              <span className="text-sm font-medium">{module.tokenReward} EDU</span>
            </div>
          </div>
          
          <motion.div variants={buttonVariants}>
            <Button 
              variant={module.completed ? "outline" : "default"} 
              className="w-full group"
              onClick={handleClick}
            >
              {module.completed ? "Review Module" : "Start Learning"}
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default AnimatedModuleCard;
