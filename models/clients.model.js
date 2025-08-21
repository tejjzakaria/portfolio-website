import mongoose, { Schema } from "mongoose";

const clientSchema = new mongoose.Schema(
    {
        client: String,
        company: String,
        email: String,
        phone: String,
        projects: {
            type: [String],
            default: []
        },
        status: {
            type: String,
            default: "active"
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Client || mongoose.model("Client", clientSchema);