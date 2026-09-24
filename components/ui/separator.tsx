import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

function Separator({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("shrink-0 bg-slate-200 h-[1px] w-full", className)}
      {...props}
    />
  );
}

export { Separator };
