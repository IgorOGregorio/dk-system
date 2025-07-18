import { InMemoryTopicPersistence } from "../persistence/in-memory-topic.persistence";
import { CreateTopicBody } from "../schemas/create-topic-body.schema";
import { CreateTopicService } from "../services/create-topic.service";
class CreateTopicController {
  constructor(private createTopicService: CreateTopicService) {}

  async handle(createTopicBody: CreateTopicBody): Promise<void> {
    await this.createTopicService.execute(createTopicBody);
  }
}

export const createTopicController = new CreateTopicController(
  new CreateTopicService(new InMemoryTopicPersistence())
);
