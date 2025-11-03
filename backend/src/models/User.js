import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    profileImage: {
      type: String,
      default: "",
    },
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["Admin", "User"],
      default: "User"
    },
    solvedProblems: [
      {
        problem: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Problem",
          required: true,
        },
        solved: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  { timestamps: true } // createdAt, updatedAt
);

userSchema.statics.getLeaderboard = async function (limit = 10) {
  return this.aggregate([
    {
      $addFields: {
        solvedCount: {
          $size: {
            $filter: {
              input: "$solvedProblems",
              as: "p",
              cond: { $eq: ["$$p.solved", true] },
            },
          },
        },
      },
    },
    { $sort: { solvedCount: -1 } },
    { $limit: limit },
    { $project: { name: 1, solvedCount: 1 } },
  ]);
};

const User = mongoose.model("User", userSchema);

export default User;
