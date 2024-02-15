// module imports
import { isValidObjectId } from "mongoose";

// file imports
import ElementModel from "./model";
import * as userController from "../user/controller";
import { Element } from "./interface";
import { GetPaymentAccountDTO } from "./dto";

// destructuring assignments

/**
 * @description Add element
 * @param {Object} elementObj element data
 * @returns {Object} element data
 */
export const addElement = async (elementObj: Element) => {
  const { user } = elementObj;

  if (!user) throw new Error("Please enter user id!|||400");
  if (!isValidObjectId(user))
    throw new Error("Please enter valid user id!|||400");
  if (!(await userController.checkElementExistence({ _id: user })))
    throw new Error("user not found!|||404");
  return await ElementModel.create(elementObj);
};

/**
 * @description Get element
 * @param {Object} params element data
 * @returns {Object} element data
 */
export const getElement = async (params: GetPaymentAccountDTO) => {
  const { paymentAccount, user, key, value } = params;
  const query: any = {};
  if (paymentAccount) query._id = paymentAccount;
  if (user) query.user = user;
  if (key) query[key] = value;
  else query._id = null;
  const paymentAccountExists = await ElementModel.findOne(query).select(
    "-createdAt -updatedAt -__v"
  );
  // if (paymentAccountExists);
  // else throw new Error("Element not found!|||404");
  return paymentAccountExists;
};
