import { Router, Request, Response, NextFunction } from "express";
import { validate } from "../middlewares/validation.middlaware";
import {
  CreateTopicBody,
  createTopicBody,
} from "../schemas/create-topic-body.schema";
import { findTopicByIdController, createTopicController } from "..";

const topicRouter = Router();

/**
 * @swagger
 * /topics/{id}:
 *   get:
 *     summary: Retrieve a single topic by ID
 *     tags: [Topics]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the topic to retrieve
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "f7b1b3b4-4b3b-4b3b-4b3b-4b3b4b3b4b3b"
 *     responses:
 *       200:
 *         description: A single topic object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "123e4567-e89b-12d3-a456-426614174000"
 *                 name:
 *                   type: string
 *                   example: Introduction to Design Patterns
 *                 content:
 *                   type: string
 *                   example: This topic covers the basics of various design patterns.
 *                 parentTopicId:
 *                   type: string
 *                   nullable: true
 *                   example: "f7b1b3b4-4b3b-4b3b-4b3b-4b3b4b3b4b3b"
 *                 subtopics:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["Content of subtopic 1", "Content of subtopic 2"]
 *       404:
 *         description: Topic not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Topic not found"
 *                 details:
 *                   type: object
 *                   properties:
 *                     topicId:
 *                       type: string
 *                       example: "non-existent-id"
 */

topicRouter.get(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const topicId = req.params.id;
      const topic = await findTopicByIdController.handle(topicId);
      res.status(200).json(topic);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * tags:
 *   name: Topics
 *   description: API for managing topics
 */

/**
 * @swagger
 * /topics:
 *   post:
 *     summary: Create a new topic
 *     tags: [Topics]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - content
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the topic.
 *                 example: Introduction to Design Patterns
 *               content:
 *                 type: string
 *                 description: The content of the topic.
 *                 example: This topic covers the basics of various design patterns.
 *               parentTopicId:
 *                 type: string
 *                 description: The ID of a parent topic
 *                 example: "f7b1b3b4-4b3b-4b3b-4b3b-4b3b4b3b4b3b"
 *     responses:
 *       201:
 *         description: Topic created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "123e4567-e89b-12d3-a456-426614174000"
 *                 name:
 *                   type: string
 *                   example: Introduction to Design Patterns
 *                 content:
 *                   type: string
 *                   example: This topic covers the basics of various design patterns.
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-10-27T10:00:00Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-10-27T10:00:00Z"
 *                 version:
 *                   type: number
 *                   example: 1
 *       400:
 *         description: Invalid input.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Name is required"
 */

topicRouter.post(
  "/",
  validate(createTopicBody),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await createTopicController.handle(req.body as CreateTopicBody);
      res.status(201).send();
    } catch (error) {
      next(error);
    }
  }
);

export default topicRouter;
