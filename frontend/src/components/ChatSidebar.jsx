import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sendChatMessage } from '../api/client';

export default function ChatSidebar() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm SkillBridge's career assistant. Ask me about job roles, skills, or how to use the platform." },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    setMessages((m) => [...m, { role: 'user', content: text }]);
    setLoading(true);
    try {
      const next = [...messages, { role: 'user', content: text }];
      const { reply } = await sendChatMessage(next.map((x) => ({ role: x.role, content: x.content })));
      setMessages((m) => [...m, { role: 'assistant', content: reply }]);
    } catch (err) {
      setMessages((m) => [...m, { role: 'assistant', content: 'Sorry, I could not reach the server. Is the backend running?' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-brand-500 to-indigo-500 text-white shadow-lg shadow-brand-500/30 flex items-center justify-center hover:scale-105 transition"
        aria-label="Open chat"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: 320 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 320 }}
            className="fixed top-0 right-0 z-50 w-full max-w-md h-full glass border-l border-white/10 flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h2 className="font-semibold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Career Assistant
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                      msg.role === 'user'
                        ? 'bg-brand-500/30 text-white'
                        : 'bg-white/10 text-gray-200'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white/10 rounded-2xl px-4 py-2 text-gray-400 text-sm">Thinking...</div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
            <div className="p-4 border-t border-white/10">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about roles, skills, roadmap..."
                  className="flex-1 px-4 py-3 rounded-xl bg-dark-700 border border-white/10 text-white placeholder-gray-500 focus:border-brand-500 outline-none text-sm"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-3 rounded-xl bg-brand-500 text-white font-medium hover:bg-brand-600 disabled:opacity-50 text-sm"
                >
                  Send
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
