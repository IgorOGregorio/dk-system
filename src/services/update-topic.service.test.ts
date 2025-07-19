import { TopicNotFoundError } from "../errors/domain.error";
import { Topic, TopicFactory } from "../models/topic.model";
import { ITopicRepository } from "../repositories/itopic.repository";
import { FindSubtopicsRecursiveService } from "./find-subtopics-recursive.service";
import { UpdateTopicService } from "./update-topic.service";

describe("UpdateTopicService", () => {
  let topicRepository: ITopicRepository;
  let updateTopicService: UpdateTopicService;

  beforeEach(() => {
    topicRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      findAllSubtopics: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<ITopicRepository>;
    const findSubtopicsRecursiveService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<FindSubtopicsRecursiveService>;

    updateTopicService = new UpdateTopicService(
      topicRepository,
      findSubtopicsRecursiveService
    );
  });

  it("should throw TopicNotFoundError if topic is not found", async () => {
    const id = "1";
    const updateTopicProps = {
      name: "New Name",
      content: "New Content",
    };

    (topicRepository.findById as jest.Mock).mockResolvedValue(null);

    await expect(
      updateTopicService.execute(id, updateTopicProps)
    ).rejects.toThrow(new TopicNotFoundError(id));
  });

  it("should create a new version of the topic and save it", async () => {
    const id = "1";
    const updateTopicProps = {
      name: "New Name",
      content: "New Content",
    };
    const topic = TopicFactory.create({
      name: "Original Name",
      content: "Original Content",
    });

    (topicRepository.findById as jest.Mock).mockResolvedValue(topic);

    const newTopic = await updateTopicService.execute(id, updateTopicProps);

    console.log(topic);
    console.log(newTopic);

    expect(topicRepository.create).toHaveBeenCalledWith(newTopic);
    expect(newTopic.name).toBe(updateTopicProps.name);
    expect(newTopic.content).toBe(updateTopicProps.content);
    expect(newTopic.parentTopicId).toBe(topic.parentTopicId);
    expect(newTopic.version).toBe(topic.version + 1);
  });

  it("should update the parentTopicId", async () => {
    const id = "1";
    const updateTopicProps = {
      name: "New Name",
      content: "New Content",
      parentTopicId: "2",
    };
    const topic = TopicFactory.create({
      name: "Original Name",
      content: "Original Content",
    });
    const parentTopic = TopicFactory.create({
      name: "Parent Topic",
      content: "Parent Content",
    });

    (topicRepository.findById as jest.Mock)
      .mockResolvedValueOnce(topic)
      .mockResolvedValueOnce(parentTopic);

    const newTopic = await updateTopicService.execute(id, updateTopicProps);

    expect(topicRepository.create).toHaveBeenCalledWith(newTopic);
    expect(newTopic.name).toBe(updateTopicProps.name);
    expect(newTopic.content).toBe(updateTopicProps.content);
    expect(newTopic.parentTopicId).toBe(updateTopicProps.parentTopicId);
    expect(newTopic.version).toBe(topic.version + 1);
  });

  it("should throw TopicNotFoundError if parent topic is not found", async () => {
    const id = "1";
    const updateTopicProps = {
      name: "New Name",
      content: "New Content",
      parentTopicId: "2",
    };
    const topic = TopicFactory.create({
      name: "Original Name",
      content: "Original Content",
    });

    (topicRepository.findById as jest.Mock)
      .mockResolvedValueOnce(topic)
      .mockResolvedValueOnce(null);

    await expect(
      updateTopicService.execute(id, updateTopicProps)
    ).rejects.toThrow(new TopicNotFoundError(updateTopicProps.parentTopicId));
  });
});
