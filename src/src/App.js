import { useState, useEffect } from "react";

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
  bg: "#080808",
  surface: "#0f0f0f",
  card: "#141414",
  cardHover: "#1a1a1a",
  border: "#1f1f1f",
  borderBright: "#2a2a2a",
  orange: "#ff6b2b",
  orangeDim: "#ff6b2b18",
  orangeGlow: "#ff6b2b40",
  yellow: "#fbbf24",
  green: "#10b981",
  red: "#f43f5e",
  blue: "#3b82f6",
  cyan: "#06b6d4",
  purple: "#8b5cf6",
  text: "#f0f0f0",
  textDim: "#888",
  textFaint: "#444",
  mono: "'JetBrains Mono', monospace",
  display: "'Syne', sans-serif",
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

const RENK_PALETI = [
  "#ff6b2b","#fbbf24","#10b981","#3b82f6","#8b5cf6",
  "#ec4899","#06b6d4","#f43f5e","#a78bfa","#34d399",
  "#fb923c","#38bdf8","#f0abfc","#86efac","#fde68a",
  "#ffffff","#94a3b8","#6b7280",
];

const initialStok = [
  // VİDALARIM
  { id: 1,  kod: "VDA-001", ad: "Vida M4×20",              kategori: "Vidalarım", renk: "#ff6b2b", stok: 2500, birim: "adet", fiyat: 0.35, kritik: 500 },
  { id: 2,  kod: "VDA-002", ad: "Vida M5×25",              kategori: "Vidalarım", renk: "#ff6b2b", stok: 1800, birim: "adet", fiyat: 0.45, kritik: 400 },
  { id: 3,  kod: "VDA-003", ad: "Vida M6×30",              kategori: "Vidalarım", renk: "#ff6b2b", stok: 1240, birim: "adet", fiyat: 0.60, kritik: 300 },
  { id: 4,  kod: "VDA-004", ad: "Vida M8×40",              kategori: "Vidalarım", renk: "#ff8c42", stok: 900,  birim: "adet", fiyat: 0.90, kritik: 200 },
  { id: 5,  kod: "VDA-005", ad: "Vida M10×50",             kategori: "Vidalarım", renk: "#ff8c42", stok: 600,  birim: "adet", fiyat: 1.20, kritik: 150 },
  { id: 6,  kod: "VDA-006", ad: "Çift Başlı Vida M6",      kategori: "Vidalarım", renk: "#fbbf24", stok: 750,  birim: "adet", fiyat: 1.50, kritik: 150 },
  { id: 7,  kod: "SOM-007", ad: "Somun M6",                kategori: "Vidalarım", renk: "#fb923c", stok: 2000, birim: "adet", fiyat: 0.25, kritik: 400 },
  { id: 8,  kod: "SOM-008", ad: "Somun M8",                kategori: "Vidalarım", renk: "#fb923c", stok: 1500, birim: "adet", fiyat: 0.35, kritik: 300 },
  { id: 9,  kod: "SOM-009", ad: "Rondela M6",              kategori: "Vidalarım", renk: "#f97316", stok: 3000, birim: "adet", fiyat: 0.15, kritik: 500 },
  { id: 10, kod: "SOM-010", ad: "Rondela M8",              kategori: "Vidalarım", renk: "#f97316", stok: 2200, birim: "adet", fiyat: 0.20, kritik: 400 },

  // SİLİKONLARIM
  { id: 11, kod: "SLK-011", ad: "Silikon Beyaz 280ml",     kategori: "Silikonlarım", renk: "#e5e7eb", stok: 85, birim: "adet", fiyat: 32,  kritik: 20 },
  { id: 12, kod: "SLK-012", ad: "Silikon Şeffaf 280ml",    kategori: "Silikonlarım", renk: "#a5f3fc", stok: 60, birim: "adet", fiyat: 30,  kritik: 15 },
  { id: 13, kod: "SLK-013", ad: "Silikon Siyah 280ml",     kategori: "Silikonlarım", renk: "#6b7280", stok: 40, birim: "adet", fiyat: 34,  kritik: 10 },
  { id: 14, kod: "SLK-014", ad: "Silikon Gri 280ml",       kategori: "Silikonlarım", renk: "#9ca3af", stok: 35, birim: "adet", fiyat: 33,  kritik: 10 },
  { id: 15, kod: "SLK-015", ad: "Yapı Silikonu Beyaz",     kategori: "Silikonlarım", renk: "#f0f9ff", stok: 50, birim: "adet", fiyat: 45,  kritik: 10 },
  { id: 16, kod: "SLK-016", ad: "Silikon Kırmızı 280ml",   kategori: "Silikonlarım", renk: "#ef4444", stok: 20, birim: "adet", fiyat: 36,  kritik: 8  },
  { id: 17, kod: "SLK-017", ad: "Silikon Bej 280ml",       kategori: "Silikonlarım", renk: "#d4a574", stok: 30, birim: "adet", fiyat: 33,  kritik: 8  },
  { id: 18, kod: "SLK-018", ad: "Mastik Beyaz 600ml",      kategori: "Silikonlarım", renk: "#fef3c7", stok: 18, birim: "adet", fiyat: 65,  kritik: 5  },
  { id: 19, kod: "SLK-019", ad: "Akrilik Mastik 280ml",    kategori: "Silikonlarım", renk: "#ec4899", stok: 25, birim: "adet", fiyat: 28,  kritik: 8  },
  { id: 20, kod: "SLK-020", ad: "Silikon Sprey 400ml",     kategori: "Silikonlarım", renk: "#c084fc", stok: 15, birim: "adet", fiyat: 55,  kritik: 5  },

  // EL ALETLERİM
  { id: 21, kod: "ALT-021", ad: "Tornavida Düz 5mm",         kategori: "El Aletlerim", renk: "#3b82f6", stok: 45, birim: "adet", fiyat: 35,  kritik: 10 },
  { id: 22, kod: "ALT-022", ad: "Tornavida Yıldız PH2",      kategori: "El Aletlerim", renk: "#3b82f6", stok: 50, birim: "adet", fiyat: 38,  kritik: 10 },
  { id: 23, kod: "ALT-023", ad: "Tornavida Seti 6'lı",       kategori: "El Aletlerim", renk: "#60a5fa", stok: 18, birim: "set",  fiyat: 125, kritik: 5  },
  { id: 24, kod: "ALT-024", ad: "İngiliz Anahtarı 10\"",     kategori: "El Aletlerim", renk: "#2563eb", stok: 22, birim: "adet", fiyat: 145, kritik: 5  },
  { id: 25, kod: "ALT-025", ad: "Kombine Anahtar Seti 12'li",kategori: "El Aletlerim", renk: "#1d4ed8", stok: 12, birim: "set",  fiyat: 285, kritik: 3  },
  { id: 26, kod: "ALT-026", ad: "Pense Düz 180mm",           kategori: "El Aletlerim", renk: "#7c3aed", stok: 30, birim: "adet", fiyat: 85,  kritik: 8  },
  { id: 27, kod: "ALT-027", ad: "Kargaburnu Pense",          kategori: "El Aletlerim", renk: "#7c3aed", stok: 25, birim: "adet", fiyat: 95,  kritik: 6  },
  { id: 28, kod: "ALT-028", ad: "Çekiç 500g",                kategori: "El Aletlerim", renk: "#6d28d9", stok: 20, birim: "adet", fiyat: 110, kritik: 5  },
  { id: 29, kod: "ALT-029", ad: "Ruhani Terazi 60cm",        kategori: "El Aletlerim", renk: "#5b21b6", stok: 10, birim: "adet", fiyat: 175, kritik: 3  },
  { id: 30, kod: "ALT-030", ad: "Mastar Metre 5m",           kategori: "El Aletlerim", renk: "#4c1d95", stok: 28, birim: "adet", fiyat: 65,  kritik: 8  },
];

