"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function PerfilMembro() {
  const [avatar, setAvatar] = useState<File | null>(null);
  const [nome, setNome] = useState("");
  const [bio, setBio] = useState("");
  const [uploading, setUploading] = useState(false);
  const [mensagem, setMensagem] = useState("");

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    setMensagem("");
    if (!avatar) {
      setMensagem("Selecione uma imagem.");
      return;
    }
    setUploading(true);
    const fileExt = avatar.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const { data, error } = await supabase.storage.from("avatars").upload(fileName, avatar);
    if (error) {
      setMensagem("Erro ao enviar imagem: " + error.message);
      setUploading(false);
      return;
    }
    // Salvar o perfil no banco
    const avatar_url = data?.path ? supabase.storage.from("avatars").getPublicUrl(data.path).data.publicUrl : null;
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) {
      setMensagem("Usuário não autenticado.");
      setUploading(false);
      return;
    }
    const { error: upsertError } = await supabase.from("membros").upsert({
      user_id: user.id,
      nome,
      bio,
      avatar_url
    });
    if (upsertError) setMensagem("Erro ao salvar perfil: " + upsertError.message);
    else setMensagem("Perfil atualizado com sucesso!");
    setUploading(false);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 to-purple-900 p-8 relative overflow-hidden">
      <div className="absolute left-1/3 top-1/4 w-80 h-80 bg-purple-400 blur-3xl opacity-20 rounded-full animate-pulse -z-10" />
      <div className="absolute right-1/4 bottom-1/4 w-72 h-72 bg-indigo-500 blur-2xl opacity-10 rounded-full animate-pulse -z-10" />
      <form className="bg-gradient-to-br from-black/80 via-indigo-900/80 to-purple-900/80 rounded-3xl shadow-2xl p-8 w-full max-w-md flex flex-col gap-4 border-2 border-purple-400/30" onSubmit={handleUpload}>
        <h1 className="text-3xl font-extrabold text-center text-purple-200 drop-shadow glow mb-4 tracking-widest font-caveat">🧙‍♂️ Perfil do Membro</h1>
        <input
          type="text"
          placeholder="Nome do bruxo(a)"
          className="rounded px-3 py-2 border border-purple-400 bg-black/30 text-indigo-100 focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder:text-indigo-300"
          value={nome}
          onChange={e => setNome(e.target.value)}
          required
        />
        <textarea
          placeholder="Bio, poderes, história..."
          className="rounded px-3 py-2 border border-purple-400 bg-black/30 text-indigo-100 focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder:text-indigo-300"
          value={bio}
          onChange={e => setBio(e.target.value)}
          rows={3}
        />
        <input
          type="file"
          accept="image/*"
          onChange={e => setAvatar(e.target.files?.[0] || null)}
          className="file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-purple-700 via-indigo-700 to-emerald-700 hover:from-purple-500 hover:to-emerald-500 text-white font-bold py-2 rounded-full shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-purple-400/60 focus:ring-offset-2 focus:ring-offset-black/30 disabled:opacity-60"
          disabled={uploading}
        >
          {uploading ? "Enviando..." : "Salvar perfil"}
        </button>
        {mensagem && <p className="text-center mt-2 text-purple-200 font-bold drop-shadow">{mensagem}</p>}
      </form>
    </main>
  );
}
