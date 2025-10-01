import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface ISubscription extends Document {
  userId: ObjectId;
  creatorId: ObjectId;
  plan: {
    type: "monthly" | "yearly";
    priceCOP: number;
    currency: "COP" | "USD";
  };
  payment: {
    provider: "stripe" | "wompi" | "payu";
    subscriptionId: string;
    customerId?: string;
    lastPayment?: Date;
    nextPayment?: Date;
  };
  status: "active" | "paused" | "cancelled" | "expired";
  startDate: Date;
  endDate?: Date;
  autoRenew: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema = new Schema<ISubscription>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    creatorId: { type: Schema.Types.ObjectId, ref: "Creator", required: true },
    plan: {
      type: { type: String, enum: ["monthly", "yearly"], required: true },
      priceCOP: { type: Number, required: true, min: 0 },
      currency: { type: String, enum: ["COP", "USD"], default: "COP" },
    },
    payment: {
      provider: {
        type: String,
        enum: ["stripe", "wompi", "payu"],
        required: true,
      },
      subscriptionId: { type: String, required: true },
      customerId: String,
      lastPayment: Date,
      nextPayment: Date,
    },
    status: {
      type: String,
      enum: ["active", "paused", "cancelled", "expired"],
      default: "active",
    },
    startDate: { type: Date, required: true },
    endDate: Date,
    autoRenew: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

SubscriptionSchema.index({ userId: 1, creatorId: 1 });
SubscriptionSchema.index({ status: 1 });
SubscriptionSchema.index({ "payment.subscriptionId": 1 });

export const Subscription = mongoose.model<ISubscription>(
  "Subscription",
  SubscriptionSchema,
);
