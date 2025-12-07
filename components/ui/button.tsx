import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'secondary'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: "bg-tata-blue hover:bg-tata-darkblue text-white",
      outline: "border-2 border-tata-blue text-tata-blue hover:bg-tata-blue hover:text-white",
      secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800"
    }
    
    return (
      <button
        className={cn(
          "px-6 py-3 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
          variants[variant],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
