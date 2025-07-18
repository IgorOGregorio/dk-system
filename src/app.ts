import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger";
import appRouter from "./routes/app.route";
import errorMiddleware from "./middlewares/error.middleware";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
  })
);
app.use(helmet());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/", appRouter);

app.use(errorMiddleware);
export default app;
