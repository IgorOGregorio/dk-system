import { CreateTopicDto } from "../dtos/create-topic.dto";
import { Topic, TopicFactory } from "../models/topic.model";
import { ITopicRepository } from "../repositories/itopic.repository";

export class CreateTopicService {
  constructor(private topicRepository: ITopicRepository) {}

  async execute(createTopicDto: CreateTopicDto): Promise<Topic> {
    const topic = TopicFactory.create(createTopicDto);

    await this.topicRepository.create(topic);

    return topic;
  }
}
