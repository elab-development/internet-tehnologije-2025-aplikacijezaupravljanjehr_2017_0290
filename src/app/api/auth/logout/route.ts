import { AUTH_COOKIE } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST() {
    // Kreiranje odgovora i brisanje kolačića sa tokenom
    const res = NextResponse.json({ ok: true });

    // Postavljanje kolačića sa praznom vrednošću i istekom u prošlosti kako bi se obrisao
    res.cookies.set(AUTH_COOKIE, "", {
        httpOnly: true, // Kolačić nije dostupan JavaScript-u, smanjuje rizik od XSS napada
        secure: process.env.NODE_ENV === "production", // Kolačić se šalje samo preko HTTPS-a u produkciji, smanjuje rizik od presretanja tokena
        sameSite: "lax" as const, // Kolačić se šalje samo za iste sajtove, smanjuje rizik od CSRF napada
        path: "/", 
        maxAge: 0, 
        expires: new Date(0)
    })

    return res;
}