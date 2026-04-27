import { db } from "@/db";
import { users } from "@/db/schema";
import { AUTH_COOKIE, verifyAuthToken } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    // Dobijanje tokena iz kolačića
    const token = (await cookies()).get(AUTH_COOKIE)?.value

    if (!token) return NextResponse.json({ user: null });

    try {
        // Verifikacija tokena i dobijanje korisničkih podataka iz tokena
        const userData = verifyAuthToken(token);

        // Pretraživanje korisnika u bazi podataka na osnovu ID-a iz tokena
        const u = await db
            .select({ id: users.id, email: users.email, name: users.name, role: users.position })
            .from(users)
            .where(eq(users.id, userData.sub))
            .then((res) => res[0]);
        return NextResponse.json({ user: u ?? null });
    } catch {
        // U slučaju greške (npr. neispravan token), vraća se null kao korisnik
        return NextResponse.json({ user: null }, { status: 401 });
    }

}