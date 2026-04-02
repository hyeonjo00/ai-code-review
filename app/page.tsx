"use client";

import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function Home() {
  const [code, setCode] = useState("");
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReview = async () => {
    setLoading(true);
    setReview("");

    const res = await fetch("/api/review", {
      method: "POST",
      body: JSON.stringify({ code }),
    });

    const data = await res.json();

    setReview(data.review);
    setLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(review);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-10">

      {/* 제목 */}
      <h1 className="text-4xl font-bold text-center mb-10">
        💻 AI Code Review
      </h1>

      <div className="grid grid-cols-2 gap-6">

        {/* 입력 */}
        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
          <h2 className="mb-4 text-lg font-semibold">Code Input</h2>

          <textarea
            className="w-full h-80 p-4 bg-black text-green-400 rounded-lg font-mono outline-none"
            placeholder="코드를 입력하세요..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />

          <button
            onClick={handleReview}
            className="w-full mt-4 bg-blue-600 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            {loading ? "Analyzing..." : "Review Code"}
          </button>
        </div>

        {/* 결과 */}
        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col">

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">AI Review</h2>

            {review && (
              <button
                onClick={copyToClipboard}
                className="text-sm bg-gray-700 px-3 py-1 rounded hover:bg-gray-600"
              >
                Copy
              </button>
            )}
          </div>

          {loading ? (
            <div className="text-gray-400 animate-pulse">
              AI is analyzing your code...
            </div>
          ) : review ? (
            <SyntaxHighlighter
              language="javascript"
              style={oneDark}
              customStyle={{ borderRadius: "10px", padding: "20px" }}
            >
              {review}
            </SyntaxHighlighter>
          ) : (
            <div className="text-gray-500">
              결과가 여기에 표시됩니다
            </div>
          )}

        </div>

      </div>

    </div>
  );
}