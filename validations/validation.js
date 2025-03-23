const joi = require('joi')

const registerValidation = (data) => {
    const schemaValidation = joi.object({
        user_name:joi.string().required(),
        user_email:joi.string().required().email(),
        user_password:joi.string().required()
    })
    return schemaValidation.validate(data)
}

const loginValidation = (data) => {
    const schemaValidation = joi.object({
        user_email:joi.string().required().email(),
        user_password:joi.string().required()
    })
    return schemaValidation.validate(data)
}

const postValidation = (data) => {
    const schemaValidation = joi.object({
        title:joi.string().required().max(100),
        description:joi.string().required().max(500)
    })
    return schemaValidation.validate(data)
}

module.exports.registerValidation = registerValidation
module.exports.loginValidation = loginValidation
module.exports.postValidation = postValidation