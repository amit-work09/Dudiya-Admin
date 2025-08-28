import AuthService from "../services/authService.js";
import logger from "../utils/logger.js";
import methods from "../utils/methods.js";
import {
  LoginSchema,
  VerifyOtpSchema,
  ResendOtpSchema,
} from "../validator/authValidator.js";

class AuthController {
  /**
   * @description Login patient through email.
   * @param  {express.Request} req
   * @param  {express.Response} res
   */
  async login(req, res) {
    try {
      const validateSchema = LoginSchema.validate(req.body);
      if (validateSchema.error) {
        return res.status(process.env.BAD_REQUEST).json({
          success: false,
          message: validateSchema.error.details[0].message,
        });
      }

      const response = await new AuthService().login(validateSchema.value);
      return res.status(response.status).json({
        success: response.status == process.env.SUCCESS ? true : false,
        message: response.message,
      });
    } catch (error) {
      console.log(error);
      logger.error(`login Error ${error}`);
      return res
        .status(process.env.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: error.message });
    }
  }

  /**
   * @description Verify patient through otp on email
   * @param  {express.Request} req
   * @param  {express.Response} res
   */
  async verifyOtp(req, res) {
    try {
      const validateSchema = VerifyOtpSchema.validate(req.body);
      if (validateSchema.error) {
        return res.status(process.env.BAD_REQUEST).json({
          success: false,
          message: validateSchema.error.details[0].message,
        });
      }

      const response = await new AuthService().verifyOtp(validateSchema.value);
      return res.status(response.status).json({
        success: response.status == process.env.SUCCESS ? true : false,
        message: response.message,
        data: response.data,
        token: response.token,
      });
    } catch (error) {
      console.log(error);
      logger.error(`login Error ${error}`);
      return res
        .status(process.env.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: error.message });
    }
  }

  /**
   * @description Resend patient through otp on email
   * @param  {express.Request} req
   * @param  {express.Response} res
   */
  async resendOtp(req, res) {
    try {
      const validateSchema = ResendOtpSchema.validate(req.body);
      if (validateSchema.error) {
        return res.status(process.env.BAD_REQUEST).json({
          success: false,
          message: validateSchema.error.details[0].message,
        });
      }

      const response = await new AuthService().resendOtp(validateSchema.value);
      return res.status(response.status).json({
        success: response.status == process.env.SUCCESS ? true : false,
        message: response.message,
      });
    } catch (error) {
      console.log(error);
      logger.error(`login Error ${error}`);
      return res
        .status(process.env.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: error.message });
    }
  }
}

export default new AuthController();
