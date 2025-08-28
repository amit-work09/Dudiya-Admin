import mongoose from "mongoose";
import FindRepo from "../repo/findRepo.js";
import { Messages } from "../utils/messages.js";
import Methods from "../utils/methods.js";

/**
 * @description JWT token validation
 * @param req
 * @param res
 * @param next
 * @returns success and error will return
 */
export const PatientAuth = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res
      .status(process.env.UNAUTHORISED)
      .json({ success: false, message: Messages.AUTH_ERROR });
  }
  const token = req.headers.authorization.split(" ")[1];
  try {
    var decoded = Methods.verifyToken(token, process.env.JWT_SECRET);
    if (decoded) {
      req.loginUser = decoded;
      req.loginUser["jwt_token"] = token;
      let checkUser = await new FindRepo("UserModel").findOne({
        _id: new mongoose.Types.ObjectId(req.loginUser.id),
        role: "patient",
      });
      if (checkUser) {
        if (checkUser?.is_block)
          return res
            .status(process.env.FORBIDDEN)
            .json({ success: false, message: Messages.BLOCKED });
      } else
        return res
          .status(process.env.FORBIDDEN)
          .json({ success: false, message: `Patient ${Messages.NOT_FOUND}` });

      next();
    } else
      return res.status(process.env.UNAUTHORISED).json({
        success: false,
        message: Messages.JWT_ERROR,
      });
  } catch (err) {
    return res
      .status(process.env.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: err.message });
  }
};

export const DoctorAuth = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res
      .status(process.env.UNAUTHORISED)
      .json({ success: false, message: Messages.AUTH_ERROR });
  }
  const token = req.headers.authorization.split(" ")[1];
  try {
    var decoded = Methods.verifyToken(token, process.env.JWT_SECRET);
    if (decoded) {
      req.loginUser = decoded;
      req.loginUser["jwt_token"] = token;
      let checkUser = await new FindRepo("UserModel").findOne({
        _id: new mongoose.Types.ObjectId(req.loginUser.id),
        role: "doctor",
      });
      if (checkUser) {
        if (checkUser?.is_block)
          return res
            .status(process.env.FORBIDDEN)
            .json({ success: false, message: Messages.BLOCKED });
      } else
        return res
          .status(process.env.FORBIDDEN)
          .json({ success: false, message: `Doctor ${Messages.NOT_FOUND}` });

      next();
    } else
      return res.status(process.env.UNAUTHORISED).json({
        success: false,
        message: Messages.JWT_ERROR,
      });
  } catch (err) {
    return res
      .status(process.env.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: err.message });
  }
};
