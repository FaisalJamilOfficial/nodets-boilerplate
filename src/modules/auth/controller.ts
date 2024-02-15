// file imports
import NodeMailer from "../../utils/node-mailer";
import * as userController from "../user/controller";
import * as userTokenController from "../user-token/controller";
import * as customerController from "../customer/controller";
import * as adminController from "../admin/controller";
import { Element } from "../user/interface";
import { USER_TYPES, USER_STATUSES } from "../../configs/enum";
import {
  LoginDTO,
  SendEmailDTO,
  GenerateEmailTokenDTO,
  ResetPasswordDTO,
  VerifyUserEmailDTO,
} from "./dto";

// destructuring assignments
const { CUSTOMER, ADMIN } = USER_TYPES;
const { ACTIVE } = USER_STATUSES;
const {
  sendEmail,
  getEmailVerificationEmailTemplate,
  getResetPasswordEmailTemplate,
  getWelcomeUserEmailTemplate,
} = new NodeMailer();

/**
 * @description Register user
 * @param {Object} params user registration data
 * @returns {String} user token
 */
export const register = async (params: Element) => {
  const { type } = params;
  const user = await userController.addElement(params);

  const profileObj = { user: user._id };
  const userObj: any = {};
  userObj.type = type;

  if (type === CUSTOMER)
    userObj.customer = (await customerController.addElement(profileObj))._id;
  else if (type === ADMIN)
    userObj.admin = (await adminController.addElement(profileObj))._id;

  await userController.updateElementById(user._id, userObj);

  return user.getSignedjwtToken();
};

/**
 * @description Login user
 * @param {Object} params user login data
 * @returns {Object} user token
 */
export const login = async (params: LoginDTO) => {
  const { email, password, type } = params;

  const query: any = {};

  if (email && password) query.email = email;
  else throw new Error("Please enter login credentials!|||400");

  const userExists: any = await userController.getElement(query);
  if (!userExists) throw new Error("User not registered!|||404");

  if (userExists.type !== type) throw new Error("User not found!|||404");

  if (!(await userExists.validatePassword(password)))
    throw new Error("Invalid password!|||401");

  if (userExists.status !== ACTIVE)
    throw new Error(`User ${userExists.status}!|||403`);

  await userController.updateElement(
    { _id: userExists._id },
    { lastLogin: new Date() }
  );

  return userExists.getSignedjwtToken();
};

/**
 * @description Send reset password email
 * @param {Object} params user email data
 * @returns {Object} user password reset data
 */
export const emailResetPassword = async (params: SendEmailDTO) => {
  const { email } = params;
  const tokenExpirationTime = new Date();
  tokenExpirationTime.setMinutes(tokenExpirationTime.getMinutes() + 10);
  const { user, token } = await generateEmailToken({
    email,
    tokenExpirationTime,
  });
  const args: any = {};
  args.to = email;
  args.subject = "Password reset";
  args.text = getResetPasswordEmailTemplate({ user, token });
  return await sendEmail(args);
};

/**
 * @description Send email verification email
 * @param {Object} params user email data
 * @returns {Object} user email verification data
 */
export const emailVerifyEmail = async (params: SendEmailDTO) => {
  const { email } = params;
  const tokenExpirationTime = new Date();
  tokenExpirationTime.setMinutes(tokenExpirationTime.getMinutes() + 10);
  const { user, token } = await generateEmailToken({
    email,
    tokenExpirationTime,
  });
  const args: any = {};
  args.to = email;
  args.subject = "Email verification";
  args.text = getEmailVerificationEmailTemplate({ user, token });
  return await new NodeMailer().sendEmail(args);
};

/**
 * @description Send welcome email
 * @param {Object} params user email data
 * @returns {Object} user welcome data
 */
export const emailWelcomeUser = async (params: SendEmailDTO) => {
  const { email, name } = params;
  const args: any = {};
  args.to = email;
  args.subject = "Greetings";
  args.text = getWelcomeUserEmailTemplate({ name });
  return await new NodeMailer().sendEmail(args);
};

/**
 * @description Generate user email token
 * @param {Object} params user token generation data
 * @returns {Object} user token data
 */
export const generateEmailToken = async (params: GenerateEmailTokenDTO) => {
  const { email, tokenExpirationTime } = params;
  const userExists: any = await userController.getElement({ email });
  if (!userExists)
    throw new Error("User with given email doesn't exist!|||404");
  let userTokenExists = await userTokenController.getElement({
    user: userExists._id,
  });
  if (!userTokenExists) {
    const userTokenObj: any = {};
    userTokenObj.user = userExists._id;
    userTokenObj.token = userExists.getSignedjwtToken();
    userTokenObj.expireAt = tokenExpirationTime;

    userTokenExists = await userTokenController.addElement(userTokenObj);
  }
  return userTokenExists;
};

/**
 * @description Reset user password
 * @param {Object} params user password reset data
 */
export const resetPassword = async (
  params: ResetPasswordDTO
): Promise<void> => {
  const { password, user, token } = params;

  const userExists: any = await userController.getElementById(user);
  if (!userExists) throw new Error("Invalid link!|||400");

  const userTokenExists: any = await userTokenController.getElement({
    user,
    token,
  });
  if (!userTokenExists) throw new Error("Invalid or expired link!|||400");

  await userExists.setPassword(password);
  await userTokenExists.delete();
};

/**
 * @description Email user email
 * @param {Object} params user email verification data
 */
export const verifyUserEmail = async (
  params: VerifyUserEmailDTO
): Promise<void> => {
  const { user, token } = params;

  const userExists = await userController.getElementById(user);
  if (!userExists) throw new Error("Invalid link!|||400");

  const userTokenExists: any = await userTokenController.getElement({
    user,
    token,
  });
  if (!userTokenExists) throw new Error("Invalid or expired link!|||400");

  userExists.isEmailVerified = true;
  await userExists.save();
  await userTokenExists.delete();
};
