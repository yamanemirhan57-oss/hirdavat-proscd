import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

/* ── GLOBAL STYLES ── */
const globalStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=JetBrains+Mono:wght@400;600;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #080808; }
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
  bg: "#080808", surface: "#0f0f0f", card: "#141414", cardHover: "#1a1a1a", border: "#1f1f1f", borderBright: "#2a2a2a", orange: "#ff6b2b", orangeDim: "#ff6b2b18", orangeGlow: "#ff6b2b40", yellow: "#fbbf24", green: "#10b981", red: "#f43f5e", blue: "#3b82f6", cyan: "#06b6d4", purple: "#8b5cf6", text: "#f0f0f0", textDim: "#888", textFaint: "#444", mono: "'JetBrains Mono', monospace", display: "'Syne', sans-serif",
};

const KATEGORILER = [
  { ad: "Vidalarım",    emoji: "🔩", renk: "#ff6b2b" },
  { ad: "Çivilerim",    emoji: "📌", renk: "#fbbf24" },
  { ad: "El Aletlerim", emoji: "🔧", renk: "#3b82f6" },
  { ad: "Elektriğim",   emoji: "⚡", renk: "#eab308" },
  { ad: "Silikonlarım", emoji: "🎨", renk: "#ec4899" },
  { ad: "Borularım",    emoji: "🔗", renk: "#06b6d4" },
  { ad: "Yapı",         emoji: "🧱", renk: "#a78bfa" },
  { ad: "Hırdavatım",   emoji: "⚙️", renk: "#10b981" },
  { ad: "Diğerleri",    emoji: "📦", renk: "#6b7280" },
];

const BIRIMLER = ["adet", "metre", "kg", "litre", "paket", "kutu", "rulo", "set", "çift", "düzine"];

const RENK_PALETI = [ "#ff6b2b","#fbbf24","#10b981","#3b82f6","#8b5cf6", "#ec4899","#06b6d4","#f43f5e","#a78bfa","#34d399", "#fb923c","#38bdf8","#f0abfc","#86efac","#fde68a", "#ffffff","#94a3b8","#6b7280" ];

/* ── HELPERS ── */
function fmt(n) { return Number(n).toLocaleString("tr-TR"); }
function fmtPara(n) { return "₺" + Number(n).toLocaleString("tr-TR", { minimumFractionDigits: 0, maximumFractionDigits: 2 }); }

function Tag({ children, color = C.orange, small }) {
  return <span style={{ background: color + "18", color, border: `1px solid ${color}35`, borderRadius: 5, padding: small ? "2px 7px" : "3px 10px", fontSize: small ? "0.65rem" : "0.72rem", fontWeight: 700, fontFamily: C.mono, letterSpacing: "0.05em", whiteSpace: "nowrap" }}>{children}</span>;
}

function Btn({ children, color = C.orange, onClick, full, sm, disabled }) {
  return <button onClick={onClick} disabled={disabled} className="btn-hover" style={{ background: `linear-gradient(135deg, ${color}22, ${color}10)`, color, border: `1px solid ${color}50`, borderRadius: 8, padding: sm ? "6px 14px" : "10px 20px", cursor: disabled ? "not-allowed" : "pointer", fontWeight: 700, fontSize: sm ? "0.75rem" : "0.82rem", fontFamily: C.mono, width: full ? "100%" : "auto", opacity: disabled ? 0.5 : 1, letterSpacing: "0.03em", transition: "all 0.15s", boxShadow: `0 0 12px ${color}15` }}>{children}</button>;
}

function TextInput({ label, value, onChange, placeholder, type = "text", hint }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <div style={{ color: C.textDim, fontSize: "0.65rem", letterSpacing: "0.15em", marginBottom: 6, fontFamily: C.mono, textTransform: "uppercase" }}>{label}</div>}
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{ width: "100%", background: "#0a0a0a", border: `1px solid ${C.borderBright}`, borderRadius: 9, padding: "10px 14px", color: C.text, fontFamily: C.mono, fontSize: "0.88rem", outline: "none" }} />
    </div>
  );
}

