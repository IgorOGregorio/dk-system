import { CreateTopicService } from "./create-topic.service";
import { InMemoryTopicPersistence } from "../persistence/in-memory-topic.persistence";
import { HttpException } from "../exceptions/http.exception";
import { Topic, TopicFactory } from "../models/topic.model";
import { randomUUID } from "node:crypto";

// Mock the persistence layer
jest.mock("../persistence/in-memory-topic.persistence");

describe("CreateTopicService", () => {
  let topicPersistenceMock: jest.Mocked<InMemoryTopicPersistence>;
  let createTopicService: CreateTopicService;

  beforeEach(() => {
    // Create a mock instance of the persistence layer
    topicPersistenceMock =
      new InMemoryTopicPersistence() as jest.Mocked<InMemoryTopicPersistence>;
    createTopicService = new CreateTopicService(topicPersistenceMock);
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
    topicPersistenceMock.create.mockResolvedValue(undefined);

    await createTopicService.execute(topicProps);

    // Verify that the create method was called
    expect(topicPersistenceMock.create).toHaveBeenCalledTimes(1);
    // Verify that it was called with a Topic instance
    expect(topicPersistenceMock.create).toHaveBeenCalledWith(expect.any(Topic));
    // Optionally, check the properties of the topic passed to create
    const createdTopic = topicPersistenceMock.create.mock.calls[0][0] as Topic;
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
    topicPersistenceMock.findById.mockResolvedValue(parentTopic);
    // Mock create to resolve successfully
    topicPersistenceMock.create.mockResolvedValue(undefined);

    await createTopicService.execute(topicProps);

    // Verify findById was called
    expect(topicPersistenceMock.findById).toHaveBeenCalledTimes(1);
    expect(topicPersistenceMock.findById).toHaveBeenCalledWith(parentTopic.id);

    // Verify create was called
    expect(topicPersistenceMock.create).toHaveBeenCalledTimes(1);
    const createdTopic = topicPersistenceMock.create.mock.calls[0][0] as Topic;
    expect(createdTopic.name).toBe(topicProps.name);
    expect(createdTopic.parentTopicId).toBe(parentTopic.id);
  });

  it("should throw an HttpException if parent topic is not found", async () => {
    const topicProps = {
      name: "Child Topic",
      content: "This is a child topic.",
      parentTopicId: "non-existent-id",
    };

    // Mock findById to return null
    topicPersistenceMock.findById.mockResolvedValue(null);

    await expect(createTopicService.execute(topicProps)).rejects.toThrow(
      HttpException
    );

    // Verify findById was called
    expect(topicPersistenceMock.findById).toHaveBeenCalledTimes(1);
    expect(topicPersistenceMock.findById).toHaveBeenCalledWith(
      "non-existent-id"
    );
    // Verify create was NOT called
    expect(topicPersistenceMock.create).not.toHaveBeenCalled();
  });

  it("should throw an HttpException with correct details when parent topic not found", async () => {
    const topicProps = {
      name: "Child Topic",
      content: "This is a child topic.",
      parentTopicId: "non-existent-id",
    };

    // Mock findById to return null
    topicPersistenceMock.findById.mockResolvedValue(null);

    try {
      await createTopicService.execute(topicProps);
      // Fail test if it doesn't throw
      fail("Expected CreateTopicService.execute to throw, but it did not.");
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      if (error instanceof HttpException) {
        expect(error.status).toBe(404);
        expect(error.message).toBe("Bad Request");
        expect(error.details).toEqual({
          message: "Parent topic not found",
          parentTopicId: "non-existent-id",
          source: "CreateTopicService",
        });
      }
    }
  });
});
