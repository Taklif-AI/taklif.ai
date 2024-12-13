import { assignmentSchema } from '@/lib/schemas/assignment-schema'

export async function POST(req) {
    try {
        const body = await req.json();
        let pdf_base64_data = '';

        // student interest validation
        const validated_interest = assignmentSchema.safeParse({ student_interest: body.student_interest });
        if (!validated_interest.success) {
            return new Response(JSON.stringify({ error: validated_interest.error.message }), { status: 400 });
        }

        // check the assignment is pdf or text
        if (body.is_pdf) {

            // Extract MIME type and base64 data
            const [prefix, base64Data] = body.general_assignment.split(',');
            const mimeType = prefix.split(':')[1].split(';')[0];

            pdf_base64_data = base64Data;

            // pdf validation
            if (mimeType !== 'application/pdf') {
                return new Response(JSON.stringify(
                    { error: 'Only pdf files are allowed' }), { status: 400 });
            }
        } else {
            // text-input validation
            if (!body.general_assignment && !(body.general_assignment.trim().length > 0)) {
                return new Response(JSON.stringify(
                    { error: 'General assignment can not be empty' }), { status: 400 });
            }
        }

        const dataToApi = {
            model: "openrouter/google/learnlm-1.5-pro-experimental:free",
            params: {
                student_interest: body.student_interest,
                general_assignment: body.is_pdf ? pdf_base64_data : body.general_assignment,
                is_pdf: body.is_pdf,
            }
        };

        return new Response(JSON.stringify({ success: true, dataToApi }), { status: 200 });

        // Send data to llm api
        // const res = await fetch('https://pdgr6qk367.execute-api.eu-north-1.amazonaws.com/Development/llm_call/', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json', },
        //     body: JSON.stringify(dataToApi),
        // })

        //     if (!res.ok) {
        //         return new Response(JSON.stringify({ error: 'Failed to generate assignment' }), { status: 500 });
        //     }

        //     const custmoized_assignment = await res.json();
        //     if (custmoized_assignment.body?.error) {
        //         return new Response(JSON.stringify({ error: 'Failed to generate assignment2' }), { status: 500 });
        //     }

        //     return new Response(JSON.stringify({ success: true, custmoized_assignment }), { status: 200 });
    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify({ error: 'Failed to generate assignment' }), { status: 500 });
    }
}