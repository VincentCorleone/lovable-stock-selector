const fs = require('fs');
const zlib = require('zlib');

// 输入和输出文件路径
const inputPath = './wechat-miniprogram/utils/main.wasm';
const outputPath = './wechat-miniprogram/utils/main.wasm.br';

// 读取WASM文件
fs.readFile(inputPath, (err, data) => {
  if (err) {
    console.error('读取文件失败:', err);
    return;
  }

  // 使用brotli压缩
  zlib.brotliCompress(data, { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 11 } }, (err, compressedData) => {
    if (err) {
      console.error('压缩失败:', err);
      return;
    }

    // 写入压缩后的文件
    fs.writeFile(outputPath, compressedData, (err) => {
      if (err) {
        console.error('写入文件失败:', err);
        return;
      }

      console.log(`成功将${inputPath}压缩为${outputPath}`);
      console.log(`原始大小: ${data.length} bytes`);
      console.log(`压缩后大小: ${compressedData.length} bytes`);
    });
  });
});