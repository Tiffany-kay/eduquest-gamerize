
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Badge as BadgeType } from "@/utils/contractUtils";

interface RewardBadgeProps {
  badge: BadgeType;
  size?: "sm" | "md" | "lg";
  className?: string;
  showTooltip?: boolean;
}

const RewardBadge: React.FC<RewardBadgeProps> = ({
  badge,
  size = "md",
  className,
  showTooltip = true,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  
  // Define sizes
  const sizes = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-24 h-24",
  };
  
  // Define colors based on rarity
  const rarityColors = {
    common: "from-gray-400 to-gray-300",
    rare: "from-blue-500 to-blue-400",
    epic: "from-purple-600 to-purple-400",
    legendary: "from-amber-500 to-yellow-300",
  };
  
  // Define glow based on rarity
  const rarityGlow = {
    common: "shadow-sm",
    rare: "shadow-md shadow-blue-200 dark:shadow-blue-900/30",
    epic: "shadow-md shadow-purple-200 dark:shadow-purple-900/40",
    legendary: "shadow-lg shadow-amber-200 dark:shadow-amber-900/40",
  };
  
  return (
    <div className="relative">
      <div
        className={cn(
          "relative rounded-full flex items-center justify-center transition-transform",
          "bg-gradient-to-br",
          rarityColors[badge.rarity],
          rarityGlow[badge.rarity],
          sizes[size],
          "hover:scale-105 cursor-pointer",
          className
        )}
        onMouseEnter={() => showTooltip && setShowDetails(true)}
        onMouseLeave={() => showTooltip && setShowDetails(false)}
      >
        <span className="text-white font-bold text-xl">
          {badge.name.charAt(0)}
        </span>
        {/* Pulse animation for legendary badges */}
        {badge.rarity === "legendary" && (
          <span className="absolute inset-0 rounded-full bg-amber-400/20 animate-ping" />
        )}
      </div>
      
      {/* Tooltip */}
      {showDetails && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 z-10 w-48 p-3 rounded-lg shadow-lg bg-popover border animate-fade-in">
          <div className="text-center">
            <p className="font-bold text-sm mb-1">{badge.name}</p>
            <p className="text-xs text-muted-foreground mb-1">{badge.description}</p>
            <span className={cn(
              "text-xs px-2 py-0.5 rounded-full capitalize",
              badge.rarity === "common" && "bg-gray-200 text-gray-800",
              badge.rarity === "rare" && "bg-blue-100 text-blue-800",
              badge.rarity === "epic" && "bg-purple-100 text-purple-800",
              badge.rarity === "legendary" && "bg-amber-100 text-amber-800",
            )}>
              {badge.rarity}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RewardBadge;
