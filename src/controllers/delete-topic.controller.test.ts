import { DeleteTopicController } from "./delete-topic.controller";
import { DeleteTopicService } from "../services/delete-topic.service";
import {
  TopicHasSubtopicsError,
  TopicNotFoundError,
} from "../errors/domain.error";

describe("DeleteTopicController", () => {
  let deleteTopicServiceMock: jest.Mocked<DeleteTopicService>;
  let deleteTopicController: DeleteTopicController;

  beforeEach(() => {
    deleteTopicServiceMock = {
      execute: jest.fn(),
    } as any;
    deleteTopicController = new DeleteTopicController(deleteTopicServiceMock);
  });

  it("should call the service to delete the topic", async () => {
    const topicId = "some-id";
    deleteTopicServiceMock.execute.mockResolvedValue();

    await deleteTopicController.handle(topicId);

    expect(deleteTopicServiceMock.execute).toHaveBeenCalledWith(topicId);
    expect(deleteTopicServiceMock.execute).toHaveBeenCalledTimes(1);
  });

  it("should propagate TopicNotFoundError from the service", async () => {
    const topicId = "non-existent-id";
    const expectedError = new TopicNotFoundError(topicId);
    deleteTopicServiceMock.execute.mockRejectedValue(expectedError);

    await expect(deleteTopicController.handle(topicId)).rejects.toThrow(
      expectedError
    );
  });

  it("should propagate TopicHasSubtopicsError from the service", async () => {
    const topicId = "topic-with-subtopics";
    const expectedError = new TopicHasSubtopicsError(topicId);
    deleteTopicServiceMock.execute.mockRejectedValue(expectedError);

    await expect(deleteTopicController.handle(topicId)).rejects.toThrow(
      expectedError
    );
  });
});
