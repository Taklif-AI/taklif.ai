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
            task: "generation",
            params: {
                interest: body.student_interest,
                is_pdf: body.is_pdf ? "true" : "false",
                general_assignment: body.is_pdf ? pdf_base64_data : body.general_assignment,
            }
        };
        // return new Response(JSON.stringify({ success: true, customized_assignment: dataToApi }), { status: 200 });
        // Send data to llm api
        const res = await fetch('https://***REMOVED-API-ENDPOINT***/Development/llm_generation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify(dataToApi),
        })

        
        const data = await res.json();
        if (!res.ok || data.error || data.message) {
            return new Response(JSON.stringify({ error: data.error ? data.error : data.message }), { status: 400 });
        }

        return new Response(JSON.stringify({ success: true, customized_assignment: data.response }), { status: 200 });
    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify({ error: 'Failed to generate assignment' }), { status: 500 });
    }
}
