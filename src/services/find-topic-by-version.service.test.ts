import { TopicVersionNotFoundError } from "../errors/domain.error";
import { TopicFactory } from "../models/topic.model";
import { ITopicRepository } from "../repositories/itopic.repository";
import { FindSubtopicsRecursiveService } from "./find-subtopics-recursive.service";
import { FindTopicByVersionService } from "./find-topic-by-version.service";

describe("FindTopicByVersionService", () => {
  let topicRepository: jest.Mocked<ITopicRepository>;
  let findSubtopicsRecursiveService: jest.Mocked<FindSubtopicsRecursiveService>;
  let findTopicByVersionService: FindTopicByVersionService;

  beforeEach(() => {
    topicRepository = {
      findById: jest.fn(),
    } as any;
    findSubtopicsRecursiveService = {
      execute: jest.fn(),
    } as any;
    findTopicByVersionService = new FindTopicByVersionService(
      topicRepository,
      findSubtopicsRecursiveService
    );
  });

  it("should return the root topic if the version matches", async () => {
    const topic = TopicFactory.create({ name: "Topic", content: "Content" });
    topicRepository.findById.mockResolvedValue(topic);

    const result = await findTopicByVersionService.execute(topic.id, "1");

    expect(result).toBe(topic);
    expect(findSubtopicsRecursiveService.execute).toHaveBeenCalledWith(topic);
  });

  it("should find and return a topic with the specified version in subtopics", async () => {
    const rootTopic = TopicFactory.create({
      name: "Root",
      content: "...",
    });
    const subtopicV1_1 = TopicFactory.createVersion(rootTopic, {
      name: "Sub 1.1",
      content: "...",
    });
    const subtopicV1_2 = TopicFactory.createVersion(rootTopic, {
      name: "Sub 1.2",
      content: "...",
    });

    topicRepository.findById.mockResolvedValue(rootTopic);
    findSubtopicsRecursiveService.execute.mockResolvedValue();

    const result = await findTopicByVersionService.execute(rootTopic.id, "1.2");

    expect(result).toBe(subtopicV1_2);
  });

  it("should find a topic in a nested subtopic tree", async () => {
    const root = TopicFactory.create({
      name: "Root",
      content: "c",
    });
    TopicFactory.createVersion(root, {
      name: "Child1",
      content: "c",
    });
    const child2 = TopicFactory.createVersion(root, {
      name: "Child2",
      content: "c",
    });
    const grandchild = TopicFactory.createVersion(child2, {
      name: "Grandchild",
      content: "c",
    });

    topicRepository.findById.mockResolvedValue(root);
    findSubtopicsRecursiveService.execute.mockResolvedValue();

    const result = await findTopicByVersionService.execute(root.id, "1.2.1");
    expect(result).toBe(grandchild);
  });

  it("should throw TopicNotFoundError if the root topic is not found", async () => {
    topicRepository.findById.mockResolvedValue(null);

    await expect(
      findTopicByVersionService.execute("non-existent-id", "1")
    ).rejects.toThrow("Topic not found");
  });

  it("should throw TopicVersionNotFoundError if version is not found", async () => {
    const topic = TopicFactory.create({ name: "Topic", content: "Content" });
    topicRepository.findById.mockResolvedValue(topic);
    findSubtopicsRecursiveService.execute.mockResolvedValue();

    await expect(
      findTopicByVersionService.execute(topic.id, "2")
    ).rejects.toThrow(new TopicVersionNotFoundError("2"));
  });
});
