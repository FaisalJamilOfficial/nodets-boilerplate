// module imports
import { isValidObjectId } from "mongoose";

// file imports
import UserModel from "./model";
import FilesRemover from "../../utils/files-remover";
import * as profileController from "../profile/controller";
import { User } from "./interface";
import { MongoID } from "../../configs/types";
import { USER_TYPES } from "../../configs/enum";
import { ErrorHandler } from "../../middlewares/error-handler";
import {
  GetUsersDTO,
  getUserDTO,
  getUserProfileDTO,
  updateUserDTO,
} from "./dto";

// destructuring assignments
const { ADMIN } = USER_TYPES;

/**
 * @description Add user
 * @param {Object} userObj user data
 * @returns {Object} user data
 */
export const addUser = async (userObj: User) => {
  const { password } = userObj;
  const user: any = await UserModel.create(userObj);
  await user.setPassword(password);
  return user;
};

/**
 * @description Update user data
 * @param {String} user user id
 * @param {Object} userObj user data
 * @returns {Object} user data
 */
export const updateUserById = async (user: MongoID, userObj: updateUserDTO) => {
  if (!user) throw new ErrorHandler("Please enter user id!", 400);
  if (!isValidObjectId(user))
    throw new ErrorHandler("Please enter valid user id!", 400);
  const {
    password,
    firstName,
    lastName,
    image,
    profile,
    coordinates,
    fcm,
    shallRemoveFCM,
    device,
  } = userObj;

  if (!user) throw new ErrorHandler("Please enter user id!", 400);
  if (!isValidObjectId(user))
    throw new ErrorHandler("Please enter valid user id!", 400);

  let userExists: any = await UserModel.findById(user);
  if (!userExists) throw new ErrorHandler("User not found!", 404);

  if (password) {
    await userExists.setPassword(password);
    delete userObj.password;
  }
  if (fcm) {
    if (fcm?.token && fcm?.device) {
      let alreadyExists = false;
      userExists.fcms.forEach((user: any) => {
        if (user.device === fcm.device) {
          alreadyExists = true;
          user.token = fcm.token;
        }
      });
      if (!alreadyExists)
        userExists.fcms.push({ device: fcm.device, token: fcm.token });
    } else
      throw new ErrorHandler("Please enter FCM token and device both!", 400);
  }
  if (shallRemoveFCM)
    if (device)
      userExists.fcms = userExists.fcms.filter(
        (user: any) => user?.device !== device
      );
  if (firstName || lastName)
    userExists.name = (firstName || "") + " " + (lastName || "");
  if (image) {
    if (userExists.image) new FilesRemover().remove([userExists.image]);
    userExists.image = image;
  }
  if (coordinates) {
    if (coordinates?.length === 2)
      userExists.location.coordinates = coordinates;
    else
      throw new ErrorHandler(
        "Please enter location longitude and latitude both!",
        400
      );
  }
  if (profile)
    if (await profileController.checkProfileExistence({ _id: profile })) {
      userExists.profile = profile;
    } else throw new ErrorHandler("Profile not found!", 404);

  userExists = { ...userExists._doc, ...userObj };
  userExists = await UserModel.findByIdAndUpdate(userExists._id, userExists, {
    new: true,
  }).select("-createdAt -updatedAt -__v");
  if (!userExists) throw new ErrorHandler("user not found!", 404);
  return userExists;
};

/**
 * @description Update user data
 * @param {Object} query user data
 * @param {Object} userObj user data
 * @returns {Object} user data
 */
export const updateUser = async (
  query: Partial<User>,
  userObj: Partial<User>
) => {
  if (!query || Object.keys(query).length === 0)
    throw new ErrorHandler("Please enter query!", 400);
  const userExists = await UserModel.findOneAndUpdate(query, userObj, {
    new: true,
  });
  if (!userExists) throw new ErrorHandler("user not found!", 404);
  return userExists;
};

