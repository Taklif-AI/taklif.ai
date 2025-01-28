import { currentUser } from '@/lib/auth/auth';
import { assignmentSchema } from '@/lib/schemas/assignment-schema'

export async function POST(req) {
    const user = await currentUser();
    if (!user) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

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
            task: "personalization",
            params: {
                interest: body.student_interest,
                is_pdf: body.is_pdf,
                general_assignment: body.is_pdf ? pdf_base64_data : body.general_assignment,
                run_id: body.run_id,
                personalization_id: body.personalization_id,
                user_id: user.id
            }
        };

        // Send data to llm api
        const res = await fetch('https://ne4754rnb8.execute-api.eu-north-1.amazonaws.com/Development/llm_generation', {
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

        return new Response(JSON.stringify({ success: true, customized_assignment: data }), { status: 200 });
    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify({ error: 'Failed to generate assignment' }), { status: 500 });
    }
}
