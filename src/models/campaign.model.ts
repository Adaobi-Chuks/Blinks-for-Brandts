import { model, Schema } from "mongoose";
import ICampaign from "../interfaces/campaign.interface";
import { DATABASES } from "../configs/constants.config";

const campaignSchema = new Schema<ICampaign>({
    userId: {
        type: String,
        trim: true
    },
    title: {
        type: String,
        trim: true
    },
    image: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    goal: {
        type: String,
        trim: true
    },
    duration: {
        type: Number,
        trim: true
    },
    budget: {
        type: Number,
        trim: true
    },
    requirement: {
        type: String,
        trim: true
    },
    targetAudience: {
        type: String,
        trim: true
    },
    app: {
        type: String,
        trim: true
    },
    additionalLink: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ["open", "closed", "inProgress", "paid"],
        default: "inProgress"
    }
}, {
    strict: true,
    timestamps: true
});

const Campaign = model<ICampaign>(DATABASES.CAMPAIGN, campaignSchema, DATABASES.CAMPAIGN);
export default Campaign;