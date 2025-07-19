import { CreateTopicController } from "./controllers/create-topic.controller";
import { DeleteTopicController } from "./controllers/delete-topic.controller";
import { FindTopicByIdController } from "./controllers/find-topic-by-id.controller";
import { FindTopicByVersionController } from "./controllers/find-topic-by-version.controller";
import { UpdateTopicController } from "./controllers/update-topic.controller";
import { InMemoryTopicPersistence } from "./persistence/in-memory-topic.persistence";
import { CreateTopicService } from "./services/create-topic.service";
import { DeleteTopicService } from "./services/delete-topic.service";
import { FindSubtopicsRecursiveService } from "./services/find-subtopics-recursive.service";
import { FindTopicByIdService } from "./services/find-topic-by-id.service";
import { FindTopicByVersionService } from "./services/find-topic-by-version.service";
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

const findTopicByVersionService = new FindTopicByVersionService(
  topicRepository,
  findSubtopicsRecursiveService
);

const deleteTopicService = new DeleteTopicService(
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

export const findTopicByVersionController = new FindTopicByVersionController(
  findTopicByVersionService
);

export const deleteTopicController = new DeleteTopicController(
  deleteTopicService
);

export default topicRepository;
