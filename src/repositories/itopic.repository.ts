import { Topic } from "../models/topic.model";

export interface ITopicRepository {
  create(topic: Topic): Promise<void>;
  findById(id: string): Promise<Topic | null>;
  findAll(): Promise<Topic[]>;
  update(topic: Topic): Promise<void>;
  delete(id: string): Promise<void>;
}
