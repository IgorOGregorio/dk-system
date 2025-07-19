import { topicRepository } from "..";
import { CreateTopicBody } from "../schemas/create-topic-body.schema";
import { CreateTopicService } from "../services/create-topic.service";
export class CreateTopicController {
  constructor(private createTopicService: CreateTopicService) {}

  async handle(createTopicBody: CreateTopicBody): Promise<void> {
    await this.createTopicService.execute(createTopicBody);
  }
}


