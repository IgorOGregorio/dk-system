import { Router, Request, Response, NextFunction } from "express";
import { validate } from "../middlewares/validation.middlaware";
import {
  CreateTopicBody,
  createTopicBody,
} from "../schemas/create-topic-body.schema";
import {
  findTopicByIdController,
  createTopicController,
  updateTopicController,
} from "..";
import { UpdateTopicBodySchema } from "../schemas/update-topic-body.schema";

const topicRouter = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Topic:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "f7b1b3b4-4b3b-4b3b-4b3b-4b3b4b3b4b3b"
 *         name:
 *           type: string
 *           example: "Introduction to TypeScript"
 *         content:
 *           type: string
 *           example: "This topic covers the basics of TypeScript."
 *         parentTopicId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           example: "f7b1b3b4-4b3b-4b3b-4b3b-4b3b4b3b4b3b"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2023-01-01T00:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2023-01-01T00:00:00.000Z"
 *         version:
 *           type: integer
 *           example: 1
 *     NotFoundError:
 *       type: object
 *       properties:
 *         status:
 *           type: number
 *           example: 404
 *         message:
 *           type: string
 *           example: "Topic not found"
 *         details:
 *           type: object
 *           properties:
 *             topicId:
 *               type: string
 *               example: "non-existent-id"
 *     BadRequestError:
 *       type: object
 *       properties:
 *         status:
 *           type: number
 *           example: 400
 *         message:
 *           type: string
 *           example: "Invalid input"
 *         details:
 *           type: object
 *           properties:
 *             topicId:
 *               type: string
 *               example: "non-existent-id"
 *     InternalServerError:
 *       type: object
 *       properties:
 *         status:
 *           type: number
 *           example: 500
 *         message:
 *           type: string
 *           example: "Internal Server Error"
 *         details:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *               example: "any description"
 *
 */

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
 *               $ref: '#/components/schemas/NotFoundError'
 *  */

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
 *               $ref: '#/components/schemas/BadRequestError'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerError'
 *
 */

topicRouter.post(
  "/",
  validate(createTopicBody),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await createTopicController.handle(
        req.body as CreateTopicBody
      );
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /topics/{id}:
 *   put:
 *     summary: Update an existing topic
 *     tags: [Topics]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the topic to update
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "f7b1b3b4-4b3b-4b3b-4b3b-4b3b4b3b4b3b"
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
 *                 description: The new name of the topic.
 *                 example: Advanced Design Patterns
 *               content:
 *                 type: string
 *                 description: The new content of the topic.
 *                 example: This topic delves into advanced design patterns.
 *     responses:
 *       201:
 *         description: Topic updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Topic'
 *       400:
 *         description: Invalid input.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BadRequestError'
 *       404:
 *         description: Topic or parent topic not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerError'
 */
topicRouter.put(
  "/:id",
  validate(UpdateTopicBodySchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const topicId = req.params.id;
      const updateTopicDto = req.body;
      const updatedTopic = await updateTopicController.handle(
        topicId,
        updateTopicDto
      );
      res.status(201).json(updatedTopic);
    } catch (error) {
      next(error);
    }
  }
);

export default topicRouter;
