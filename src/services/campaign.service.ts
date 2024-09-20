import ICampaign from "../interfaces/campaign.interface";
import BaseRepository from "../repositories/base.repository";
import Campaign from "../models/campaign.model";
import HttpException from "../utils/helpers/httpException.util";
import { INTERNAL_SERVER_ERROR, NOT_FOUND } from "../utils/statusCodes.util";
const CampaignRepository = new BaseRepository(
    Campaign
);

export default class CampaignService {

    async create(campaign: ICampaign) {
        try {

            return await CampaignRepository.create(campaign);

        } catch (error: any) {

            throw new HttpException(INTERNAL_SERVER_ERROR, error.message);
        }
    }

    async findById(id: string) {
        try {

            const campaign = await CampaignRepository.findById(id);

            if (!campaign) throw new HttpException(NOT_FOUND, "Invalid Id");

            return campaign;

        } catch (error: any) {

            if (error.status === NOT_FOUND) throw error;

            throw new HttpException(INTERNAL_SERVER_ERROR, error.message);
        }
    }

    async findByUserId(id: string) {
        try {

            const campaign = await CampaignRepository.find({ userId: id });

            return campaign;

        } catch (error: any) {

            throw new HttpException(INTERNAL_SERVER_ERROR, error.message);
        }
    }

    async findAll() {
        try {

            const campaign = await CampaignRepository.find({ status: "open" });

            return campaign;

        } catch (error: any) {

            throw new HttpException(INTERNAL_SERVER_ERROR, error.message);
        }
    }

    async openById(id: string) {
        try {
            const campaign = await CampaignRepository.findById(id);

            if (!campaign) {
                throw new HttpException(NOT_FOUND, "Campaign not found");
            }

            campaign.status = "open";
            await campaign.save();

            return campaign;
        } catch (error: any) {
            if (error.status === NOT_FOUND) {
                throw error;
            }
            throw new HttpException(INTERNAL_SERVER_ERROR, `Error closing campaign: ${error.message}`);
        }
    }

    async closeById(id: string) {
        try {
            const campaign = await CampaignRepository.findById(id);

            if (!campaign) {
                throw new HttpException(NOT_FOUND, "Campaign not found");
            }

            campaign.status = "closed";
            await campaign.save();

            return campaign;
        } catch (error: any) {
            if (error.status === NOT_FOUND) {
                throw error;
            }
            throw new HttpException(INTERNAL_SERVER_ERROR, `Error closing campaign: ${error.message}`);
        }
    }

    async deleteById(id: string) {
        try {
            const campaign = await CampaignRepository.deleteById(id);

            if (!campaign) {
                throw new HttpException(NOT_FOUND, "Campaign not found");
            }

            return campaign;
        } catch (error: any) {
            if (error.status === NOT_FOUND) {
                throw error;
            }
            throw new HttpException(INTERNAL_SERVER_ERROR, `Error deleting campaign: ${error.message}`);
        }
    }

}
