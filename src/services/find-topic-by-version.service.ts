import { TopicVersionNotFoundError } from "../errors/domain.error";
import { Topic } from "../models/topic.model";
import { ITopicRepository } from "../repositories/itopic.repository";
import { FindSubtopicsRecursiveService } from "./find-subtopics-recursive.service";

export class FindTopicByVersionService {
  constructor(
    private readonly topicRepository: ITopicRepository,
    private readonly findSubtopicsRecursiveService: FindSubtopicsRecursiveService
  ) {}

  async execute(id: string, version: string): Promise<Topic> {
    const topic = await this.topicRepository.findById(id);

    if (!topic) {
      throw new Error("Topic not found");
    }

    await this.findSubtopicsRecursiveService.execute(topic);

    if (topic.version !== version) {
      return this.findVersionInSubtopicsTree(topic, version);
    }

    return topic;
  }

  private findVersionInSubtopicsTree(topic: Topic, version: string): Topic {
    for (const subtopic of topic.getSubTopics()) {
      if (subtopic.version === version) {
        return subtopic;
      }
      try {
        // Attempt to find the version in the sub-tree
        return this.findVersionInSubtopicsTree(subtopic, version);
      } catch (error) {
        // If not found, continue to the next subtopic
        if (!(error instanceof TopicVersionNotFoundError)) {
          throw error; // Re-throw unexpected errors
        }
      }
    }
    // If the loop completes without finding the version, throw an error
    throw new TopicVersionNotFoundError(version);
  }
}
