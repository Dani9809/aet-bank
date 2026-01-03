import * as React from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent' | 'destructive';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    href?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', href, ...props }, ref) => {

        const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 font-heading tracking-wide"

        const variants = {
            // Primary: Orange (#e8871e) on White
            primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md",
            // Secondary: Sage Green (#bad4aa) on Dark
            secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
            // Accent: Mustard (#edb458)
            accent: "bg-accent text-accent-foreground hover:bg-accent/90",
            // Destructive: Red
            destructive: "bg-red-600 text-white hover:bg-red-700 shadow-md",
            // Outline: Bordered with Muted (#d4d4aa)
            outline: "border border-muted-foreground/30 bg-transparent text-foreground hover:bg-muted/20",
            ghost: "hover:bg-muted/20 hover:text-foreground",
        }

        const sizes = {
            sm: "h-8 px-3 text-xs",
            md: "h-10 px-8 py-2",
            lg: "h-12 px-8 text-lg",
            icon: "h-10 w-10",
        }

        if (href) {
            return (
                <Link
                    href={href}
                    className={cn(baseStyles, variants[variant], sizes[size], className)}
                >
                    {props.children}
                </Link>
            )
        }

        return (
            <button
                ref={ref}
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }
