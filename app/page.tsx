"use client";

import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const sampleCode = `function total(items) {
  let sum = 0;

  items.forEach((item) => {
    sum += item.price;
  });

  return sum;
}`;

export default function Home() {
  const [code, setCode] = useState("");
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReview = async () => {
    if (!code.trim() || loading) {
      return;
    }

    setLoading(true);
    setReview("");

    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.review ?? "Review request failed.");
      }

      setReview(data.review);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      setReview(`Error: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!review) {
      return;
    }

    navigator.clipboard.writeText(review);
  };

  return (
    <main className="min-h-screen bg-[#111827] text-white">
      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-6 py-10 sm:px-8 lg:px-10">
        <header className="flex flex-col gap-3">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">
            Next.js + OpenAI
          </p>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white sm:text-5xl">
                AI Code Review
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300">
                Paste JavaScript or TypeScript code and get an AI-generated
                review with issues, improvement ideas, and a revised example.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setCode(sampleCode)}
              className="h-11 rounded-lg border border-cyan-300/40 px-4 text-sm font-semibold text-cyan-100 transition hover:border-cyan-200 hover:bg-cyan-300/10"
            >
              Load sample
            </button>
          </div>
        </header>

        <div className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-2">
          <section className="flex flex-col rounded-lg border border-slate-700 bg-slate-900 p-5 shadow-xl shadow-black/20">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">Code Input</h2>
              <span className="text-sm text-slate-400">
                {code.length.toLocaleString()} chars
              </span>
            </div>

            <textarea
              className="min-h-96 flex-1 resize-none rounded-lg border border-slate-700 bg-[#020617] p-4 font-mono text-sm leading-6 text-emerald-300 outline-none transition placeholder:text-slate-500 focus:border-cyan-300"
              placeholder="Paste code to review..."
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />

            <button
              type="button"
              onClick={handleReview}
              disabled={!code.trim() || loading}
              className="mt-4 h-12 rounded-lg bg-cyan-400 px-4 text-sm font-bold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
            >
              {loading ? "Analyzing..." : "Review Code"}
            </button>
          </section>

          <section className="flex flex-col rounded-lg border border-slate-700 bg-slate-900 p-5 shadow-xl shadow-black/20">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">AI Review</h2>

              <button
                type="button"
                onClick={copyToClipboard}
                disabled={!review}
                className="h-9 rounded-lg border border-slate-600 px-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:border-slate-800 disabled:text-slate-500"
              >
                Copy
              </button>
            </div>

            {loading ? (
              <div className="rounded-lg border border-slate-700 bg-[#020617] p-5 text-slate-300">
                AI is analyzing your code...
              </div>
            ) : review ? (
              <SyntaxHighlighter
                language="markdown"
                style={oneDark}
                wrapLongLines
                customStyle={{
                  flex: 1,
                  minHeight: "24rem",
                  borderRadius: "8px",
                  margin: 0,
                  padding: "20px",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {review}
              </SyntaxHighlighter>
            ) : (
              <div className="flex min-h-96 flex-1 items-center justify-center rounded-lg border border-dashed border-slate-700 bg-[#020617] p-6 text-center text-slate-400">
                Review results will appear here.
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}
