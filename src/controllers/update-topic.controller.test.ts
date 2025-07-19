import { UpdateTopicController } from "./update-topic.controller";
import { UpdateTopicService } from "../services/update-topic.service";
import { UpdateTopicDto } from "../dtos/update-topic.dto";
import { Topic, TopicFactory } from "../models/topic.model";
import { TopicNotFoundError } from "../errors/domain.error";

describe("UpdateTopicController", () => {
  let updateTopicServiceMock: jest.Mocked<UpdateTopicService>;
  let updateTopicController: UpdateTopicController;

  beforeEach(() => {
    updateTopicServiceMock = {
      execute: jest.fn(),
    } as any;
    updateTopicController = new UpdateTopicController(updateTopicServiceMock);
  });

  it("should call the service and return the updated topic", async () => {
    const topicId = "some-id";
    const topicDto: UpdateTopicDto = {
      name: "Updated Topic",
      content: "This is some updated content.",
    };
    const expectedTopic = TopicFactory.create(topicDto, topicId);

    updateTopicServiceMock.execute.mockResolvedValue(expectedTopic);

    const result = await updateTopicController.handle(topicId, topicDto);

    expect(updateTopicServiceMock.execute).toHaveBeenCalledTimes(1);
    expect(updateTopicServiceMock.execute).toHaveBeenCalledWith(
      topicId,
      topicDto
    );
    expect(result).toBe(expectedTopic);
    expect(result.name).toBe(topicDto.name);
  });

  it("should propagate errors from the service", async () => {
    const topicId = "non-existent-id";
    const topicDto: UpdateTopicDto = {
      name: "Error Topic",
      content: "This should fail.",
    };

    const expectedError = new TopicNotFoundError(topicId);

    updateTopicServiceMock.execute.mockRejectedValue(expectedError);

    await expect(
      updateTopicController.handle(topicId, topicDto)
    ).rejects.toThrow(expectedError);
  });
});
