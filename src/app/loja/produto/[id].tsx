import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type Produto = {
  id: string;
  nome: string;
  descricao: string | null;
  preco: number;
  imagem_url: string | null;
};

export default async function ProdutoPage({ params }: { params: { id: string } }) {
  const { data, error } = await supabase
    .from("produtos")
    .select("id, nome, descricao, preco, imagem_url")
    .eq("id", params.id)
    .single();
  if (error || !data) return notFound();
  const produto = data as Produto;

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 to-purple-900 p-8 relative overflow-hidden">
      <div className="absolute left-1/3 top-1/4 w-80 h-80 bg-purple-400 blur-3xl opacity-20 rounded-full animate-pulse -z-10" />
      <div className="absolute right-1/4 bottom-1/4 w-72 h-72 bg-indigo-500 blur-2xl opacity-10 rounded-full animate-pulse -z-10" />
      <div className="bg-gradient-to-br from-black/80 via-indigo-900/80 to-purple-900/80 rounded-3xl shadow-2xl p-8 w-full max-w-md flex flex-col items-center gap-4 border-2 border-purple-400/30">
        {produto.imagem_url && (
          <Image
            src={produto.imagem_url}
            alt={produto.nome}
            width={200}
            height={200}
            className="w-48 h-48 object-contain mb-2 rounded-full bg-black/30 shadow-lg"
            priority
          />
        )}
        <h1 className="text-3xl font-extrabold text-purple-200 drop-shadow glow mb-2 tracking-widest font-caveat">{produto.nome}</h1>
        <span className="text-xl font-bold text-emerald-300 mb-2 drop-shadow">R$ {produto.preco}</span>
        <p className="text-indigo-100 mb-2 text-center text-sm italic font-light">{produto.descricao}</p>
        <Link href="/loja" className="text-indigo-200 hover:underline font-bold">Voltar para loja</Link>
      </div>
    </main>
  );
}
