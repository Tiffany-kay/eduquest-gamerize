
import { Button } from "@/components/ui/button";
import { useWallet } from "@/hooks/useWallet";
import { Wallet, LogOut, Loader2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ConnectWalletProps {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
}

const ConnectWallet: React.FC<ConnectWalletProps> = ({
  variant = "default",
  size = "default",
  className,
}) => {
  const { wallet, isConnecting, connectWallet, disconnectWallet } = useWallet();
  const [isHovering, setIsHovering] = useState(false);

  // Format address for display
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="relative">
      {wallet.connected ? (
        <Button
          variant={variant}
          size={size}
          className={cn(
            "transition-all duration-300",
            isHovering ? "bg-destructive text-destructive-foreground" : "",
            className
          )}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onClick={isHovering ? disconnectWallet : undefined}
        >
          {isHovering ? (
            <>
              <LogOut className="mr-2 h-4 w-4" />
              Disconnect
            </>
          ) : (
            <>
              <Wallet className="mr-2 h-4 w-4" />
              {wallet.address ? formatAddress(wallet.address) : "Connected"}
            </>
          )}
        </Button>
      ) : (
        <Button
          variant={variant}
          size={size}
          className={className}
          onClick={connectWallet}
          disabled={isConnecting}
        >
          {isConnecting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Wallet className="mr-2 h-4 w-4" />
              Connect Wallet
            </>
          )}
        </Button>
      )}
    </div>
  );
};

export default ConnectWallet;
