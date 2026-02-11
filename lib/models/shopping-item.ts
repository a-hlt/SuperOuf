import mongoose, { Schema, Document } from "mongoose"

export interface IShoppingItem extends Document {
  name: string
  quantity: number
  category?: string
  checked: boolean
  status: "VALIDATED" | "PENDING" | "REJECTED"
  listId: mongoose.Types.ObjectId
  proposedById?: mongoose.Types.ObjectId
  createdAt: Date
}

const ShoppingItemSchema = new Schema<IShoppingItem>(
  {
    name: { type: String, required: true },
    quantity: { type: Number, default: 1 },
    category: { type: String },
    checked: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["VALIDATED", "PENDING", "REJECTED"],
      default: "VALIDATED",
    },
    listId: {
      type: Schema.Types.ObjectId,
      ref: "ShoppingList",
      required: true,
    },
    proposedById: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
)

ShoppingItemSchema.index({ listId: 1, status: 1 })

export const ShoppingItem =
  mongoose.models.ShoppingItem ||
  mongoose.model<IShoppingItem>("ShoppingItem", ShoppingItemSchema)
