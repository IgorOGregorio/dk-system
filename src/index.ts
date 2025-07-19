import { CreateTopicController } from "./controllers/create-topic.controller";
import { FindTopicByIdController } from "./controllers/find-topic-by-id.controller";
import { UpdateTopicController } from "./controllers/update-topic.controller";
import { InMemoryTopicPersistence } from "./persistence/in-memory-topic.persistence";
import { CreateTopicService } from "./services/create-topic.service";
import { FindSubtopicsRecursiveService } from "./services/find-subtopics-recursive.service";
import { FindTopicByIdService } from "./services/find-topic-by-id.service";
import { UpdateTopicService } from "./services/update-topic.service";

//repositories
export const topicRepository = new InMemoryTopicPersistence();

//services
const createTopicService = new CreateTopicService(topicRepository);

const findTopicByIdService = new FindTopicByIdService(topicRepository);

export const findSubtopicsRecursiveService = new FindSubtopicsRecursiveService(
  topicRepository
);

const updateTopicService = new UpdateTopicService(
  topicRepository,
  findSubtopicsRecursiveService
);

//constrollers
export const updateTopicController = new UpdateTopicController(
  updateTopicService
);

export const findTopicByIdController = new FindTopicByIdController(
  findTopicByIdService
);

export const createTopicController = new CreateTopicController(
  createTopicService
);
