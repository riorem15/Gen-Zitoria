import { useState, useEffect, useCallback } from 'react';
import { useStore } from '../store/useStore';
import { GoogleGenerativeAI } from '@google/generative-ai';

// API Key (Seharusnya disimpan di .env)
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

export default function AIMentor({ currentQuestion, userWrongAnswer }) {
  const { zpdLevel } = useStore();
  const [messages, setMessages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Jika zpdLevel > 1, AI Mentor tidak muncul (belajar mandiri)
  if (zpdLevel > 1) return null;

  const generateHint = useCallback(async () => {
    setIsLoading(true);
    try {
      if (!API_KEY) {
        // Fallback jika tidak ada API key
        setMessages(prev => [...prev, {
          role: 'ai',
          content: `Halo! Sepertinya kamu kesulitan di soal ini. Petunjuk: Coba perhatikan kembali kata kunci dalam soal. (Note: Set VITE_GEMINI_API_KEY di .env untuk mengaktifkan AI sungguhan)`
        }]);
        setIsLoading(false);
        return;
      }

      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
        Kamu adalah Mentor Sejarah yang ramah bernama 'Zitoria AI'.
        Siswa sedang belajar sejarah dan menjawab soal berikut:
        Pertanyaan: "${currentQuestion.question}"
        Jawaban yang benar adalah: "${currentQuestion.correctAnswer}".
        Siswa baru saja menjawab salah.
        Tugasmu: Berikan PETUNJUK (Hint) yang mengarahkan mereka ke jawaban yang benar tanpa langsung memberitahu jawabannya. Gunakan bahasa Indonesia yang santai, edukatif, dan memotivasi. Maksimal 3 kalimat.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      setMessages(prev => [...prev, { role: 'ai', content: text }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'ai', content: "Maaf, mentor sedang beristirahat. Coba baca ulang materinya ya!" }]);
    }
    setIsLoading(false);
  }, [currentQuestion]);

  useEffect(() => {
    if (userWrongAnswer) {
      setIsOpen(true);
      generateHint();
    }
  }, [userWrongAnswer, generateHint]);

  return (
    <div className="fixed bottom-20 right-4 md:bottom-8 md:right-8 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="bg-surface-container-lowest border border-surface-variant shadow-lg rounded-xl mb-4 w-72 md:w-80 overflow-hidden flex flex-col">
          <div className="bg-purple-600 text-white px-4 py-2 flex justify-between items-center">
            <span className="font-bold font-label-md flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">smart_toy</span> Zitoria Mentor
            </span>
            <button onClick={() => setIsOpen(false)}>
              <span className="material-symbols-outlined text-sm hover:text-gray-300">close</span>
            </button>
          </div>
          <div className="p-4 max-h-60 overflow-y-auto flex flex-col gap-3 bg-surface-container-low">
            {messages.length === 0 && !isLoading && (
              <p className="text-sm text-on-surface-variant text-center italic">Belum ada pesan.</p>
            )}
            {messages.map((msg, idx) => (
              <div key={idx} className={`p-3 rounded-lg text-sm ${msg.role === 'ai' ? 'bg-purple-100 text-purple-900 self-start' : 'bg-surface-variant text-on-surface self-end'}`}>
                {msg.content}
              </div>
            ))}
            {isLoading && (
              <div className="p-3 rounded-lg text-sm bg-purple-100 text-purple-900 self-start animate-pulse">
                Mentor sedang mengetik...
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Tombol Floating Mentor */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-purple-600 rounded-full flex items-center justify-center text-white shadow-[0_4px_15px_rgba(147,51,234,0.4)] hover:bg-purple-700 hover:scale-105 transition-all"
      >
        <span className="material-symbols-outlined text-2xl">smart_toy</span>
      </button>
    </div>
  );
}
