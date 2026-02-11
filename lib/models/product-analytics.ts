import mongoose, { Schema, Document } from "mongoose"

export interface IProductAnalytics extends Document {
  productName: string
  totalRequests: number
  totalPurchased: number
  category?: string
  lastRequested: Date
}

const ProductAnalyticsSchema = new Schema<IProductAnalytics>({
  productName: { type: String, required: true, unique: true },
  totalRequests: { type: Number, default: 0 },
  totalPurchased: { type: Number, default: 0 },
  category: { type: String },
  lastRequested: { type: Date, default: Date.now },
})

ProductAnalyticsSchema.index({ totalRequests: 1 })

export const ProductAnalytics =
  mongoose.models.ProductAnalytics ||
  mongoose.model<IProductAnalytics>(
    "ProductAnalytics",
    ProductAnalyticsSchema
  )
