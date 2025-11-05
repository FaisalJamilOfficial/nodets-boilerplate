// module imports
import { model, Schema } from "mongoose";

// file imports
import { MODEL_NAMES } from "../../configs/enum";

// variable initializations

const userTokenSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    index: true,
    ref: MODEL_NAMES.USERS,
  },
  token: {
    type: String,
    required: true,
  },
  expireAt: {
    type: Date,
    default: null,
  },
});

userTokenSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

export default model(MODEL_NAMES.USER_TOKENS, userTokenSchema);
