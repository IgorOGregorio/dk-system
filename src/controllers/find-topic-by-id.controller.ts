import { FindTopicByIdService } from "../services/find-topic-by-id.service";
import { Topic } from "../models/topic.model";

export class FindTopicByIdController {
  constructor(private readonly findTopicByIdService: FindTopicByIdService) {}

  async handle(topicId: string): Promise<Topic> {
    return await this.findTopicByIdService.execute(topicId);
  }
}
