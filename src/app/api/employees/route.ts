import { db } from "@/db";
import { departments, employees } from "@/db/schema";
import { requestAuth, requireRole } from "@/lib/authz";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// Endpoint za dohvatanje svih zaposlenih, dostupno svim autentifikovanim korisnicima
export async function GET(req: Request) {
    const { error } = await requestAuth();
    if (error) return NextResponse.json({ error }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const departmentId = searchParams.get("departmentId");

    // Dohvatanje zaposlenih, opcionalno filtriranje po departmanu
    const rows = await db
        .select({
            id: employees.id,
            firstName: employees.firstName,
            lastName: employees.lastName,
            jobTitle: employees.jobTitle,
            departmentId: employees.departmentId,
            active: employees.active,
        })
        .from(employees)
        .leftJoin(departments, eq(employees.departmentId, departments.id))
        .where(departmentId ? eq(employees.departmentId, departmentId) : undefined);

        return NextResponse.json(rows);
}


// Endpoint za kreiranje novog zaposlenog, dostupan samo HR menadžerima i administratorima
export async function POST(req: Request) {
    const { error } = await requireRole("HR_MANAGER", "ADMIN");
    if (error) return NextResponse.json({ error }, { status: 401 });

    const body = await req.json();
    const [e] = await db.insert(employees).values(body).returning();

    return NextResponse.json(e, { status: 201 });
}

