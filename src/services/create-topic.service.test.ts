import { CreateTopicService } from "./create-topic.service";
import { Topic, TopicFactory } from "../models/topic.model";
import { randomUUID } from "node:crypto";
import { TopicNotFoundError } from "../errors/domain.error";
import { ITopicRepository } from "../repositories/itopic.repository";

describe("CreateTopicService", () => {
  let topicRepositoryMock: jest.Mocked<ITopicRepository>;
  let createTopicService: CreateTopicService;

  beforeEach(() => {
    topicRepositoryMock = {
      create: jest.fn(),
      findById: jest.fn(),
    } as unknown as jest.Mocked<ITopicRepository>;
    createTopicService = new CreateTopicService(topicRepositoryMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create a topic successfully without a parent", async () => {
    const topicProps = {
      name: "Test Topic",
      content: "This is a test topic.",
    };

    // Mock the create method to resolve successfully
    topicRepositoryMock.create.mockResolvedValue(undefined);

    await createTopicService.execute(topicProps);

    // Verify that the create method was called
    expect(topicRepositoryMock.create).toHaveBeenCalledTimes(1);
    // Verify that it was called with a Topic instance
    expect(topicRepositoryMock.create).toHaveBeenCalledWith(expect.any(Topic));
    // Optionally, check the properties of the topic passed to create
    const createdTopic = topicRepositoryMock.create.mock.calls[0][0] as Topic;
    expect(createdTopic.name).toBe(topicProps.name);
    expect(createdTopic.content).toBe(topicProps.content);
  });

  it("should create a topic successfully with a parent", async () => {
    const parentTopic = TopicFactory.create(
      {
        name: "Parent Topic",
        content: "This is the parent topic.",
      },
      randomUUID()
    );

    const topicProps = {
      name: "Child Topic",
      content: "This is a child topic.",
      parentTopicId: parentTopic.id,
    };

    // Mock findById to return the parent topic
    topicRepositoryMock.findById.mockResolvedValue(parentTopic);
    // Mock create to resolve successfully
    topicRepositoryMock.create.mockResolvedValue(undefined);

    await createTopicService.execute(topicProps);

    // Verify findById was called
    expect(topicRepositoryMock.findById).toHaveBeenCalledTimes(1);
    expect(topicRepositoryMock.findById).toHaveBeenCalledWith(parentTopic.id);

    // Verify create was called
    expect(topicRepositoryMock.create).toHaveBeenCalledTimes(1);
    const createdTopic = topicRepositoryMock.create.mock.calls[0][0] as Topic;
    expect(createdTopic.name).toBe(topicProps.name);
    expect(createdTopic.parentTopicId).toBe(parentTopic.id);
  });

  it("should throw an TopicNotFoundError if parent topic is not found", async () => {
    const topicProps = {
      name: "Child Topic",
      content: "This is a child topic.",
      parentTopicId: "non-existent-id",
    };

    // Mock findById to return null
    topicRepositoryMock.findById.mockResolvedValue(null);

    await expect(createTopicService.execute(topicProps)).rejects.toThrow(
      new TopicNotFoundError(topicProps.parentTopicId)
    );

    // Verify findById was called
    expect(topicRepositoryMock.findById).toHaveBeenCalledTimes(1);
    expect(topicRepositoryMock.findById).toHaveBeenCalledWith(
      "non-existent-id"
    );
    // Verify create was NOT called
    expect(topicRepositoryMock.create).not.toHaveBeenCalled();
  });
});
