import { Topic } from "../models/topic.model";
import { FindTopicByVersionService } from "../services/find-topic-by-version.service";

export class FindTopicByVersionController {
  constructor(
    private readonly findTopicByVersionService: FindTopicByVersionService
  ) {}

  async handle(topicId: string, version: string): Promise<Topic> {
    if (version === "1.0") version = "1";
    return await this.findTopicByVersionService.execute(topicId, version);
  }
}
