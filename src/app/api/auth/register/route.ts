import { db } from "@/db";
import { users } from "@/db/schema";
import { eq} from "drizzle-orm";
import { NextResponse } from "next/server";
import { AUTH_COOKIE, cookieOpts, signAuthToken } from "@/lib/auth";
import bcrypt from "bcrypt" 


type Body = {
    email: string;
    password: string;
    name: string;
    position: string;
}

export async function POST(req: Request) {
    //Parsiranje podataka iz tijela zahtjeva
    const { email, password, name, position }: Body = await req.json();

    //Provjera da li su svi potrebni podaci prisutni
    if (!email || !password || !name || !position) {
        return NextResponse.json({ error: "Nedostaju podaci" }, { status: 400 });
    }

    //Provjera da li korisnik sa datim emailom već postoji
    const existingUser = await db.select().from(users).where(eq(users.email, email))
    if (existingUser.length) return NextResponse.json({ error: "Korisnik sa datim emailom već postoji" }, { status: 400 });

    //Hashiranje lozinke prije spremanja u bazu
    const hashedPassword = await bcrypt.hash(password, 10);

    //write to db
    const [newUser] = await db.insert(users).values({
        name,
        email,
        password: hashedPassword,
        position: (position as "EMPLOYEE" | "HR_MANAGER" | "ADMIN")
    }).returning({id: users.id, email: users.email, name: users.name, position: users.position});


    //Kreiranje tokena sa korisničkim podacima
    const token = signAuthToken({ sub: newUser.id, email: newUser.email, name: newUser.name, role: newUser.position });

    //Postavljanje tokena u kolačić i vraćanje odgovora sa korisničkim podacima
    const res = NextResponse.json({ id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.position });
    res.cookies.set(AUTH_COOKIE, token, cookieOpts());

    return res;

}