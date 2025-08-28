import Joi from "joi";

class AuthValidator {
  ObjectIdSchema = Joi.string()
    .hex()
    .length(24)
    .message("Object ID not valid")
    .required();

  LoginSchema = Joi.object().keys({
    email: Joi.string().lowercase().email().required().messages({
      "any.required": `Email Address is required`,
      "string.email": `Please enter correct Email Address`,
    }),
    role: Joi.string().valid("patient", "doctor", "admin").required(),
  });

  VerifyOtpSchema = Joi.object().keys({
    email: Joi.string().lowercase().email().required().messages({
      "any.required": `Email Address is required`,
      "string.email": `Please enter correct Email Address`,
    }),
    otp: Joi.number().integer().required(),
    role: Joi.string().valid("patient", "doctor", "admin").required(),
  });

  ResendOtpSchema = Joi.object().keys({
    email: Joi.string().lowercase().email().required().messages({
      "any.required": `Email Address is required`,
      "string.email": `Please enter correct Email Address`,
    }),
  });
}

export const { ObjectIdSchema, LoginSchema, VerifyOtpSchema, ResendOtpSchema } =
  new AuthValidator();
