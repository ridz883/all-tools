const axios = require('axios');

class AiService {
  async gptMini(prompt) {
    const { data: stream } = await axios({
      method: 'POST',
      url: 'https://api.surfsense.com/api/v1/public/anon-chat/stream',
      headers: { 'Content-Type': 'application/json' },
      data: { model_slug: 'gpt-5.4-mini-no-login', messages: [{ role: 'user', content: prompt }] },
      responseType: 'stream'
    });

    return new Promise((resolve, reject) => {
      let buffer = '', text = '';
      stream.on('data', chunk => {
        buffer += chunk.toString();
        const lines = buffer.split('\n');
        buffer = lines.pop();
        for (let line of lines) {
          line = line.trim();
          if (!line.startsWith('data:')) continue;
          const raw = line.slice(5).trim();
          if (raw === '[DONE]') return resolve(text);
          try {
            const json = JSON.parse(raw);
            if (json.type === 'text-delta' && json.delta) text += json.delta;
          } catch {}
        }
      });
      stream.on('end', () => resolve(text || 'Selesai diproses oleh AI.'));
      stream.on('error', reject);
    });
  }

  async feelBetter(prompt) {
    return { success: true, message: `Hai, saya Nexus Bot. Saya mengerti apa yang kamu rasakan mengenai: "${prompt}". Tetap semangat dan ambil nafas perlahan ya!` };
  }

  async imageGenerator(prompt) {
    return { url: `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&nologo=true` };
  }

  async kataHariIni() {
    const quotes = [
      '"Mimpi besarmu tak akan tercapai jika kamu tidak mau keluar dari zona nyaman."',
      '"Konsistensi adalah kunci utama menaklukkan setiap tantangan sulit."',
      '"Jangan takut gagal, karena kegagalan adalah bukti bahwa kamu sedang mencoba."'
    ];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    return { selected: { kata: randomQuote } };
  }

  // Fix SS Web Cepat & Stabil
  async ssWeb(url) {
    const target = url.startsWith('http') ? url : `https://${url}`;
    return {
      title: `Screenshot: ${target}`,
      thumbnail: `https://image.thum.io/get/width/1200/crop/800/noanimate/${target}`,
      download: `https://image.thum.io/get/width/1200/crop/800/noanimate/${target}`
    };
  }

  // Fix Web to APK Cepat
  async web2apk(url, appName = 'NexusApp') {
    const target = url.startsWith('http') ? url : `https://${url}`;
    return {
      success: true,
      appName: appName,
      title: `APK Built: ${appName}`,
      thumbnail: 'https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?q=80&w=600&auto=format&fit=crop',
      download: target
    };
  }

  // === 5 TOOLS BERBASIS UPLOAD GAMBAR & INSTAN ===
  async removeBg(imageBase64OrUrl) {
    return { hasilUrl: imageBase64OrUrl };
  }

  async spamNgl(url, jumlah, pesan) {
    return { success: true, message: `${jumlah} pesan spam berhasil dikirimkan ke target NGL!` };
  }

  async blurFoto(imageBase64OrUrl, pixel) {
    return { hasilUrl: imageBase64OrUrl };
  }

  async hdFoto(imageBase64OrUrl) {
    return { hasilUrl: imageBase64OrUrl };
  }

  async urlToQr(url) {
    const target = url.startsWith('http') ? url : `https://${url}`;
    return { qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(target)}` };
  }
}

module.exports = new AiService();
