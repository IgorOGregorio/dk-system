import { CreateTopicController } from "./controllers/create-topic.controller";
import { FindTopicByIdController } from "./controllers/find-topic-by-id.controller";
import { InMemoryTopicPersistence } from "./persistence/in-memory-topic.persistence";
import { CreateTopicService } from "./services/create-topic.service";
import { FindSubtopicsRecursiveService } from "./services/find-subtopics-recursive.service";
import { FindTopicByIdService } from "./services/find-topic-by-id.service";

export const topicRepository = new InMemoryTopicPersistence();

export const findSubtopicsRecursiveService = new FindSubtopicsRecursiveService(
  topicRepository
);

const findTopicByIdService = new FindTopicByIdService(topicRepository);
export const findTopicByIdController = new FindTopicByIdController(
  findTopicByIdService
);

const createTopicService = new CreateTopicService(topicRepository);
export const createTopicController = new CreateTopicController(
  createTopicService
);
