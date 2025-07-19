import { UpdateTopicDto } from "../dtos/update-topic.dto";
import { Topic } from "../models/topic.model";
import { UpdateTopicService } from "../services/update-topic.service";

export class UpdateTopicController {
  constructor(private readonly updateTopicService: UpdateTopicService) {}

  async handle(
    topicId: string,
    updateTopicDto: UpdateTopicDto
  ): Promise<Topic> {
    return await this.updateTopicService.execute(topicId, updateTopicDto);
  }
}
