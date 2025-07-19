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
  findTopicByVersionController,
  deleteTopicController,
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
 *               $ref: '#/components/schemas/Topic'
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
 * /topics/version/{id}/{version}:
 *   get:
 *     summary: Retrieve a specific version of a topic by ID
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
 *       - in: path
 *         name: version
 *         required: true
 *         description: Version of the topic to retrieve
 *         schema:
 *           type: string
 *           example: "1.0"
 *     responses:
 *       200:
 *         description: A single topic object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Topic'
 *       404:
 *         description: Topic with this version not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 *  */
topicRouter.get(
  "/version/:id/:version",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const topicId = req.params.id;
      const version = req.params.version;
      const topic = await findTopicByVersionController.handle(topicId, version);
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
 *         description: A single topic object
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

/**
 * @swagger
 * /topics/{id}:
 *   delete:
 *     summary: Delete a topic by ID
 *     tags: [Topics]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the topic to delete
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "f7b1b3b4-4b3b-4b3b-4b3b-4b3b4b3b4b3b"
 *     responses:
 *       204:
 *         description: Topic deleted successfully.
 *       400:
 *         description: Bad request, e.g., topic has subtopics.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BadRequestError'
 *       404:
 *         description: Topic not found.
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
topicRouter.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const topicId = req.params.id;
      await deleteTopicController.handle(topicId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

export default topicRouter;
