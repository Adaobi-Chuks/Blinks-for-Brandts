import { Request, Response } from "express";
// import { ethers } from "ethers";
// import ContractABI from "../ABI/campaignManagerABI.json";
import CustomResponse from "../utils/helpers/response.util";
import HttpException from "../utils/helpers/httpException.util";
import { INTERNAL_SERVER_ERROR, OK } from "../utils/statusCodes.util";
import Campaign from "../services/campaign.service";
import Submission from "../services/submission.service";
const CampaignService = new Campaign();
const SubmissionService = new Submission();

export default class CampaignController {

    async createCampaign(req: Request, res: Response) {

        try {

            const campaign = await CampaignService.create(req.body);

            return new CustomResponse(OK, true, "Campaign created successfully", res, campaign);

        } catch (error: any) {

            if (error instanceof HttpException) {

                return new CustomResponse(error.status, false, error.message, res);

            }
            return new CustomResponse(INTERNAL_SERVER_ERROR, false, `Error: ${error.message}`, res);
        }
    }

    async getACampaign(req: Request, res: Response) {

        try {

            const campaign = await CampaignService.findById(req.params.id);

            const submissions = await SubmissionService.find({ campaignId: req.params.id });

            const creatorDetails = await Promise.all(submissions.map(async (submission) => {
                let traffic = {
                    likes: 0,
                    comments: 0
                };
                if (campaign.app === "instagram") {
                    // traffic = await getInstagramDetails(submission.submissionUrl);
                } else if (campaign.app === "X (twitter)") {
                    // traffic = await getXDetails(submission.submissionUrl);
                }
                return {
                    _id: submission._id,
                    name: submission.name,
                    email: submission.email,
                    address: submission.userId,
                    link: submission.submissionUrl,
                    likes: traffic?.likes,
                    comments: traffic?.comments
                };
            }));

            return new CustomResponse(OK, true, "Campaign fetched successfully", res, {
                campaignDetails: campaign,
                creatorDetails
            });

        } catch (error: any) {

            if (error instanceof HttpException) {

                return new CustomResponse(error.status, false, error.message, res);

            }
            return new CustomResponse(INTERNAL_SERVER_ERROR, false, `Error: ${error.message}`, res);
        }
    }

