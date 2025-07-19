import { UpdateTopicDto } from "../dtos/update-topic.dto";
import { TopicNotFoundError } from "../errors/domain.error";
import { Topic, TopicFactory } from "../models/topic.model";
import { ITopicRepository } from "../repositories/itopic.repository";
import { FindSubtopicsRecursiveService } from "./find-subtopics-recursive.service";

export class UpdateTopicService {
  constructor(
    private topicRepository: ITopicRepository,
    private readonly findSubtopicsRecursiveService: FindSubtopicsRecursiveService
  ) {}

  async execute(id: string, updateTopicDto: UpdateTopicDto): Promise<Topic> {
    const topic = await this.topicRepository.findById(id);

    if (!topic) {
      throw new TopicNotFoundError(id);
    }

    await this.findSubtopicsRecursiveService.execute(topic);

    const newTopic = TopicFactory.createVersion(topic, updateTopicDto);

    await this.topicRepository.create(newTopic);

    return newTopic;
  }
}
