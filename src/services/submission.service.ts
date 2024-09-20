import ISubmission from "../interfaces/submission.interface";
import BaseRepository from "../repositories/base.repository";
import Submission from "../models/submission.model";
import HttpException from "../utils/helpers/httpException.util";
import { INTERNAL_SERVER_ERROR, NOT_FOUND } from "../utils/statusCodes.util";
const SubmissionRepository = new BaseRepository(
    Submission
);

export default class SubmissionService {

    async create(submission: ISubmission) {
        try {

            return await SubmissionRepository.create(submission);

        } catch (error: any) {

            throw new HttpException(INTERNAL_SERVER_ERROR, error.message);
        }
    }

    async deleteById(id: string) {
        try {

            const submission = await SubmissionRepository.deleteById(id);

            if (!submission) throw new HttpException(NOT_FOUND, "Invalid Id");

            return submission;

        } catch (error: any) {

            if (error.status === NOT_FOUND) throw error;

            throw new HttpException(INTERNAL_SERVER_ERROR, error.message);
        }
    }

    async find(query: {}) {
        try {

            const submissions = await SubmissionRepository.find(query);

            return submissions;

        } catch (error: any) {

            throw new HttpException(INTERNAL_SERVER_ERROR, error.message);
        }
    }

    async findOne(query: {}) {
        try {

            const submissions = await SubmissionRepository.findOne(query);

            return submissions;

        } catch (error: any) {

            throw new HttpException(INTERNAL_SERVER_ERROR, error.message);
        }
    }
}
