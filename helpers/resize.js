const Jimp = require('jimp')

function resize(pathToImage) {
  Jimp.read(pathToImage, (err, lenna) => {
    if (err) throw err
    lenna.resize(256, 256).write(pathToImage)
  })
}

module.exports = resize