const initialMusteriler = [
  { id: 1, ad: "Ahmet Yılmaz", tel: "0532 111 2233", borc: 1850, islemler: [
    { tarih: "2025-03-01", aciklama: "Vida + Çivi alımı", tutar: 650, odeme: false },
    { tarih: "2025-03-08", aciklama: "Boru malzemeleri", tutar: 1200, odeme: false },
  ]},
  { id: 2, ad: "Mehmet İnşaat A.Ş.", tel: "0212 444 5566", borc: 4200, islemler: [
    { tarih: "2025-02-20", aciklama: "Toplu vida siparişi", tutar: 2800, odeme: false },
    { tarih: "2025-03-05", aciklama: "El aleti seti ×5", tutar: 1400, odeme: false },
  ]},
  { id: 3, ad: "Fatma Hanım", tel: "0535 777 8899", borc: 0, islemler: [
    { tarih: "2025-03-10", aciklama: "Silikon mastik", tutar: 180, odeme: true },
  ]},
];

/* ── HELPERS ── */
function fmt(n) { return Number(n).toLocaleString("tr-TR"); }
function fmtPara(n) { return "₺" + Number(n).toLocaleString("tr-TR", { minimumFractionDigits: 0, maximumFractionDigits: 2 }); }

function Tag({ children, color = C.orange, small }) {
  return (
    <span style={{
      background: color + "18", color, border: `1px solid ${color}35`,
      borderRadius: 5, padding: small ? "2px 7px" : "3px 10px",
      fontSize: small ? "0.65rem" : "0.72rem", fontWeight: 700,
      fontFamily: C.mono, letterSpacing: "0.05em", whiteSpace: "nowrap",
    }}>{children}</span>
  );
}

function Btn({ children, color = C.orange, onClick, full, sm, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled} className="btn-hover" style={{
      background: `linear-gradient(135deg, ${color}22, ${color}10)`,
      color, border: `1px solid ${color}50`,
      borderRadius: 8, padding: sm ? "6px 14px" : "10px 20px",
      cursor: disabled ? "not-allowed" : "pointer", fontWeight: 700,
      fontSize: sm ? "0.75rem" : "0.82rem", fontFamily: C.mono,
      width: full ? "100%" : "auto", opacity: disabled ? 0.5 : 1,
      letterSpacing: "0.03em", transition: "all 0.15s",
      boxShadow: `0 0 12px ${color}15`,
    }}>{children}</button>
  );
}

function TextInput({ label, value, onChange, placeholder, type = "text", hint }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <div style={{ color: C.textDim, fontSize: "0.65rem", letterSpacing: "0.15em", marginBottom: 6, fontFamily: C.mono, textTransform: "uppercase" }}>{label}</div>}
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{
          width: "100%", background: "#0a0a0a", border: `1px solid ${C.borderBright}`,
          borderRadius: 9, padding: "10px 14px", color: C.text,
          fontFamily: C.mono, fontSize: "0.88rem", outline: "none",
          transition: "border-color 0.2s",
        }}
        onFocus={e => e.target.style.borderColor = C.orange}
        onBlur={e => e.target.style.borderColor = C.borderBright}
      />
      {hint && <div style={{ color: C.textFaint, fontSize: "0.68rem", marginTop: 4, fontFamily: C.mono }}>{hint}</div>}
    </div>
  );
}

