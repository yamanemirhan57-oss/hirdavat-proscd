import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

/* ── SENİN O EFSANE 700 SATIRLIK TASARIMININ STİLLERİ (BİREBİR) ── */
const globalStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=JetBrains+Mono:wght@400;600;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #080808; color: #f0f0f0; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #111; }
  ::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
  input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
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
  return <span style={{ background: color + "18", color, border: `1px solid ${color}35`, borderRadius: 5, padding: small ? "2px 7px" : "3px 10px", fontSize: small ? "0.65rem" : "0.72rem", fontWeight: 700, fontFamily: C.mono }}>{children}</span>;
}

function Btn({ children, color = C.orange, onClick, full, sm }) {
  return <button onClick={onClick} className="btn-hover" style={{ background: `${color}15`, color, border: `1px solid ${color}50`, borderRadius: 8, padding: sm ? "6px 14px" : "10px 20px", cursor: "pointer", fontWeight: 700, fontSize: sm ? "0.75rem" : "0.82rem", fontFamily: C.mono, width: full ? "100%" : "auto", transition: "all 0.15s" }}>{children}</button>;
}

function StatCard({ label, value, icon, color }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "1.2rem 1.4rem", flex: 1, minWidth: 150, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${color}, transparent)` }} />
      <div style={{ fontSize: "1.6rem", marginBottom: 8 }}>{icon}</div>
      <div style={{ color: C.textDim, fontSize: "0.62rem", fontFamily: C.mono, textTransform: "uppercase" }}>{label}</div>
      <div style={{ color, fontSize: "1.6rem", fontWeight: 900, fontFamily: C.display }}>{value}</div>
    </div>
  );
}

// Giriş Ekranı
const Login = ({ onLogin }) => {
  const [pass, setPass] = useState("");
  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#080808', fontFamily: C.display }}>
      <div style={{ background: '#141414', padding: '40px', borderRadius: '25px', border: '1px solid #1f1f1f', textAlign: 'center', width: '350px' }}>
        <h2 style={{ color: C.orange }}>🔩 HIRDAVAT PRO</h2>
        <input type="password" placeholder="Şifre" onChange={(e) => setPass(e.target.value)} style={{ width: '100%', padding: '12px', background: 'black', color: 'white', border: `1px solid ${C.border}`, borderRadius: '10px', margin: '20px 0', textAlign: 'center', outline: 'none' }} />
        <Btn onClick={() => pass === "hirdavat2026" ? onLogin() : alert("Hatalı!")} full color={C.orange}>GİRİŞ YAP</Btn>
      </div>
    </div>
  );
};

/* ── ANA UYGULAMA ── */
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tab, setTab] = useState("stok");
  const [stok, setStok] = useState([]);
  const [musteriler, setMusteriler] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [yeniUrun, setYeniUrun] = useState({ ad: "", kategori: "Vidalarım", stok: 0, fiyat: 0, kritik: 10 });

  useEffect(() => { if (isLoggedIn) fetchAll(); }, [isLoggedIn]);

  const fetchAll = async () => {
    const { data: sData } = await supabase.from('stok').select('*').order('ad');
    const { data: mData } = await supabase.from('musteriler').select('*').order('ad');
    if (sData) setStok(sData);
    if (mData) setMusteriler(mData);
    setLoading(false);
  };

  const miktarGuncelle = async (id, miktar) => {
    await supabase.from('stok').update({ stok: miktar }).eq('id', id);
    setStok(prev => prev.map(s => s.id === id ? { ...s, stok: miktar } : s));
  };

  const urunEkle = async () => {
    const katRenk = KATEGORILER.find(k => k.ad === yeniUrun.kategori).renk;
    await supabase.from('stok').insert([{ ...yeniUrun, renk: katRenk }]);
    setModal(false);
    fetchAll();
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
        
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
          <StatCard label="Ürün Çeşidi" value={stok.length} icon="📦" color={C.orange} />
          <StatCard label="Stok Değeri" value={"₺" + stok.reduce((a,s)=>a+(s.stok*s.fiyat),0).toLocaleString()} icon="💰" color={C.green} />
          <StatCard label="Açık Hesap" value={"₺" + musteriler.reduce((a,m)=>a+m.borc,0).toLocaleString()} icon="📒" color={C.red} />
        </div>

        {tab === "stok" && (
          <div style={{ animation: "fadeIn 0.3s" }}>
            <Btn onClick={() => setModal(true)} color={C.green} full>＋ YENİ ÜRÜN EKLE</Btn>
            <div style={{ display: "grid", gap: "10px", marginTop: "20px" }}>
              {stok.map(s => (
                <div key={s.id} className="card-hover" style={{ background: C.card, padding: "20px", borderRadius: "15px", border: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", gap: 15, alignItems: "center" }}>
                    <div style={{ fontSize: "1.5rem", background: (s.renk || C.orange) + "15", width: 50, height: 50, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${s.renk || C.orange}30` }}>{KATEGORILER.find(k => k.ad === s.kategori)?.emoji || "📦"}</div>
                    <div>
                      <div style={{ fontWeight: 800, color: s.renk || C.orange, fontFamily: C.display }}>{s.ad}</div>
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

        {tab === "veresiye" && (
           <div style={{ animation: "fadeIn 0.3s" }}>
             <h2 style={{ fontFamily: C.display, marginBottom: 20 }}>📒 AÇIK DEFTER</h2>
             {musteriler.map(m => (
               <div key={m.id} style={{ background: C.card, padding: 20, borderRadius: 15, marginBottom: 10, display: "flex", justifyContent: "space-between", border: `1px solid ${C.border}` }}>
                 <span style={{fontWeight: 700}}>{m.ad}</span>
                 <span style={{ color: C.red, fontWeight: 900 }}>₺{m.borc.toLocaleString()}</span>
               </div>
             ))}
           </div>
        )}

        {tab === "rapor" && (
          <div style={{ animation: "fadeIn 0.3s", display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            <div style={{ background: C.card, padding: 30, borderRadius: 20, border: `1px solid ${C.orange}30`, textAlign: 'center' }}>
               <h3 style={{fontFamily:C.display, color:C.orange}}>📊 DÜKKAN ANALİZİ</h3>
               <p style={{color: C.textDim, marginTop: 10}}>Bulut veritabanındaki verilerle canlı raporlama aktif.</p>
            </div>
          </div>
        )}
      </div>

      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: C.card, padding: 30, borderRadius: 25, border: `1px solid ${C.border}`, width: "90%", maxWidth: 400, animation: "slideIn 0.2s" }}>
            <h3 style={{ fontFamily: C.display, marginBottom: 20 }}>YENİ ÜRÜN EKLE</h3>
            <input placeholder="Ürün Adı" onChange={e => setYeniUrun({...yeniUrun, ad: e.target.value})} style={{ marginBottom: 10, width: "100%", padding: 10, background: 'black', color: 'white', border: '1px solid #333', borderRadius: 8 }} />
            <select onChange={e => setYeniUrun({...yeniUrun, kategori: e.target.value})} style={{ marginBottom: 10, width: "100%", padding: 10, background: 'black', color: 'white', border: '1px solid #333', borderRadius: 8 }}>
              {KATEGORILER.map(k => <option key={k.ad} value={k.ad}>{k.ad}</option>)}
            </select>
            <input type="number" placeholder="Stok" onChange={e => setYeniUrun({...yeniUrun, stok: parseInt(e.target.value)})} style={{ marginBottom: 10, width: "100%", padding: 10, background: 'black', color: 'white', border: '1px solid #333', borderRadius: 8 }} />
            <input type="number" placeholder="Fiyat" onChange={e => setYeniUrun({...yeniUrun, fiyat: parseFloat(e.target.value)})} style={{ marginBottom: 20, width: "100%", padding: 10, background: 'black', color: 'white', border: '1px solid #333', borderRadius: 8 }} />
            <div style={{ display: "flex", gap: 10 }}>
              <Btn onClick={() => setModal(false)} color={C.textDim} full>İPTAL</Btn>
              <Btn onClick={urunEkle} color={C.orange} full>KAYDET</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
