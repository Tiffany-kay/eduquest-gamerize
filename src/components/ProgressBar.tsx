
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  progress: number;
  total: number;
  label?: string;
  showPercentage?: boolean;
  className?: string;
  barClassName?: string;
  height?: "sm" | "default" | "lg";
  animated?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  total,
  label,
  showPercentage = true,
  className,
  barClassName,
  height = "default",
  animated = true,
}) => {
  const percentage = Math.min(Math.round((progress / total) * 100), 100);
  
  const heightClasses = {
    sm: "h-1.5",
    default: "h-2.5",
    lg: "h-4",
  };
  
  return (
    <div className={cn("w-full", className)}>
      {(label || showPercentage) && (
        <div className="flex justify-between mb-1.5 text-sm">
          {label && <span className="font-medium">{label}</span>}
          {showPercentage && (
            <span className="text-muted-foreground">{percentage}%</span>
          )}
        </div>
      )}
      
      <div className={cn("w-full bg-muted/60 rounded-full overflow-hidden", heightClasses[height])}>
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            animated && "animate-pulse-soft",
            percentage < 20 
              ? "bg-red-500" 
              : percentage < 40 
                ? "bg-orange-500" 
                : percentage < 60 
                  ? "bg-yellow-500" 
                  : percentage < 80 
                    ? "bg-lime-500" 
                    : "bg-green-500",
            barClassName
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
