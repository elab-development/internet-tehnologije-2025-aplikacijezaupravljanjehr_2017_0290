"use client";   
import { InputHTMLAttributes } from "react";    

type InputProps = InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string; }

export default function Input({ label, error, className = "", ...props }: InputProps) {
    return (
        <label className="block">
            {label && <span className="block text-sm font-medium text-gray-900">{label}</span>}
            <input 
            className={`mt-1 block w-full rounded-md border py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${error ? "border-red-500" : "border-gray-300"} ${className}`} {...props} />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </label>
    )
}