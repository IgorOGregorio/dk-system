import { Topic } from "../models/topic.model";
import { ITopicRepository } from "../repositories/itopic.repository";

export class FindSubtopicsRecursiveService {
  constructor(private readonly topicRepository: ITopicRepository) {}

  async execute(topic: Topic): Promise<void> {
    const subtopics = await this.topicRepository.findAllSubtopics(topic.id);

    if (subtopics.length > 0) {
      for (const subtopic of subtopics) {
        topic.add(subtopic);
      }

      await Promise.all(subtopics.map((subtopic) => this.execute(subtopic)));
    }
  }
}
