// module imports
import mongoose from "mongoose";

// file imports
import { NOTIFICATION_TYPES, NOTIFICATION_STATUSES } from "../../configs/enum";

// destructuring assignments
const { UNREAD } = NOTIFICATION_STATUSES;

// variable initializations
const Schema = mongoose.Schema;
const model = mongoose.model;

const notificationSchema = new Schema(
  {
    type: {
      type: String,
      enum: Object.values(NOTIFICATION_TYPES),
      required: true,
      index: true,
    },
    text: {
      type: String,
      default: "",
    },
    message: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "messages",
      index: true,
    },
    messenger: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(NOTIFICATION_STATUSES),
      default: UNREAD,
    },
  },
  {
    timestamps: true,
  }
);

export default model("notifications", notificationSchema);
