import { Topic, TopicFactory } from "../models/topic.model";
import { ITopicRepository } from "../repositories/itopic.repository";

type TopicTable = {
  id: string;
  name: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  version: string;
  parentTopicId?: string;
};

const topics: TopicTable[] = [];

export class InMemoryTopicPersistence implements ITopicRepository {
  constructor() {
    topics.push({
      id: "f7b1b3b4-4b3b-4b3b-4b3b-4b3b4b3b4b3b",
      name: "Introduction to Design Patterns",
      content: "This topic covers the basics of various design patterns.",
      createdAt: new Date(),
      updatedAt: new Date(),
      version: "1",
      parentTopicId: undefined,
    });
  }

  async create(topic: Topic): Promise<void> {
    topics.push({
      id: topic.id,
      name: topic.name,
      content: topic.content,
      createdAt: topic.createdAt,
      updatedAt: topic.updatedAt,
      version: topic.version,
      parentTopicId: topic.parentTopicId ?? undefined,
    });
  }

  async findById(id: string): Promise<Topic | null> {
    const topic = topics.find((topic) => topic.id === id);
    if (!topic) return null;
    return TopicFactory.create(topic);
  }

  async findAll(): Promise<Topic[]> {
    return topics.map((topic) => TopicFactory.create(topic));
  }

  async findAllSubtopics(parentTopicId: string): Promise<Topic[]> {
    const subtopics = topics.filter((topic) => {
      return topic.parentTopicId === parentTopicId;
    });

    if (subtopics.length === 0) return [];

    return subtopics.map((topic: TopicTable) => TopicFactory.create(topic));
  }

  async update(topic: Topic): Promise<void> {
    const index = topics.findIndex((t) => t.id === topic.id);
    if (index > -1) {
      topics[index] = topic;
    }
  }

  async delete(id: string): Promise<void> {}
}
