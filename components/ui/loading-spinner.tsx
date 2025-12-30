import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number;
  text?: string;
}

export function LoadingSpinner({ size = 48, text, className, ...props }: LoadingSpinnerProps) {
  return (
    <div 
      className={cn("flex min-h-[50vh] w-full items-center justify-center p-8", className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 bg-orange-500 rounded-full blur-xl opacity-20 animate-pulse" />
          <Loader2 
            className="relative animate-spin text-orange-500" 
            size={size}
          />
        </div>
        {text && (
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 animate-pulse">
            {text}
          </p>
        )}
      </div>
    </div>
  );
}
