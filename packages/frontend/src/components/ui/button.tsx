import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center cursor-pointer whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: " text-secondary-foreground hover:text-primary underline-offset-4 hover:underline transition-color",
        fito: "group relative overflow-hidden border border-input focus:outline-none focus:ring",
        paez: "group shadow-sm bg-gradient-to-r from-indigo-100 via-pink-100 to-purple-100 hover:text-accent-foreground active:text-opacity-75 ",
      },
      size: {
        default: "h-9 px-4 py-2",
        xs: "h-6 rounded-md  text-xs px-4 py-2",
        sm: "h-8 rounded-md  text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    if (variant === "fito") {
      return (
        <Comp
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        >
          <span className="absolute inset-y-0 left-0 w-[3px] bg-indigo-400 transition-all group-hover:w-full group-active:bg-indigo-500"></span>
          <span className="relative transition-colors group-hover:text-white">
            {props.children}
          </span>
        </Comp>
      );
    }
    if (variant === "paez") {
      return (
        <div className={cn(buttonVariants({ variant, size, className }))}>
          <span className="block rounded-md bg-background px-4 py-2 font-medium group-hover:bg-transparent border border-input shadow-sm hover:bg-accent hover:text-accent-foreground">
            {props.children}
          </span>
        </div>
      );
    }
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
