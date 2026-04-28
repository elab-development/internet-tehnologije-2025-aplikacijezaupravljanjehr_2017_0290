"use client"
import { ButtonHTMLAttributes } from "react"

type Variant = "primary" | "secondary" | "destructive" | "ghost"
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; loading?: boolean }

const styles: Record<Variant, string> = {
    primary: "bg-emerald-600 hover:bg-emerald-700 text-white",
    secondary: "bg-teal-100 hover:bg-teal-200 text-teal-800",
    destructive: "bg-orange-600 hover:bg-orange-700 text-white",
    ghost: "bg-transparent hover:bg-emerald-50 text-emerald-700",
}

export default function Button({ variant = "primary", loading, className = "", children, ...rest }: ButtonProps) {
    return (
        <button
            className={'rounded px-3 py-1.5 text-sm font-semibold shadow disabled:opacity-60 disabled:cursor-not-allowed ' + styles[variant] + ' ' + className}
            disabled={loading || rest.disabled}
            {...rest}
        >
            {loading ? "Loading..." : children}
        </button>
    )
}