    async openCampaign(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const openedCampaign = await CampaignService.openById(id);

            return new CustomResponse(OK, true, "Campaign opened successfully", res, openedCampaign);
        } catch (error: any) {
            if (error instanceof HttpException) {
                return new CustomResponse(error.status, false, error.message, res);
            }
            return new CustomResponse(INTERNAL_SERVER_ERROR, false, `Error: ${error.message}`, res);
        }
    }

    async closeCampaign(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const closedCampaign = await CampaignService.closeById(id);

            return new CustomResponse(OK, true, "Campaign closed successfully", res, closedCampaign);
        } catch (error: any) {
            if (error instanceof HttpException) {
                return new CustomResponse(error.status, false, error.message, res);
            }
            return new CustomResponse(INTERNAL_SERVER_ERROR, false, `Error: ${error.message}`, res);
        }
    }

    async deleteCampaign(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const deletedCampaign = await CampaignService.deleteById(id);

            return new CustomResponse(OK, true, "Campaign deleted successfully", res, deletedCampaign);
        } catch (error: any) {
            if (error instanceof HttpException) {
                return new CustomResponse(error.status, false, error.message, res);
            }
            return new CustomResponse(INTERNAL_SERVER_ERROR, false, `Error: ${error.message}`, res);
        }
    }

    async payOut(req: Request, res: Response) {
        // try {
        //     const campaign = await CampaignService.findById(req.params.id);
        //     const submissions = await SubmissionService.find({ campaignId: req.params.id });

        //     const ownersFee = req.body.ownersFee;
        //     const campaignId = req.body.userId;
        //     const addresses = submissions.map(submission => submission.userId as `0x${string}`);

        //     campaign.status = "paid";
        //     await campaign.save();

        //     const CampaignABI = ContractABI.abi;

        //     const CONTRACT_ADDRESS = "0x5F27CC10D7fD2a05294BB4ee4d05973f012fe99D";

        //     const NodeUrl = process.env.ALCHEMY_KEY;

        //     const privateKey = process.env.WALLET_KEY;

        //     const provider = new ethers.JsonRpcProvider(NodeUrl);
        //     const wallet = new ethers.Wallet(privateKey!, provider);

        //     const contract = new ethers.Contract(
        //         CONTRACT_ADDRESS,
        //         CampaignABI,
        //         wallet
        //     );

        //     // contract.on("Payout", (campaignId, recipient, amount) => {
        //     //     console.log("Payout event emitted!");
        //     //     console.log("Campaign ID:", campaignId.toString());
        //     //     console.log("Recipient:", recipient);
        //     //     console.log("Amount:", ethers.formatEther(amount));
        //     // });

        //     const transactionResponse = await contract.payout(
        //         campaignId,
        //         addresses,
        //         ownersFee
        //     );
        //     // await transactionResponse.wait();

        //     return new CustomResponse(OK, true, "Creators paid successfully", res);
        // } catch (error: any) {
        //     if (error instanceof HttpException) {
        //         return new CustomResponse(error.status, false, error.message, res);
        //     }
        //     return new CustomResponse(INTERNAL_SERVER_ERROR, false, `Error: ${error.message}`, res);
        // }
    }

    async getDashboardInfo(req: Request, res: Response) {
        try {
            const campaigns = await CampaignService.findByUserId(req.params.userId);

            const campaignsDetails = await Promise.all(campaigns.map(async (campaign) => {
                const submissions = await SubmissionService.find({ campaignId: campaign._id });

                const creatorDetails = await Promise.all(submissions.map(async (submission) => {
                    let traffic = {
                        likes: 0,
                        comments: 0
                    };;
                    if (campaign.app === "instagram") {
                        // traffic = await getInstagramDetails(submission.submissionUrl);
                    } else if (campaign.app === "X (twitter)") {
                        // traffic = await getXDetails(submission.submissionUrl);
                    }
                    return {
                        likes: traffic?.likes || 0,
                        comments: traffic?.comments || 0
                    };
                }));

                const likes = await creatorDetails.reduce(async (totalLikes, creatorDetail) => {
                    return (await totalLikes) + creatorDetail.likes;
                }, Promise.resolve(0));

                const comments = await creatorDetails.reduce(async (totalComments, creatorDetail) => {
                    return (await totalComments) + creatorDetail.comments;
                }, Promise.resolve(0));

                const trafficGenerated = creatorDetails.reduce((total, creatorDetail) => {
                    return total + creatorDetail.likes + creatorDetail.comments;
                }, 0);

                const engagementRate = (trafficGenerated / submissions.length) * 100;

                return {
                    id: campaign._id,
                    name: campaign.title,
                    submissions: submissions.length,
                    likes: likes,
                    comments: comments,
                    trafficGenerated: trafficGenerated,
                    budgetSpent: campaign.budget,
                    engagementRate: engagementRate ? engagementRate : 0,
                    status: campaign.status
                };
            }));

            const totalSubmissions = await campaignsDetails.reduce(async (total, campaignDetail) => {
                return (await total) + campaignDetail.submissions;
            }, Promise.resolve(0));

            const totalBudgetSpent = campaigns.reduce((totalBudget, campaign) => {
                return totalBudget + campaign.budget;
            }, 0);

            const activeCampaigns = campaigns.filter(campaign => campaign.status === 'open').length;

            const totalTrafficGenerated = campaignsDetails.reduce((total, campaignDetail) => {
                return total + campaignDetail.trafficGenerated;
            }, 0);

            const averageEngagementRate = (campaignsDetails.reduce((sum, campaignDetail) => {
                return sum + campaignDetail.engagementRate;
            }, 0)) / campaignsDetails.length;

            const response = {
                details: {
                    totalCampaigns: campaigns.length,
                    totalSubmissions: totalSubmissions,
                    trafficPercentage: (totalTrafficGenerated / campaignsDetails.length) * 100,
                    totalBudgetSpent: totalBudgetSpent,
                    averageEngagementRate: averageEngagementRate ? averageEngagementRate : 0,
                    activeCampaigns: activeCampaigns
                },
                campaigns: campaignsDetails
            };

            return new CustomResponse(OK, true, "Dashboard info fetched successfully", res, response);
        } catch (error: any) {
            console.log(error.message)
            if (error instanceof HttpException) {
                return new CustomResponse(error.status, false, error.message, res);
            }
            return new CustomResponse(INTERNAL_SERVER_ERROR, false, `Error: ${error.message}`, res);
        }
    }

    async getAllCampaign(_req: Request, res: Response) {

        try {

            const campaigns = await CampaignService.findAll();

            return new CustomResponse(OK, true, "All campaigns fetched successfully", res, campaigns);

        } catch (error: any) {

            if (error instanceof HttpException) {

                return new CustomResponse(error.status, false, error.message, res);

            }
            return new CustomResponse(INTERNAL_SERVER_ERROR, false, `Error: ${error.message}`, res);
        }
    }

}