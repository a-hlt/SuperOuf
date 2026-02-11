import mongoose, { Schema, Document } from "mongoose"

export interface ISuggestion extends Document {
  productName: string
  description: string
  discount?: string
  isActive: boolean
  expiresAt?: Date
  createdAt: Date
}

const SuggestionSchema = new Schema<ISuggestion>(
  {
    productName: { type: String, required: true },
    description: { type: String, required: true },
    discount: { type: String },
    isActive: { type: Boolean, default: true },
    expiresAt: { type: Date },
  },
  { timestamps: true }
)

export const Suggestion =
  mongoose.models.Suggestion ||
  mongoose.model<ISuggestion>("Suggestion", SuggestionSchema)
