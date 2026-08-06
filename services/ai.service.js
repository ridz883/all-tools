const axios = require('axios');
const FormData = require('form-data');

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
      stream.on('end', () => resolve(text || 'Selesai.'));
      stream.on('error', reject);
    });
  }

  async feelBetter(prompt) {
    const { data } = await axios.post('https://feelbetterbot.com/', {
      messages: [
        { role: 'assistant', content: "Hi, I'm FeelBetterBot." },
        { role: 'user', content: prompt }
      ]
    }, { headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream' }, responseType: 'text' });
    return { success: true, message: data.trim() };
  }

  // Fix AI Image Generator (Ganti ke publik stabil)
  async imageGenerator(prompt) {
    return { url: `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}` };
  }

  async kataHariIni() {
    const { data } = await axios.get('https://name-ai-kappa.vercel.app/api/kata-hari-ini');
    return data;
  }

  // Fix Full Page Screenshot
  async ssWeb(url) {
    const { data } = await axios.post('https://urlbox.com/api/render', {
      url, width: 1440, height: 1024, full_page: true, format: 'png'
    }, { headers: { 'Content-Type': 'application/json' } });
    return data;
  }

  // Fix Web to APK
  async web2apk(url, appName = 'MyWebAPK') {
    const packageName = `com.${appName.toLowerCase().replace(/[^a-z0-9]/g, '')}.web2apk`;
    const { data: defaultIcon } = await axios.get('https://raw.githubusercontent.com/rzkrohan/image-canvas/refs/heads/main/applemusic.png', { responseType: 'arraybuffer' });

    const form = new FormData();
    form.append('websiteUrl', url);
    form.append('appName', appName);
    form.append('icon', Buffer.from(defaultIcon), { filename: 'icon.png', contentType: 'image/png' });
    form.append('packageName', packageName);
    form.append('versionName', '1.0.0');
    form.append('versionCode', '1');

    const { data } = await axios.post('https://webappcreator.amethystlab.org/api/build-apk', form, {
      headers: { Origin: 'https://webappcreator.amethystlab.org', Referer: 'https://webappcreator.amethystlab.org/', ...form.getHeaders() }
    });
    if (!data.success) throw new Error(data.message || 'Gagal buat APK');
    return { success: true, downloadUrl: `https://webappcreator.amethystlab.org${data.downloadUrl}` };
  }

  // ==========================================
  // 5 TOOLS BARU
  // ==========================================
  async removeBg(url) {
    const { data } = await axios.get(`https://api.nexadev.my.id/tools/remove/?url=${encodeURIComponent(url)}`);
    return data;
  }

  async spamNgl(url, jumlah, pesan) {
    const { data } = await axios.get(`https://api.nexadev.my.id/tools/nglspam/?url=${encodeURIComponent(url)}&jumlah=${jumlah}&pesan=${encodeURIComponent(pesan)}`);
    return data;
  }

  async blurFoto(url, pixel) {
    return { hasilUrl: `https://apii.nexadev.my.id/pixel?url=${encodeURIComponent(url)}&pixel=${pixel}` };
  }

  async hdFoto(image) {
    const { data } = await axios.get(`https://api.nexadev.my.id/tools/hd/?image=${encodeURIComponent(image)}`);
    return data;
  }

  async urlToQr(url) {
    return { qrUrl: `https://api.nexadev.my.id/tools/toqr?url=${encodeURIComponent(url)}` };
  }
}

module.exports = new AiService();