/**
 * @description Delete user
 * @param {String} user user id
 * @returns {Object} user data
 */
export const deleteUserById = async (user: MongoID) => {
  if (!user) throw new ErrorHandler("Please enter user id!", 400);
  if (!isValidObjectId(user))
    throw new ErrorHandler("Please enter valid user id!", 400);
  const userExists = await UserModel.findByIdAndDelete(user);
  if (!userExists) throw new ErrorHandler("user not found!", 404);
  return userExists;
};

/**
 * @description Get user
 * @param {String} user user id
 * @returns {Object} user data
 */
export const getUserById = async (user: MongoID) => {
  if (!user) throw new ErrorHandler("Please enter user id!", 400);
  if (!isValidObjectId(user))
    throw new ErrorHandler("Please enter valid user id!", 400);
  const userExists = await UserModel.findById(user).select(
    "-createdAt -updatedAt -__v"
  );
  if (!userExists) throw new ErrorHandler("user not found!", 404);
  return userExists;
};

/**
 * @description Get user
 * @param {Object} params user data
 * @returns {Object} user data
 */
export const getUser = async (params: getUserDTO) => {
  const { user, email, phone, googleId, facebookId } = params;
  const query: any = {};
  if (user) query._id = user;
  if (email) query.email = email;
  if (googleId) query.googleId = googleId;
  if (facebookId) query.facebookId = facebookId;
  if (phone) query.phone = phone;
  if (Object.keys(query).length === 0) query._id = null;

  let userExists = await UserModel.findOne(query).select(
    "-createdAt -updatedAt -__v -fcms"
  );
  if (userExists)
    if (userExists?.profile)
      userExists = await userExists.populate(userExists.type);
  return userExists;
};

/**
 * @description Get users
 * @param {Object} params users fetching parameters
 * @returns {Object[]} users data
 */
export const getUsers = async (params: GetUsersDTO) => {
  const { type, user } = params;
  let { page, limit, keyword } = params;
  page = page - 1 || 0;
  limit = limit || 10;
  const query: any = {};

  if (type) query.type = type;
  else query.type = { $ne: ADMIN };
  if (user) query._id = { $ne: user };
  if (keyword) {
    keyword = keyword.trim();
    if (keyword !== "")
      query.$or = [
        { email: { $regex: keyword, $options: "i" } },
        { name: { $regex: keyword, $options: "i" } },
      ];
  }
  const [result] = await UserModel.aggregate([
    { $match: query },
    { $sort: { createdAt: -1 } },
    { $project: { password: 0, createdAt: 0, updatedAt: 0, __v: 0 } },
    {
      $facet: {
        totalCount: [{ $count: "totalCount" }],
        data: [{ $skip: page * limit }, { $limit: limit }],
      },
    },
    { $unwind: "$totalCount" },
    {
      $project: {
        totalCount: "$totalCount.totalCount",
        totalPages: { $ceil: { $divide: ["$totalCount.totalCount", limit] } },
        data: 1,
      },
    },
  ]);
  return { data: [], totalCount: 0, totalPages: 0, ...result };
};

/**
 * @description Check user existence
 * @param {Object} query user data
 * @returns {Boolean} user existence status
 */
export const checkUserExistence = async (query: Partial<User>) => {
  if (!query || Object.keys(query).length === 0)
    throw new ErrorHandler("Please enter query!", 400);
  return await UserModel.exists(query);
};

/**
 * @description Get user profile
 * @param {Object} params user fetching parameters
 * @returns {Object} user data
 */
export const getUserProfile = async (params: getUserProfileDTO) => {
  const { user, device } = params;
  const userExists: any = await UserModel.findById(user).select(
    "-createdAt -updatedAt -__v"
  );
  userExists.fcms.forEach((user: any) => {
    if (user?.device === device) userExists._doc.fcm = user?.token;
  });
  delete userExists._doc.fcms;
  return userExists;
};
