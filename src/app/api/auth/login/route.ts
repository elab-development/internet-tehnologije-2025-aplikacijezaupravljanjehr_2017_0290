import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { AUTH_COOKIE, cookieOpts, signAuthToken } from "@/lib/auth";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
    // Parsiranje emaila i lozinke iz tela zahteva
    const { email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ error: "Pogresan email ili lozinka" }, { status: 401 });

    // Provera da li korisnik sa datim emailom postoji u bazi
    const [u] = await db.select().from(users).where(eq(users.email, email));
    if (!u) return NextResponse.json({ error: "Pogresan email ili lozinka" }, { status: 401 });

    // Provera da li je lozinka ispravna
    const isMatch = await bcrypt.compare(password, u.password);
    if (!isMatch) return NextResponse.json({ error: "Pogresan email ili lozinka" }, { status: 401 });

    // Kreiranje tokena sa korisničkim podacima
    const token = signAuthToken({ sub: u.id, email: u.email, name: u.name, role: u.position });

    // Postavljanje tokena u kolačić i vraćanje odgovora sa korisničkim podacima
    const res = NextResponse.json({ id: u.id, email: u.email, name: u.name, role: u.position });
    res.cookies.set(AUTH_COOKIE, token, cookieOpts());
    return res;
}   