import { Router, Request, Response, Application } from 'express';
import campaignRoute from "./campaign.route";
import submissionRoute from "./submission.route";
import { OK } from '../utils/statusCodes.util';
const router: Router = Router();
import CustomResponse from "../utils/helpers/response.util";
import { BASEPATH } from '../configs/constants.config';

/**API base route */
router.get("/", (req: Request, res: Response) => {
    return new CustomResponse(OK, true, "Welcome, ensure to go through the API docs before using this service", res);
});

router.use("/campaign", campaignRoute);
router.use("/submission", submissionRoute);

export default router;

export function baseController(_req: Request, res: Response) {
    res.redirect(`${BASEPATH}`);
};