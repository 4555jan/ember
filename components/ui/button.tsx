import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface Opts { variant?: "default" | "outline"; size?: "default" | "sm"; className?: string }

/** Use on <Link> too: <Link className={buttonVariants({ variant: "outline" })}> */
export function buttonVariants({ variant = "default", size = "default", className }: Opts = {}) {
  return cn("btn", variant === "outline" && "btn-w", size === "sm" && "btn-s", className);
}

export const Button = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & Opts>(
  ({ variant, size, className, type = "button", ...props }, ref) => (
    <button ref={ref} type={type} className={buttonVariants({ variant, size, className })} {...props} />
  ),
);
Button.displayName = "Button";
