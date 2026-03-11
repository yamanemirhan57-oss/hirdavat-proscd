import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

/* ── KUZENİN DÜKKAN TASARIMI ── */
const globalStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=JetBrains+Mono:wght@400;600;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #080808; color: #f0f0f0; font-family: 'JetBrains Mono', monospace; }
  .card-hover:hover { border-color: #ff6b2b !important; transform: translateY(-2px); transition: all 0.2s; }
  input, select { background: #0a0a0a; border: 1px solid #2a2a2a; color: white; padding: 12px; border-radius: 10px; outline: none; width: 100%; }
  @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
`;

const C = { 
  orange: "#ff6b2b", green: "#10b981", red: "#f43f5e", blue: "#3b82f6",
  card: "#141414", border: "#1f1f1f", display: "'Syne', sans-serif" 
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [pass, setPass] = useState("");
  const [tab, setTab] = useState("stok");
  const [stok, setStok] = useState([]);
  const [musteriler, setMusteriler] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [yeniUrun, setYeniUrun] = useState({ ad: "", kategori: "Vidalarım", stok: 0, fiyat: 0, kritik: 10 });

  useEffect(() => { if (isLoggedIn) verileriCek(); }, [isLoggedIn]);

  const verileriCek = async () => {
    const { data: sData } = await supabase.from('stok').select('*').order('ad');
    const { data: mData } = await supabase.from('musteriler').select('*').order('borc', { ascending: false });
    if (sData) setStok(sData);
    if (mData) setMusteriler(mData);
    setLoading(false);
  };

  const urunEkle = async () => {
    if (!yeniUrun.ad) return alert("Ad gir kanka!");
    await supabase.from('stok').insert([yeniUrun]);
    setModal(false);
    verileriCek();
  };

  const miktarGuncelle = async (id, miktar) => {
    await supabase.from('stok').update({ stok: miktar }).eq('id', id);
    setStok(prev => prev.map(s => s.id === id ? { ...s, stok: miktar } : s));
  };

  // RAPOR HESAPLAMALARI
  const toplamStokDegeri = stok.reduce((a, s) => a + (s.stok * s.fiyat), 0);
  const toplamAlacak = musteriler.reduce((a, m) => a + m.borc, 0);
  const kritikUrunSayisi = stok.filter(s => s.stok <= s.kritik).length;

  if (!isLoggedIn) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#080808' }}>
      <style>{globalStyle}</style>
      <div style={{ background: '#141414', padding: '40px', borderRadius: '25px', border: '1px solid #1f1f1f', textAlign: 'center', width: '350px' }}>
        <h2 style={{ color: C.orange, fontFamily: C.display }}>🔩 HIRDAVAT PRO</h2>
        <input type="password" placeholder="Şifre" onChange={(e) => setPass(e.target.value)} style={{ margin: '20px 0', textAlign: 'center' }} />
        <button onClick={() => pass === "hirdavat2026" ? setIsLoggedIn(true) : alert("Hatalı!")} style={{ background: C.orange, color: 'white', border: 'none', padding: '15px', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', width: '100%' }}>GİRİŞ YAP</button>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <style>{globalStyle}</style>
      
      {/* NAV MENÜ */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', background: C.card, padding: '15px 25px', borderRadius: '18px', border: `1px solid ${C.border}` }}>
        <div style={{ fontFamily: C.display, color: C.orange, fontWeight: 900 }}>HIRDAVAT PRO</div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['stok', 'veresiye', 'rapor'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ background: tab === t ? C.orange : 'transparent', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.75rem' }}>{t.toUpperCase()}</button>
          ))}
        </div>
      </div>

      {loading ? <p>Yükleniyor...</p> : (
        <div style={{ animation: 'fadeIn 0.4s ease' }}>
          
          {/* STOK SEKEMESİ */}
          {tab === "stok" && (
            <div>
              <button onClick={() => setModal(true)} style={{ background: C.green, color: 'white', border: 'none', padding: '12px', borderRadius: '12px', cursor: 'pointer', width: '100%', fontWeight: 'bold', marginBottom: '15px' }}>＋ YENİ ÜRÜN EKLE</button>
              <div style={{ display: 'grid', gap: '10px' }}>
                {stok.map(s => (
                  <div key={s.id} className="card-hover" style={{ background: C.card, padding: '15px 20px', borderRadius: '15px', border: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 800, color: C.orange, fontFamily: C.display }}>{s.ad}</div>
                      <div style={{ fontSize: '0.7rem', color: '#666' }}>Birim Fiyat: ₺{s.fiyat}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.4rem', fontWeight: 900, color: s.stok <= s.kritik ? C.red : 'white' }}>{s.stok}</div>
                      </div>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <button onClick={() => miktarGuncelle(s.id, s.stok - 1)} style={{ background: C.red, border: 'none', color: 'white', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer' }}>-</button>
                        <button onClick={() => miktarGuncelle(s.id, s.stok + 1)} style={{ background: C.green, border: 'none', color: 'white', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer' }}>+</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VERESİYE SEKEMESİ */}
          {tab === "veresiye" && (
            <div style={{ display: 'grid', gap: '10px' }}>
              <h3 style={{ fontFamily: C.display, color: C.orange, marginBottom: '10px' }}>📒 Müşteri Borçları</h3>
              {musteriler.map(m => (
                <div key={m.id} style={{ background: C.card, padding: '15px', borderRadius: '12px', border: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between' }}>
                  <span>{m.ad}</span>
                  <span style={{ color: C.red, fontWeight: 'bold' }}>₺{m.borc.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}

          {/* RAPOR SEKEMESİ (Senin istediğin o özel bölüm) */}
          {tab === "rapor" && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
              <div style={{ background: C.card, padding: '25px', borderRadius: '20px', border: `1px solid ${C.green}40`, textAlign: 'center' }}>
                <div style={{ fontSize: '2rem' }}>💰</div>
                <div style={{ color: '#666', fontSize: '0.8rem', marginTop: '10px' }}>TOPLAM STOK DEĞERİ</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: C.green, marginTop: '5px' }}>₺{toplamStokDegeri.toLocaleString()}</div>
              </div>
              <div style={{ background: C.card, padding: '25px', borderRadius: '20px', border: `1px solid ${C.red}40`, textAlign: 'center' }}>
                <div style={{ fontSize: '2rem' }}>📒</div>
                <div style={{ color: '#666', fontSize: '0.8rem', marginTop: '10px' }}>TOPLAM ALACAK (VERESİYE)</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: C.red, marginTop: '5px' }}>₺{toplamAlacak.toLocaleString()}</div>
              </div>
              <div style={{ background: C.card, padding: '25px', borderRadius: '20px', border: `1px solid ${C.orange}40`, textAlign: 'center' }}>
                <div style={{ fontSize: '2rem' }}>⚠️</div>
                <div style={{ color: '#666', fontSize: '0.8rem', marginTop: '10px' }}>KRİTİK STOKTAKİ ÜRÜN</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: C.orange, marginTop: '5px' }}>{kritikUrunSayisi} ÜRÜN</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODAL */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: C.card, padding: '30px', borderRadius: '25px', border: `1px solid ${C.border}`, width: '90%', maxWidth: '400px' }}>
            <h3 style={{ marginBottom: '20px', fontFamily: C.display }}>YENİ ÜRÜN</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input placeholder="Ürün Adı" onChange={e => setYeniUrun({...yeniUrun, ad: e.target.value})} />
              <input type="number" placeholder="Stok" onChange={e => setYeniUrun({...yeniUrun, stok: parseInt(e.target.value)})} />
              <input type="number" placeholder="Fiyat" onChange={e => setYeniUrun({...yeniUrun, fiyat: parseFloat(e.target.value)})} />
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button onClick={() => setModal(false)} style={{ flex: 1, padding: '12px', borderRadius: '10px', background: '#333', border: 'none', color: 'white' }}>İptal</button>
                <button onClick={urunEkle} style={{ flex: 1, padding: '12px', borderRadius: '10px', background: C.orange, border: 'none', color: 'white', fontWeight: 'bold' }}>KAYDET</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
