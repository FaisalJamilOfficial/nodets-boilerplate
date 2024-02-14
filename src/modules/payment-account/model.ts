// module imports
import mongoose from "mongoose";

// file imports
import { PAYMENT_ACCOUNT_TYPES } from "../../configs/enum";

// destructuring assignments

// variable initializations
const Schema = mongoose.Schema;
const model = mongoose.model;

const paymentAccountSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
      index: true,
    },
    account: {
      type: Object,
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(PAYMENT_ACCOUNT_TYPES),
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model("paymentAccounts", paymentAccountSchema);
