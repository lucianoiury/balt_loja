"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Mensagem {
  id: string;
  user_id: string;
  mensagem: string;
  created_at: string;
}

export default function ChatPage() {
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [novaMensagem, setNovaMensagem] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id || null));
  }, []);

  useEffect(() => {
    async function fetchMensagens() {
      const { data } = await supabase
        .from("chat")
        .select("id, user_id, mensagem, created_at")
        .order("created_at", { ascending: true });
      setMensagens(data || []);
    }
    fetchMensagens();
    const channel = supabase
      .channel('chat-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chat' }, () => {
        fetchMensagens();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [mensagens]);

  async function enviarMensagem(e: React.FormEvent) {
    e.preventDefault();
    if (!novaMensagem.trim()) return;
    setEnviando(true);
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return;
    await supabase.from("chat").insert({ mensagem: novaMensagem, user_id: user.id });
    setNovaMensagem("");
    setEnviando(false);
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-950 to-purple-900 p-8 relative overflow-hidden">
      <div className="absolute left-1/3 top-1/4 w-80 h-80 bg-purple-400 blur-3xl opacity-20 rounded-full animate-pulse -z-10" />
      <div className="absolute right-1/4 bottom-1/4 w-72 h-72 bg-indigo-500 blur-2xl opacity-10 rounded-full animate-pulse -z-10" />
      <section className="bg-gradient-to-br from-black/80 via-indigo-900/80 to-purple-900/80 rounded-3xl shadow-2xl p-6 w-full max-w-lg flex flex-col border-2 border-purple-400/30 min-h-[500px]">
        <h1 className="text-3xl font-extrabold text-center text-purple-200 drop-shadow glow mb-4 tracking-widest font-caveat">💬 Chat Místico</h1>
        <div ref={chatRef} className="flex-1 overflow-y-auto space-y-2 mb-4 scrollbar-thin scrollbar-thumb-purple-400/40 scrollbar-track-transparent px-2">
          {mensagens.length === 0 && <p className="text-indigo-200 text-center">Nenhuma mensagem ainda.</p>}
          {mensagens.map((msg) => (
            <div key={msg.id} className={`max-w-[80%] px-4 py-2 rounded-2xl shadow-md text-sm font-medium mb-1 ${msg.user_id === userId ? "bg-gradient-to-r from-purple-700 to-indigo-700 text-white self-end ml-auto" : "bg-black/40 text-purple-100 self-start mr-auto"}`}>
              <span>{msg.mensagem}</span>
              <span className="block text-xs text-indigo-200 opacity-60 mt-1 text-right">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          ))}
        </div>
        <form className="flex gap-2 mt-2" onSubmit={enviarMensagem} autoComplete="off">
          <input
            type="text"
            className="flex-1 rounded-full px-4 py-2 border border-purple-400 bg-black/30 text-indigo-100 focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder:text-indigo-300"
            placeholder="Digite sua mensagem..."
            value={novaMensagem}
            onChange={e => setNovaMensagem(e.target.value)}
            disabled={enviando}
            maxLength={200}
            required
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-purple-700 via-indigo-700 to-emerald-700 hover:from-purple-500 hover:to-emerald-500 text-white font-bold py-2 px-6 rounded-full shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-purple-400/60 focus:ring-offset-2 focus:ring-offset-black/30 disabled:opacity-60"
            disabled={enviando}
          >
            Enviar
          </button>
        </form>
      </section>
    </main>
  );
}
