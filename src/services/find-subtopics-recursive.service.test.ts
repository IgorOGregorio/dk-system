import { FindSubtopicsRecursiveService } from "./find-subtopics-recursive.service";
import { ITopicRepository } from "../repositories/itopic.repository";
import { Topic, TopicFactory } from "../models/topic.model";

describe("FindSubtopicsRecursiveService", () => {
  let topicRepositoryMock: jest.Mocked<ITopicRepository>;
  let findSubtopicsRecursiveService: FindSubtopicsRecursiveService;

  beforeEach(() => {
    topicRepositoryMock = {
      findAllSubtopics: jest.fn(),
    } as any;
    findSubtopicsRecursiveService = new FindSubtopicsRecursiveService(
      topicRepositoryMock
    );
  });

  it("should recursively find and add all subtopics to the root topic", async () => {
    // 1. Arrange
    const rootTopic = TopicFactory.create(
      { name: "Root", content: "" },
      "root-id"
    );
    const child1 = TopicFactory.create(
      { name: "Child 1", content: "", parentTopicId: "root-id" },
      "child1-id"
    );
    const child2 = TopicFactory.create(
      { name: "Child 2", content: "", parentTopicId: "root-id" },
      "child2-id"
    );
    const grandchild1 = TopicFactory.create(
      { name: "Grandchild 1", content: "", parentTopicId: "child1-id" },
      "grandchild1-id"
    );

    // Mock the repository calls
    topicRepositoryMock.findAllSubtopics
      .mockResolvedValueOnce([child1, child2]) // For root-id
      .mockResolvedValueOnce([grandchild1]) // For child1-id
      .mockResolvedValueOnce([]) // For child2-id
      .mockResolvedValueOnce([]); // For grandchild1-id

    // 2. Act
    await findSubtopicsRecursiveService.execute(rootTopic);

    // 3. Assert
    expect(topicRepositoryMock.findAllSubtopics).toHaveBeenCalledWith(
      "root-id"
    );
    expect(topicRepositoryMock.findAllSubtopics).toHaveBeenCalledWith(
      "child1-id"
    );
    expect(topicRepositoryMock.findAllSubtopics).toHaveBeenCalledWith(
      "child2-id"
    );
    expect(topicRepositoryMock.findAllSubtopics).toHaveBeenCalledWith(
      "grandchild1-id"
    );
    expect(topicRepositoryMock.findAllSubtopics).toHaveBeenCalledTimes(4);

    const rootSubtopics = rootTopic.getSubTopics() as Topic[];
    expect(rootSubtopics).toHaveLength(2);
    expect(rootSubtopics[0].id).toBe("child1-id");
    expect(rootSubtopics[1].id).toBe("child2-id");

    const child1Subtopics = rootSubtopics[0].getSubTopics() as Topic[];
    expect(child1Subtopics).toHaveLength(1);
    expect(child1Subtopics[0].id).toBe("grandchild1-id");

    const child2Subtopics = rootSubtopics[1].getSubTopics();
    expect(child2Subtopics).toHaveLength(0);

    const grandchild1Subtopics = child1Subtopics[0].getSubTopics();
    expect(grandchild1Subtopics).toHaveLength(0);
  });

  it("should do nothing if a topic has no subtopics", async () => {
    // 1. Arrange
    const topic = TopicFactory.create({ name: "Leaf", content: "" }, "leaf-id");
    topicRepositoryMock.findAllSubtopics.mockResolvedValue([]);

    // 2. Act
    await findSubtopicsRecursiveService.execute(topic);

    // 3. Assert
    expect(topicRepositoryMock.findAllSubtopics).toHaveBeenCalledWith(
      "leaf-id"
    );
    expect(topicRepositoryMock.findAllSubtopics).toHaveBeenCalledTimes(1);
    expect(topic.getSubTopics()).toHaveLength(0);
  });
});
