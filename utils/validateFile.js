const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];

function isValidFileType(type) {
  return allowedTypes.includes(type);
}

function isValidFileSize(size) {
  return size <= 5 * 1024 * 1024; // 5MB
}

module.exports = { isValidFileType, isValidFileSize };