// module imports
import mongoose from "mongoose";

// variable initializations
const Schema = mongoose.Schema;
const model = mongoose.model;

const elementSchema = new Schema(
  { title: { type: String } },
  { timestamps: true }
);

export default model("elements", elementSchema);
