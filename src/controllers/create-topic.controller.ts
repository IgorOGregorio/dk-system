import { CreateTopicDto } from "../dtos/create-topic.dto";
import { Topic } from "../models/topic.model";
import { CreateTopicService } from "../services/create-topic.service";
export class CreateTopicController {
  constructor(private createTopicService: CreateTopicService) {}

  async handle(createTopicDto: CreateTopicDto): Promise<Topic> {
    return await this.createTopicService.execute(createTopicDto);
  }
}
