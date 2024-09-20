import { Document } from 'mongoose';

export default interface ICampaign extends Document {
    userId: string;
    title: string;
    image: string;
    description: string;
    goal: string;
    duration: number;
    budget: number;
    requirement: string;
    targetAudience: string;
    app: string;
    additionalLink: string;
    status: string;
}