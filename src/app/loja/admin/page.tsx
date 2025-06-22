"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";

export default function AdminProduto() {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [imagem, setImagem] = useState<File | null>(null);
  const [mensagem, setMensagem] = useState("");
  const [uploading, setUploading] = useState(false);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [editNome, setEditNome] = useState("");
  const [editDescricao, setEditDescricao] = useState("");
  const [editPreco, setEditPreco] = useState("");

  type Produto = {
    id: string;
    nome: string;
    descricao: string | null;
    preco: number;
    imagem_url: string | null;
  };

  useEffect(() => {
    async function fetchProdutos() {
      const { data } = await supabase.from("produtos").select("id, nome, descricao, preco, imagem_url");
      setProdutos(data || []);
    }
    fetchProdutos();
  }, [mensagem]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMensagem("");
    setUploading(true);
    let imagem_url = null;
    if (imagem) {
      const fileExt = imagem.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const { data, error } = await supabase.storage.from("produtos").upload(fileName, imagem);
      if (error) {
        setMensagem("Erro ao enviar imagem: " + error.message);
        setUploading(false);
        return;
      }
      imagem_url = data?.path ? supabase.storage.from("produtos").getPublicUrl(data.path).data.publicUrl : null;
    }
    const { error: insertError } = await supabase.from("produtos").insert({
      nome,
      descricao,
      preco: parseFloat(preco),
      imagem_url
    });
    if (insertError) setMensagem("Erro ao cadastrar produto: " + insertError.message);
    else setMensagem("Produto cadastrado com sucesso!");
    setUploading(false);
    setNome("");
    setDescricao("");
    setPreco("");
    setImagem(null);
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;
    await supabase.from("produtos").delete().eq("id", id);
    setMensagem("Produto excluído!");
  }

  function startEdit(produto: Produto) {
    setEditId(produto.id);
    setEditNome(produto.nome);
    setEditDescricao(produto.descricao || "");
    setEditPreco(produto.preco.toString());
  }

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editId) return;
    await supabase.from("produtos").update({ nome: editNome, descricao: editDescricao, preco: parseFloat(editPreco) }).eq("id", editId);
    setMensagem("Produto atualizado!");
    setEditId(null);
  }

  return (
    <>
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 to-purple-900 p-8 relative overflow-hidden">
        <div className="absolute left-1/3 top-1/4 w-80 h-80 bg-purple-400 blur-3xl opacity-20 rounded-full animate-pulse -z-10" />
        <div className="absolute right-1/4 bottom-1/4 w-72 h-72 bg-indigo-500 blur-2xl opacity-10 rounded-full animate-pulse -z-10" />
        <form className="bg-gradient-to-br from-black/80 via-indigo-900/80 to-purple-900/80 rounded-3xl shadow-2xl p-8 w-full max-w-md flex flex-col gap-4 border-2 border-purple-400/30" onSubmit={handleSubmit}>
          <h1 className="text-3xl font-extrabold text-center text-purple-200 drop-shadow glow mb-4 tracking-widest font-caveat">✨ Cadastrar Produto</h1>
          <input
            type="text"
            placeholder="Nome do produto"
            className="rounded px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={nome}
            onChange={e => setNome(e.target.value)}
            required
          />
          <textarea
            placeholder="Descrição"
            className="rounded px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={descricao}
            onChange={e => setDescricao(e.target.value)}
            rows={2}
          />
          <input
            type="number"
            placeholder="Preço (R$)"
            className="rounded px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={preco}
            onChange={e => setPreco(e.target.value)}
            min={0}
            step={0.01}
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={e => setImagem(e.target.files?.[0] || null)}
            className="file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
          <button
            type="submit"
            className="bg-indigo-700 hover:bg-indigo-800 text-white font-semibold py-2 rounded transition-colors disabled:opacity-60"
            disabled={uploading}
          >
            {uploading ? "Enviando..." : "Cadastrar"}
          </button>
          {mensagem && <p className="text-center mt-2 text-indigo-900 dark:text-indigo-200">{mensagem}</p>}
        </form>
      </main>
      <section className="max-w-2xl mx-auto mt-8">
        <h2 className="text-2xl font-extrabold mb-4 text-purple-200 drop-shadow glow font-caveat">Produtos cadastrados</h2>
        <ul className="space-y-4">
          {produtos.map((produto) => (
            <li key={produto.id} className="bg-gradient-to-br from-purple-900/80 via-indigo-900/80 to-emerald-900/80 border-2 border-purple-400/30 shadow-2xl rounded-3xl p-4 flex flex-col sm:flex-row items-center gap-4">
              {produto.imagem_url && (
                <Image src={produto.imagem_url} alt={produto.nome} width={64} height={64} className="rounded-full w-16 h-16 object-contain bg-black/30 shadow-lg" />
              )}
              {editId === produto.id ? (
                <form onSubmit={handleEdit} className="flex flex-col sm:flex-row gap-2 flex-1">
                  <input value={editNome} onChange={e => setEditNome(e.target.value)} className="rounded px-2 py-1 border border-purple-400 bg-black/30 text-indigo-100" required />
                  <input value={editDescricao} onChange={e => setEditDescricao(e.target.value)} className="rounded px-2 py-1 border border-purple-400 bg-black/30 text-indigo-100" />
                  <input type="number" value={editPreco} onChange={e => setEditPreco(e.target.value)} className="rounded px-2 py-1 border border-purple-400 bg-black/30 text-indigo-100" required min={0} step={0.01} />
                  <button type="submit" className="bg-indigo-700 text-white px-3 py-1 rounded">Salvar</button>
                  <button type="button" onClick={() => setEditId(null)} className="bg-gray-300 px-3 py-1 rounded">Cancelar</button>
                </form>
              ) : (
                <>
                  <div className="flex-1">
                    <div className="font-bold text-purple-200 drop-shadow font-caveat text-lg">{produto.nome}</div>
                    <div className="text-indigo-100 text-sm italic font-light">{produto.descricao}</div>
                    <div className="text-emerald-300 font-bold">R$ {produto.preco}</div>
                  </div>
                  <button onClick={() => startEdit(produto)} className="bg-yellow-500 text-white px-3 py-1 rounded mr-2">Editar</button>
                  <button onClick={() => handleDelete(produto.id)} className="bg-red-600 text-white px-3 py-1 rounded">Excluir</button>
                </>
              )}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
