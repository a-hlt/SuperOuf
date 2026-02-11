import mongoose, { Schema, Document } from "mongoose"

export interface IHousehold extends Document {
  name: string
  inviteCode: string
  createdAt: Date
}

const HouseholdSchema = new Schema<IHousehold>(
  {
    name: { type: String, required: true },
    inviteCode: { type: String, required: true, unique: true },
  },
  { timestamps: true }
)

export const Household =
  mongoose.models.Household ||
  mongoose.model<IHousehold>("Household", HouseholdSchema)
