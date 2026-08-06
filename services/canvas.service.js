const { createCanvas, loadImage } = require('@napi-rs/canvas');
const axios = require('axios');

class CanvasService {
  // Fix Apple Music
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

  // Fix FF Fake
  async fakeFf(nama = 'RIDZ.GAKJAGO') {
    const BG_WIDTH = 1200, BG_HEIGHT = 2135;
    const canvas = createCanvas(BG_WIDTH, BG_HEIGHT);
    const ctx = canvas.getContext('2d');

    const bgImage = await loadImage('https://raw.githubusercontent.com/rzkrohan/epep-cowo/refs/heads/main/cowo2.webp');
    ctx.drawImage(bgImage, 0, 0, BG_WIDTH, BG_HEIGHT);

    const centerX = 600.0, centerY = 1670.08 + (58.9 / 2);
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.font = 'bold 50px sans-serif';

    ctx.lineWidth = 6;
    ctx.strokeStyle = '#3D2400';
    ctx.strokeText(nama, centerX, centerY);

    const gradient = ctx.createLinearGradient(centerX - 250, centerY - 30, centerX - 250, centerY + 30);
    gradient.addColorStop(0, '#FFF3B0');
    gradient.addColorStop(0.5, '#FFD182');
    gradient.addColorStop(1, '#C98A1F');

    ctx.fillStyle = gradient;
    ctx.fillText(nama, centerX, centerY);

    return canvas.toDataURL('image/png');
  }

  // Fake Tulis Buku
  async fakeTulis(text = 'Contoh tulisan tangan...') {
    const canvas = createCanvas(1080, 1920);
    const ctx = canvas.getContext('2d');

    const { data } = await axios.get('https://raw.githubusercontent.com/rzkrohanmedia/cloud-backup/main/uploads/KyzoCDN_1784739409872_undefined.png', { responseType: 'arraybuffer' });
    const bg = await loadImage(Buffer.from(data));
    ctx.drawImage(bg, 0, 0, 1080, 1920);

    ctx.font = '36px sans-serif';
    ctx.fillStyle = '#444444';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    let x = 150, y = 286, maxWidth = 785, lineHeight = 46;
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

  // Fix Windows Player
  async fakeWindows(text = 'ANJAY BANGWT KIR') {
    const canvas = createCanvas(1080, 1920);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 1080, 1920);

    const { data: imgBuf } = await axios.get('https://raw.githubusercontent.com/whatsapp-media/whatsapp-media/main/uploads/KyzoCDN_1784711336503_undefined.png', { responseType: 'arraybuffer' });
    const img = await loadImage(Buffer.from(imgBuf));
    ctx.drawImage(img, 0, 0, 1080, 1920);

    ctx.font = 'bold 55px Arial';
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    const lines = text.trim().split(/\s+/);
    let startY = 729.15;
    lines.forEach((line, i) => {
      ctx.fillText(line, 45.0, startY + (i * 65));
    });

    return canvas.toDataURL('image/png');
  }
}

module.exports = new CanvasService();
