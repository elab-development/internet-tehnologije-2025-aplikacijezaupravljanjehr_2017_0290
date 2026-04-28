import * as jwt from "jsonwebtoken";

export const AUTH_COOKIE = "auth";
const JWT_SECRET = process.env.JWT_SECRET!;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not set");
}

// Definisanje izgleda JWT tokena koji ćemo koristiti za autentifikaciju korisnika
export type JwtUserClaims = {
  sub: string;
  email: string;
  name?: string;
  role: "ADMIN" | "EMPLOYEE" | "HR_MANAGER";
};

// Funkcija za potpisivanje JWT tokena sa korisničkim podacima
export function signAuthToken(claims: JwtUserClaims) {
    return jwt.sign(claims, JWT_SECRET, { algorithm: "HS256", expiresIn: "7d" });
}


// Funkcija za verifikaciju JWT tokena i izdvajanje korisničkih podataka iz njega
export function verifyAuthToken(token: string): JwtUserClaims {
    const p = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload & JwtUserClaims;
    if (!p.sub || !p.email || !p.role) throw new Error("Invalid token payload");
    return {
        sub: p.sub,
        email: p.email,
        name: p.name,
        role: p.role as "ADMIN" | "EMPLOYEE" | "HR_MANAGER",
    };
}


// Funkcija za dobijanje opcija za postavljanje kolačića sa JWT tokenom
export function cookieOpts() {
    return {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
    };
}