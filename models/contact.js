const { Schema, model } = require('mongoose')
const Joi = require('joi')

const contactSchema = Schema(
  {
    name: {
      type: String,
      required: [true, 'Set name for contact'],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
  },
  { versionKey: false, timestamps: true },
)

const joiSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string(),
  phone: Joi.string(),
  favorite: Joi.boolean(),
  owner: Joi.object(),
})

const updateFavoriteJoiSchema = Joi.object({
  favorite: Joi.boolean(),
})

const Contact = model('contact', contactSchema)

module.exports = {
  joiSchema,
  updateFavoriteJoiSchema,
  Contact,
}
