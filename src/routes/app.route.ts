import { NextFunction, Router, Request, Response } from "express";

const appRouter = Router();

/**
 * @swagger
 * /:
 *   get:
 *     summary: Checks if the API is healthy
 *     tags: [Health Check]
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: healthy
 */
appRouter.get("/", (req: Request, res: Response, next: NextFunction) => {});

export default appRouter;
