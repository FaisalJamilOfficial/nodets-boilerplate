// module imports
import { isValidObjectId } from "mongoose";

// file imports
import models from "../models";
import { PaymentAccount } from "../interfaces";

// destructuring assignments
const { paymentAccountsModel, usersModel } = models;

/**
 * @description Add paymentAccount
 * @param {String} user user id
 * @returns {Object} paymentAccount data
 */
export const addPaymentAccount = async (
  paymentAccountObj: PaymentAccount
): Promise<any> => {
  const { user } = paymentAccountObj;

  if (!user) throw new Error("Please enter user id!|||400");
  if (!isValidObjectId(user))
    throw new Error("Please enter valid user id!|||400");
  if (!(await usersModel.exists({ _id: user })))
    throw new Error("user not found!|||404");

  return await paymentAccountsModel.create(paymentAccountObj);
};

/**
 * @description Get paymentAccount
 * @param {String} paymentAccount paymentAccount id
 * @param {String} user user id
 * @returns {Object} paymentAccount data
 */
export const getPaymentAccount = async (params: any): Promise<any> => {
  const { paymentAccount, user, key, value } = params;
  const query: any = {};
  if (paymentAccount) query._id = paymentAccount;
  if (user) query.user = user;
  if (key) query[key] = value;
  else query._id = null;
  const paymentAccountExists = await paymentAccountsModel
    .findOne(query)
    .select("-createdAt -updatedAt -__v");
  // if (paymentAccountExists);
  // else throw new Error("PaymentAccount not found!|||404");
  return paymentAccountExists;
};

/**
 * @description Get paymentAccounts
 * @param {String} keyword search keyword
 * @param {Number} limit paymentAccounts limit
 * @param {Number} page paymentAccounts page number
 * @returns {Object} paymentAccount data
 */
export const getPaymentAccounts = async (params: any): Promise<any> => {
  const { user } = params;
  let { limit, page } = params;
  if (!limit) limit = 10;
  if (!page) page = 0;
  if (page) page = page - 1;
  const query: any = {};
  if (user) query.user = user;
  const paymentAccounts = await paymentAccountsModel.aggregate([
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
        totalPages: {
          $ceil: {
            $divide: ["$totalCount.totalCount", limit],
          },
        },
        data: 1,
      },
    },
  ]);
  return { data: [], totalCount: 0, totalPages: 0, ...paymentAccounts[0] };
};
