import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, unique: true, required: true },
    billables: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BillableHours",
        required: true,
      },
    ],
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    amount: { type: Number, required: true }, // totalHours * hourlyRate
    totalHours: { type: Number, required: true },
    hourlyRate: { type: Number, required: true },
    status: { type: String, enum: ["draft", "sent", "paid", "overdue"], default: "draft" },
  },
  { timestamps: true }
);

export default mongoose.models.Invoice || mongoose.model("Invoice", invoiceSchema);
