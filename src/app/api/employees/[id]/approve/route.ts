import { db } from "@/db";
import { ptoRequests } from "@/db/schema";
import { requireRole } from "@/lib/authz";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";


// Endpoint za odobravanje zahtjeva za godišnji odmor, dostupan samo HR menadžerima i administratorima
export async function POST(req: Request, { params }: { params: Promise<{id: string}> }) {
    const { error } = await requireRole("HR_MANAGER", "ADMIN");
    if (error) return NextResponse.json({ error }, { status: 401 });

    const { id } = await params;
    const [request] = await db.update(ptoRequests)
        .set({ status: "APPROVED"})
        .where(eq(ptoRequests.id, id))
        .returning();
    if (!request) return NextResponse.json({ error: "Zahtjev nije pronađen" }, { status: 404 });

    return NextResponse.json(request);
}