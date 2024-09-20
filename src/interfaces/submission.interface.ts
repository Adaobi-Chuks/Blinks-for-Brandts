import { Document } from 'mongoose';

export default interface ICampaign extends Document {
    userId: string;
    name: string;
    email: string;
    campaignId: string;
    submissionUrl: string;
}