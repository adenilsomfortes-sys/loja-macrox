import React from 'react';
import { motion } from 'framer-motion';

function CompareImage() {
  const [pos, setPos] = React.useState(50);
  const [dragging, setDragging] = React.useState(false);

  const updateFromClientX = (clientX, element) => {
    const rect = element.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPos(pct);
  };

  const handleMouseDown = (e) => {
    setDragging(true);
    updateFromClientX(e.clientX, e.currentTarget);
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    updateFromClientX(e.clientX, e.currentTarget);
  };

  const handleTouchStart = (e) => {
    updateFromClientX(e.touches[0].clientX, e.currentTarget);
  };

  const handleTouchMove = (e) => {
    updateFromClientX(e.touches[0].clientX, e.currentTarget);
  };

  React.useEffect(() => {
    const stopDragging = () => setDragging(false);
    window.addEventListener('mouseup', stopDragging);
    return () => window.removeEventListener('mouseup', stopDragging);
  }, []);

  return (
    <div style={{ maxWidth: 600, margin: '16px auto 0' }}>
      <div
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        style={{
          position: 'relative',
          borderRadius: 22,
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.35)',
          cursor: 'ew-resize',
          userSelect: 'none',
          touchAction: 'none',
          background: '#000'
        }}
      >
        <img
          src="/sem-grafico.png"
          alt="Sem gráfico"
          draggable="false"
          style={{ width: '100%', height: 260, objectFit: 'contain', display: 'block' }}
        />

        <img
          src="/com-grafico.png"
          alt="Com gráfico"
          draggable="false"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            display: 'block',
            clipPath: `inset(0 ${100 - pos}% 0 0)`
          }}
        />

        <div
          style={{
            position: 'absolute',
            top: 0,
            left: `${pos}%`,
            width: 2,
            height: '100%',
            background: '#ffffff',
            boxShadow: '0 0 14px rgba(255,255,255,0.9)',
            transform: 'translateX(-1px)'
          }}
        />

        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: `${pos}%`,
            transform: 'translate(-50%, -50%)',
            width: 46,
            height: 46,
            borderRadius: '50%',
            background: '#ffffff',
            color: '#020617',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 900,
            boxShadow: '0 8px 24px rgba(0,0,0,0.35)'
          }}
        >
          ↔
        </div>
      </div>

      <div style={{ color: '#94a3b8', fontSize: 13, marginTop: 10, textAlign: 'center' }}>
        Arraste a linha para a esquerda ou direita para comparar.
      </div>
    </div>
  );
}

