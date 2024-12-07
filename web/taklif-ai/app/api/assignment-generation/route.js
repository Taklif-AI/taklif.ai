import { assignmentSchema } from '@/lib/schemas/assignment-schema'

export async function POST(req) {
    try {
        const body = await req.json();
        const { params } = body;

        // data validation
        const validatedData = assignmentSchema.safeParse(params);
        // validation check
        if (!validatedData.success) {
            return new Response(JSON.stringify({ error: validatedData.error.message }), { status: 400 });
        }

        // Send data to llm api
        const res = await fetch('https://pdgr6qk367.execute-api.eu-north-1.amazonaws.com/Development/llm_call/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify(body),
        })

        if (!res.ok) {
            return new Response(JSON.stringify({ error: 'Failed to generate assignment1' }), { status: 500 });
        }

        const custmoized_assignment = await res.json();
        if (custmoized_assignment.body?.error) {
            return new Response(JSON.stringify({ error: 'Failed to generate assignment2' }), { status: 500 });
        }

        return new Response(JSON.stringify({ success: true, custmoized_assignment }), { status: 200 });
    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify({ error: 'Failed to generate assignment3' }), { status: 500 });
    }
}