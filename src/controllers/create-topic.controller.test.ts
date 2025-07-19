import { CreateTopicController } from "./create-topic.controller";
import { CreateTopicService } from "../services/create-topic.service";
import { CreateTopicBody } from "../schemas/create-topic-body.schema";
import { TopicNotFoundError } from "../errors/domain.error";

describe("CreateTopicController", () => {
  let createTopicServiceMock: jest.Mocked<CreateTopicService>;
  let createTopicController: CreateTopicController;

  beforeEach(() => {
    createTopicServiceMock = {
      execute: jest.fn(),
    } as any;
    createTopicController = new CreateTopicController(createTopicServiceMock);
  });

  it("should call the service's execute method with the correct body", async () => {
    const topicBody: CreateTopicBody = {
      name: "Test Topic",
      content: "This is some test content.",
    };

    createTopicServiceMock.execute.mockResolvedValue(undefined);

    await createTopicController.handle(topicBody);

    expect(createTopicServiceMock.execute).toHaveBeenCalledTimes(1);
    expect(createTopicServiceMock.execute).toHaveBeenCalledWith(topicBody);
  });

  it("should propagate errors from the service", async () => {
    const topicBody: CreateTopicBody = {
      name: "Error Topic",
      content: "This should fail.",
      parentTopicId: "non-existent-id",
    };

    const expectedError = new TopicNotFoundError(topicBody.parentTopicId || "");

    createTopicServiceMock.execute.mockRejectedValue(expectedError);

    await expect(createTopicController.handle(topicBody)).rejects.toThrow(
      expectedError
    );
  });
});
