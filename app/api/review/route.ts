import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const { code } = await req.json();

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: `You are a senior developer. Review this code:\n${code}`,
    });

    console.log("FULL RESPONSE:", response);

    return Response.json({
      review: response.output_text || "No response",
    });

  } catch (error: any) {
    console.error("🔥 API ERROR:", error.message);
    return Response.json({
      review: "Error occurred: " + error.message,
    });
  }
}