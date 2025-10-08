"use client";
import { useState, useEffect } from "react";

export default function SendLink({ onSuccess }) {
  const [linkInput, setLinkInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let timer;
    if (success || error) {
      timer = setTimeout(() => {
        setSuccess(false);
        setError(false);
        setErrorMessage("");
      }, 10000);
    }
    return () => clearTimeout(timer);
  }, [success, error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(false);
    setErrorMessage("");

    try {
      if (!linkInput || !linkInput.trim()) {
        throw new Error("لطفاً یک لینک معتبر وارد کنید");
      }
      console.log(linkInput);
      const sendRes = await fetch("/api/auth/send-to-n8n", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        
        body: JSON.stringify({ link: linkInput.trim() })
      });

      if (!sendRes.ok) {
        const errText = await sendRes.text();
        throw new Error(errText || "ارسال لینک به n8n ناموفق بود");
      }

      setSuccess(true);
      setLinkInput("");
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      setError(true);
      setErrorMessage(err.message || "خطای ناشناخته رخ داد");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto mt-16 mb-8 px-4 md:px-6 text-center animate-fade-in">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 
                   bg-[#0b1624]/70 border border-cyan-700/40 rounded-2xl p-4 
                   backdrop-blur-md shadow-[0_0_25px_rgba(0,200,255,0.2)]"
      >
        <input
          type="url"
          placeholder="لینک را وارد کنید..."
          value={linkInput}
          onChange={(e) => setLinkInput(e.target.value)}
          className="flex-1 px-4 py-3 text-lg rounded-xl 
                     text-gray-200 bg-[#0b1624]/80 
                     border border-cyan-700/40 
                     focus:outline-none focus:border-cyan-400 
                     shadow-[0_0_15px_rgba(0,200,255,0.3)]"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-lg text-gray-200 
                     bg-gradient-to-r from-cyan-500 to-blue-500 
                     hover:from-blue-500 hover:to-cyan-400 
                     shadow-[0_0_15px_rgba(0,200,255,0.4)] 
                     transition-all duration-300 
                     disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "در حال ارسال..." : "ارسال لینک"}
        </button>
      </form>

      {success && (
        <p className="mt-3 text-base text-green-400 animate-fade-in">
          ✅ لینک با موفقیت ارسال شد!
        </p>
      )}
      {error && (
        <p className="mt-3 text-base text-pink-400 animate-fade-in">
          ⚠️ خطا: {errorMessage}
        </p>
      )}
    </div>
  );
}
