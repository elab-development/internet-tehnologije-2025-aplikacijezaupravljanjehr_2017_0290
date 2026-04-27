import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AUTH_COOKIE, JwtUserClaims, verifyAuthToken } from "./auth";

export async function getCurrentUser() : Promise<JwtUserClaims | null> {
    const token = (await cookies()).get(AUTH_COOKIE)?.value;
    if (!token) return null;
    try {
        const claims = verifyAuthToken(token);
        return claims;
    } catch  {
        return null;
    }
}

export async function requestAuth() {
    const user = await getCurrentUser();
    if (!user) return { user: null, error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
    return { user: user, error: null };
}

export async function requireRole(...allowed: JwtUserClaims["role"][]) {
    const { user, error } = await requestAuth();
    if (error) return { user: null, error };
    if (!allowed.includes(user!.role)) return { user: null, error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
    return { user, error: null };
}

