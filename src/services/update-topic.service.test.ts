import { TopicNotFoundError } from "../errors/domain.error";
import { Topic, TopicFactory } from "../models/topic.model";
import { ITopicRepository } from "../repositories/itopic.repository";
import { FindSubtopicsRecursiveService } from "./find-subtopics-recursive.service";
import { UpdateTopicService } from "./update-topic.service";
import { UpdateTopicDto } from "../dtos/update-topic.dto";
import { randomUUID } from "node:crypto";

describe("UpdateTopicService", () => {
  let topicRepository: jest.Mocked<ITopicRepository>;
  let findSubtopicsRecursiveService: jest.Mocked<FindSubtopicsRecursiveService>;
  let updateTopicService: UpdateTopicService;

  beforeEach(() => {
    topicRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findManyByIds: jest.fn(),
      findManyByParentTopicId: jest.fn(),
    } as unknown as jest.Mocked<ITopicRepository>;

    findSubtopicsRecursiveService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<FindSubtopicsRecursiveService>;

    updateTopicService = new UpdateTopicService(
      topicRepository,
      findSubtopicsRecursiveService
    );
  });

  it("should throw TopicNotFoundError if topic is not found", async () => {
    const id = "1";
    const updateTopicDto: UpdateTopicDto = {
      name: "New Name",
      content: "New Content",
    };

    topicRepository.findById.mockResolvedValue(null);

    await expect(
      updateTopicService.execute(id, updateTopicDto)
    ).rejects.toThrow(new TopicNotFoundError(id));
  });

  it("should find subtopics, create a new version, and save it", async () => {
    const id = randomUUID();
    const updateTopicDto: UpdateTopicDto = {
      name: "New Name",
      content: "New Content",
    };
    const topic = TopicFactory.create(
      {
        name: "Original Name",
        content: "Original Content",
      },
      id
    );

    topicRepository.findById.mockResolvedValue(topic);
    findSubtopicsRecursiveService.execute.mockResolvedValue();

    const newTopic = await updateTopicService.execute(id, updateTopicDto);

    expect(topicRepository.findById).toHaveBeenCalledWith(id);
    expect(findSubtopicsRecursiveService.execute).toHaveBeenCalledWith(topic);
    expect(topicRepository.create).toHaveBeenCalledWith(newTopic);

    expect(newTopic.name).toBe(updateTopicDto.name);
    expect(newTopic.content).toBe(updateTopicDto.content);
    expect(newTopic.parentTopicId).toBe(topic.id);
    expect(newTopic.version).toBe(`${topic.version}.1`);
  });
});
