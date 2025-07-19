import {
  TopicHasSubtopicsError,
  TopicNotFoundError,
} from "../errors/domain.error";
import { TopicFactory } from "../models/topic.model";
import { ITopicRepository } from "../repositories/itopic.repository";
import { DeleteTopicService } from "./delete-topic.service";
import { FindSubtopicsRecursiveService } from "./find-subtopics-recursive.service";

describe("DeleteTopicService", () => {
  let topicRepository: jest.Mocked<ITopicRepository>;
  let findSubtopicsRecursiveService: jest.Mocked<FindSubtopicsRecursiveService>;
  let deleteTopicService: DeleteTopicService;

  beforeEach(() => {
    topicRepository = {
      findById: jest.fn(),
      delete: jest.fn(),
    } as any;
    findSubtopicsRecursiveService = {
      execute: jest.fn(),
    } as any;
    deleteTopicService = new DeleteTopicService(
      topicRepository,
      findSubtopicsRecursiveService
    );
  });

  it("should delete a topic successfully if it has no subtopics", async () => {
    const topic = TopicFactory.create({ name: "Topic", content: "Content" });
    topicRepository.findById.mockResolvedValue(topic);
    findSubtopicsRecursiveService.execute.mockResolvedValue(); // No subtopics

    await deleteTopicService.execute(topic.id);

    expect(topicRepository.delete).toHaveBeenCalledWith(topic.id);
  });

  it("should throw TopicNotFoundError if the topic is not found", async () => {
    topicRepository.findById.mockResolvedValue(null);

    await expect(deleteTopicService.execute("non-existent-id")).rejects.toThrow(
      TopicNotFoundError
    );
  });

  it("should throw TopicHasSubtopicsError if the topic has subtopics", async () => {
    const rootTopic = TopicFactory.create({ name: "Root", content: "..." });
    TopicFactory.createVersion(rootTopic, {
      name: "Sub",
      content: "...",
    });

    topicRepository.findById.mockResolvedValue(rootTopic);
    findSubtopicsRecursiveService.execute.mockResolvedValue();

    await expect(deleteTopicService.execute(rootTopic.id)).rejects.toThrow(
      TopicHasSubtopicsError
    );
  });
});
