import mongoose, { Schema, Document } from "mongoose"

export interface IShoppingList extends Document {
  name: string
  isActive: boolean
  isTemplate: boolean
  completedAt?: Date
  householdId: mongoose.Types.ObjectId
  createdAt: Date
}

const ShoppingListSchema = new Schema<IShoppingList>(
  {
    name: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    isTemplate: { type: Boolean, default: false },
    completedAt: { type: Date },
    householdId: {
      type: Schema.Types.ObjectId,
      ref: "Household",
      required: true,
    },
  },
  { timestamps: true }
)

ShoppingListSchema.index({ householdId: 1, isActive: 1 })

export const ShoppingList =
  mongoose.models.ShoppingList ||
  mongoose.model<IShoppingList>("ShoppingList", ShoppingListSchema)
