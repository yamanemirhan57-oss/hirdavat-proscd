import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient"; // Supabase bağlantımız

/* ── SENİN EFSANE TASARIMININ STİLLERİ ── */
const globalStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=JetBrains+Mono:wght@400;600;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #080808; color: #f0f0f0; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #111; }
  ::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
  input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
  @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
  @keyframes slideIn { from { opacity:0; transform:scale(0.96); } to { opacity:1; transform:scale(1); } }
  .card-hover:hover { border-color: #333 !important; transform: translateY(-1px); transition: all 0.2s; }
  .btn-hover:hover { filter: brightness(1.2); transform: translateY(-1px); }
`;

const C = {
  bg: "#080808", surface: "#0f0f0f", card: "#141414", border: "#1f1f1f",
  orange: "#ff6b2b", green: "#10b981", red: "#f43f5e", textDim: "#888",
  mono: "'JetBrains Mono', monospace", display: "'Syne', sans-serif"
};

const KATEGORILER = [
  { ad: "Vidalarım", emoji: "🔩", renk: "#ff6b2b" },
  { ad: "Çivilerim", emoji: "📌", renk: "#fbbf24" },
  { ad: "El Aletlerim", emoji: "🔧", renk: "#3b82f6" },
  { ad: "Hırdavatım", emoji: "⚙️", renk: "#10b981" },
  { ad: "Diğerleri", emoji: "📦", renk: "#6b7280" }
];

/* ── UI BİLEŞENLERİ (Birebir Senin Tasarımın) ── */
function Tag({ children, color = C.orange, small }) {
  return <span style={{ background: color + "18", color, border: `1px solid ${color}35`, borderRadius: 5, padding: small ? "2px 7px" : "3px 10px", fontSize: small ? "0.65rem" : "0.72rem", fontWeight: 700, fontFamily: C.mono }}>{children}</span>;
}

function Btn({ children, color = C.orange, onClick, full, sm }) {
  return <button onClick={onClick} className="btn-hover" style={{ background: `${color}15`, color, border: `1px solid ${color}50`, borderRadius: 8, padding: sm ? "6px 14px" : "10px 20px", cursor: "pointer", fontWeight: 700, fontSize: sm ? "0.75rem" : "0.82rem", fontFamily: C.mono, width: full ? "100%" : "auto", transition: "all 0.15s" }}>{children}</button>;
}

/* ── ANA UYGULAMA ── */
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [pass, setPass] = useState("");
  const [tab, setTab] = useState("stok");
  const [stok, setStok] = useState([]);
  const [musteriler, setMusteriler] = useState([]);
  const [loading, setLoading] = useState(true);

  // Giriş yapınca buluttan verileri çek
  useEffect(() => { if (isLoggedIn) fetchAll(); }, [isLoggedIn]);

  const fetchAll = async () => {
    setLoading(true);
    const { data: sData } = await supabase.from('stok').select('*').order('ad');
    const { data: mData } = await supabase.from('musteriler').select('*').order('ad');
    if (sData) setStok(sData);
    if (mData) setMusteriler(mData);
    setLoading(false);
  };

  // Miktar güncelleme (Artık Supabase'e kaydediyor!)
  const miktarGuncelle = async (id, yeniMiktar) => {
    await supabase.from('stok').update({ stok: yeniMiktar }).eq('id', id);
    setStok(prev => prev.map(s => s.id === id ? { ...s, stok: yeniMiktar } : s));
  };

  // Borç güncelleme (Artık Supabase'e kaydediyor!)
  const borcGuncelle = async (id, yeniBorc) => {
    await supabase.from('musteriler').update({ borc: yeniBorc }).eq('id', id);
    setMusteriler(prev => prev.map(m => m.id === id ? { ...m, borc: yeniBorc } : m));
  };

  // Şifre Ekranı
  if (!isLoggedIn) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#080808', fontFamily: C.display }}>
      <style>{globalStyle}</style>
      <div style={{ background: '#141414', padding: '40px', borderRadius: '25px', border: '1px solid #1f1f1f', textAlign: 'center', width: '350px' }}>
        <h2 style={{ color: C.orange }}>🔩 HIRDAVAT PRO</h2>
        <input type="password" placeholder="Şifre" onChange={(e) => setPass(e.target.value)} style={{ width: '100%', padding: '12px', background: 'black', color: 'white', border: `1px solid ${C.border}`, borderRadius: '10px', margin: '20px 0', textAlign: 'center' }} />
        <Btn onClick={() => pass === "hirdavat2026" ? setIsLoggedIn(true) : alert("Hatalı!")} full color={C.orange}>GİRİŞ YAP</Btn>
      </div>
    </div>
  );

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.text }}>
      <style>{globalStyle}</style>
      
      {/* HEADER (Birebir Senin Tasarımın) */}
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "15px 30px", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontFamily: C.display, fontWeight: 900, color: C.orange }}>HIRDAVAT PRO</div>
          <div style={{ display: "flex", gap: 10 }}>
            {['stok', 'veresiye', 'rapor'].map(t => (
              <button key={t} onClick={() => setTab(t)} style={{ background: tab === t ? C.orange + "15" : "none", border: "none", color: tab === t ? C.orange : C.textDim, fontFamily: C.mono, fontWeight: 700, padding: "8px 15px", cursor: "pointer", borderRadius: "8px" }}>{t === 'veresiye' ? 'AÇIK DEFTER' : t.toUpperCase()}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "30px 20px" }}>
        
        {/* STOK SEKMESİ */}
        {tab === "stok" && (
          <div style={{ animation: "fadeIn 0.3s" }}>
            <div style={{ display: "grid", gap: "10px" }}>
              {stok.map(s => (
                <div key={s.id} className="card-hover" style={{ background: C.card, padding: "20px", borderRadius: "15px", border: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", gap: 15, alignItems: "center" }}>
                    <div style={{ fontSize: "1.5rem" }}>{KATEGORILER.find(k => k.ad === s.kategori)?.emoji || "📦"}</div>
                    <div>
                      <div style={{ fontWeight: 800, color: C.orange, fontFamily: C.display }}>{s.ad}</div>
                      <Tag color={C.textDim} small>{s.kategori} · ₺{s.fiyat}</Tag>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                    <div style={{ fontSize: "1.8rem", fontWeight: 900, fontFamily: C.display, color: s.stok <= s.kritik ? C.red : C.green }}>{s.stok}</div>
                    <div style={{ display: "flex", gap: 5 }}>
                      <Btn sm color={C.red} onClick={() => miktarGuncelle(s.id, s.stok - 1)}>−</Btn>
                      <Btn sm color={C.green} onClick={() => miktarGuncelle(s.id, s.stok + 1)}>+</Btn>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AÇIK DEFTER SEKMESİ */}
        {tab === "veresiye" && (
           <div style={{ animation: "fadeIn 0.3s" }}>
             <h2 style={{ fontFamily: C.display, marginBottom: 20 }}>📒 AÇIK DEFTER</h2>
             {musteriler.map(m => (
               <div key={m.id} style={{ background: C.card, padding: 20, borderRadius: 15, marginBottom: 10, display: "flex", justifyContent: "space-between", border: `1px solid ${C.border}`, alignItems: "center" }}>
                 <div>
                    <div style={{fontWeight: 700, fontSize: "1.1rem"}}>{m.ad}</div>
                    <div style={{fontSize: "0.8rem", color: C.textDim}}>{m.tel}</div>
                 </div>
                 <div style={{display: "flex", alignItems: "center", gap: 15}}>
                    <span style={{ color: C.red, fontWeight: 900, fontSize: "1.3rem" }}>₺{m.borc.toLocaleString()}</span>
                    <div style={{display: "flex", gap: 5}}>
                        <Btn sm color={C.green} onClick={() => borcGuncelle(m.id, m.borc - 100)}>ÖDEDİ</Btn>
                        <Btn sm color={C.red} onClick={() => borcGuncelle(m.id, m.borc + 100)}>BORÇ</Btn>
                    </div>
                 </div>
               </div>
             ))}
           </div>
        )}

        {/* RAPOR SEKMESİ */}
        {tab === "rapor" && (
          <div style={{ animation: "fadeIn 0.3s", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
            <div style={{ background: C.card, padding: 30, borderRadius: 20, border: `1px solid ${C.green}30`, textAlign: "center" }}>
              <div style={{ color: C.textDim, fontSize: "0.7rem", marginBottom: 10 }}>TOPLAM MAL DEĞERİ</div>
              <div style={{ fontSize: "2.2rem", fontWeight: 900, color: C.green }}>₺{stok.reduce((a, s) => a + (s.stok * s.fiyat), 0).toLocaleString()}</div>
            </div>
            <div style={{ background: C.card, padding: 30, borderRadius: 20, border: `1px solid ${C.red}30`, textAlign: "center" }}>
              <div style={{ color: C.textDim, fontSize: "0.7rem", marginBottom: 10 }}>TOPLAM ALACAK</div>
              <div style={{ fontSize: "2.2rem", fontWeight: 900, color: C.red }}>₺{musteriler.reduce((a, m) => a + m.borc, 0).toLocaleString()}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
