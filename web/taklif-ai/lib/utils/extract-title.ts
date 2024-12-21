

export function extractTitleAndText(input: string) {
    const start = input.indexOf('<<');
    const end = input.indexOf('>>');

    if (start !== -1 && end !== -1 && end > start) {
        const title = input.slice(start + 2, end).trim(); // Extract title
        const text = input.slice(end + 2).trim(); // Extract rest of the string
        return { title, text };
    }

    return null; // Return null if no valid delimiters are found
}