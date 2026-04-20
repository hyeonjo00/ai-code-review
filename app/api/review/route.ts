import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const { code } = (await req.json()) as { code?: string };

    if (!code?.trim()) {
      return Response.json(
        { review: "Please provide code to review." },
        { status: 400 },
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return Response.json(
        { review: "OPENAI_API_KEY is not configured." },
        { status: 500 },
      );
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: `
Review the following code and respond in Markdown.

Focus on correctness, maintainability, readability, and practical improvements.

Code:
\`\`\`
${code}
\`\`\`

Use this structure:

## Issues
- ...

## Improvements
- ...

## Revised Code
\`\`\`
...
\`\`\`
`,
    });

    return Response.json({
      review: response.output_text,
    });
  } catch (error) {
    console.error(error);

    const message = error instanceof Error ? error.message : "Unknown error";

    return Response.json({ review: `Error: ${message}` }, { status: 500 });
  }
}
