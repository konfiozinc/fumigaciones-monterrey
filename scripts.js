// ============================================================
// Fumigación Monterrey — lógica (plantilla base KONFÍO ZINC)
// QR dinámico 160x160 + vCard + compartir + año + service worker
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  const qrEl = document.getElementById('qrcode');
  if (qrEl && typeof QRCode !== 'undefined') {
    new QRCode(qrEl, {
      text: window.location.href,
      width: 160,
      height: 160,
      colorDark: '#0f172a',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.H
    });
  }

  const copiar = (texto) => {
    const ok = () => {};
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(texto).catch(() => {});
    } else {
      const ta = document.createElement('textarea');
      ta.value = texto; ta.style.position = 'fixed'; ta.style.left = '-9999px';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } catch (e) {}
      ta.remove();
    }
    ok();
  };

  // Compartir nativo con respaldo a copiar enlace
  document.getElementById('btn-share').addEventListener('click', async () => {
    const data = { title: 'Fumigación Monterrey', text: 'Fumigación y control de plagas. Abierto 24 horas.', url: window.location.href };
    if (navigator.share) {
      try { await navigator.share(data); } catch (e) {}
    } else {
      copiar(window.location.href);
    }
  });

  // Guardar contacto (vCard)
  document.getElementById('btn-vcard').addEventListener('click', () => {
    const vCardData = 'BEGIN:VCARD\r\nVERSION:3.0\r\nFN:Fumigaciones Monterrey INC\r\nORG:Fumigaciones Monterrey INC\r\nTEL;TYPE=CELL:+573147936494\r\nADR;TYPE=WORK:;;Calle 5 N- 5 -40 Barrio Centro;Riohacha;;;Colombia\r\nNOTE:NIT 700225285-8. Soluciones y servicios CIP. Abierto 24 horas.\r\nEND:VCARD';
    const blob = new Blob([vCardData], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Fumigaciones_Monterrey.vcf';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1200);
  });

  // Año
  const anio = document.getElementById('anio');
  if (anio) anio.textContent = new Date().getFullYear();

  // Service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js').catch(() => {});
  }
});
