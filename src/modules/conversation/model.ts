// module imports
import mongoose from "mongoose";

// file imports
import { CONVERSATION_STATUSES } from "../../configs/enum";

// destructuring assignments
const { PENDING } = CONVERSATION_STATUSES;

// variable initializations
const Schema = mongoose.Schema;
const model = mongoose.model;

const conversationSchema = new Schema(
  {
    userTo: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
      index: true,
    },
    userFrom: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
      index: true,
    },
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: "messages",
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(CONVERSATION_STATUSES),
      default: PENDING,
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

export default model("conversations", conversationSchema);
