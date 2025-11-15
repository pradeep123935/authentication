import "dotenv/config";
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import { config } from "./config/app.config";
import connectToDB from "./database/database";
import { errorHandler } from "./middlewares/errorHandlers";
import { StatusCodes } from "http-status-codes";
import { asyncHandler } from "./middlewares/asyncController";
import authRoutes from "./modules/auth/auth.routes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: config.APP_ORIGIN,
    credentials: true,
  })
);
app.use(cookieParser());

app.get(
  "/",
  asyncHandler(async (req, res, next) => {
    res.status(StatusCodes.OK).json({
      message: "Server is running",
    });
  })
);

app.use(`${config.BASE_PATH}/auth`, authRoutes);

app.use(errorHandler);

app.listen(config.PORT, async () => {
  console.log(`Server started running on ${config.PORT}!!`);
  await connectToDB();
});
