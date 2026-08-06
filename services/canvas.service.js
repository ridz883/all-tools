const { createCanvas, loadImage } = require('@napi-rs/canvas');
const axios = require('axios');

class CanvasService {
  // 1. Fake Apple Music
  async fakeAppleMusic(title = 'Beauty and a beat', artist = 'Justin Bieber') {
    const canvas = createCanvas(1080, 1920);
    const ctx = canvas.getContext('2d');

    const bg = await loadImage('https://raw.githubusercontent.com/rzkrohan/image-canvas/refs/heads/main/applemusic.png');
    ctx.drawImage(bg, 0, 0, 1080, 1920);

    const { data: imgBuffer } = await axios.get('https://cdn.nekohime.site/file/wjo8i87c.jpg', { responseType: 'arraybuffer' });
    const cover = await loadImage(imgBuffer);

    const coverX = 86, coverY = 186, coverW = 907.8, coverH = 907.8, radius = 59;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(coverX + radius, coverY);
    ctx.arcTo(coverX + coverW, coverY, coverX + coverW, coverY + coverH, radius);
    ctx.arcTo(coverX + coverW, coverY + coverH, coverX, coverY + coverH, radius);
    ctx.arcTo(coverX, coverY + coverH, coverX, coverY, radius);
    ctx.arcTo(coverX, coverY, coverX + coverW, coverY, radius);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(cover, coverX, coverY, coverW, coverH);
    ctx.restore();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 45px sans-serif';
    ctx.fillText(title, 100, 1206, 880);

    ctx.fillStyle = '#BEBEBE';
    ctx.font = '35px sans-serif';
    ctx.fillText(artist, 100, 1272, 880);

    return canvas.toDataURL('image/png');
  }

  // 2. Fake FF Lobby Maker (Teks Nama Diperjelas)
  async fakeFf(nama = 'RIDZ.GAKJAGO') {
    const BG_WIDTH = 1200, BG_HEIGHT = 2135;
    const canvas = createCanvas(BG_WIDTH, BG_HEIGHT);
    const ctx = canvas.getContext('2d');

    const bgImage = await loadImage('https://raw.githubusercontent.com/rzkrohan/epep-cowo/refs/heads/main/cowo2.webp');
    ctx.drawImage(bgImage, 0, 0, BG_WIDTH, BG_HEIGHT);

    const centerX = 600.0, centerY = 350.0;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.font = 'bold 70px sans-serif';

    ctx.lineWidth = 10;
    ctx.strokeStyle = '#000000';
    ctx.strokeText(nama, centerX, centerY);

    ctx.fillStyle = '#FFD700';
    ctx.fillText(nama, centerX, centerY);

    return canvas.toDataURL('image/png');
  }

  // 3. Fake Tulis Buku (Fix Tulisan Muncul Jelas di Kertas)
  async fakeTulis(text = 'Contoh tulisan tangan...') {
    const canvas = createCanvas(1080, 1920);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#fcfbf7';
    ctx.fillRect(0, 0, 1080, 1920);

    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    for (let i = 200; i < 1800; i += 60) {
      ctx.beginPath();
      ctx.moveTo(100, i);
      ctx.lineTo(980, i);
      ctx.stroke();
    }

    ctx.font = '40px sans-serif';
    ctx.fillStyle = '#1e293b';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    let x = 130, y = 210, maxWidth = 800, lineHeight = 60;
    const paragraphs = String(text).split('\n');

    for (const paragraph of paragraphs) {
      const words = paragraph.split(' ');
      let line = '';
      for (const word of words) {
        const testLine = line + word + ' ';
        if (ctx.measureText(testLine).width > maxWidth && line !== '') {
          ctx.fillText(line.trim(), x, y);
          line = word + ' ';
          y += lineHeight;
        } else {
          line = testLine;
        }
      }
      if (line) {
        ctx.fillText(line.trim(), x, y);
        y += lineHeight;
      }
    }

    return canvas.toDataURL('image/png');
  }

  // 4. Windows Player Maker
  async fakeWindows(text = 'ANJAY BANGWT KIR') {
    const canvas = createCanvas(1080, 1920);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 1080, 1920);

    const { data: imgBuf } = await axios.get('https://raw.githubusercontent.com/whatsapp-media/whatsapp-media/main/uploads/KyzoCDN_1784711336503_undefined.png', { responseType: 'arraybuffer' });
    const img = await loadImage(Buffer.from(imgBuf));
    ctx.drawImage(img, 0, 0, 1080, 1920);

    ctx.font = 'bold 60px sans-serif';
    ctx.fillStyle = '#0f172a';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    const lines = text.trim().split(/\s+/);
    let startY = 720.0;
    lines.forEach((line, i) => {
      ctx.fillText(line, 80.0, startY + (i * 75));
    });

    return canvas.toDataURL('image/png');
  }
}

module.exports = new CanvasService();
