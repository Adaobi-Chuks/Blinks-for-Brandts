import express from 'express';
import SubmissionController from '../controllers/submission.controller';
const { createSubmission, disqualifyCreator } = new SubmissionController();
const router = express.Router();

//create submission
router.post("/", createSubmission);

//disqualify a creator
router.delete("/:creatorId", disqualifyCreator);

export default router;