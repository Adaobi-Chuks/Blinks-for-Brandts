import { model, Schema } from "mongoose";
import ISubmission from "../interfaces/submission.interface";
import { DATABASES } from "../configs/constants.config";

const submissionSchema = new Schema<ISubmission>({
    userId: {
        type: String,
        trim: true
    },
    submissionUrl: {
        type: String,
        trim: true
    },
    campaignId: {
        type: String,
        trim: true
    },
    name: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true
    }
}, {
    strict: true,
    timestamps: true
});

const Submission = model<ISubmission>(DATABASES.SUBMISSION, submissionSchema, DATABASES.SUBMISSION);
export default Submission;