// module imports
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

// file imports
import { exceptionHandler } from "./exception-handler";
import models from "../models";
import { USER_STATUSES, USER_TYPES } from "../configs/enums";

// destructuring assignments
const { JWT_SECRET } = process.env;
const { usersModel } = models;
const { ACTIVE, DELETED } = USER_STATUSES;
const { CUSTOMER, ADMIN, SUPER_ADMIN } = USER_TYPES;

/**
 * @description Get JWT token
 * @param {String} _id user id
 * @param {String} phone user phone number
 * @param {String} otp OTP code
 * @param {String} shouldValidateOTP OTP validation check
 * @param {string | boolean } variable any variable
 * @returns {Object} JWT token
 */
export const getToken = function (params: any) {
  return jwt.sign(params, process.env.JWT_SECRET ?? "");
};

export const verifyToken = async (
  req: Request,
  _res: Response,
  next: NextFunction,
  shouldReturnUserOnFailure = false
) => {
  try {
    const token =
      (req.headers.authorization &&
        req.headers.authorization.split("Bearer")[1]) ||
      (req.signedCookies && req.signedCookies.jwt) ||
      (req.cookies && req.cookies.jwt);
    if (token) {
      const verificationObject: any = jwt.verify(
        token.trim(),
        JWT_SECRET ?? ""
      );

      if (verificationObject.shouldValidateOTP) {
        req.user = verificationObject;
        return next();
      }
      const user = await usersModel
        .findOne({ _id: verificationObject._id })
        .select("-createdAt -updatedAt -__v -fcms");
      if (user) {
        if (user.status === DELETED)
          next(new Error("User account deleted!|||403"));
        req.user = user;
        return next();
      }
    }
    if (shouldReturnUserOnFailure) {
      req.user = null;
      return next();
    }
    next(new Error("Invalid token!|||403"));
  } catch (error) {
    if (shouldReturnUserOnFailure) {
      req.user = null;
      return next();
    }
    return next(new Error("Unauthorized!|||401"));
  }
};

export const verifyOTP = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const { otp } = req?.user;
    const { code } = req.body;
    if (Number(code) === Number(otp)) next();
    else return next(new Error("Invalid Code!|||400"));
  } catch (error) {
    return next(error);
  }
};

export const verifyAdmin = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  if (
    (req?.user?.type === ADMIN || req?.user?.type === SUPER_ADMIN) &&
    req?.user?.status === ACTIVE
  )
    next();
  else return next(new Error("Unauthorized as admin!|||403"));
};

export const verifySuperAdmin = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  if (req?.user?.type === SUPER_ADMIN && req?.user?.status === ACTIVE) next();
  else return next(new Error("Unauthorized as super-admin!|||403"));
};

export const verifyCustomer = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  if (req?.user?.type === CUSTOMER && req?.user?.status === ACTIVE) next();
  else return next(new Error("Unauthorized as customer!|||403"));
};

export const verifyUser = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  if (req?.user && req?.user?.status === ACTIVE) next();
  else return next(new Error("Unauthorized as user!|||403"));
};

export const verifyUserToken = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  if (req?.user?._id) next();
  else return next(new Error("Invalid user token!|||400"));
};

export const checkUserPhoneExists = exceptionHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const userExists = await usersModel.exists({ phone: req.body.phone });
    if (userExists) next();
    else next(new Error("User not found!|||404"));
  }
);
