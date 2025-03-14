
import { cn } from "@/lib/utils";
import { Module } from "@/utils/contractUtils";
import ProgressBar from "./ProgressBar";
import { ArrowRight, Award, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface LevelCardProps {
  module: Module;
  className?: string;
  onModuleSelect?: (moduleId: string) => void;
}

const LevelCard: React.FC<LevelCardProps> = ({
  module,
  className,
  onModuleSelect,
}) => {
  const navigate = useNavigate();
  
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
  
  return (
    <div 
      className={cn(
        "group relative rounded-xl border p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-1",
        module.completed 
          ? "bg-muted/50 dark:bg-muted/10" 
          : "bg-card hover:bg-card/95",
        className
      )}
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
            </div>
            <h3 className="text-lg font-bold">{module.title}</h3>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mb-6 flex-grow">
          {module.description}
        </p>
        
        <div className="mt-auto">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-medium">{module.xpReward} XP</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium">{module.tokenReward} EDU</span>
            </div>
          </div>
          
          <Button 
            variant={module.completed ? "outline" : "default"} 
            className="w-full"
            onClick={handleClick}
          >
            {module.completed ? "Review Module" : "Start Learning"}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LevelCard;
