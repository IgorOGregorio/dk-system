import { findSubtopicsRecursiveService } from "..";
import { TopicNotFoundError } from "../errors/domain.error";
import { Topic } from "../models/topic.model";
import { ITopicRepository } from "../repositories/itopic.repository";

export class FindTopicByIdService {
  constructor(private topicRepository: ITopicRepository) {}

  async execute(topicId: string): Promise<Topic> {
    const topic = await this.topicRepository.findById(topicId);

    if (!topic) {
      throw new TopicNotFoundError(topicId);
    }

    await findSubtopicsRecursiveService.execute(topic);

    return topic;
  }
}
