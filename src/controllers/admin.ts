// module imports
import { isValidObjectId } from "mongoose";

// file imports
import AdminModel from "../models/admin";
import { Admin } from "../interfaces/admin";
import { GetAdminsDTO } from "../dto/admin";

// destructuring assignments

/**
 * @description Add admin
 * @param {Object} adminObj admin data
 * @returns {Object} admin data
 */
export const addAdmin = async (adminObj: Admin) => {
  return await AdminModel.create(adminObj);
};

/**
 * @description Update admin data
 * @param {String} user user id
 * @param {Object} adminObj admin data
 * @returns {Object} admin data
 */
export const updateAdmin = async (user: string, adminObj: Partial<Admin>) => {
  if (!user) throw new Error("Please enter user id!|||400");
  if (!isValidObjectId(user))
    throw new Error("Please enter valid user id!|||400");
  const adminExists = await AdminModel.findOneAndUpdate({ user }, adminObj, {
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
  const adminExists = await AdminModel.findOneAndDelete({ user });
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
  const adminExists = await AdminModel.findOne({ user }).select(
    "-createdAt -updatedAt -__v"
  );
  if (!adminExists) throw new Error("Admin not found!|||404");
  return adminExists;
};

/**
 * @description Get admins
 * @param {Object} params admins fetching parameters
 * @returns {Object[]} admins data
 */
export const getAdmins = async (params: GetAdminsDTO) => {
  let { limit, page } = params;
  page = page - 1 || 0;
  limit = limit || 10;
  const query: any = {};
  const [result] = await AdminModel.aggregate([
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
 */
export const cleanDB = async (): Promise<void> => {
  const models: any = [];
  Promise.all(models.map((model: any) => model.remove())).then((res) =>
    res.map((element) => console.log(element.status))
  );
};
