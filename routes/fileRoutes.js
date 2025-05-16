const express = require('express');
const router = express.Router();
const { getUploadUrl, getDownloadUrl } = require('../controllers/fileController');

router.post('/upload-url', getUploadUrl);
router.get('/files/:filename', getDownloadUrl);

module.exports = router;