import { Topic, TopicFactory } from "../models/topic.model";
import { randomUUID } from "node:crypto";
import { TopicNotFoundError } from "../errors/domain.error";
import { ITopicRepository } from "../repositories/itopic.repository";
import { FindTopicByIdService } from "./find-topic-by-id.service";
import { findSubtopicsRecursiveService } from "..";

// Mock the imported service instance
jest.mock("..", () => ({
  findSubtopicsRecursiveService: {
    execute: jest.fn(),
  },
}));

describe("FindTopicByIdService", () => {
  let topicRepositoryMock: jest.Mocked<ITopicRepository>;
  let findTopicByIdService: FindTopicByIdService;
  let findSubtopicsRecursiveServiceMock: jest.Mocked<
    typeof findSubtopicsRecursiveService
  >;

  beforeEach(() => {
    jest.clearAllMocks();

    topicRepositoryMock = {
      findById: jest.fn(),
    } as any;

    findTopicByIdService = new FindTopicByIdService(topicRepositoryMock);
    findSubtopicsRecursiveServiceMock =
      findSubtopicsRecursiveService as jest.Mocked<
        typeof findSubtopicsRecursiveService
      >;
  });

  it("should find a topic and call the recursive service", async () => {
    const topicId = randomUUID();
    const rootTopic = TopicFactory.create(
      {
        name: "Root Topic",
        content: "This is the root topic.",
      },
      topicId
    );

    topicRepositoryMock.findById.mockResolvedValue(rootTopic);
    findSubtopicsRecursiveServiceMock.execute.mockResolvedValue(undefined);

    const result = await findTopicByIdService.execute(topicId);

    expect(topicRepositoryMock.findById).toHaveBeenCalledWith(topicId);
    expect(
      findSubtopicsRecursiveServiceMock.execute
    ).toHaveBeenCalledWith(rootTopic);
    expect(result).toBe(rootTopic);
  });

  it("should throw TopicNotFoundError if topic is not found", async () => {
    const topicId = randomUUID();
    topicRepositoryMock.findById.mockResolvedValue(null);

    await expect(findTopicByIdService.execute(topicId)).rejects.toThrow(
      new TopicNotFoundError(topicId)
    );

    expect(topicRepositoryMock.findById).toHaveBeenCalledWith(topicId);
    expect(findSubtopicsRecursiveServiceMock.execute).not.toHaveBeenCalled();
  });
});
