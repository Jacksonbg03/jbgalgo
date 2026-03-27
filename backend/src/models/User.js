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
    level: {
      type: String,
      enum:["SMP", "SMA"],
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
        sourceCode: {
          type: String,
          default: "", // menyimpan kode program
        },
        language: {
          type: String,
          default: "python", // atau python / java
        },
        submittedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true } // createdAt, updatedAt
);

userSchema.statics.getLeaderboard = async function (limit = 50) {
  return this.aggregate([
    {
      $lookup: {
        from: "problems",
        localField: "solvedProblems.problem",
        foreignField: "_id",
        as: "problemsData",
      },
    },
    {
      $addFields: {
        solvedWithDifficulty: {
          $map: {
            input: { $ifNull: ["$solvedProblems", []] }, // aman kalau kosong
            as: "sp",
            in: {
              solved: "$$sp.solved",
              difficulty: {
                $let: {
                  vars: {
                    prob: {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: "$problemsData",
                            as: "pd",
                            cond: { $eq: ["$$pd._id", "$$sp.problem"] },
                          },
                        },
                        0,
                      ],
                    },
                  },
                  in: { $ifNull: ["$$prob.difficulty", "Unknown"] }, // default kalau null
                },
              },
            },
          },
        },
      },
    },
    {
      $addFields: {
        totalSolved: {
          $size: {
            $filter: {
              input: "$solvedWithDifficulty",
              as: "s",
              cond: { $eq: ["$$s.solved", true] },
            },
          },
        },
        easy: {
          $size: {
            $filter: {
              input: "$solvedWithDifficulty",
              as: "s",
              cond: { $and: [{ $eq: ["$$s.solved", true] }, { $eq: ["$$s.difficulty", "Easy"] }] },
            },
          },
        },
        medium: {
          $size: {
            $filter: {
              input: "$solvedWithDifficulty",
              as: "s",
              cond: { $and: [{ $eq: ["$$s.solved", true] }, { $eq: ["$$s.difficulty", "Medium"] }] },
            },
          },
        },
        hard: {
          $size: {
            $filter: {
              input: "$solvedWithDifficulty",
              as: "s",
              cond: { $and: [{ $eq: ["$$s.solved", true] }, { $eq: ["$$s.difficulty", "Hard"] }] },
            },
          },
        },
      },
    },
    { $sort: { totalSolved: -1 } },
    { $limit: limit },
    { $project: { name: 1, profileImage: 1, totalSolved: 1, easy: 1, medium: 1, hard: 1 } },
  ]);
};

const User = mongoose.model("User", userSchema);

export default User;