function SelectInput({ label, value, onChange, options }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <div style={{ color: C.textDim, fontSize: "0.65rem", letterSpacing: "0.15em", marginBottom: 6, fontFamily: C.mono, textTransform: "uppercase" }}>{label}</div>}
      <select value={value} onChange={e => onChange(e.target.value)} style={{
        width: "100%", background: "#0a0a0a", border: `1px solid ${C.borderBright}`,
        borderRadius: 9, padding: "10px 14px", color: C.text,
        fontFamily: C.mono, fontSize: "0.88rem", outline: "none", cursor: "pointer",
      }}>
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}

function StatCard({ label, value, icon, color, sub }) {
  return (
    <div style={{
      background: C.card, border: `1px solid ${C.border}`,
      borderRadius: 14, padding: "1.2rem 1.4rem", flex: 1, minWidth: 130,
      position: "relative", overflow: "hidden",
    }}>
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
  const bos = { ad: "", kategori: "Vida & Somun", renk: "#ff6b2b", stok: "", birim: "adet", fiyat: "", kritik: "", kod: "" };
  const [form, setForm] = useState(urun ? { ...urun } : bos);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const kaydet = () => {
    if (!form.ad.trim()) return alert("Ürün adı zorunlu!");
    if (!form.fiyat) return alert("Fiyat giriniz!");
    onKaydet({
      ...form,
      stok: parseInt(form.stok) || 0,
      fiyat: parseFloat(form.fiyat) || 0,
      kritik: parseInt(form.kritik) || 0,
      kod: form.kod || form.kategori.slice(0,3).toUpperCase() + "-" + Date.now().toString().slice(-4),
      id: form.id || Date.now(),
    });
    onKapat();
  };

  const kat = KATEGORILER.find(k => k.ad === form.kategori);

  return (
    <div style={{ position: "fixed", inset: 0, background: "#000000cc", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 16, backdropFilter: "blur(4px)" }}>
      <div style={{ background: C.surface, border: `1px solid ${C.borderBright}`, borderRadius: 18, padding: "1.8rem", width: "100%", maxWidth: 500, maxHeight: "92vh", overflowY: "auto", animation: "slideIn 0.2s ease", position: "relative" }}>
        {/* Accent top bar */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${form.renk}, ${form.renk}44)`, borderRadius: "18px 18px 0 0" }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 }}>
          <div>
            <div style={{ fontFamily: C.display, fontWeight: 900, fontSize: "1.2rem", color: C.text }}>{urun ? "Ürün Düzenle" : "Yeni Ürün"}</div>
            <div style={{ color: C.textDim, fontSize: "0.72rem", fontFamily: C.mono, marginTop: 2 }}>Ürün bilgilerini gir</div>
          </div>
          <button onClick={onKapat} style={{ background: "#1a1a1a", border: `1px solid ${C.border}`, color: C.textDim, borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
        </div>

        {/* Önizleme kartı */}
        <div style={{ background: "#0a0a0a", border: `1px solid ${form.renk}30`, borderRadius: 12, padding: "12px 16px", marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: form.renk + "20", border: `2px solid ${form.renk}50`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem", flexShrink: 0 }}>{kat?.emoji ?? "📦"}</div>
          <div style={{ flex: 1 }}>
            <div style={{ color: form.renk, fontWeight: 800, fontFamily: C.display, fontSize: "0.95rem" }}>{form.ad || "Ürün Adı"}</div>
            <div style={{ color: C.textDim, fontSize: "0.72rem", fontFamily: C.mono }}>{form.kategori} · {form.birim} · {fmtPara(form.fiyat || 0)}</div>
          </div>
          <div style={{ color: C.green, fontFamily: C.mono, fontWeight: 700, fontSize: "1rem" }}>{fmt(form.stok || 0)}</div>
        </div>

        <TextInput label="Ürün Adı" value={form.ad} onChange={v => set("ad", v)} placeholder="örn: 12'lik Vida, Kırmızı Silikon..." />
        <TextInput label="Ürün Kodu (opsiyonel)" value={form.kod} onChange={v => set("kod", v)} placeholder="otomatik oluşturulur" hint="Boş bırakırsan otomatik kod verilir" />

        {/* Kategori */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ color: C.textDim, fontSize: "0.65rem", letterSpacing: "0.15em", marginBottom: 8, fontFamily: C.mono, textTransform: "uppercase" }}>Kategori</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {KATEGORILER.map(k => (
              <button key={k.ad} onClick={() => { set("kategori", k.ad); set("renk", k.renk); }} style={{
                background: form.kategori === k.ad ? k.renk + "25" : "#0d0d0d",
                border: `1.5px solid ${form.kategori === k.ad ? k.renk : C.border}`,
                borderRadius: 8, padding: "6px 12px", cursor: "pointer",
                color: form.kategori === k.ad ? k.renk : C.textDim,
                fontFamily: C.mono, fontSize: "0.75rem", fontWeight: 700,
                transition: "all 0.15s",
              }}>{k.emoji} {k.ad}</button>
            ))}
          </div>
        </div>

        {/* Renk */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ color: C.textDim, fontSize: "0.65rem", letterSpacing: "0.15em", marginBottom: 8, fontFamily: C.mono, textTransform: "uppercase" }}>Etiket Rengi</div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <div style={{ position: "relative" }}>
              <input type="color" value={form.renk} onChange={e => set("renk", e.target.value)}
                style={{ width: 42, height: 42, border: `2px solid ${form.renk}`, borderRadius: 10, cursor: "pointer", background: "none", padding: 2 }} />
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {RENK_PALETI.map(r => (
                <div key={r} onClick={() => set("renk", r)} style={{
                  width: 26, height: 26, borderRadius: 7, background: r, cursor: "pointer",
                  border: form.renk === r ? `2.5px solid white` : `2px solid transparent`,
                  boxShadow: form.renk === r ? `0 0 8px ${r}` : "none",
                  transition: "all 0.12s",
                }} />
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <TextInput label="Başlangıç Stok" value={form.stok} onChange={v => set("stok", v)} type="number" placeholder="0" />
          <SelectInput label="Birim" value={form.birim} onChange={v => set("birim", v)} options={BIRIMLER} />
          <TextInput label="Birim Fiyat (₺)" value={form.fiyat} onChange={v => set("fiyat", v)} type="number" placeholder="0.00" />
          <TextInput label="Kritik Stok Seviyesi" value={form.kritik} onChange={v => set("kritik", v)} type="number" placeholder="uyarı eşiği" />
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
          <Btn onClick={onKapat} color={C.textDim} full>İptal</Btn>
          <Btn onClick={kaydet} color={C.green} full>{urun ? "💾 Güncelle" : "✅ Ürün Ekle"}</Btn>
        </div>
      </div>
    </div>
  );
}

/* ── STOK EKRANI ── */
function StokEkrani({ stok, setStok }) {
  const [modal, setModal] = useState(false);
  const [duzenle, setDuzenle] = useState(null);
  const [arama, setArama] = useState("");
  const [filtrKat, setFiltrKat] = useState("Tümü");
  const [miktar, setMiktar] = useState({});

  const filtered = stok.filter(s =>
    (filtrKat === "Tümü" || s.kategori === filtrKat) &&
    (s.ad.toLowerCase().includes(arama.toLowerCase()) || (s.kod || "").toLowerCase().includes(arama.toLowerCase()))
  );

  const kaydet = (form) => setStok(prev => form.id && prev.some(s => s.id === form.id)
    ? prev.map(s => s.id === form.id ? form : s)
    : [...prev, form]);

  const sil = (id) => { if (window.confirm("Bu ürünü silmek istediğinize emin misiniz?")) setStok(prev => prev.filter(s => s.id !== id)); };

  const stokEkle = (id) => {
    const m = parseInt(miktar[id]);
    if (!m) return;
    setStok(prev => prev.map(s => s.id === id ? { ...s, stok: Math.max(0, s.stok + m) } : s));
    setMiktar(prev => ({ ...prev, [id]: "" }));
  };

  const kritikCount = stok.filter(s => s.stok <= s.kritik).length;
  const toplamDeger = stok.reduce((a, s) => a + s.stok * s.fiyat, 0);
  const aktifKatlar = [...new Set(stok.map(s => s.kategori))];

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      {(modal || duzenle) && <UrunModal urun={duzenle} onKaydet={kaydet} onKapat={() => { setModal(false); setDuzenle(null); }} />}

      {/* Stats */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
        <StatCard label="Ürün Çeşidi" value={stok.length} icon="📦" color={C.orange} />
        <StatCard label="Kritik Stok" value={kritikCount} icon="⚠️" color={C.red} sub={kritikCount > 0 ? "sipariş ver!" : "hepsi tamam"} />
        <StatCard label="Stok Değeri" value={fmtPara(toplamDeger)} icon="💰" color={C.green} />
      </div>

      {/* Toolbar */}
      <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: C.textDim, fontSize: "0.9rem" }}>🔍</span>
          <input value={arama} onChange={e => setArama(e.target.value)} placeholder="Ürün ara..."
            style={{ width: "100%", background: C.card, border: `1px solid ${C.borderBright}`, borderRadius: 10, padding: "10px 14px 10px 36px", color: C.text, fontFamily: C.mono, fontSize: "0.85rem", outline: "none" }} />
        </div>
        <Btn onClick={() => { setDuzenle(null); setModal(true); }} color={C.green}>＋ Yeni Ürün</Btn>
      </div>

      {/* Kategori filtre */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 18 }}>
        {["Tümü", ...aktifKatlar].map(k => {
          const kat = KATEGORILER.find(x => x.ad === k);
          const aktif = filtrKat === k;
          return (
            <button key={k} onClick={() => setFiltrKat(k)} style={{
              background: aktif ? (kat?.renk ?? C.orange) + "20" : C.card,
              border: `1px solid ${aktif ? (kat?.renk ?? C.orange) : C.border}`,
              borderRadius: 7, padding: "5px 12px", cursor: "pointer",
              color: aktif ? (kat?.renk ?? C.orange) : C.textDim,
              fontFamily: C.mono, fontSize: "0.72rem", fontWeight: 700, transition: "all 0.15s",
            }}>{kat?.emoji ?? ""} {k}</button>
          );
        })}
      </div>

      {/* Ürün listesi */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem 2rem", color: C.textDim }}>
          <div style={{ fontSize: "3rem", marginBottom: 12 }}>🏪</div>
          <div style={{ fontFamily: C.display, fontSize: "1.1rem", marginBottom: 8, color: C.text }}>{arama ? "Ürün bulunamadı" : "Henüz ürün yok"}</div>
          <div style={{ fontSize: "0.82rem", fontFamily: C.mono, marginBottom: 20 }}>İlk ürününü ekleyerek başla</div>
          {!arama && <Btn onClick={() => setModal(true)} color={C.green}>＋ Ürün Ekle</Btn>}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map(s => {
            const kritik = s.stok <= s.kritik;
            const kat = KATEGORILER.find(k => k.ad === s.kategori);
            return (
              <div key={s.id} className="card-hover" style={{
                background: C.card, borderRadius: 14,
                border: `1px solid ${kritik ? s.renk + "50" : C.border}`,
                padding: "1rem 1.2rem", transition: "all 0.2s",
                boxShadow: kritik ? `0 0 16px ${s.renk}10` : "none",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                  {/* Renk & emoji */}
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: s.renk + "18", border: `2px solid ${s.renk}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", flexShrink: 0, boxShadow: `0 0 12px ${s.renk}20` }}>
                    {kat?.emoji ?? "📦"}
                  </div>

                  {/* Bilgi */}
                  <div style={{ flex: 1, minWidth: 140 }}>
                    <div style={{ fontFamily: C.display, fontWeight: 800, fontSize: "0.98rem", color: s.renk, marginBottom: 4 }}>{s.ad}</div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                      <Tag color={C.textDim} small>{s.kod}</Tag>
                      <Tag color={s.renk} small>{s.kategori}</Tag>
                      <Tag color={C.yellow} small>{fmtPara(s.fiyat)}/{s.birim}</Tag>
                    </div>
                  </div>

                  {/* Stok göstergesi */}
                  <div style={{ textAlign: "center", minWidth: 90 }}>
                    <div style={{ fontFamily: C.display, fontWeight: 900, fontSize: "1.4rem", color: kritik ? C.red : C.green, lineHeight: 1 }}>{fmt(s.stok)}</div>
                    <div style={{ color: C.textDim, fontSize: "0.68rem", fontFamily: C.mono }}>{s.birim}</div>
                    {kritik && <div style={{ color: C.red, fontSize: "0.65rem", fontFamily: C.mono, animation: "pulse 2s infinite" }}>⚠ KRİTİK</div>}
                  </div>

                  {/* Kontroller */}
                  <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                    <Btn onClick={() => setStok(p => p.map(x => x.id === s.id ? { ...x, stok: Math.max(0, x.stok - 1) } : x))} color={C.red} sm>−1</Btn>
                    <Btn onClick={() => setStok(p => p.map(x => x.id === s.id ? { ...x, stok: x.stok + 1 } : x))} color={C.green} sm>+1</Btn>
                    <div style={{ display: "flex", gap: 5 }}>
                      <input type="number" value={miktar[s.id] || ""} onChange={e => setMiktar(p => ({ ...p, [s.id]: e.target.value }))}
                        placeholder="±miktar" style={{ width: 72, background: "#0a0a0a", border: `1px solid ${C.borderBright}`, borderRadius: 7, padding: "6px 10px", color: C.text, fontFamily: C.mono, fontSize: "0.78rem", outline: "none" }} />
                      <Btn onClick={() => stokEkle(s.id)} color={C.orange} sm>Ekle</Btn>
                    </div>
                    <Btn onClick={() => setDuzenle(s)} color={C.blue} sm>✏️</Btn>
                    <Btn onClick={() => sil(s.id)} color={C.red} sm>🗑</Btn>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── VERESİYE EKRANI ── */
function VeresiyeEkrani({ musteriler, setMusteriler }) {
  const [secili, setSecili] = useState(null);
  const [odeme, setOdeme] = useState("");
  const [yeniIslem, setYeniIslem] = useState({ aciklama: "", tutar: "" });
  const [musEkleModal, setMusEkleModal] = useState(false);
  const [yeniMus, setYeniMus] = useState({ ad: "", tel: "" });
  const [arama, setArama] = useState("");

  const musteri = musteriler.find(m => m.id === secili);
  const filtered = musteriler.filter(m => m.ad.toLowerCase().includes(arama.toLowerCase()));

  const odemeAl = () => {
    const t = parseFloat(odeme); if (!t) return;
    setMusteriler(p => p.map(m => m.id !== secili ? m : {
      ...m, borc: Math.max(0, m.borc - t),
      islemler: [...m.islemler, { tarih: new Date().toISOString().slice(0,10), aciklama: "✅ Ödeme alındı", tutar: t, odeme: true }],
    }));
    setOdeme("");
  };

  const veresiyeEkle = () => {
    const t = parseFloat(yeniIslem.tutar); if (!t || !yeniIslem.aciklama) return;
    setMusteriler(p => p.map(m => m.id !== secili ? m : {
      ...m, borc: m.borc + t,
      islemler: [...m.islemler, { tarih: new Date().toISOString().slice(0,10), aciklama: yeniIslem.aciklama, tutar: t, odeme: false }],
    }));
    setYeniIslem({ aciklama: "", tutar: "" });
  };

  const musEkle = () => {
    if (!yeniMus.ad.trim()) return;
    setMusteriler(p => [...p, { ...yeniMus, id: Date.now(), borc: 0, islemler: [] }]);
    setYeniMus({ ad: "", tel: "" }); setMusEkleModal(false);
  };

  const musSil = (id) => { if (window.confirm("Müşteriyi sil?")) { setMusteriler(p => p.filter(m => m.id !== id)); if (secili === id) setSecili(null); } };

  const toplamBorc = musteriler.reduce((a, m) => a + m.borc, 0);

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      {musEkleModal && (
        <div style={{ position: "fixed", inset: 0, background: "#000000cc", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, backdropFilter: "blur(4px)" }}>
          <div style={{ background: C.surface, border: `1px solid ${C.borderBright}`, borderRadius: 18, padding: "1.8rem", width: "100%", maxWidth: 380, animation: "slideIn 0.2s ease", position: "relative" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${C.blue}, transparent)`, borderRadius: "18px 18px 0 0" }} />
            <div style={{ fontFamily: C.display, fontWeight: 900, fontSize: "1.2rem", marginBottom: 20 }}>👤 Yeni Müşteri</div>
            <TextInput label="Ad Soyad / Firma" value={yeniMus.ad} onChange={v => setYeniMus(p => ({ ...p, ad: v }))} placeholder="Ahmet Yılmaz" />
            <TextInput label="Telefon" value={yeniMus.tel} onChange={v => setYeniMus(p => ({ ...p, tel: v }))} placeholder="0532 xxx xxxx" />
            <div style={{ display: "flex", gap: 10 }}>
              <Btn onClick={() => setMusEkleModal(false)} color={C.textDim} full>İptal</Btn>
              <Btn onClick={musEkle} color={C.blue} full>✅ Kaydet</Btn>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
        <StatCard label="Toplam Veresiye" value={fmtPara(toplamBorc)} icon="📒" color={C.red} />
        <StatCard label="Borçlu Müşteri" value={musteriler.filter(m => m.borc > 0).length} icon="👤" color={C.orange} />
        <StatCard label="Temiz Hesap" value={musteriler.filter(m => m.borc === 0).length} icon="✅" color={C.green} />
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 180, position: "relative" }}>
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: C.textDim }}>🔍</span>
          <input value={arama} onChange={e => setArama(e.target.value)} placeholder="Müşteri ara..."
            style={{ width: "100%", background: C.card, border: `1px solid ${C.borderBright}`, borderRadius: 10, padding: "10px 14px 10px 36px", color: C.text, fontFamily: C.mono, fontSize: "0.85rem", outline: "none" }} />
        </div>
        <Btn onClick={() => setMusEkleModal(true)} color={C.blue}>＋ Müşteri Ekle</Btn>
      </div>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "flex-start" }}>
        {/* Liste */}
        <div style={{ flex: 1, minWidth: 260 }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem", color: C.textDim }}>
              <div style={{ fontSize: "2.5rem", marginBottom: 10 }}>👥</div>
              <div style={{ fontFamily: C.display, fontSize: "1rem", color: C.text }}>Müşteri yok</div>
              <div style={{ fontSize: "0.8rem", fontFamily: C.mono, marginBottom: 16 }}>Müşteri ekleyerek başla</div>
              <Btn onClick={() => setMusEkleModal(true)} color={C.blue}>Ekle</Btn>
            </div>
          ) : filtered.sort((a, b) => b.borc - a.borc).map(m => (
            <div key={m.id} onClick={() => setSecili(secili === m.id ? null : m.id)} className="card-hover" style={{
              background: secili === m.id ? C.orange + "10" : C.card,
              border: `1px solid ${secili === m.id ? C.orange + "60" : C.border}`,
              borderRadius: 12, padding: "1rem 1.1rem", marginBottom: 8, cursor: "pointer", transition: "all 0.2s",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 42, height: 42, borderRadius: 10, background: m.borc > 0 ? C.red + "18" : C.green + "18", border: `2px solid ${m.borc > 0 ? C.red : C.green}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", flexShrink: 0 }}>
                  {m.borc > 0 ? "⚠️" : "✅"}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: C.display, fontWeight: 800, fontSize: "0.92rem" }}>{m.ad}</div>
                  <div style={{ color: C.textDim, fontSize: "0.72rem", fontFamily: C.mono }}>{m.tel || "—"} · {m.islemler.length} işlem</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                  <div style={{ color: m.borc > 0 ? C.red : C.green, fontFamily: C.display, fontWeight: 900, fontSize: "1rem" }}>{fmtPara(m.borc)}</div>
                  <button onClick={e => { e.stopPropagation(); musSil(m.id); }} style={{ background: C.red + "15", border: `1px solid ${C.red}30`, borderRadius: 6, color: C.red, padding: "2px 8px", cursor: "pointer", fontSize: "0.65rem", fontFamily: C.mono }}>sil</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detay */}
        {musteri && (
          <div style={{ width: 300, background: C.card, border: `1px solid ${C.borderBright}`, borderRadius: 16, overflow: "hidden", flexShrink: 0 }}>
            <div style={{ background: C.surface, padding: "1rem 1.2rem", borderBottom: `1px solid ${C.border}` }}>
              <div style={{ fontFamily: C.display, fontWeight: 900, fontSize: "1rem" }}>{musteri.ad}</div>
              <div style={{ color: C.textDim, fontSize: "0.72rem", fontFamily: C.mono }}>{musteri.tel}</div>
              <div style={{ color: musteri.borc > 0 ? C.red : C.green, fontFamily: C.display, fontWeight: 900, fontSize: "1.4rem", marginTop: 6 }}>{fmtPara(musteri.borc)}</div>
            </div>

            <div style={{ padding: "1rem 1.2rem" }}>
              {/* Geçmiş */}
              <div style={{ maxHeight: 200, overflowY: "auto", marginBottom: 14 }}>
                {musteri.islemler.length === 0
                  ? <div style={{ color: C.textDim, fontSize: "0.8rem", textAlign: "center", padding: "1rem" }}>İşlem yok</div>
                  : [...musteri.islemler].reverse().map((i, idx) => (
                    <div key={idx} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: `1px solid ${C.border}`, gap: 8 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "0.8rem", color: C.text }}>{i.aciklama}</div>
                        <div style={{ fontSize: "0.65rem", color: C.textDim, fontFamily: C.mono }}>{i.tarih}</div>
                      </div>
                      <div style={{ color: i.odeme ? C.green : C.red, fontFamily: C.mono, fontWeight: 700, fontSize: "0.85rem", whiteSpace: "nowrap" }}>
                        {i.odeme ? "+" : "−"}{fmtPara(i.tutar)}
                      </div>
                    </div>
                  ))}
              </div>

              {/* Veresiye ekle */}
              <div style={{ background: "#0a0a0a", borderRadius: 10, padding: "10px", marginBottom: 10 }}>
                <div style={{ color: C.red, fontSize: "0.65rem", fontFamily: C.mono, letterSpacing: "0.1em", marginBottom: 8 }}>VERESİYE EKLE</div>
                <input value={yeniIslem.aciklama} onChange={e => setYeniIslem(p => ({ ...p, aciklama: e.target.value }))}
                  placeholder="Açıklama..." style={{ width: "100%", background: "#111", border: `1px solid ${C.border}`, borderRadius: 7, padding: "7px 10px", color: C.text, fontFamily: C.mono, fontSize: "0.8rem", outline: "none", marginBottom: 6, boxSizing: "border-box" }} />
                <div style={{ display: "flex", gap: 6 }}>
                  <input type="number" value={yeniIslem.tutar} onChange={e => setYeniIslem(p => ({ ...p, tutar: e.target.value }))}
                    placeholder="₺ tutar" style={{ flex: 1, background: "#111", border: `1px solid ${C.border}`, borderRadius: 7, padding: "7px 10px", color: C.text, fontFamily: C.mono, fontSize: "0.8rem", outline: "none" }} />
                  <Btn onClick={veresiyeEkle} color={C.red} sm>Ekle</Btn>
                </div>
              </div>

              {/* Ödeme al */}
              <div style={{ background: "#0a0a0a", borderRadius: 10, padding: "10px" }}>
                <div style={{ color: C.green, fontSize: "0.65rem", fontFamily: C.mono, letterSpacing: "0.1em", marginBottom: 8 }}>ÖDEME AL</div>
                <div style={{ display: "flex", gap: 6 }}>
                  <input type="number" value={odeme} onChange={e => setOdeme(e.target.value)}
                    placeholder="₺ tutar" style={{ flex: 1, background: "#111", border: `1px solid ${C.border}`, borderRadius: 7, padding: "7px 10px", color: C.text, fontFamily: C.mono, fontSize: "0.8rem", outline: "none" }} />
                  <Btn onClick={odemeAl} color={C.green} sm>Kaydet</Btn>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── RAPOR EKRANI ── */
function RaporEkrani({ stok, musteriler }) {
  const toplamStok = stok.reduce((a, s) => a + s.stok * s.fiyat, 0);
  const toplamBorc = musteriler.reduce((a, m) => a + m.borc, 0);
  const kritikler = stok.filter(s => s.stok <= s.kritik);
  const katDagilim = KATEGORILER.map(k => ({ ...k, sayi: stok.filter(s => s.kategori === k.ad).length })).filter(k => k.sayi > 0);
  const enCokBorc = [...musteriler].sort((a, b) => b.borc - a.borc).slice(0, 5);
  const maxBorc = Math.max(...enCokBorc.map(m => m.borc), 1);

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
        <StatCard label="Stok Değeri" value={fmtPara(toplamStok)} icon="📦" color={C.orange} />
        <StatCard label="Açık Veresiye" value={fmtPara(toplamBorc)} icon="📒" color={C.red} />
        <StatCard label="Kritik Ürün" value={kritikler.length} icon="⚠️" color={C.red} />
        <StatCard label="Toplam Müşteri" value={musteriler.length} icon="👥" color={C.blue} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
        {/* En çok borçlular */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "1.3rem" }}>
          <div style={{ fontFamily: C.display, fontWeight: 800, fontSize: "0.95rem", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <span>📒</span> En Yüksek Veresiyeler
          </div>
          {enCokBorc.length === 0 ? <div style={{ color: C.textDim, fontSize: "0.82rem" }}>Veresiye yok 🎉</div> : enCokBorc.map(m => (
            <div key={m.id} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, fontSize: "0.83rem" }}>
                <span style={{ fontWeight: 700 }}>{m.ad}</span>
                <span style={{ color: C.red, fontFamily: C.mono, fontWeight: 700 }}>{fmtPara(m.borc)}</span>
              </div>
              <div style={{ background: "#0a0a0a", borderRadius: 99, height: 6, overflow: "hidden" }}>
                <div style={{ height: 6, borderRadius: 99, background: `linear-gradient(90deg, ${C.red}, ${C.orange})`, width: `${(m.borc / maxBorc) * 100}%`, transition: "width 0.5s" }} />
              </div>
            </div>
          ))}
        </div>

        {/* Kategori dağılımı */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "1.3rem" }}>
          <div style={{ fontFamily: C.display, fontWeight: 800, fontSize: "0.95rem", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <span>⚙️</span> Kategori Dağılımı
          </div>
          {katDagilim.map(k => (
            <div key={k.ad} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: "1rem" }}>{k.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: 4 }}>
                  <span style={{ color: k.renk, fontWeight: 700 }}>{k.ad}</span>
                  <span style={{ color: C.textDim, fontFamily: C.mono }}>{k.sayi} ürün</span>
                </div>
                <div style={{ background: "#0a0a0a", borderRadius: 99, height: 5 }}>
                  <div style={{ height: 5, borderRadius: 99, background: k.renk, width: `${(k.sayi / stok.length) * 100}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Kritik stoklar */}
        {kritikler.length > 0 && (
          <div style={{ background: C.card, border: `1px solid ${C.red}30`, borderRadius: 14, padding: "1.3rem" }}>
            <div style={{ fontFamily: C.display, fontWeight: 800, fontSize: "0.95rem", color: C.red, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <span>⚠️</span> Acil Sipariş Ver
            </div>
            {kritikler.map(s => (
              <div key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${C.border}` }}>
                <div>
                  <div style={{ color: s.renk, fontWeight: 700, fontSize: "0.85rem" }}>{s.ad}</div>
                  <div style={{ color: C.textDim, fontSize: "0.68rem", fontFamily: C.mono }}>min: {s.kritik} {s.birim}</div>
                </div>
                <Tag color={C.red}>{fmt(s.stok)} {s.birim}</Tag>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── ANA UYGULAMA ── */
const TABS = [
  { id: "stok", label: "Stok", icon: "📦" },
  { id: "veresiye", label: "Veresiye", icon: "📒" },
  { id: "rapor", label: "Rapor", icon: "📊" },
];

export default function App() {
  const [tab, setTab] = useState("stok");

  // localStorage'dan yükle, yoksa örnek veriyi kullan
  const [stok, setStok] = useState(() => {
    try {
      const kayitli = localStorage.getItem("hirdavat_stok");
      return kayitli ? JSON.parse(kayitli) : initialStok;
    } catch { return initialStok; }
  });

  const [musteriler, setMusteriler] = useState(() => {
    try {
      const kayitli = localStorage.getItem("hirdavat_musteriler");
      return kayitli ? JSON.parse(kayitli) : initialMusteriler;
    } catch { return initialMusteriler; }
  });

  // Her değişiklikte otomatik kaydet
  useEffect(() => {
    try { localStorage.setItem("hirdavat_stok", JSON.stringify(stok)); } catch {}
  }, [stok]);

  useEffect(() => {
    try { localStorage.setItem("hirdavat_musteriler", JSON.stringify(musteriler)); } catch {}
  }, [musteriler]);

  // Kayıt bildirimi
  const [kayitMesaj, setKayitMesaj] = useState(false);
  const kayitTimer = useState(null);

  useEffect(() => {
    setKayitMesaj(true);
    const t = setTimeout(() => setKayitMesaj(false), 1500);
    return () => clearTimeout(t);
  }, [stok, musteriler]);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = globalStyle;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.text }}>
      {/* Header */}
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "0 1.5rem", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: C.orange + "20", border: `2px solid ${C.orange}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", boxShadow: `0 0 16px ${C.orange}20` }}>🔩</div>
            <div>
              <div style={{ fontFamily: C.display, fontWeight: 900, fontSize: "1.05rem", color: C.orange, letterSpacing: "0.05em" }}>HIRDAVAT PRO</div>
              <div style={{ fontSize: "0.58rem", color: C.textDim, fontFamily: C.mono, letterSpacing: "0.2em" }}>YÖNETİM PANELİ</div>
            </div>
          </div>

          {/* Kayıt göstergesi + Nav */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Otomatik kayıt bildirimi */}
            <div style={{
              display: "flex", alignItems: "center", gap: 5,
              opacity: kayitMesaj ? 1 : 0, transition: "opacity 0.4s",
              color: C.green, fontSize: "0.72rem", fontFamily: C.mono,
            }}>
              <span>●</span> kaydedildi
            </div>

            {/* Nav */}
            <div style={{ display: "flex", gap: 2 }}>
              {TABS.map(t => (
                <button key={t.id} onClick={() => setTab(t.id)} style={{
                  background: tab === t.id ? C.orange + "18" : "none",
                  border: `1px solid ${tab === t.id ? C.orange + "50" : "transparent"}`,
                  borderRadius: 9, padding: "7px 16px", cursor: "pointer",
                  color: tab === t.id ? C.orange : C.textDim,
                  fontFamily: C.mono, fontSize: "0.8rem", fontWeight: 700,
                  transition: "all 0.2s", display: "flex", alignItems: "center", gap: 6,
                }}>
                  <span>{t.icon}</span> {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "1.8rem 1.2rem" }}>
        {tab === "stok" && <StokEkrani stok={stok} setStok={setStok} />}
        {tab === "veresiye" && <VeresiyeEkrani musteriler={musteriler} setMusteriler={setMusteriler} />}
        {tab === "rapor" && <RaporEkrani stok={stok} musteriler={musteriler} />}
      </div>
    </div>
  );
}
