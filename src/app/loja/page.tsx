import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export const revalidate = 0; // SSR para sempre buscar os produtos mais recentes

type Produto = {
  id: string;
  nome: string;
  descricao: string | null;
  preco: number;
  imagem_url: string | null;
};

async function getProdutos(): Promise<Produto[]> {
  const { data, error } = await supabase.from("produtos").select("id, nome, descricao, preco, imagem_url");
  if (error) throw new Error(error.message);
  return (data as Produto[]) || [];
}

export default async function LojaPage() {
  const produtos = await getProdutos();

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-950 to-purple-900 p-8">
      <h1 className="text-3xl font-bold text-center text-indigo-100 mb-10 drop-shadow-lg">Loja Mística do Clã Michetti</h1>
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-6xl mx-auto">
        {produtos.length === 0 && (
          <p className="col-span-full text-center text-indigo-200">Nenhum produto cadastrado ainda.</p>
        )}
        {produtos.map((produto) => (
          <div
            key={produto.id}
            className="bg-gradient-to-br from-purple-900/80 via-indigo-900/80 to-emerald-900/80 border-2 border-purple-400/30 shadow-2xl rounded-3xl p-5 flex flex-col items-center group transition-transform hover:scale-105 hover:shadow-purple-500/40 focus-within:scale-105 focus-within:shadow-purple-500/40 outline-none"
            tabIndex={0}
          >
            {produto.imagem_url && (
              <Link href={`/loja/produto/${produto.id}`} aria-label={`Ver detalhes de ${produto.nome}`}
                className="block mb-2 rounded-full ring-2 ring-purple-400/40 group-hover:ring-4 group-focus:ring-4 transition-all">
                <Image
                  src={produto.imagem_url}
                  alt={produto.nome}
                  width={128}
                  height={128}
                  className="w-32 h-32 object-contain rounded-full bg-black/30 shadow-lg group-hover:shadow-purple-400/40 group-focus:shadow-purple-400/40"
                  priority
                />
              </Link>
            )}
            <h2 className="text-2xl font-extrabold text-purple-200 drop-shadow mb-1 tracking-wide font-caveat">{produto.nome}</h2>
            <p className="text-indigo-100 mb-2 text-center text-sm italic font-light">{produto.descricao}</p>
            <span className="text-xl font-bold text-emerald-300 mb-2 drop-shadow">R$ {produto.preco}</span>
            <button
              className="mt-auto bg-gradient-to-r from-purple-700 via-indigo-700 to-emerald-700 hover:from-purple-500 hover:to-emerald-500 text-white font-bold py-2 px-6 rounded-full shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-purple-400/60 focus:ring-offset-2 focus:ring-offset-black/30"
              onClick={() => alert('Compra simulada!')}
              aria-label={`Comprar ${produto.nome}`}
            >
              <span className="drop-shadow glow">Comprar ✨</span>
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