function SelectInput({ label, value, onChange, options }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <div style={{ color: C.textDim, fontSize: "0.65rem", letterSpacing: "0.15em", marginBottom: 6, fontFamily: C.mono, textTransform: "uppercase" }}>{label}</div>}
      <select value={value} onChange={e => onChange(e.target.value)} style={{ width: "100%", background: "#0a0a0a", border: `1px solid ${C.borderBright}`, borderRadius: 9, padding: "10px 14px", color: C.text, fontFamily: C.mono, fontSize: "0.88rem", outline: "none", cursor: "pointer" }}>
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}

function StatCard({ label, value, icon, color, sub }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "1.2rem 1.4rem", flex: 1, minWidth: 130, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${color}, transparent)` }} />
      <div style={{ fontSize: "1.6rem", marginBottom: 8 }}>{icon}</div>
      <div style={{ color: C.textDim, fontSize: "0.62rem", letterSpacing: "0.18em", fontFamily: C.mono, textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
      <div style={{ color, fontSize: "1.6rem", fontWeight: 900, fontFamily: C.display, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ color: C.textFaint, fontSize: "0.7rem", fontFamily: C.mono, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

/* ── ÜRÜN MODAL ── */
function UrunModal({ urun, onKaydet, onKapat }) {
  const bos = { ad: "", kategori: "Vidalarım", renk: "#ff6b2b", stok: "", birim: "adet", fiyat: "", kritik: "", kod: "" };
  const [form, setForm] = useState(urun ? { ...urun } : bos);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const kaydet = () => {
    if (!form.ad.trim()) return alert("Ürün adı zorunlu!");
    onKaydet({ ...form, stok: parseInt(form.stok) || 0, fiyat: parseFloat(form.fiyat) || 0, kritik: parseInt(form.kritik) || 0 });
    onKapat();
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "#000000cc", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 16, backdropFilter: "blur(4px)" }}>
      <div style={{ background: C.surface, border: `1px solid ${C.borderBright}`, borderRadius: 18, padding: "1.8rem", width: "100%", maxWidth: 500, maxHeight: "92vh", overflowY: "auto", animation: "slideIn 0.2s ease" }}>
        <h3 style={{ fontFamily: C.display, color: C.text, marginBottom: 20 }}>{urun ? "Ürün Düzenle" : "Yeni Ürün"}</h3>
        <TextInput label="Ürün Adı" value={form.ad} onChange={v => set("ad", v)} />
        <div style={{ marginBottom: 16 }}>
          <div style={{ color: C.textDim, fontSize: "0.65rem", marginBottom: 8, fontFamily: C.mono }}>KATEGORİ</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {KATEGORILER.map(k => (
              <button key={k.ad} onClick={() => { set("kategori", k.ad); set("renk", k.renk); }} style={{ background: form.kategori === k.ad ? k.renk + "25" : "#0d0d0d", border: `1px solid ${form.kategori === k.ad ? k.renk : C.border}`, borderRadius: 8, padding: "6px 12px", color: form.kategori === k.ad ? k.renk : C.textDim, fontFamily: C.mono, fontSize: "0.75rem", cursor: "pointer" }}>{k.emoji} {k.ad}</button>
            ))}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <TextInput label="Stok" value={form.stok} onChange={v => set("stok", v)} type="number" />
          <SelectInput label="Birim" value={form.birim} onChange={v => set("birim", v)} options={BIRIMLER} />
          <TextInput label="Fiyat (₺)" value={form.fiyat} onChange={v => set("fiyat", v)} type="number" />
          <TextInput label="Kritik" value={form.kritik} onChange={v => set("kritik", v)} type="number" />
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <Btn onClick={onKapat} color={C.textDim} full>İptal</Btn>
          <Btn onClick={kaydet} color={C.green} full>Kaydet</Btn>
        </div>
      </div>
    </div>
  );
}

/* ── STOK EKRANI ── */
function StokEkrani({ stok, onSave, onDelete }) {
  const [modal, setModal] = useState(false);
  const [duzenle, setDuzenle] = useState(null);
  const [arama, setArama] = useState("");
  const filtered = stok.filter(s => s.ad.toLowerCase().includes(arama.toLowerCase()));

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      {(modal || duzenle) && <UrunModal urun={duzenle} onKapat={() => {setModal(false); setDuzenle(null);}} onKaydet={onSave} />}
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <StatCard label="Ürün Çeşidi" value={stok.length} icon="📦" color={C.orange} />
        <StatCard label="Stok Değeri" value={fmtPara(stok.reduce((a, s) => a + s.stok * s.fiyat, 0))} icon="💰" color={C.green} />
      </div>
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <input value={arama} onChange={e => setArama(e.target.value)} placeholder="Ürün ara..." style={{ flex: 1, background: C.card, border: `1px solid ${C.borderBright}`, borderRadius: 10, padding: "10px 15px", color: C.text }} />
        <Btn onClick={() => setModal(true)} color={C.green}>＋ Yeni Ürün</Btn>
      </div>
      <div style={{ display: "grid", gap: 10 }}>
        {filtered.map(s => (
          <div key={s.id} className="card-hover" style={{ background: C.card, padding: 15, borderRadius: 15, border: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", gap: 15, alignItems: "center" }}>
              <div style={{ width: 45, height: 45, background: s.renk + "20", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem" }}>{KATEGORILER.find(k => k.ad === s.kategori)?.emoji || "📦"}</div>
              <div>
                <div style={{ fontWeight: 800, color: s.renk, fontFamily: C.display }}>{s.ad}</div>
                <Tag color={C.textDim} small>{s.kategori} · ₺{s.fiyat}</Tag>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
              <div style={{ textAlign: "right", minWidth: 60 }}>
                <div style={{ fontSize: "1.4rem", fontWeight: 900, color: s.stok <= s.kritik ? C.red : C.green }}>{fmt(s.stok)}</div>
                <div style={{ fontSize: "0.6rem", color: C.textDim }}>{s.birim}</div>
              </div>
              <Btn sm onClick={() => onSave({...s, stok: s.stok + 1})} color={C.green}>+</Btn>
              <Btn sm onClick={() => onSave({...s, stok: Math.max(0, s.stok - 1)})} color={C.red}>-</Btn>
              <Btn sm onClick={() => setDuzenle(s)} color={C.blue}>✏️</Btn>
              <Btn sm onClick={() => onDelete(s.id)} color={C.red}>🗑</Btn>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── AÇIK DEFTER (VERESİYE) EKRANI ── */
function VeresiyeEkrani({ musteriler, onSave, onDelete }) {
  const [modal, setModal] = useState(false);
  const [yeniMus, setYeniMus] = useState({ ad: "", tel: "" });

  const musEkle = () => {
    if (!yeniMus.ad) return;
    onSave({ ...yeniMus, id: Date.now(), borc: 0, islemler: [] });
    setYeniMus({ ad: "", tel: "" }); setModal(false);
  };

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "#000000cc", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}>
          <div style={{ background: C.surface, padding: 30, borderRadius: 18, width: "100%", maxWidth: 380 }}>
            <h3 style={{ marginBottom: 20 }}>👤 Yeni Müşteri</h3>
            <TextInput label="Ad Soyad" value={yeniMus.ad} onChange={v => setYeniMus({...yeniMus, ad: v})} />
            <TextInput label="Telefon" value={yeniMus.tel} onChange={v => setYeniMus({...yeniMus, tel: v})} />
            <div style={{ display: "flex", gap: 10 }}>
              <Btn onClick={() => setModal(false)} color={C.textDim} full>İptal</Btn>
              <Btn onClick={musEkle} color={C.blue} full>Kaydet</Btn>
            </div>
          </div>
        </div>
      )}
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <StatCard label="Açık Hesap" value={fmtPara(musteriler.reduce((a, m) => a + m.borc, 0))} icon="📒" color={C.red} />
        <Btn onClick={() => setModal(true)} color={C.blue}>＋ Müşteri Ekle</Btn>
      </div>
      <div style={{ display: "grid", gap: 10 }}>
        {musteriler.map(m => (
          <div key={m.id} style={{ background: C.card, padding: 15, borderRadius: 15, border: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontWeight: 800, fontFamily: C.display }}>{m.ad}</div>
              <div style={{ fontSize: "0.7rem", color: C.textDim }}>{m.tel}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
              <div style={{ color: m.borc > 0 ? C.red : C.green, fontWeight: 900, fontSize: "1.2rem" }}>{fmtPara(m.borc)}</div>
              <Btn sm onClick={() => onSave({...m, borc: m.borc + 100})} color={C.red}>+100</Btn>
              <Btn sm onClick={() => onSave({...m, borc: Math.max(0, m.borc - 100)})} color={C.green}>-100</Btn>
              <Btn sm onClick={() => onDelete(m.id)} color={C.red}>🗑</Btn>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── RAPOR EKRANI ── */
function RaporEkrani({ stok, musteriler }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15, animation: "fadeIn 0.3s ease" }}>
      <StatCard label="Toplam Mal" value={fmtPara(stok.reduce((a, s) => a + s.stok * s.fiyat, 0))} icon="📦" color={C.orange} />
      <StatCard label="Toplam Alacak" value={fmtPara(musteriler.reduce((a, m) => a + m.borc, 0))} icon="📒" color={C.red} />
      <div style={{ background: C.card, padding: 20, borderRadius: 15, gridColumn: "1 / span 2", border: `1px solid ${C.border}` }}>
        <h4 style={{ color: C.orange, marginBottom: 15 }}>⚠️ Kritik Stok Listesi</h4>
        {stok.filter(s => s.stok <= s.kritik).map(s => (
          <div key={s.id} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: `1px solid #111` }}>
            <span>{s.ad}</span>
            <span style={{ color: C.red }}>{s.stok} {s.birim}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── ANA UYGULAMA ── */
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [pass, setPass] = useState("");
  const [tab, setTab] = useState("stok");
  const [stok, setStok] = useState([]);
  const [musteriler, setMusteriler] = useState([]);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = globalStyle;
    document.head.appendChild(style);
    if (isLoggedIn) { fetchAll(); }
  }, [isLoggedIn]);

  const fetchAll = async () => {
    const { data: sData } = await supabase.from('stok').select('*').order('ad');
    const { data: mData } = await supabase.from('musteriler').select('*').order('ad');
    if (sData) setStok(sData);
    if (mData) setMusteriler(mData);
  };

  const saveStok = async (item) => {
    const { error } = await supabase.from('stok').upsert(item);
    if (!error) fetchAll();
  };

  const deleteStok = async (id) => {
    if (!window.confirm("Silinsin mi?")) return;
    await supabase.from('stok').delete().eq('id', id);
    fetchAll();
  };

  const saveMusteri = async (item) => {
    await supabase.from('musteriler').upsert(item);
    fetchAll();
  };

  const deleteMusteri = async (id) => {
    if (!window.confirm("Silinsin mi?")) return;
    await supabase.from('musteriler').delete().eq('id', id);
    fetchAll();
  };

  if (!isLoggedIn) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#080808' }}>
      <div style={{ background: '#141414', padding: '40px', borderRadius: '25px', border: '1px solid #1f1f1f', textAlign: 'center' }}>
        <h2 style={{ color: C.orange, fontFamily: C.display, marginBottom: 20 }}>🔩 HIRDAVAT PRO</h2>
        <input type="password" placeholder="Şifre" onChange={(e) => setPass(e.target.value)} style={{ width: "100%", padding: 12, borderRadius: 10, background: "black", color: "white", border: "1px solid #333", marginBottom: 20, textAlign: "center" }} />
        <Btn onClick={() => pass === "hirdavat2026" ? setIsLoggedIn(true) : alert("Hatalı!")} full color={C.orange}>Giriş Yap</Btn>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 30, background: C.surface, padding: 15, borderRadius: 15, border: `1px solid ${C.border}` }}>
        <div style={{ fontFamily: C.display, color: C.orange, fontWeight: 900 }}>HIRDAVAT PRO</div>
        <div style={{ display: "flex", gap: 5 }}>
          {["stok", "veresiye", "rapor"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ background: tab === t ? C.orange : "transparent", color: "white", border: "none", padding: "8px 15px", borderRadius: 8, cursor: "pointer", fontWeight: 700 }}>{t === "veresiye" ? "AÇIK DEFTER" : t.toUpperCase()}</button>
          ))}
        </div>
      </div>
      {tab === "stok" && <StokEkrani stok={stok} onSave={saveStok} onDelete={deleteStok} />}
      {tab === "veresiye" && <VeresiyeEkrani musteriler={musteriler} onSave={saveMusteri} onDelete={deleteMusteri} />}
      {tab === "rapor" && <RaporEkrani stok={stok} musteriler={musteriler} />}
    </div>
  );
}
