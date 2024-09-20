import { Request, Response } from "express";
import CustomResponse from "../utils/helpers/response.util";
import HttpException from "../utils/helpers/httpException.util";
import { INTERNAL_SERVER_ERROR, OK } from "../utils/statusCodes.util";
import Submission from "../services/submission.service";
const SubmissionService = new Submission();

export default class SubmissionController {

    async createSubmission(req: Request, res: Response) {

        try {

            const foundSubmission = await SubmissionService.findOne({
                userId: req.body.userId,
                submissionUrl: req.body.submissionUrl
            })

            if (foundSubmission) {
                return new CustomResponse(OK, true, "User already submitted the specified video", res, foundSubmission);
            }

            const submission = await SubmissionService.create(req.body);

            return new CustomResponse(OK, true, "Submission submitted successfully", res, submission);

        } catch (error: any) {

            if (error instanceof HttpException) {

                return new CustomResponse(error.status, false, error.message, res);

            }
            return new CustomResponse(INTERNAL_SERVER_ERROR, false, `Error: ${error.message}`, res);
        }
    }

    async disqualifyCreator(req: Request, res: Response) {

        try {

            await SubmissionService.deleteById(req.params.creatorId);

            return new CustomResponse(OK, true, "Creator disqualified successfully", res);

        } catch (error: any) {

            if (error instanceof HttpException) {

                return new CustomResponse(error.status, false, error.message, res);

            }
            return new CustomResponse(INTERNAL_SERVER_ERROR, false, `Error: ${error.message}`, res);
        }
    }

}