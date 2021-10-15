const path = require('path')
const fs = require('fs/promises')
const jwt = require('jsonwebtoken')
const { SECRET_KEY } = process.env
const { User } = require('../models')
const { resize } = require('../helpers')

const avatarsDir = path.join(__dirname, '../', 'public/avatars')

const updateAvatar = async (req, res) => {
  const { path: tempStorage, originalname } = req.file
  try {
    const usertoken = req.headers.authorization
    const token = usertoken.split(' ')
    const { _id } = jwt.verify(token[1], SECRET_KEY)

    const [extention] = originalname.split('.').reverse()
    const avatarFileName = `avatar-${_id}.${extention}`
    const avatarStorage = path.join(avatarsDir, avatarFileName)
    await fs.rename(tempStorage, avatarStorage)

    await User.findByIdAndUpdate(_id, {
      avatarURL: `/avatars/${avatarFileName}`,
    })
    res.json({
      status: '200 OK',
      data: {
        token: `${token}`,
        avatarURL: `/avatars/${avatarFileName}`,
      },
    })
    resize(avatarStorage)
  } catch (error) {
    await fs.unlink(tempStorage)
    throw error.message
  }
}

module.exports = {
  updateAvatar,
}
