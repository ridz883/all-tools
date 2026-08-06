const axios = require('axios');
const FormData = require('form-data');

class AiService {
  // 7. GPT-5.4 Mini AI (SurfSense Stream Parser)
  async gptMini(prompt) {
    const { data: stream } = await axios({
      method: 'POST',
      url: 'https://api.surfsense.com/api/v1/public/anon-chat/stream',
      headers: { 'Content-Type': 'application/json' },
      data: {
        model_slug: 'gpt-5.4-mini-no-login',
        messages: [{ role: 'user', content: prompt }]
      },
      responseType: 'stream'
    });

    return new Promise((resolve, reject) => {
      let buffer = '';
      let text = '';

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

      stream.on('end', () => resolve(text || 'Tidak ada balasan dari AI.'));
      stream.on('error', reject);
    });
  }

  // 8. FeelBetterBot AI
  async feelBetter(prompt) {
    const { data } = await axios.post(
      'https://feelbetterbot.com/',
      {
        messages: [
          {
            role: 'assistant',
            content: "Hi, I'm FeelBetterBot — I'm here to listen and help you through whatever's on your mind. How are you doing today?"
          },
          { role: 'user', content: prompt }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'text/event-stream',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'
        },
        responseType: 'text'
      }
    );
    return { success: true, message: data.trim() };
  }

  // 9. AI Image Generator (Creen.ai)
  async imageGenerator(prompt) {
    const AUTH_TOKEN = '_';
    const FINGER = '_';

    const api = axios.create({
      baseURL: 'https://www.creen.ai/api',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-platform': 'web',
        'x-version': '999.0.0',
        'x-language': 'id',
        'x-auth-token': AUTH_TOKEN,
        'x-finger': FINGER
      }
    });

    const { data: create } = await api.post('/aiImage/create/v2', {
      modelId: 14,
      baseImage: '',
      imageUrls: [],
      prompt,
      resolution: '1K',
      quality: 'low',
      aspectRatio: '16:9',
      number: 1,
      permission: 1
    });

    const result = create.result?.dataList?.[0];
    if (!result) throw new Error('Gagal memulai task generasi gambar.');
    const resultId = result.id;

    let retries = 0;
    while (retries < 10) {
      await new Promise(res => setTimeout(res, 2000));
      const { data: status } = await api.post('/aiImage/getListTaskStatus', { resultIds: [resultId] });
      const task = status.data?.[0];

      if (task?.status === 2 && task.resultUrl) return { url: task.resultUrl };
      if (task?.errorMessage) throw new Error(task.errorMessage);
      retries++;
    }
    throw new Error('Timeout saat generate gambar di server.');
  }

  // 10. Kata-Kata Hari Ini
  async kataHariIni() {
    const { data } = await axios.get('https://name-ai-kappa.vercel.app/api/kata-hari-ini');
    return data;
  }

  // 11. FullPage Web Screenshot (Urlbox)
  async ssWeb(url) {
    const { data } = await axios.post(
      'https://urlbox.com/api/render',
      {
        url,
        width: 1440,
        height: 1024,
        full_page: true,
        dark_mode: true,
        hide_cookie_banners: true,
        format: 'png'
      },
      { headers: { 'Content-Type': 'application/json' } }
    );
    return data;
  }

  // 12. Web to APK (AmethystLab)
  async web2apk(url, appName = 'MyWebAPK') {
    const packageName = `com.${appName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'app'}.web2apk`;

    const { data: defaultIcon } = await axios.get(
      'https://raw.githubusercontent.com/rzkrohan/image-canvas/refs/heads/main/applemusic.png',
      { responseType: 'arraybuffer' }
    );

    const form = new FormData();
    form.append('websiteUrl', url);
    form.append('appName', appName);
    form.append('icon', Buffer.from(defaultIcon), { filename: 'icon.png', contentType: 'image/png' });
    form.append('packageName', packageName);
    form.append('versionName', '1.0.0');
    form.append('versionCode', '1');

    const { data } = await axios.post('https://webappcreator.amethystlab.org/api/build-apk', form, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        Origin: 'https://webappcreator.amethystlab.org',
        Referer: 'https://webappcreator.amethystlab.org/',
        ...form.getHeaders()
      }
    });

    if (!data.success) throw new Error(data.message || 'Gagal membuat APK');

    return {
      success: true,
      appName,
      packageName,
      downloadUrl: `https://webappcreator.amethystlab.org${data.downloadUrl}`
    };
  }
}

module.exports = new AiService();
