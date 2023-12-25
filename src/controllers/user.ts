// module imports
import { isValidObjectId } from "mongoose";

// file imports
import AdminModel from "../models/admin";
import CustomerModel from "../models/customer";
import UserModel from "../models/user";
import FilesDeleter from "../utils/files-deleter";
import { User } from "../interfaces/user";
import {
  GetUsersDTO,
  getUserDTO,
  getUserProfileDTO,
  updateUserDTO,
} from "../dto/user";
import { USER_TYPES } from "../configs/enum";

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
 * @description Update user
 * @param {String} user user id
 * @param {Object} userObj user data
 * @returns {Object} user data
 */
export const updateUser = async (user: string, userObj: updateUserDTO) => {
  const {
    password,
    firstName,
    lastName,
    image,
    customer,
    admin,
    coordinates,
    fcm,
    shallRemoveFCM,
    device,
  } = userObj;

  if (!user) throw new Error("Please enter user id!|||400");
  if (!isValidObjectId(user))
    throw new Error("Please enter valid user id!|||400");

  let userExists: any = await UserModel.findById(user);
  if (!userExists) throw new Error("User not found!|||404");

  if (password) await userExists.setPassword(password);
  if (fcm) {
    if (fcm?.token && fcm?.device) {
      let alreadyExists = false;
      userExists.fcms.forEach((element: any) => {
        if (element.device === fcm.device) {
          alreadyExists = true;
          element.token = fcm.token;
        }
      });
      if (!alreadyExists)
        userExists.fcms.push({ device: fcm.device, token: fcm.token });
    } else throw new Error("Please enter FCM token and device both!|||400");
  }
  if (shallRemoveFCM)
    if (device)
      userExists.fcms = userExists.fcms.filter(
        (element: any) => element?.device !== device
      );
  if (firstName || lastName)
    userExists.name =
      (userExists.firstName || "") + " " + (userExists.lastName || "");
  if (image) {
    if (userExists.image)
      new FilesDeleter().deleteImage({ image: userExists.image });
    userExists.image = image;
  }
  if (coordinates) {
    if (coordinates?.length === 2)
      userExists.location.coordinates = coordinates;
    else
      throw new Error(
        "Please enter location longitude and latitude both!|||400"
      );
  }
  if (customer)
    if (await CustomerModel.exists({ _id: customer })) {
      userExists.customer = customer;
      userExists.isCustomer = true;
    } else throw new Error("Customer not found!|||404");
  if (admin)
    if (await AdminModel.exists({ _id: admin })) {
      userExists.admin = admin;
      userExists.isAdmin = true;
    } else throw new Error("Admin not found!|||404");

  userExists = { ...userExists._doc, ...userObj };
  userExists = await UserModel.findByIdAndUpdate(userExists._id, userExists, {
    new: true,
  }).select("-createdAt -updatedAt -__v");
  return userExists;
};

/**
 * @description Delete user
 * @param {String} user user id
 * @returns {Object} user data
 */
export const deleteUser = async (user: string) => {
  if (!user) throw new Error("Please enter user id!|||400");
  if (!isValidObjectId(user))
    throw new Error("Please enter valid user id!|||400");
  const userExists = await UserModel.findByIdAndDelete(user);
  if (!userExists) throw new Error("User not found!|||404");
  return userExists;
};

/**
 * @description Get user
 * @param {Object} params user fetching parameters
 * @returns {Object} user data
 */
export const getUser = async (params: getUserDTO) => {
  const { user, email, phone, googleId, facebookId, twitterId } = params;
  const query: any = {};
  if (user) query._id = user;
  if (email) query.email = email;
  if (googleId) query.googleId = googleId;
  if (facebookId) query.facebookId = facebookId;
  if (twitterId) query.twitterId = twitterId;
  if (phone) query.phone = phone;
  if (Object.keys(query).length === 0) query._id = null;

  let userExists = await UserModel.findOne(query).select(
    "-createdAt -updatedAt -__v -fcms"
  );
  if (userExists) userExists = await userExists.populate(userExists.type);
  return userExists;
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
  userExists.fcms.forEach((element: any) => {
    if (element?.device === device) userExists._doc.fcm = element?.token;
  });
  delete userExists._doc.fcms;
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
