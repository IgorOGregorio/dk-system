import { FindTopicByIdController } from "./find-topic-by-id.controller";
import { FindTopicByIdService } from "../services/find-topic-by-id.service";
import { Topic, TopicFactory } from "../models/topic.model";
import { randomUUID } from "node:crypto";
import { TopicNotFoundError } from "../errors/domain.error";

describe("FindTopicByIdController", () => {
  let findTopicByIdServiceMock: jest.Mocked<FindTopicByIdService>;
  let findTopicByIdController: FindTopicByIdController;

  beforeEach(() => {
    findTopicByIdServiceMock = {
      execute: jest.fn(),
    } as any;
    findTopicByIdController = new FindTopicByIdController(
      findTopicByIdServiceMock
    );
  });

  it("should return a topic when found", async () => {
    const topicId = randomUUID();
    const topic = TopicFactory.create(
      {
        name: "Test Topic",
        content: "This is a test topic.",
      },
      topicId
    );

    findTopicByIdServiceMock.execute.mockResolvedValue(topic);

    const result = await findTopicByIdController.handle(topicId);

    expect(result).toEqual(topic);
    expect(findTopicByIdServiceMock.execute).toHaveBeenCalledWith(topicId);
    expect(findTopicByIdServiceMock.execute).toHaveBeenCalledTimes(1);
  });

  it("should throw TopicNotFoundError if topic is not found", async () => {
    const topicId = randomUUID();
    const error = new TopicNotFoundError(topicId);
    findTopicByIdServiceMock.execute.mockRejectedValue(error);

    await expect(findTopicByIdController.handle(topicId)).rejects.toThrow(
      error
    );
    expect(findTopicByIdServiceMock.execute).toHaveBeenCalledWith(topicId);
    expect(findTopicByIdServiceMock.execute).toHaveBeenCalledTimes(1);
  });
});

