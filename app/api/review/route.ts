import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const { code } = await req.json();

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: `
다음 코드를 리뷰해라:

${code}

다음 형식으로 답해라:

[문제점]
- ...

[개선점]
- ...

[개선 코드]
...
`,
    });

    return Response.json({
      review: response.output_text,
    });

  } catch (error: any) {
    console.error(error);

    return Response.json({
      review: "Error: " + error.message,
    });
  }
}