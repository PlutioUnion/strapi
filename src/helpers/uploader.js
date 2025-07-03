const fs = require("fs");
const util = require("util");
const stream = require("stream");
const path = require("path");
const axios = require("axios");
const mime = require("mime-types");

const getFileDetails = async (filePath) => {
  return new Promise((resolve, reject) => {
    fs.stat(filePath, (err, stats) => {
      if (err) reject(err.message);
      resolve(stats);
    });
  });
};

const deleteFile = async (filePath) => {
  return new Promise((resolve, reject) => {
    fs.unlink(filePath, (err) => {
      if (err) reject(err.message);
      resolve("deleted");
    });
  });
};

const upload = async ({ filePath, mimeType, saveAs }) => {
  const stats = await getFileDetails(filePath);
  const fileName = path.parse(filePath).base;

  const [image] = await strapi.plugins.upload.services.upload.upload({
    data: { path: saveAs },
    files: {
      path: filePath,
      name: fileName,
      type: mimeType || mime.lookup(filePath),
      size: stats.size,
    },
  });

  await deleteFile(filePath);
  return image;
};

const uploadToLibrary = async ({ url, title, handle, mimeType }) => {
  const filePath = `/tmp/${title || handle}`;
  const { data } = await axios.get(url, {
    responseType: "stream",
  });

  const file = fs.createWriteStream(filePath);
  const finished = util.promisify(stream.finished);
  data.pipe(file);
  await finished(file);
  const image = await upload({ filePath, mimeType, saveAs: "uploads" });
  return image;
};

module.exports = uploadToLibrary;
