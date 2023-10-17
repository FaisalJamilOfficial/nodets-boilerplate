// module imports
import { isValidObjectId } from "mongoose";

// file imports
import models from "../models";
import { Admin } from "../interfaces";
import { GetAdminsDTO } from "../dto/admins";

// destructuring assignments
const { adminsModel } = models;

/**
 * @description @description Add admin
 * @param {String} user user id
 * @returns {Object} admin data
 */
export const addAdmin = async (adminObj: Admin) => {
  return await adminsModel.create(adminObj);
};

/**
 * @description Update admin data
 * @param {String} user user id
 * @returns {Object} admin data
 */
export const updateAdmin = async (user: string, adminObj: Partial<Admin>) => {
  if (!user) throw new Error("Please enter user id!|||400");
  if (!isValidObjectId(user))
    throw new Error("Please enter valid user id!|||400");
  const adminExists = await adminsModel.findOneAndUpdate({ user }, adminObj, {
    new: true,
  });
  if (!adminExists) throw new Error("Admin not found!|||404");
  return adminExists;
};

/**
 * @description Delete admin
 * @param {String} user user id
 * @returns {Object} admin data
 */
export const deleteAdmin = async (user: string) => {
  if (!user) throw new Error("Please enter user id!|||400");
  if (!isValidObjectId(user))
    throw new Error("Please enter valid user id!|||400");
  const adminExists = await adminsModel.findOneAndDelete({ user });
  if (!adminExists) throw new Error("Admin not found!|||404");
  return adminExists;
};

/**
 * @description Get admin
 * @param {String} user user id
 * @returns {Object} admin data
 */
export const getAdmin = async (user: string) => {
  if (!user) throw new Error("Please enter user id!|||400");
  if (!isValidObjectId(user))
    throw new Error("Please enter valid user id!|||400");
  const adminExists = await adminsModel
    .findOne({ user })
    .select("-createdAt -updatedAt -__v");
  if (!adminExists) throw new Error("Admin not found!|||404");
  return adminExists;
};

/**
 * @description Get admins
 * @param {Number} limit admins limit
 * @param {Number} page admins page number
 * @returns {Object} admin data
 */
export const getAdmins = async (params: GetAdminsDTO) => {
  let { limit, page } = params;
  if (!limit) limit = 10;
  if (!page) page = 0;
  if (page) page = page - 1;
  const query: any = {};
  const [result] = await adminsModel.aggregate([
    { $match: query },
    { $sort: { createdAt: -1 } },
    { $project: { createdAt: 0, updatedAt: 0, __v: 0 } },
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
 * @description Clean DB
 * @returns {Object} success status
 */
export const cleanDB = async (): Promise<void> => {
  const models: any = [];
  Promise.all(models.map((model: any) => model.remove())).then((res) =>
    res.map((element) => console.log(element.status))
  );
};
