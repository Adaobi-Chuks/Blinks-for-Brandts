import app from "./app";
import logger from "./middlewares/logger.middleware";
import connectToMongo from "./configs/database.config"
import { PORT } from "./configs/constants.config";

(async () => {
  logger.info(`Attempting to run server on port ${PORT}`);

  await connectToMongo();

  app.listen(PORT, () => {
    logger.info(`Listening on port ${PORT}`);
  });

})();