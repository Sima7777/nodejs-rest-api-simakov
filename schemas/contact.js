const Joi = require('joi')

const schema = Joi.object({
  name: Joi.string().max(30).required(),

  phone: Joi.string().min(5).max(30).required(),

  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net'] },
    })
    .required(),
})

module.exports = schema
