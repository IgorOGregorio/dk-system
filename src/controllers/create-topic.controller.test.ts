import { CreateTopicController } from "./create-topic.controller";
import { CreateTopicService } from "../services/create-topic.service";
import { CreateTopicDto } from "../dtos/create-topic.dto";
import { TopicNotFoundError } from "../errors/domain.error";
import { Topic, TopicFactory } from "../models/topic.model";

describe("CreateTopicController", () => {
  let createTopicServiceMock: jest.Mocked<CreateTopicService>;
  let createTopicController: CreateTopicController;

  beforeEach(() => {
    createTopicServiceMock = {
      execute: jest.fn(),
    } as any;
    createTopicController = new CreateTopicController(createTopicServiceMock);
  });

  it("should call the service and return the created topic", async () => {
    const topicDto: CreateTopicDto = {
      name: "Test Topic",
      content: "This is some test content.",
    };
    const expectedTopic = TopicFactory.create(topicDto);

    createTopicServiceMock.execute.mockResolvedValue(expectedTopic);

    const result = await createTopicController.handle(topicDto);

    expect(createTopicServiceMock.execute).toHaveBeenCalledTimes(1);
    expect(createTopicServiceMock.execute).toHaveBeenCalledWith(topicDto);
    expect(result).toBe(expectedTopic);
    expect(result.name).toBe(topicDto.name);
  });

  it("should propagate errors from the service", async () => {
    const topicDto: CreateTopicDto = {
      name: "Error Topic",
      content: "This should fail.",
    };

    const expectedError = new TopicNotFoundError("some-id");

    createTopicServiceMock.execute.mockRejectedValue(expectedError);

    await expect(createTopicController.handle(topicDto)).rejects.toThrow(
      expectedError
    );
  });
});