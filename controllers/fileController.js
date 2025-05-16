const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { v4: uuidv4 } = require('uuid');
const { isValidFileType, isValidFileSize } = require('../utils/validateFile');
const mime = require('mime-types');

const s3 = new S3Client({
  region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   }
});

const BUCKET = process.env.S3_BUCKET_NAME;

// POST /api/upload-url
exports.getUploadUrl = async (req, res) => {
  const { fileName, fileType, fileSize } = req.body;

  if (!isValidFileType(fileType) || !isValidFileSize(fileSize)) {
    return res.status(400).json({ error: 'Invalid file type or size' });
  }

  const key = `${uuidv4()}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: fileType,
  });

  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 }); // 5 min

  res.json({ uploadUrl, key });
};

// GET /api/files/:filename
exports.getDownloadUrl = async (req, res) => {
  const { filename } = req.params;

  const command = new GetObjectCommand({
    Bucket: BUCKET,
    Key: filename,
  });

  try {
    const downloadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });
    res.json({ downloadUrl });
  } catch (err) {
    res.status(404).json({ error: 'File not found' });
  }
};