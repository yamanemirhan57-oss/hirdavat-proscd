import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

/* ── GLOBAL STYLES (Senin Tasarımın) ── */
const globalStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=JetBrains+Mono:wght@400;600;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #080808; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #111; }
  ::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
  @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
  @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
  @keyframes slideIn { from { opacity:0; transform:scale(0.96); } to { opacity:1; transform:scale(1); } }
  .card-hover:hover { border-color: #333 !important; transform: translateY(-1px); transition: all 0.2s; }
  .btn-hover:hover { filter: brightness(1.2); transform: translateY(-1px); }
`;

const C = {
  bg: "#080808", surface: "#0f0f0f", card: "#141414", border: "#1f1f1f",
  borderBright: "#2a2a2a", orange: "#ff6b2b", yellow: "#fbbf24",
  green: "#10b981", red: "#f43f5e", blue: "#3b82f6", text: "#f0f0f0",
  textDim: "#888", mono: "'JetBrains Mono', monospace", display: "'Syne', sans-serif",
};

const KATEGORILER = [
  { ad: "Vidalarım", emoji: "🔩", renk: "#ff6b2b" },
  { ad: "Çivilerim", emoji: "📌", renk: "#fbbf24" },
  { ad: "El Aletlerim", emoji: "🔧", renk: "#3b82f6" },
  { ad: "Elektriğim", emoji: "⚡", renk: "#eab308" },
  { ad: "Silikonlarım", emoji: "🎨", renk: "#ec4899" },
  { ad: "Borularım", emoji: "🔗", renk: "#06b6d4" },
  { ad: "Yapı", emoji: "🧱", renk: "#a78bfa" },
  { ad: "Hırdavatım", emoji: "⚙️", renk: "#10b981" },
  { ad: "Diğerleri", emoji: "📦", renk: "#6b7280" },
];

/* ── UI BİLEŞENLERİ (Senin Tasarımın) ── */
function Tag({ children, color = C.orange, small }) {
  return <span style={{ background: color + "18", color, border: `1px solid ${color}35`, borderRadius: 5, padding: small ? "2px 7px" : "3px 10px", fontSize: small ? "0.65rem" : "0.72rem", fontWeight: 700, fontFamily: C.mono, whiteSpace: "nowrap" }}>{children}</span>;
}

function Btn({ children, color = C.orange, onClick, full, sm, disabled }) {
  return <button onClick={onClick} disabled={disabled} className="btn-hover" style={{ background: `${color}15`, color, border: `1px solid ${color}50`, borderRadius: 8, padding: sm ? "6px 14px" : "10px 20px", cursor: "pointer", fontWeight: 700, fontSize: sm ? "0.75rem" : "0.82rem", fontFamily: C.mono, width: full ? "100%" : "auto" }}>{children}</button>;
}

// Yeni: Güvenlik Kapısı
const Login = ({ onLogin }) => {
  const [pass, setPass] = useState("");
  return (
    <div style={{height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:C.bg, color:'white', fontFamily:C.display}}>
      <div style={{background:C.card, padding:'40px', borderRadius:'20px', border:`1px solid ${C.border}`, textAlign:'center', width:'350px'}}>
        <h2 style={{color:C.orange, marginBottom:'10px'}}>🔩 HIRDAVAT PRO</h2>
        <input type="password" placeholder="Yönetici Şifresi" onChange={(e)=>setPass(e.target.value)} style={{width:'100%', padding:'12px', borderRadius:'10px', border:`1px solid ${C.borderBright}`, background:'black', color:'white', margin:'20px 0', textAlign:'center', outline:'none'}} />
        <Btn onClick={() => pass === "hirdavat2026" ? onLogin() : alert("Şifre Hatalı!")} full color={C.orange}>Sisteme Gir</Btn>
      </div>
    </div>
  );
};

/* ── ANA UYGULAMA ── */
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tab, setTab] = useState("stok");
  const [stok, setStok] = useState([]);
  const [loading, setLoading] = useState(true);

  // SUPABASE'DEN VERİ ÇEKME
  useEffect(() => {
    if (isLoggedIn) {
      const verileriCek = async () => {
        const { data } = await supabase.from('stok').select('*').order('ad');
        if (data) setStok(data);
        setLoading(false);
      };
      verileriCek();
    }
  }, [isLoggedIn]);

  // STOK GÜNCELLEME (Supabase'e yazar)
  const stokGuncelle = async (id, yeniMiktar) => {
    const { error } = await supabase.from('stok').update({ stok: yeniMiktar }).eq('id', id);
    if (!error) setStok(prev => prev.map(s => s.id === id ? { ...s, stok: yeniMiktar } : s));
  };

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = globalStyle;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  if (!isLoggedIn) return <Login onLogin={() => setIsLoggedIn(true)} />;

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.text }}>
      {/* Senin Header Tasarımın */}
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "0 1.5rem", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: C.orange + "20", border: `2px solid ${C.orange}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>🔩</div>
            <div style={{fontFamily: C.display, fontWeight: 900, color: C.orange}}>HIRDAVAT PRO</div>
          </div>
          <div style={{ display: "flex", gap: 5 }}>
            {['stok', 'veresiye', 'rapor'].map(t => (
              <button key={t} onClick={() => setTab(t)} style={{ background: tab === t ? C.orange + "15" : "none", border: "none", color: tab === t ? C.orange : C.textDim, fontFamily: C.mono, fontSize: "0.8rem", fontWeight: 700, padding: "8px 15px", cursor: "pointer", borderRadius: "8px" }}>{t.toUpperCase()}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "1.8rem 1.2rem" }}>
        {loading ? (
          <p style={{fontFamily:C.mono, color:C.textDim}}>Bulut veritabanına bağlanılıyor...</p>
        ) : (
          <div style={{ animation: "fadeIn 0.4s ease" }}>
            {tab === "stok" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {stok.map(s => {
                  const kat = KATEGORILER.find(k => k.ad === s.kategori);
                  return (
                    <div key={s.id} className="card-hover" style={{ background: C.card, borderRadius: 14, border: `1px solid ${C.border}`, padding: "1rem 1.2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
                        <div style={{ fontSize: "1.5rem", background: s.renk + "10", width: 45, height: 45, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${s.renk}30` }}>{kat?.emoji || "📦"}</div>
                        <div>
                          <div style={{ fontFamily: C.display, fontWeight: 800, fontSize: "0.95rem", color: s.renk }}>{s.ad}</div>
                          <Tag color={C.textDim} small>{s.kategori} · {s.kod}</Tag>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontFamily: C.display, fontWeight: 900, fontSize: "1.4rem", color: C.green }}>{s.stok}</div>
                          <div style={{ fontSize: "0.6rem", color: C.textDim, fontFamily: C.mono }}>ADET</div>
                        </div>
                        <div style={{ display: "flex", gap: 5 }}>
                          <Btn sm color={C.red} onClick={() => stokGuncelle(s.id, s.stok - 1)}>−</Btn>
                          <Btn sm color={C.green} onClick={() => stokGuncelle(s.id, s.stok + 1)}>+</Btn>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {tab !== "stok" && <p style={{color:C.textDim, textAlign:'center', marginTop:'50px', fontFamily:C.mono}}>Bu sekme için Supabase ayarlarını yapıyoruz kanka...</p>}
          </div>
        )}
      </div>
    </div>
  );
}
