import express from 'express';
import CampaignController from '../controllers/campaign.controller';
const { createCampaign, getACampaign, getAllCampaign, getDashboardInfo, closeCampaign, deleteCampaign, payOut, openCampaign } = new CampaignController();
const router = express.Router();

//create campaign
router.post("/", createCampaign);

//get a campaign details
router.get("/:id", getACampaign);

//get all campaigns
router.get("/", getAllCampaign);

//get dashboard details
router.get("/dashboard/:userId", getDashboardInfo);

//pay creators
router.patch("/pay/:id", payOut);

//open a campaign
router.patch("/open/:id", openCampaign);

//close a campaign
router.patch("/:id", closeCampaign);

//delete a campaign
router.delete("/:id", deleteCampaign);

export default router;