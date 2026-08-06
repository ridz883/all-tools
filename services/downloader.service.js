const axios = require('axios');

class DownloaderService {
  // 1. TikTok Downloader (Lovetik)
  async tiktok(url) {
    const { data } = await axios.post(
      'https://lovetik.com/api/ajax/search',
      new URLSearchParams({ query: url }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'X-Requested-With': 'XMLHttpRequest',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
          'Origin': 'https://lovetik.com',
          'Referer': 'https://lovetik.com/'
        }
      }
    );
    return data;
  }

  // 2. Instagram Downloader (ClipsSaver)
  async instagram(url) {
    const { data } = await axios.post(
      'https://clipssaver.com/api/instagram/instagramDownloader/download-post',
      { url },
      { headers: { Accept: 'application/json', 'Content-Type': 'application/json' } }
    );

    if (data.status !== 'success') throw new Error('Gagal mengambil data dari Instagram.');
    const result = data.data.post;

    return {
      id: result.id,
      shortcode: result.short_code,
      username: result.owner?.username,
      caption: result.edge_media_to_caption?.edges[0]?.node?.text || '',
      thumbnail: result.thumbnail_src,
      image: result.display_url,
      video: result.video_url,
      download: result.download_url || result.video_url || result.display_url,
      likes: result.edge_liked_by?.count || 0,
      comments: result.edge_media_to_comment?.count || 0,
      duration: result.video_duration,
      type: result.type
    };
  }

  // 3. Pinterest Downloader (PintSave)
  async pinterest(url) {
    const body = new URLSearchParams();
    body.append('url', url);

    const { data } = await axios.post('https://pintsave.net/api/fetch-media', body.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': '*/*',
        'X-Requested-With': 'XMLHttpRequest'
      }
    });
    return data;
  }

  // 4. YouTube MP4 (SosmedSaver)
  async youtubeMp4(url) {
    const { data } = await axios.get('https://www.sosmedsaver.me/api/info', {
      params: { url },
      headers: { Accept: 'application/json' }
    });
    return data;
  }

  // 5. YouTube MP3 (EZConv dengan Pooling & Max Retry)
  async youtubeMp3(url) {
    const { data: meta } = await axios.get('https://www.youtube.com/oembed', {
      params: { url, format: 'json' }
    });

    const captchaToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZSI6ImNvbnZlcnQiLCJqdGkiOiI3ZDhjMWJjMS1jYjdhLTQ3ODQtYTRhMC04YjA5NzViM2Q1NjQiLCJpYXQiOjE3ODUzMTYzMjAsImV4cCI6MTc4NTMxNzIyMH0.3q3iFniRtpU8fN_8mNXJEaBwnlfCeR2sRc2NSua1quA';

    const { data: convert } = await axios.post(
      'https://api.ezsrv.net/api/convert',
      { url, format: 'mp3', quality: 128, captchaToken },
      { headers: { 'Content-Type': 'application/json' } }
    );

    let status;
    let retries = 0;
    const maxRetries = 10; // Dibatas 10x untuk menghindari timeout Serverless Vercel

    while (retries < maxRetries) {
      const { data } = await axios.get('https://api.ezsrv.net/api/convert/status', {
        params: { jobId: convert.jobId }
      });

      status = data;
      if (status.status === 'done') break;
      if (status.status === 'error') throw new Error('Konversi YouTube ke MP3 gagal.');

      await new Promise(res => setTimeout(res, 1500));
      retries++;
    }

    if (retries >= maxRetries) throw new Error('Waktu tunggu konversi habis.');

    return {
      title: status.title || meta.title,
      author: meta.author_name,
      author_url: meta.author_url,
      thumbnail: meta.thumbnail_url,
      download: status.downloadUrl
    };
  }

  // 6. Spotify Downloader (MySpoty)
  async spotify(url) {
    const { data } = await axios.get('https://myspoty.app/api.php', {
      params: { action: 'lookup', u: url },
      headers: { Accept: 'application/json' }
    });

    if (data.error) throw new Error('Gagal mengambil metadata Spotify.');

    return {
      title: data.title,
      artist: data.artist,
      cover: data.cover,
      download: data.download
    };
  }
}

module.exports = new DownloaderService();
