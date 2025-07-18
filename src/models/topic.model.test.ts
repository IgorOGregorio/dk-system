import { Topic, TopicFactory, TopicComponent } from "./topic.model";

describe("Topic Model", () => {
  it("should create a topic with the correct properties", () => {
    const topic = new Topic({
      id: "1",
      name: "Main Topic",
      content: "This is the main topic.",
    });

    expect(topic.id).toBe("1");
    expect(topic.name).toBe("Main Topic");
    expect(topic.content).toBe("This is the main topic.");
    expect(topic.version).toBe(1);
    expect(topic.createdAt).toBeInstanceOf(Date);
    expect(topic.updatedAt).toBeInstanceOf(Date);
  });

  describe("Composite Pattern", () => {
    let mainTopic: Topic;
    let subTopic1: Topic;
    let subTopic2: Topic;

    beforeEach(() => {
      mainTopic = new Topic({
        id: "1",
        name: "Main Topic",
        content: "Content of the main topic.",
      });
      subTopic1 = new Topic({
        id: "2",
        name: "Sub Topic 1",
        content: "Content of sub topic 1.",
        parentTopicId: "1",
      });
      subTopic2 = new Topic({
        id: "3",
        name: "Sub Topic 2",
        content: "Content of sub topic 2.",
        parentTopicId: "1",
      });

      mainTopic.add(subTopic1);
      mainTopic.add(subTopic2);
    });

    it("should add sub-topics to a topic", () => {
      const subTopics = mainTopic.getSubTopics();
      expect(subTopics).toHaveLength(2);
      expect(subTopics).toContain(subTopic1);
      expect(subTopics).toContain(subTopic2);
    });

    it("should remove a sub-topic from a topic", () => {
      mainTopic.remove(subTopic1);
      const subTopics = mainTopic.getSubTopics();
      expect(subTopics).toHaveLength(1);
      expect(subTopics).not.toContain(subTopic1);
    });

    it("should get all content from topic and its sub-topics", () => {
      const expectedContent =
        "Content of the main topic.\nContent of sub topic 1.\nContent of sub topic 2.";
      expect(mainTopic.allContent).toBe(expectedContent);
    });
  });
});

describe("TopicFactory", () => {
  it("should create a new topic", () => {
    const topic = TopicFactory.create({
      id: "1",
      name: "New Topic",
      content: "Content for the new topic.",
    });

    expect(topic).toBeInstanceOf(Topic);
    expect(topic.name).toBe("New Topic");
    expect(topic.version).toBe(1);
  });

  it("should create a new version of a topic", () => {
    const originalTopic = new Topic({
      id: "1",
      name: "Original Topic",
      content: "Original content.",
    });

    const updatedContent = "Updated content.";
    const newVersionTopic = TopicFactory.createVersion(
      originalTopic,
      updatedContent
    );

    expect(newVersionTopic.id).toBe(originalTopic.id);
    expect(newVersionTopic.name).toBe(originalTopic.name);
    expect(newVersionTopic.content).toBe(updatedContent);
    expect(newVersionTopic.version).toBe(originalTopic.version + 1);
    expect(newVersionTopic.updatedAt).not.toBe(originalTopic.updatedAt);
  });
});
