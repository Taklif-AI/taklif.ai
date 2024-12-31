


export async function POST(req) {

    try {
        const body = await req.json();

        const dataToApi = {
            task: 'simplify',
            params: {
                interest: body.interest,
                personalized_assignment: body.text
            }
        }

        // Send data to llm api
        const res = await fetch('https://pdgr6qk367.execute-api.eu-north-1.amazonaws.com/Development/llm_generation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify(dataToApi),
        })

        const data = await res.json();
        if (res.status == 400 && data?.rejected) {
            return new Response(JSON.stringify({ error: data.rejected }), { status: 400 });
        }

        if (!res.ok || data.error || data.message) {
            return new Response(JSON.stringify({ error: 'Failed to generate assignment' }), { status: 500 });
        }
        
        return new Response(JSON.stringify({ success: true, simplified_assignment: data.response }), { status: 200 });
    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify({ error: 'Failed to generate assignment' }), { status: 500 });
    }
}