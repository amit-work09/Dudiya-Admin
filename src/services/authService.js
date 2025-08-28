import CreateRepo from "../repo/createRepo.js";
import FindRepo from "../repo/findRepo.js";
import UpdateRepo from "../repo/updateRepo.js";
import logger from "../utils/logger.js";
import { Messages } from "../utils/messages.js";
import methods from "../utils/methods.js";
import Mailer from "../utils/sendMail.js";

class AuthService {
  async login({ role, email }) {
    try {
      let data;
      let user = {};

      data = await new FindRepo("UserModel").findOne(
        { email },
        { _id: 1, is_block: 1, role: 1 }
      );

      if (data && data?.role != role)
        return {
          status: process.env.BAD_REQUEST,
          message: `${
            data?.role.charAt(0).toUpperCase() + data?.role.slice(1)
          } ${Messages.ALREADY_EXIST}`,
        };

      if (data?.is_block)
        return {
          status: process.env.BAD_REQUEST,
          message: Messages.BLOCKED,
        };

      if (!data) {
        const otp = methods.generateOTP();
        logger.info(`OTP: ${otp}`);
        if (role == "patient") {
          user = await new CreateRepo("UserModel").create({
            email,
            role,
            otp,
            otpTime: new Date(),
            is_block: false,
            userName: "",
            country: "",
            status: true,
          });
        } else {
          user = await new CreateRepo("UserModel").create({
            role,
            otp,
            otpTime: new Date(),
            is_block: false,
            status: true,
            email,
            country: "",
            userName: "",
            about: "",
            registered_office: "",
            cost: 0,
            duration: 0,
            sessions: 0,
            availability: [],
            education: "",
            degree: "",
            institution: "",
            passing_year: null,
            speciality: [],
            experience: 0,
            country: "",
            license: "",
            bankName: "",
            accountNumber: "",
          });
        }
        await Mailer.sendMail(email, "loginEmail", {
          otp,
        });
      } else {
        const otp = methods.generateOTP();
        logger.info(`OTP: ${otp}`);
        user = await new UpdateRepo("UserModel").updateWithId(data?._id, {
          otp,
          otpTime: new Date(),
        });
        await Mailer.sendMail(email, "loginEmail", {
          otp,
        });
      }
      if (!user) throw new Error("Unable to login");
      return {
        status: process.env.SUCCESS,
        message: Messages.OTP_SENT,
      };
    } catch (err) {
      return {
        status: process.env.INTERNAL_SERVER_ERROR,
        message: err.message,
      };
    }
  }

  async verifyOtp({ role, email, otp }) {
    try {
      const user_exist = await new FindRepo("UserModel").findOne(
        { email, role },
        { _id: 1, otp: 1, otpTime: 1, role: 1 }
      );
      if (!user_exist)
        return {
          status: process.env.NOT_FOUND,
          message: Messages.ERROR_404,
        };
      if (otp != user_exist?.otp)
        return {
          status: process.env.BAD_REQUEST,
          message: Messages.WRONG_OTP,
        };
      if (
        new Date().getTime() >
        new Date(user_exist.otpTime).getTime() + 2 * 60 * 1000
      ) {
        await new UpdateRepo("UserModel").updateWithId(user_exist?._id, {
          otp: null,
          otpTime: null,
        });
        return {
          status: process.env.BAD_REQUEST,
          message: Messages.OTP_EXPIRE,
        };
      }

      const token = methods.newToken({
        id: user_exist?._id,
        email: user_exist?.email,
        role: user_exist?.role,
      });
      const user = await new UpdateRepo("UserModel").updateWithId(
        user_exist?._id,
        { otp: null, otpTime: null, status: true },
        role == "patient"
          ? {
              _id: 1,
              fullName: 1,
              email: 1,
              gender: 1,
              dob: 1,
              phone: 1,
              role: 1,
              profilePhoto: 1,
              is_block: 1,
              status: 1,
            }
          : {
              _id: 1,
              fullName: 1,
              email: 1,
              gender: 1,
              dob: 1,
              phone: 1,
              role: 1,
              profilePhoto: 1,
              is_block: 1,
              status: 1,
            }
      );

      return {
        status: process.env.SUCCESS,
        message: Messages.OTP_VERIFY,
        data: user,
        token,
      };
    } catch (err) {
      return {
        status: process.env.INTERNAL_SERVER_ERROR,
        message: err.message,
      };
    }
  }

  async resendOtp({ email }) {
    try {
      const data = await new FindRepo("UserModel").findOne(
        { email },
        { _id: 1, is_block: 1 }
      );

      if (!data)
        return {
          status: process.env.NOT_FOUND,
          message: Messages.ERROR_404,
        };

      if (data?.is_block)
        return {
          status: process.env.BAD_REQUEST,
          message: Messages.BLOCKED,
        };

      const otp = methods.generateOTP();
      logger.info(`OTP: ${otp}`);
      const user = await new UpdateRepo("UserModel").updateWithId(data?._id, {
        otp,
        otpTime: new Date(),
      });
      if (!user) throw new Error(`Unable to update`);
      await Mailer.sendMail(email, "loginEmail", {
        otp,
      });
      return {
        status: process.env.SUCCESS,
        message: Messages.OTP_SENT,
      };
    } catch (err) {
      return {
        status: process.env.INTERNAL_SERVER_ERROR,
        message: err.message,
      };
    }
  }
}

export default AuthService;
