import mongoose, { Schema, Document } from "mongoose"

export interface IUser extends Document {
  email: string
  name: string
  emailVerified: boolean
  image?: string
  role: "PARENT" | "CHILD" | "SUPEROUF"
  pinCode?: string
  householdId?: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    emailVerified: { type: Boolean, default: false },
    image: { type: String },
    role: {
      type: String,
      enum: ["PARENT", "CHILD", "SUPEROUF"],
      default: "PARENT",
    },
    pinCode: { type: String },
    householdId: { type: Schema.Types.ObjectId, ref: "Household" },
  },
  { timestamps: true }
)

export const User =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema)
