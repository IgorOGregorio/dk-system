import {
  TopicHasSubtopicsError,
  TopicNotFoundError,
} from "../errors/domain.error";
import { ITopicRepository } from "../repositories/itopic.repository";
import { FindSubtopicsRecursiveService } from "./find-subtopics-recursive.service";

export class DeleteTopicService {
  constructor(
    private readonly topicRepository: ITopicRepository,
    private readonly findSubtopicsRecursiveService: FindSubtopicsRecursiveService
  ) {}

  async execute(id: string): Promise<void> {
    const topic = await this.topicRepository.findById(id);

    if (!topic) {
      throw new TopicNotFoundError(id);
    }

    await this.findSubtopicsRecursiveService.execute(topic);

    if (topic.getSubTopics().length > 0) {
      throw new TopicHasSubtopicsError(id);
    }

    await this.topicRepository.delete(id);
  }
}
