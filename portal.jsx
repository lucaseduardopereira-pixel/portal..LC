/*
portal.LC - Single-file React + Tailwind starter
Theme: preto e vermelho
Features included (client-only, no backend):
 - Animated "real-time" country-style panorama background (SVG + CSS animation)
 - Header with logo/title (portal.LC) and theme colors
 - Sections: Posts (texto), Links, Galeria de fotos (upload client-side), Feed (cards)
 - Admin controls (local state): criar post, adicionar link, subir imagens com preview
 - Responsivo e pronto pra personalizar

How to use:
1) Crie um projeto React (Vite recomendado):
   npm create vite@latest portal-lc -- --template react
   cd portal-lc
   npm install

2) Instale TailwindCSS (siga docs Tailwind). Quick setup:
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   // then configure tailwind.config.cjs content paths and add @tailwind directives to index.css

3) Copie este arquivo para src/App.jsx e rode:
   npm run dev

4) Deploy: Vercel or Netlify — faça deploy do repositório GitHub.

Want me to add: autenticação, banco (Supabase/Firestore), CMS, ou publicar pra você? Me diz.
*/

import React, { useState, useRef } from "react";

export default function App() {
  // Posts: {id, title, body, created}
  const [posts, setPosts] = useState([]);
  const [links, setLinks] = useState([]);
  const [images, setImages] = useState([]);

  const titleRef = useRef();
  const bodyRef = useRef();
  const linkLabelRef = useRef();
  const linkUrlRef = useRef();

  function addPost(e) {
    e?.preventDefault();
    const title = titleRef.current.value.trim();
    const body = bodyRef.current.value.trim();
    if (!title && !body) return;
    const p = { id: Date.now(), title, body, created: new Date().toISOString() };
    setPosts([p, ...posts]);
    titleRef.current.value = "";
    bodyRef.current.value = "";
  }

  function addLink(e) {
    e?.preventDefault();
    const label = linkLabelRef.current.value.trim();
    const url = linkUrlRef.current.value.trim();
    if (!url) return;
    const l = { id: Date.now(), label: label || url, url };
    setLinks([l, ...links]);
    linkLabelRef.current.value = "";
    linkUrlRef.current.value = "";
  }

  function handleImageUpload(e) {
    const files = Array.from(e.target.files || []);
    const readers = files.map((f) => {
      return new Promise((res) => {
        const r = new FileReader();
        r.onload = () => res({ id: Date.now() + Math.random(), name: f.name, src: r.result });
        r.readAsDataURL(f);
      });
    });
    Promise.all(readers).then((imgs) => setImages((s) => [...imgs, ...s]));
  }

  function removeImage(id) {
    setImages((s) => s.filter((i) => i.id !== id));
  }

  // Simple clock for "real-time" feel
  const [now, setNow] = useState(new Date());
  React.useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen font-sans antialiased bg-black text-gray-100">
      {/* animated background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <AnimatedPanorama time={now} />
      </div>

      <header className="backdrop-blur-md bg-black/40 border-b border-red-900/40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-black font-bold text-lg">LC</div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight">portal.LC</h1>
              <p className="text-sm text-red-300/80">Seu espaço — publique links, fotos, posts e mais</p>
            </div>
          </div>

          <nav className="flex items-center gap-4">
            <a href="#posts" className="px-3 py-1 rounded hover:bg-red-900/30">Posts</a>
            <a href="#links" className="px-3 py-1 rounded hover:bg-red-900/30">Links</a>
            <a href="#gallery" className="px-3 py-1 rounded hover:bg-red-900/30">Galeria</a>
            <a href="#feed" className="px-3 py-1 rounded bg-red-700/80 text-black font-semibold">Feed</a>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <section className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <section id="posts" className="bg-black/50 p-4 rounded-lg border border-red-900/40">
              <h2 className="text-xl font-bold">Criar Post</h2>
              <form onSubmit={addPost} className="space-y-3 mt-3">
                <input ref={titleRef} placeholder="Título" className="w-full bg-transparent border border-red-800/40 rounded px-3 py-2" />
                <textarea ref={bodyRef} placeholder="Escreva aqui..." rows={4} className="w-full bg-transparent border border-red-800/40 rounded px-3 py-2" />
                <div className="flex gap-2">
                  <button type="submit" className="px-4 py-2 rounded bg-red-700 font-semibold text-black">Publicar</button>
                  <button type="button" onClick={() => { titleRef.current.value = ''; bodyRef.current.value = '' }} className="px-4 py-2 rounded border">Limpar</button>
                </div>
              </form>

              <div className="mt-6">
                <h3 className="font-semibold">Posts recentes</h3>
                <div className="space-y-3 mt-3">
                  {posts.length === 0 ? <p className="text-sm text-red-300/60">Nenhum post ainda.</p> : posts.map(p => (
                    <article key={p.id} className="p-3 bg-black/60 rounded border border-red-900/30">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-bold">{p.title || 'Sem título'}</h4>
                          <p className="text-sm text-red-200/80">{new Date(p.created).toLocaleString()}</p>
                        </div>
                        <div>
                          <button onClick={() => setPosts(posts.filter(x => x.id !== p.id))} className="text-sm px-3 py-1 rounded border">Remover</button>
                        </div>
                      </div>
                      {p.body && <p className="mt-2 text-sm">{p.body}</p>}
                    </article>
                  ))}
                </div>
              </div>
            </section>

            <section id="feed" className="mt-6 bg-black/50 p-4 rounded-lg border border-red-900/40">
              <h2 className="text-xl font-bold">Feed</h2>
              <p className="text-sm text-red-300/80 mt-2">Aqui aparecem seus posts, links e imagens — tudo em um lugar.</p>

              <div className="mt-4 grid sm:grid-cols-2 gap-4">
                {posts.slice(0,6).map(p => (
                  <div key={p.id} className="p-3 border rounded bg-gradient-to-br from-black/40 to-black/20">
                    <h4 className="font-bold">{p.title || 'Sem título'}</h4>
                    <p className="text-xs text-red-200/80">{new Date(p.created).toLocaleString()}</p>
                    <p className="mt-2 text-sm">{p.body}</p>
                  </div>
                ))}

                {images.slice(0,6).map(img => (
                  <div key={img.id} className="p-0 border rounded overflow-hidden">
                    <img src={img.src} alt={img.name} className="w-full h-40 object-cover" />
                  </div>
                ))}

                {links.slice(0,6).map(l => (
                  <a key={l.id} href={l.url} target="_blank" rel="noreferrer" className="p-3 border rounded flex flex-col">
                    <span className="font-semibold text-sm">{l.label}</span>
                    <span className="text-xs text-red-200/80 truncate">{l.url}</span>
                  </a>
                ))}

                {posts.length === 0 && images.length === 0 && links.length === 0 && (
                  <p className="text-sm text-red-300/70">Seu feed está vazio — publique algo!</p>
                )}
              </div>
            </section>

          </div>

          <aside className="space-y-6">
            <section id="links" className="bg-black/50 p-4 rounded-lg border border-red-900/40">
              <h3 className="font-bold">Adicionar Link</h3>
              <form onSubmit={addLink} className="mt-3 space-y-2">
                <input ref={linkLabelRef} placeholder="Rótulo (opcional)" className="w-full bg-transparent border border-red-800/40 rounded px-3 py-2" />
                <input ref={linkUrlRef} placeholder="https://example.com" className="w-full bg-transparent border border-red-800/40 rounded px-3 py-2" />
                <div className="flex gap-2">
                  <button className="px-3 py-1 rounded bg-red-700 text-black font-semibold">Adicionar</button>
                </div>
              </form>

              <div className="mt-4 space-y-2">
                {links.length === 0 ? <p className="text-sm text-red-300/60">Nenhum link salvo.</p> : links.map(l => (
                  <div key={l.id} className="flex items-center justify-between border rounded p-2">
                    <a href={l.url} target="_blank" rel="noreferrer" className="truncate">{l.label}</a>
                    <button onClick={() => setLinks(links.filter(x => x.id !== l.id))} className="px-2 py-1 rounded border text-sm">X</button>
                  </div>
                ))}
              </div>
            </section>

            <section id="gallery" className="bg-black/50 p-4 rounded-lg border border-red-900/40">
              <h3 className="font-bold">Galeria</h3>
              <p className="text-sm text-red-300/80">Faça upload de imagens (client-side). Salve externamente para manter permanente.</p>
              <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="mt-3" />

              <div className="mt-3 grid grid-cols-2 gap-2">
                {images.length === 0 ? <p className="text-sm text-red-300/60">Nenhuma imagem.</p> : images.map(img => (
                  <div key={img.id} className="relative">
                    <img src={img.src} alt={img.name} className="w-full h-28 object-cover rounded" />
                    <button onClick={() => removeImage(img.id)} className="absolute top-1 right-1 bg-black/60 px-2 py-1 rounded text-sm">Remover</button>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-black/50 p-4 rounded-lg border border-red-900/40">
              <h4 className="font-bold">Informações</h4>
              <p className="text-sm text-red-300/80 mt-2">Relógio (tempo real): {now.toLocaleTimeString()}</p>
              <p className="text-sm text-red-300/80">Dica: conecte um backend (Supabase, Firebase) para persistência.</p>
            </section>
          </aside>
        </section>

        <footer className="mt-12 text-center text-sm text-red-300/70">
          © {new Date().getFullYear()} portal.LC — Crie, compartilhe e personalize.
        </footer>
      </main>
    </div>
  );
}

/* AnimatedPanorama component (inside same file for convenience) */

function AnimatedPanorama({ time }) {
  // time is used to change sky color subtly
  const seconds = time.getSeconds();
  const skyOpacity = 0.6 + (Math.sin(seconds / 60 * Math.PI * 2) * 0.15);

  return (
    <div className="w-full h-full relative">
      <svg className="w-full h-full" preserveAspectRatio="xMidYMax slice" viewBox="0 0 1600 900" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="sky" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#0b0b0b" stopOpacity={skyOpacity} />
            <stop offset="100%" stopColor="#000000" stopOpacity={0.9} />
          </linearGradient>
          <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="10" />
          </filter>
        </defs>

        <rect width="100%" height="100%" fill="url(#sky)" />

        {/* distant mountains */}
        <g transform="translate(0,220) scale(1)">
          <path d="M0,420 C200,300 400,360 600,300 C800,240 1000,340 1200,300 C1400,260 1600,360 1600,360 L1600,420 L0,420 Z" fill="#0e0e0e" />
          <path d="M0,420 C180,360 420,420 640,360 C880,300 1040,380 1260,320 C1480,260 1600,320 1600,320 L1600,420 L0,420 Z" fill="#111" opacity="0.7" />
        </g>

        {/* mid hills */}
        <g transform="translate(0,380)">
          <path d="M0,220 C180,160 420,200 640,140 C880,80 1040,160 1260,100 C1480,40 1600,120 1600,120 L1600,220 L0,220 Z" fill="#120202" />
        </g>

        {/* foreground ground */}
        <g transform="translate(0,520)">
          <rect x="0" y="0" width="1600" height="380" fill="#070707" />
        </g>

        {/* moving clouds - animated using CSS */}
        <g className="clouds" transform="translate(0,0)">
          <g className="cloud c1" transform="translate(100,120) scale(0.9)">
            <ellipse cx="0" cy="0" rx="90" ry="30" fill="#111" opacity="0.6" />
            <ellipse cx="60" cy="-10" rx="60" ry="24" fill="#111" opacity="0.6" />
            <ellipse cx="-60" cy="-10" rx="60" ry="24" fill="#111" opacity="0.6" />
          </g>
          <g className="cloud c2" transform="translate(800,80) scale(1.1)">
            <ellipse cx="0" cy="0" rx="120" ry="36" fill="#111" opacity="0.55" />
            <ellipse cx="70" cy="-12" rx="72" ry="28" fill="#111" opacity="0.55" />
          </g>
          <g className="cloud c3" transform="translate(1200,60) scale(0.7)">
            <ellipse cx="0" cy="0" rx="80" ry="28" fill="#111" opacity="0.5" />
          </g>
        </g>

        {/* subtle red glow at horizon */}
        <rect x="0" y="410" width="1600" height="6" fill="#5d0b0b" opacity="0.6" />

      </svg>

      <style>{`
        .clouds { position: absolute; left:0; top:0; width:100%; height:100%; }
        .cloud { transform-origin: center; }
        .cloud.c1 { animation: moveClouds 40s linear infinite; }
        .cloud.c2 { animation: moveClouds 60s linear infinite reverse; }
        .cloud.c3 { animation: moveClouds 50s linear infinite; }
        @keyframes moveClouds {
          0% { transform: translateX(-10%) translateY(0); opacity:0.65 }
          50% { transform: translateX(50%) translateY(-6px); opacity:0.9 }
          100% { transform: translateX(110%) translateY(0); opacity:0.65 }
        }
      `}</style>
    </div>
  );
}
