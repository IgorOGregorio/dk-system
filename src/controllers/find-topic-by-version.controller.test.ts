import { FindTopicByVersionController } from "./find-topic-by-version.controller";
import { FindTopicByVersionService } from "../services/find-topic-by-version.service";
import { TopicFactory } from "../models/topic.model";
import { TopicVersionNotFoundError } from "../errors/domain.error";

describe("FindTopicByVersionController", () => {
  let findTopicByVersionServiceMock: jest.Mocked<FindTopicByVersionService>;
  let findTopicByVersionController: FindTopicByVersionController;

  beforeEach(() => {
    findTopicByVersionServiceMock = {
      execute: jest.fn(),
    } as any;
    findTopicByVersionController = new FindTopicByVersionController(
      findTopicByVersionServiceMock
    );
  });

  it("should call the service and return the found topic", async () => {
    const topicId = "some-id";
    const version = "1.1";
    const expectedTopic = TopicFactory.create(
      {
        name: "Found Topic",
        content: "This is the content.",
      },
      "found-id"
    );
    expectedTopic.version = version;

    findTopicByVersionServiceMock.execute.mockResolvedValue(expectedTopic);

    const result = await findTopicByVersionController.handle(topicId, version);

    expect(findTopicByVersionServiceMock.execute).toHaveBeenCalledTimes(1);
    expect(findTopicByVersionServiceMock.execute).toHaveBeenCalledWith(
      topicId,
      version
    );
    expect(result).toBe(expectedTopic);
  });

  it("should propagate errors from the service", async () => {
    const topicId = "some-id";
    const version = "non-existent-version";
    const expectedError = new TopicVersionNotFoundError(version);

    findTopicByVersionServiceMock.execute.mockRejectedValue(expectedError);

    await expect(
      findTopicByVersionController.handle(topicId, version)
    ).rejects.toThrow(expectedError);
  });
});
