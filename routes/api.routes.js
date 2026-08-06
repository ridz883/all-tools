const express = require('express');
const router = express.Router();

const downloaderService = require('../services/downloader.service');
const aiService = require('../services/ai.service');
const canvasService = require('../services/canvas.service');

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    console.error(`[API Error]:`, err.message || err);
    res.status(500).json({
      success: false,
      message: err.message || 'Terjadi kesalahan pada server.'
    });
  });
};

// --- DOWNLOADERS ---
router.post('/downloader/tiktok', asyncHandler(async (req, res) => {
  const result = await downloaderService.tiktok(req.body.url);
  res.json({ success: true, data: result });
}));

router.post('/downloader/ig', asyncHandler(async (req, res) => {
  const result = await downloaderService.instagram(req.body.url);
  res.json({ success: true, data: result });
}));

router.post('/downloader/pinterest', asyncHandler(async (req, res) => {
  const result = await downloaderService.pinterest(req.body.url);
  res.json({ success: true, data: result });
}));

router.post('/downloader/yt-mp4', asyncHandler(async (req, res) => {
  const result = await downloaderService.youtubeMp4(req.body.url);
  res.json({ success: true, data: result });
}));

router.post('/downloader/yt-mp3', asyncHandler(async (req, res) => {
  const result = await downloaderService.youtubeMp3(req.body.url);
  res.json({ success: true, data: result });
}));

router.post('/downloader/spotify', asyncHandler(async (req, res) => {
  const result = await downloaderService.spotify(req.body.url);
  res.json({ success: true, data: result });
}));

// --- AI & UTILITIES (TERMASUK 5 TOOLS BARU) ---
router.post('/ai/gpt-mini', asyncHandler(async (req, res) => {
  const message = await aiService.gptMini(req.body.prompt);
  res.json({ success: true, data: { message } });
}));

router.post('/ai/feelbetter', asyncHandler(async (req, res) => {
  const result = await aiService.feelBetter(req.body.prompt);
  res.json(result);
}));

router.post('/ai/image-gen', asyncHandler(async (req, res) => {
  const result = await aiService.imageGenerator(req.body.prompt);
  res.json({ success: true, data: result });
}));

router.get('/tools/kata-hari-ini', asyncHandler(async (req, res) => {
  const result = await aiService.kataHariIni();
  res.json({ success: true, data: result });
}));

router.post('/tools/ss-web', asyncHandler(async (req, res) => {
  const result = await aiService.ssWeb(req.body.url);
  res.json({ success: true, data: result });
}));

router.post('/tools/web2apk', asyncHandler(async (req, res) => {
  const result = await aiService.web2apk(req.body.url, req.body.appName);
  res.json({ success: true, data: result });
}));

// --- 5 TOOLS BARU ---
router.post('/tools/remove-bg', asyncHandler(async (req, res) => {
  const result = await aiService.removeBg(req.body.image || req.body.url);
  res.json({ success: true, data: result });
}));

router.post('/tools/ngl-spam', asyncHandler(async (req, res) => {
  const result = await aiService.spamNgl(req.body.url, req.body.jumlah, req.body.pesan);
  res.json({ success: true, data: result });
}));

router.post('/tools/blur-foto', asyncHandler(async (req, res) => {
  const result = await aiService.blurFoto(req.body.image || req.body.url, req.body.pixel);
  res.json({ success: true, data: result });
}));

router.post('/tools/hd-foto', asyncHandler(async (req, res) => {
  const result = await aiService.hdFoto(req.body.image || req.body.url);
  res.json({ success: true, data: result });
}));

router.post('/tools/url-to-qr', asyncHandler(async (req, res) => {
  const result = await aiService.urlToQr(req.body.url);
  res.json({ success: true, data: result });
}));

// --- CANVAS IMAGE MAKERS ---
router.post('/canvas/fake-applemusic', asyncHandler(async (req, res) => {
  const imageBase64 = await canvasService.fakeAppleMusic(req.body.title, req.body.artist);
  res.json({ success: true, image: imageBase64 });
}));

router.post('/canvas/fake-ff', asyncHandler(async (req, res) => {
  const imageBase64 = await canvasService.fakeFf(req.body.nama);
  res.json({ success: true, image: imageBase64 });
}));

router.post('/canvas/fake-tulis', asyncHandler(async (req, res) => {
  const imageBase64 = await canvasService.fakeTulis(req.body.text);
  res.json({ success: true, image: imageBase64 });
}));

router.post('/canvas/fake-windows', asyncHandler(async (req, res) => {
  const imageBase64 = await canvasService.fakeWindows(req.body.text);
  res.json({ success: true, image: imageBase64 });
}));

module.exports = router;
