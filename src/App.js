import React from 'react';
import { motion } from 'framer-motion';

export default function App() {
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

  const links = {
    grafico: 'https://www.mediafire.com/file/vonszhckpeommmr/GRÁFICO+MASSINHA+AMD+wLnX.rar/file',
    emulador: 'https://www.mediafire.com/file/5ofipza2hewdf8m/minha+sensibilidade+202666666666.cfg/file',
    celular: 'https://www.mediafire.com/file/9y3fodmbuxqzk4v/sensi+mob.jpeg/file'
  };

  const [cart, setCart] = React.useState([]);

  const add = (nome, preco, link) => setCart([...cart, { nome, preco, link }]);
  const remove = (index) => setCart(cart.filter((_, i) => i !== index));
  const total = cart.reduce((s, i) => s + i.preco, 0).toFixed(2);
  const totalNumber = Number(total);
  const pixCode = totalNumber > 0 ? buildPixPayload(totalNumber) : '';
  const qrUrl = totalNumber > 0
    ? `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(pixCode)}`
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

  const finalizar = () => {
    if (cart.length) {
      alert('Pague o QR ou copie o código Pix do valor exato do carrinho e depois envie o comprovante para receber seu produto.');
    }
  };

  const itensMensagem = cart.length ? cart.map((i) => i.nome).join(', ') : 'Nenhum produto';
  const mensagemWhats = `Oi, acabei de pagar na Loja MacroX. Produtos: ${itensMensagem}. Total: R$ ${total.replace('.', ',')}. Segue meu comprovante.`;

  const styles = {
    page: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #050505 0%, #111827 45%, #3b0a00 100%)',
      color: '#ffffff',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'Arial, sans-serif'
    },
    glowOne: {
      position: 'absolute',
      top: '-80px',
      left: '-80px',
      width: '300px',
      height: '300px',
      borderRadius: '50%',
      background: 'rgba(255,120,0,0.18)',
      filter: 'blur(70px)'
    },
    glowTwo: {
      position: 'absolute',
      bottom: '-80px',
      right: '-80px',
      width: '300px',
      height: '300px',
      borderRadius: '50%',
      background: 'rgba(34,211,238,0.16)',
      filter: 'blur(70px)'
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      position: 'relative',
      zIndex: 2
    },
    title: {
      textAlign: 'center',
      color: '#22d3ee',
      fontSize: '42px',
      marginBottom: '8px',
      fontWeight: 'bold',
      textShadow: '0 0 14px rgba(34,211,238,0.45)'
    },
    subtitle: {
      textAlign: 'center',
      color: '#d1d5db',
      marginBottom: '26px',
      fontSize: '17px'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '16px'
    },
    card: {
      background: '#1f2937',
      border: '1px solid #374151',
      borderRadius: '20px',
      padding: '18px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.25)'
    },
    image: {
      width: '100%',
      height: '150px',
      objectFit: 'cover',
      borderRadius: '14px',
      marginBottom: '12px'
    },
    cardTitle: {
      color: '#22d3ee',
      fontSize: '22px',
      fontWeight: 'bold',
      margin: '0 0 8px 0'
    },
    small: {
      color: '#9ca3af',
      marginBottom: '12px'
    },
    button: {
      width: '100%',
      border: 'none',
      borderRadius: '14px',
      padding: '12px',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: '0.2s'
    },
    cyanButton: {
      background: '#22d3ee',
      color: '#000000',
      boxShadow: '0 0 16px rgba(34,211,238,0.35)'
    },
    orangeButton: {
      background: '#f97316',
      color: '#000000',
      marginBottom: '12px'
    },
    greenButton: {
      background: '#22c55e',
      color: '#000000',
      textDecoration: 'none',
      display: 'block',
      textAlign: 'center'
    },
    sectionGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: '16px',
      marginTop: '20px'
    },
    box: {
      background: '#1f2937',
      borderRadius: '20px',
      padding: '18px',
      border: '1px solid #374151'
    },
    boxBorder: {
      border: '1px solid #22d3ee'
    },
    boxTitle: {
      color: '#22d3ee',
      fontSize: '24px',
      fontWeight: 'bold',
      marginTop: 0,
      marginBottom: '12px'
    },
    pixArea: {
      background: '#111827',
      borderRadius: '16px',
      padding: '14px',
      border: '1px solid #374151',
      marginTop: '12px',
      marginBottom: '12px'
    },
    qrWrap: {
      display: 'flex',
      justifyContent: 'center',
      margin: '14px 0'
    },
    qr: {
      width: '224px',
      height: '224px',
      borderRadius: '18px',
      border: '4px solid #22d3ee',
      boxShadow: '0 0 18px rgba(34,211,238,0.35)',
      background: '#ffffff'
    },
    mono: {
      fontFamily: 'monospace',
      fontSize: '12px',
      wordBreak: 'break-all',
      color: '#e5e7eb'
    },
    muted: {
      color: '#9ca3af',
      fontSize: '13px'
    },
    cartRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '10px',
      marginBottom: '6px'
    },
    remove: {
      background: 'transparent',
      color: '#f87171',
      border: 'none',
      cursor: 'pointer',
      fontSize: '13px'
    },
    footer: {
      textAlign: 'center',
      color: '#6b7280',
      marginTop: '24px',
      fontSize: '14px'
    }
  };

  const Card = ({ img, titulo, nome, preco, link }) => (
    <div style={styles.card}>
      <img src={img} alt={nome} style={styles.image} />
      <h2 style={styles.cardTitle}>{titulo}</h2>
      <p>{nome}</p>
      <p style={styles.small}>R$ {preco.toFixed(2).replace('.', ',')}</p>
      <button
        onClick={() => add(nome, preco, link)}
        style={{ ...styles.button, ...styles.cyanButton }}
      >
        Adicionar ao Carrinho
      </button>
    </div>
  );

  return (
    <div style={styles.page}>
      <motion.div
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      >
        <div style={styles.glowOne} />
        <div style={styles.glowTwo} />
      </motion.div>

      <div style={styles.container}>
        <motion.h1
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          style={styles.title}
        >
          🔥 Loja MacroX FF 🔥
        </motion.h1>

        <p style={styles.subtitle}>Tema Free Fire • Sensis e gráficos insanos</p>

        <div style={styles.grid}>
          <Card
            img='https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80'
            titulo='Produto 1'
            nome='Gráfico Massinha AMD'
            preco={5}
            link={links.grafico}
          />
          <Card
            img='https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80'
            titulo='Produto 2'
            nome='Sensibilidade Emulador'
            preco={9.99}
            link={links.emulador}
          />
          <Card
            img='https://images.unsplash.com/photo-1560253023-3ec5d502959f?auto=format&fit=crop&w=800&q=80'
            titulo='Produto 3'
            nome='Sensibilidade Celular'
            preco={5}
            link={links.celular}
          />
        </div>

        <div style={styles.sectionGrid}>
          <div style={{ ...styles.box, ...styles.boxBorder }}>
            <h3 style={styles.boxTitle}>🛒 Carrinho Funcionando</h3>
            <p>Itens: {cart.length}</p>

            <div style={{ margin: '10px 0' }}>
              {cart.map((i, x) => (
                <div key={x} style={styles.cartRow}>
                  <span>• {i.nome}</span>
                  <button onClick={() => remove(x)} style={styles.remove}>Remover</button>
                </div>
              ))}
            </div>

            <p>Total: R$ {total.replace('.', ',')}</p>

            <div style={styles.pixArea}>
              <p style={{ ...styles.muted, margin: '0 0 4px 0' }}>🔐 Pagamento Pix Seguro</p>
              <p style={{ color: '#22d3ee', fontWeight: 'bold', margin: '0 0 8px 0' }}>MacroX Pagamentos</p>
              <p style={{ color: '#d1d5db', fontSize: '14px', marginTop: 0 }}>O QR Code muda conforme o valor do carrinho.</p>

              {totalNumber > 0 ? (
                <>
                  <div style={styles.qrWrap}>
                    <img src={qrUrl} alt='QR Code Pix dinâmico' style={styles.qr} />
                  </div>
                  <p style={styles.mono}>{pixCode}</p>
                  <button onClick={copiarPix} style={{ ...styles.button, ...styles.cyanButton, marginTop: '12px' }}>
                    Copiar código Pix
                  </button>
                </>
              ) : (
                <p style={styles.muted}>Adicione um produto ao carrinho para gerar o QR do valor exato.</p>
              )}

              <p style={{ ...styles.muted, marginTop: '12px' }}>
                Após pagar, envie o comprovante para o WhatsApp: (47) 99673-2560 para receber seu produto.
              </p>
            </div>

            <button onClick={finalizar} style={{ ...styles.button, ...styles.orangeButton }}>
              Pagar e Enviar Comprovante
            </button>

            <a
              href={`https://wa.me/5547996732560?text=${encodeURIComponent(mensagemWhats)}`}
              target='_blank'
              rel='noreferrer'
              style={{ ...styles.button, ...styles.greenButton }}
            >
              📲 Clique aqui após pagar para receber seu produto (WhatsApp)
            </a>
          </div>

          <div style={styles.box}>
            <h3 style={{ ...styles.boxTitle, color: '#fb923c' }}>🔥 Avaliações</h3>
            <p>★★★★★ Muito boa, puxou capa demais!</p>
            <p>★★★★★ Melhor sensi que já comprei.</p>
            <p>★★★★★ Entrega rápida e confiável.</p>
          </div>
        </div>

        <p style={styles.footer}>Loja MacroX FF © • Nova Versão Insana</p>
      </div>
    </div>
  );
}
