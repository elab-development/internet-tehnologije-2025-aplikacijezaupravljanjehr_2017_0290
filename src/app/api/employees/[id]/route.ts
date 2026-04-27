import { db } from "@/db";
import { employees } from "@/db/schema";
import { requireRole } from "@/lib/authz";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

type Ctx= { params: Promise<{id: string;}> };

// Endpoint za dohvatanje pojedinačnog zaposlenog po ID-ju, dostupan svim autentifikovanim korisnicima
export async function GET(req: Request, { params }: Ctx) {
    const { id } = await params;
    const [row] = await db.select().from(employees).where(eq(employees.id, id));
    if (!row) return NextResponse.json({ error: "Zaposleni nije pronađen" }, { status: 404 });
    return NextResponse.json(row);
}

// Endpoint za ažuriranje postojećeg zaposlenog, dostupan samo HR menadžerima i administratorima
export async function PUT(req: Request, { params }: Ctx) {
    const { error } = await requireRole("HR_MANAGER", "ADMIN");
    if (error) return NextResponse.json({ error }, { status: 401 });

    const { id } = await params;
    const body = await req.json();
    const [row] = await db.update(employees).set(body).where(eq(employees.id, id)).returning();
    if (!row) return NextResponse.json({ error: "Zaposleni nije pronađen" }, { status: 404 });
    return NextResponse.json(row);
}

// Endpoint za brisanje zaposlenog, dostupan samo HR menadžerima i administratorima
export async function DELETE(req: Request, { params }: Ctx) {
    const { error } = await requireRole("HR_MANAGER", "ADMIN");
    if (error) return NextResponse.json({ error }, { status: 401 });

    const { id } = await params;
    await db.delete(employees).where(eq(employees.id, id));
    return NextResponse.json({ message: "Zaposleni je obrisan", ok: true });
}