export default function App() {
  const [showCompare, setShowCompare] = React.useState(false);
  const pixKey = '+5547996732560';
  const merchantName = 'Izaque Izaias da Silva Fo';
  const merchantCity = 'SAO PAULO';

  const emv = (id, value) => `${id}${String(value.length).padStart(2, '0')}${value}`;
  const crc16 = (str) => {
    let crc = 0xffff;
    for (let i = 0; i < str.length; i++) {
      crc ^= str.charCodeAt(i) << 8;
      for (let j = 0; j < 8; j++) {
        crc = (crc & 0x8000) ? ((crc << 1) ^ 0x1021) : (crc << 1);
        crc &= 0xffff;
      }
    }
    return crc.toString(16).toUpperCase().padStart(4, '0');
  };

  const buildPixPayload = (amount) => {
    const gui = emv('00', 'BR.GOV.BCB.PIX');
    const key = emv('01', pixKey);
    const merchantAccount = emv('26', `${gui}${key}`);
    const payload = [
      emv('00', '01'),
      emv('26', merchantAccount.slice(4)),
      emv('52', '0000'),
      emv('53', '986'),
      emv('54', amount.toFixed(2)),
      emv('58', 'BR'),
      emv('59', merchantName.slice(0, 25)),
      emv('60', merchantCity.slice(0, 15)),
      emv('62', emv('05', 'MacroX')),
      '6304'
    ].join('');
    return payload + crc16(payload);
  };

  const products = [
    {
      id: 'grafico',
      titulo: 'Gráfico Massinha AMD',
      preco: 5,
      destaque: 'Mais vendido',
      img1: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1000&q=80',
      img2: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1000&q=80',
      beneficios: ['Mais estabilidade', 'Config leve', 'Melhor resposta'],
    },
    {
      id: 'emulador',
      titulo: 'Sensibilidade Emulador',
      preco: 9.99,
      destaque: 'Premium',
      img1: 'https://images.unsplash.com/photo-1511882150382-421056c89033?auto=format&fit=crop&w=1000&q=80',
      img2: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?auto=format&fit=crop&w=1000&q=80',
      beneficios: ['Puxa mais capa', 'Fácil de aplicar', 'Ajuste otimizado'],
    },
    {
      id: 'celular',
      titulo: 'Sensibilidade Celular',
      preco: 5,
      destaque: 'Mobile',
      img1: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1000&q=80',
      img2: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=1000&q=80',
      beneficios: ['Boa para toque', 'Mais precisão', 'Setup rápido'],
    }
  ];

  const [cart, setCart] = React.useState([]);
  const add = (produto) => setCart([...cart, produto]);
  const remove = (index) => setCart(cart.filter((_, i) => i !== index));
  const total = cart.reduce((s, i) => s + i.preco, 0).toFixed(2);
  const totalNumber = Number(total);
  const pixCode = totalNumber > 0 ? buildPixPayload(totalNumber) : '';
  const qrUrl = totalNumber > 0
    ? `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(pixCode)}`
    : '';

  const copiarPix = async () => {
    if (!pixCode) return;
    try {
      await navigator.clipboard.writeText(pixCode);
      alert('Código Pix copiado!');
    } catch {
      alert('Não foi possível copiar o código Pix.');
    }
  };

  const itensMensagem = cart.length ? cart.map((i) => i.titulo).join(', ') : 'Nenhum produto';
  const mensagemWhats = `Oi, acabei de pagar na Loja MacroX. Produtos: ${itensMensagem}. Total: R$ ${total.replace('.', ',')}. Segue meu comprovante.`;

  const styles = {
    page: {
      minHeight: '100vh',
      background: 'radial-gradient(circle at 20% 20%, #0f172a, #020617 70%)',
      color: '#fff',
      fontFamily: 'Inter, Arial, sans-serif',
      position: 'relative',
      overflowX: 'hidden'
    },
    glowTop: {
      position: 'absolute',
      top: -140,
      left: '10%',
      width: 340,
      height: 340,
      borderRadius: '50%',
      background: 'rgba(34,211,238,0.14)',
      filter: 'blur(80px)'
    },
    glowBottom: {
      position: 'absolute',
      bottom: -120,
      right: '8%',
      width: 360,
      height: 360,
      borderRadius: '50%',
      background: 'rgba(249,115,22,0.16)',
      filter: 'blur(85px)'
    },
    wrap: { maxWidth: 1200, margin: '0 auto', padding: '24px', position: 'relative', zIndex: 2 },
    hero: { padding: '34px 0 10px', textAlign: 'center' },
    title: {
      fontSize: 'clamp(28px,5vw,48px)',
      fontWeight: 900,
      background: 'linear-gradient(90deg,#22d3ee,#a78bfa)',
      WebkitBackgroundClip: 'text',
      color: 'transparent',
      marginBottom: 18
    },
    desc: { color: '#94a3b8', maxWidth: 700, margin: '0 auto', fontSize: 18 },
    sectionTitle: { textAlign: 'center', fontSize: 28, fontWeight: 900, margin: '50px 0 20px' },
    productsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20 },
    productCard: {
      background: 'linear-gradient(180deg,#0f172a,#020617)',
      borderRadius: 20,
      overflow: 'hidden',
      border: '1px solid rgba(255,255,255,0.05)',
      boxShadow: '0 14px 36px rgba(0,0,0,0.28)'
    },
    mainImg: { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' },
    hoverImg: { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' },
    productBody: { padding: 18 },
    tag: {
      display: 'inline-block',
      padding: '6px 10px',
      borderRadius: 999,
      background: 'rgba(249,115,22,0.12)',
      color: '#fdba74',
      fontSize: 12,
      fontWeight: 800,
      marginBottom: 10
    },
    productTitle: { fontSize: 22, fontWeight: 800, marginBottom: 6 },
    price: { fontSize: 26, fontWeight: 900, color: '#22d3ee' },
    list: { paddingLeft: 18, color: '#cbd5e1', lineHeight: 1.7, margin: '10px 0 0' },
    addBtn: {
      marginTop: 14,
      width: '100%',
      padding: 12,
      borderRadius: 12,
      border: 'none',
      background: '#22d3ee',
      color: '#000',
      fontWeight: 800,
      cursor: 'pointer'
    },
    split: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 18, marginTop: 34 },
    box: { background: '#020617', borderRadius: 20, padding: 20, border: '1px solid rgba(255,255,255,0.08)' },
    boxTitle: { fontSize: 24, fontWeight: 800, marginTop: 0, marginBottom: 12 },
    cartRow: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: 12,
      alignItems: 'center',
      padding: '8px 0',
      borderBottom: '1px solid rgba(255,255,255,0.06)'
    },
    removeBtn: { background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer', fontWeight: 700 },
    pixArea: { background: '#0b1220', borderRadius: 20, padding: 16, marginTop: 14, border: '1px solid rgba(255,255,255,0.08)' },
    qr: {
      width: 230,
      height: 230,
      borderRadius: 20,
      background: '#fff',
      border: '4px solid #22d3ee',
      boxShadow: '0 0 18px rgba(34,211,238,0.3)'
    },
    mono: { fontFamily: 'monospace', fontSize: 12, wordBreak: 'break-all', color: '#cbd5e1' },
    secondaryBtn: {
      display: 'block',
      background: 'rgba(255,255,255,0.04)',
      color: '#fff',
      border: '1px solid rgba(255,255,255,0.12)',
      padding: '14px 18px',
      borderRadius: 14,
      fontWeight: 800,
      textDecoration: 'none'
    },
    primaryBtn: {
      background: 'linear-gradient(135deg,#22d3ee,#6366f1)',
      border: 'none',
      color: '#000',
      fontWeight: 900,
      padding: '14px 18px',
      borderRadius: 14,
      cursor: 'pointer'
    },
    faqItem: {
      background: 'rgba(15,23,42,0.88)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 18,
      padding: 18,
      marginBottom: 12
    },
    reviewsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 14 },
    review: {
      background: 'rgba(15,23,42,0.88)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 20,
      padding: 18,
      color: '#dbeafe'
    },
    footer: { textAlign: 'center', marginTop: 30, color: '#64748b' },
    stealthBtn: {
      display: 'inline-block',
      marginTop: 14,
      background: 'rgba(255,255,255,0.04)',
      color: '#cbd5e1',
      border: '1px solid rgba(255,255,255,0.1)',
      padding: '10px 14px',
      borderRadius: 999,
      fontWeight: 700,
      cursor: 'pointer'
    }
  };

  const ImageHoverCard = ({ produto }) => {
    const [hover, setHover] = React.useState(false);

    return (
      <div style={styles.productCard}>
        <div
          style={{ position: 'relative', height: 220 }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <img src={produto.img1} alt={produto.titulo} style={{ ...styles.mainImg, opacity: hover ? 0 : 1, transition: '0.4s' }} />
          <img src={produto.img2} alt={produto.titulo} style={{ ...styles.hoverImg, opacity: hover ? 1 : 0, transition: '0.4s' }} />
        </div>
        <div style={styles.productBody}>
          <span style={styles.tag}>{produto.destaque}</span>
          <h3 style={styles.productTitle}>{produto.titulo}</h3>
          <div style={styles.price}>R$ {produto.preco.toFixed(2).replace('.', ',')}</div>
          <ul style={styles.list}>
            {produto.beneficios.map((b, i) => <li key={i}>{b}</li>)}
          </ul>
          <button style={styles.addBtn} onClick={() => add(produto)}>Adicionar ao carrinho</button>
        </div>
      </div>
    );
  };

  return (
    <div style={styles.page}>
      <div style={styles.glowTop} />
      <div style={styles.glowBottom} />

      <div style={styles.wrap}>
        <section style={styles.hero}>
          <motion.h1 animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 3 }} style={styles.title}>
            Loja MacroX FF
          </motion.h1>
          <p style={styles.desc}>Produtos prontos, checkout rápido e envio do comprovante direto no WhatsApp.</p>
          <button style={styles.stealthBtn} onClick={() => setShowCompare(!showCompare)}>
            {showCompare ? 'Ocultar demonstração do gráfico' : 'Ver demonstração do gráfico'}
          </button>
          {showCompare && <CompareImage />}
        </section>

        <h2 style={styles.sectionTitle}>Demonstração</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 20, marginBottom: 20 }}>
          <div style={{ background: '#020617', padding: 12, borderRadius: 16 }}>
            <div style={{ marginBottom: 8, fontWeight: 800 }}>🎮 Sensibilidade Emulador</div>
            <iframe
              src="https://drive.google.com/file/d/1SYKPTJ7kbPsko8C8S1wyuKjc1Zd0jQ_N/preview"
              title="Demonstração Sensibilidade Emulador"
              allow="autoplay"
              style={{ width: '100%', height: 260, border: 'none', borderRadius: 12 }}
            />
          </div>

          <div style={{ background: '#020617', padding: 12, borderRadius: 16 }}>
            <div style={{ marginBottom: 8, fontWeight: 800 }}>📱 Sensibilidade Mobile</div>
            <iframe
              src="https://drive.google.com/file/d/1Lp040AWBH-ztcK7-l-vogSISExNnQZRj/preview"
              title="Demonstração Sensibilidade Mobile"
              allow="autoplay"
              style={{ width: '100%', height: 260, border: 'none', borderRadius: 12 }}
            />
          </div>
        </div>

        <h2 id="produtos" style={styles.sectionTitle}>Escolha seu produto</h2>
        <div style={styles.productsGrid}>
          {products.map((produto) => <ImageHoverCard key={produto.id} produto={produto} />)}
        </div>

        <div style={styles.split} id="checkout">
          <div style={styles.box}>
            <h3 style={styles.boxTitle}>Checkout e carrinho</h3>
            <p style={{ color: '#cbd5e1' }}>Itens no carrinho: <strong>{cart.length}</strong></p>
            <div style={{ marginTop: 10 }}>
              {cart.map((item, i) => (
                <div key={i} style={styles.cartRow}>
                  <div>
                    <div>{item.titulo}</div>
                    <div style={{ color: '#67e8f9', fontWeight: 800 }}>R$ {item.preco.toFixed(2).replace('.', ',')}</div>
                  </div>
                  <button style={styles.removeBtn} onClick={() => remove(i)}>Remover</button>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 26, fontWeight: 900, marginTop: 18 }}>Total: R$ {total.replace('.', ',')}</div>

            <div style={styles.pixArea}>
              <div style={{ color: '#67e8f9', fontWeight: 800, marginBottom: 6 }}>Pagamento Pix Seguro</div>
              <div style={{ color: '#cbd5e1', marginBottom: 12 }}>O QR Code muda automaticamente conforme o valor do carrinho.</div>
              {totalNumber > 0 ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
                    <img src={qrUrl} alt="QR Pix" style={styles.qr} />
                  </div>
                  <div style={styles.mono}>{pixCode}</div>
                  <button onClick={copiarPix} style={{ ...styles.primaryBtn, width: '100%', marginTop: 14 }}>Copiar código Pix</button>
                </>
              ) : (
                <div style={{ color: '#94a3b8' }}>Adicione um produto para gerar o QR.</div>
              )}
              <div style={{ color: '#94a3b8', fontSize: 13, marginTop: 14 }}>
                Após pagar, envie o comprovante para o WhatsApp: (47) 99673-2560
              </div>
            </div>

            <a
              href={`https://wa.me/5547996732560?text=${encodeURIComponent(mensagemWhats)}`}
              target="_blank"
              rel="noreferrer"
              style={{ ...styles.secondaryBtn, textAlign: 'center', marginTop: 14 }}
            >
              📲 Enviar comprovante no WhatsApp
            </a>
          </div>

          <div>
            <div style={styles.faqItem}>
              <strong>Como funciona?</strong>
              <div style={{ color: '#cbd5e1', marginTop: 8 }}>Escolha o produto, gere o Pix, pague e envie o comprovante no WhatsApp.</div>
            </div>
            <div style={styles.faqItem}>
              <strong>Quando recebo?</strong>
              <div style={{ color: '#cbd5e1', marginTop: 8 }}>Assim que o comprovante for confirmado, o arquivo é enviado.</div>
            </div>
            <div style={styles.faqItem}>
              <strong>Comparador do gráfico</strong>
              <div style={{ color: '#cbd5e1', marginTop: 8 }}>A barra do topo mostra a diferença visual entre com e sem gráfico.</div>
            </div>
          </div>
        </div>

        <h2 style={styles.sectionTitle}>O que os clientes dizem</h2>
        <div style={styles.reviewsGrid}>
          <div style={styles.review}>★★★★★<br /><br />Muito boa, puxou capa demais. Layout ficou profissional e fácil de comprar.</div>
          <div style={styles.review}>★★★★★<br /><br />A sensi de emulador ficou absurda. Atendimento rápido no WhatsApp.</div>
          <div style={styles.review}>★★★★★<br /><br />Comprei no celular e paguei no Pix sem dificuldade.</div>
        </div>

        <div style={styles.footer}>Loja MacroX FF © • estilo premium atualizado</div>
      </div>
    </div>
  );
}