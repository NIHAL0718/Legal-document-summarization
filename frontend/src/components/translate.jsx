import React, { useState, useRef } from "react";
import { saveAs } from "file-saver";

const languageOptions = [
  { code: "hi", name: "Hindi" },
  { code: "fr", name: "French" },
  { code: "es", name: "Spanish" },
  { code: "de", name: "German" },
  { code: "ar", name: "Arabic" },
  { code: "ru", name: "Russian" },
  { code: "ja", name: "Japanese" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
];

const TranslatePage = () => {
  const [targetLang, setTargetLang] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [translatedSummary, setTranslatedSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [translateOption, setTranslateOption] = useState("both");
  const resultRef = useRef(null);

  const handleTranslate = async () => {
    const extracted = localStorage.getItem("extracted_text") ?? "";
    const summary = localStorage.getItem("summary") ?? "";

    if (!extracted && !summary) {
      setError("Missing extracted text and summary. Please summarize a document first.");
      return;
    }
    if (!targetLang) {
      setError("Please select a target language.");
      return;
    }

    setError("");
    setLoading(true);
    setTranslatedText("");
    setTranslatedSummary("");

    try {
      let body = { target_language: targetLang };

      if (translateOption === "extracted" && extracted) body.extracted_text = extracted;
      else if (translateOption === "summary" && summary) body.summary = summary;
      else {
        if (extracted) body.extracted_text = extracted;
        if (summary) body.summary = summary;
      }

      console.log("Sending to backend:", body);

      const response = await fetch("http://localhost:8000/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error("Translation failed");
      const data = await response.json();
      setTranslatedText(data.translated_text || "");
      setTranslatedSummary(data.translated_summary || "");

      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } catch (err) {
      setError(err.message || "Failed to fetch translation.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    let content = "";
    if (translateOption === "extracted" && translatedText) {
      content = `Translated Extracted Text:\n\n${translatedText}`;
    } else if (translateOption === "summary" && translatedSummary) {
      content = `Translated Summary:\n\n${translatedSummary}`;
    } else if (translatedText || translatedSummary) {
      content = `Translated Extracted Text:\n\n${translatedText}\n\nTranslated Summary:\n\n${translatedSummary}`;
    } else {
      content = "No translated content available.";
    }
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "translated-text.txt");
  };

  return (
    <div className="min-h-screen bg-[#111111] text-gray-100 px-6 py-8 font-sans">
      <h1 className="text-4xl font-extrabold text-center mb-10 text-gray-200">Translate Summary</h1>

      <div className="max-w-4xl mx-auto bg-[#1a1a1a] border border-gray-800 rounded-xl shadow-xl p-8">
        <div className="mb-6">
          <label className="block text-lg font-medium mb-2 text-gray-300">Target Language:</label>
          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-[#222222] text-gray-100 border border-gray-700 focus:outline-none"
          >
            <option value="">Select language</option>
            {languageOptions.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name} ({lang.code})
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-lg font-medium mb-2 text-gray-300">What to translate?</label>
          <div className="flex gap-6 flex-wrap">
            {["extracted", "summary", "both"].map((option) => (
              <label key={option} className="flex items-center gap-2 cursor-pointer text-gray-300">
                <input
                  type="radio"
                  name="translateOption"
                  value={option}
                  checked={translateOption === option}
                  onChange={() => setTranslateOption(option)}
                  className="accent-purple-600"
                />
                <span className="capitalize">{option}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-8">
          <button onClick={handleTranslate} className="bg-purple-700 px-6 py-2 rounded-lg text-white font-semibold">
            Translate
          </button>
          <button onClick={handleDownload} className="bg-gray-700 px-6 py-2 rounded-lg text-white font-semibold" disabled={!(translatedText || translatedSummary)}>
            Download Translated Text
          </button>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {loading && <p className="text-gray-400 mb-4">Translating...</p>}

        <div ref={resultRef}>
          {translatedText && <pre className="bg-[#1f1f1f] p-4 rounded-lg overflow-x-auto text-gray-200 whitespace-pre-wrap mb-4">{translatedText}</pre>}
          {translatedSummary && <pre className="bg-[#1f1f1f] p-4 rounded-lg overflow-x-auto text-gray-200 whitespace-pre-wrap">{translatedSummary}</pre>}
        </div>
      </div>
    </div>
  );
};

export default TranslatePage;
