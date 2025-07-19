import { CreateTopicService } from "./create-topic.service";
import { Topic } from "../models/topic.model";
import { ITopicRepository } from "../repositories/itopic.repository";
import { CreateTopicDto } from "../dtos/create-topic.dto";

describe("CreateTopicService", () => {
  let topicRepositoryMock: jest.Mocked<ITopicRepository>;
  let createTopicService: CreateTopicService;

  beforeEach(() => {
    topicRepositoryMock = {
      create: jest.fn(),
      findById: jest.fn(),
      findManyByIds: jest.fn(),
      findManyByParentTopicId: jest.fn(),
    } as unknown as jest.Mocked<ITopicRepository>;
    createTopicService = new CreateTopicService(topicRepositoryMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create a topic successfully and return it", async () => {
    const topicDto: CreateTopicDto = {
      name: "Test Topic",
      content: "This is a test topic.",
    };

    topicRepositoryMock.create.mockResolvedValue(undefined);

    const result = await createTopicService.execute(topicDto);

    expect(topicRepositoryMock.create).toHaveBeenCalledTimes(1);
    expect(topicRepositoryMock.create).toHaveBeenCalledWith(expect.any(Topic));

    const createdTopic = topicRepositoryMock.create.mock.calls[0][0] as Topic;
    expect(createdTopic.name).toBe(topicDto.name);
    expect(createdTopic.content).toBe(topicDto.content);

    expect(result).toBeInstanceOf(Topic);
    expect(result.name).toBe(topicDto.name);
    expect(result.content).toBe(topicDto.content);
  });
});