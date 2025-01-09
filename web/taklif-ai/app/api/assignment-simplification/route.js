


export async function POST(req) {

    try {
        const body = await req.json();

        const dataToApi = {
            task: 'rephrase',
            params: {
                complexity_level: 'Basic',
                interest: body.interest,
                personalized_assignment: body.text
            }
        }

        // Send data to llm api
        const res = await fetch('https://ne4754rnb8.execute-api.eu-north-1.amazonaws.com/Development/llm_generation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify(dataToApi),
        })

        if (!res.ok) {
            return new Response(JSON.stringify({ error: 'Failed to generate assignment' }), { status: 500 });
        }

        const data = await res.json();
        if (data?.error) {
            return new Response(JSON.stringify({ error: data.error }), { status: 400 });
        }
        return new Response(JSON.stringify({ success: true, simplified_assignment: data.response }), { status: 200 });
    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify({ error: 'Failed to generate assignment' }), { status: 500 });
    }
}
