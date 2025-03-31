'use server';

import { auth } from "@/auth";
import { pool } from "@/lib/db";

export default async function getUserId() {
    const session = await auth();
    if(session?.user === null || session?.user === undefined) throw new Error("User not authenticated");
    
    return session?.user?.id;
}