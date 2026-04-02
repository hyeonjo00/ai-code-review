"use client";

import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

export default function Home() {
  const [code, setCode] = useState("");
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReview = async () => {
    setLoading(true);
    setReview("");

    // 🔥 가짜 데이터 (UI 테스트용)
    setTimeout(() => {
      setReview(`[Issues]
- No input validation
- Function lacks error handling

[Improvements]
- Add type checking
- Handle invalid inputs

[Refactored Code]
function add(a, b) {
  if (typeof a !== "number" || typeof b !== "number") {
    return "Invalid input";
  }
  return a + b;
}`);
      setLoading(false);
    }, 1200);
  };

  // 🔥 리뷰 파싱
  const formatReview = (text: string) => {
    const issuesPart = text.split("[Improvements]")[0];
    const improvementsPart = text.split("[Improvements]")[1] || "";

    const issues = issuesPart.replace("[Issues]", "").trim();
    const improvements = improvementsPart
      .replace("[Refactored Code]", "")
      .trim();

    return { issues, improvements };
  };

  const { issues, improvements } = formatReview(review);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-10">
      
      <h1 className="text-4xl font-bold text-center mb-10">
        🚀 AI Code Review
      </h1>

      <div className="grid grid-cols-2 gap-8 max-w-6xl mx-auto">

        {/* LEFT - Code Input */}
        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition">
          <h2 className="font-semibold mb-4 text-lg">💻 Code Input</h2>

          <textarea
            className="w-full h-80 border rounded-lg p-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Paste your code here..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />

          <button
            onClick={handleReview}
            className="mt-4 w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition font-semibold"
          >
            {loading ? "Analyzing..." : "Review Code"}
          </button>
        </div>

        {/* RIGHT - AI Review */}
        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition">
          <h2 className="font-semibold mb-4 text-lg">🤖 AI Review</h2>

          {loading ? (
            <div className="animate-pulse text-gray-400">
              Analyzing your code...
            </div>
          ) : review ? (
            <div className="space-y-4">

              {/* Issues */}
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="font-semibold text-red-600 mb-2">
                  ⚠ Issues
                </h3>
                <pre className="text-sm whitespace-pre-wrap">
                  {issues}
                </pre>
              </div>

              {/* Improvements */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-600 mb-2">
                  ✅ Improvements
                </h3>
                <pre className="text-sm whitespace-pre-wrap">
                  {improvements}
                </pre>
              </div>

              {/* Code Block */}
              <div className="rounded-lg overflow-hidden">
                <h3 className="font-semibold mb-2">💡 Refactored Code</h3>
                <SyntaxHighlighter language="javascript">
                  {review}
                </SyntaxHighlighter>
              </div>

            </div>
          ) : (
            <p className="text-gray-400">
              Review results will appear here.
            </p>
          )}
        </div>

      </div>
    </div>
  );
}