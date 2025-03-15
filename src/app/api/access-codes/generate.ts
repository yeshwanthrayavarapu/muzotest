import { executeQuery } from '@/app/lib/dbClient';

export async function POST(req: Request) {
    const { code } = await req.json();

    if (!code) {
        return new Response(JSON.stringify({ error: "Code is required" }), { status: 400 });
    }

    try {
        await executeQuery(
            "INSERT INTO AccessCodes (code) VALUES (@param0)",
            [code]
        );
        return new Response(JSON.stringify({ message: "Access code created" }), { status: 201 });
    } catch (error) {
        console.error("Error creating access code:", error);
        return new Response(JSON.stringify({ error: "Failed to create access code" }), { status: 500 });
    }
} 