// --- Composite Pattern (Topic Hierarchy) ---

import { randomUUID } from "node:crypto";

export interface TopicComponent {
  id: string;
  name: string;
  display(indent?: string): void;
  get allContent(): string;
}

// --- Topic Model ---

export class Topic implements TopicComponent {
  id: string;
  name: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  version: number;
  parentTopicId?: string;
  private subTopics: TopicComponent[] = [];

  constructor(props: {
    id: string;
    name: string;
    content: string;
    createdAt?: Date;
    updatedAt?: Date;
    version?: number;
    parentTopicId?: string;
  }) {
    this.id = props.id;
    this.name = props.name;
    this.content = props.content;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
    this.version = props.version || 1;
    this.parentTopicId = props.parentTopicId;
  }

  // --- Composite Methods ---
  add(topic: TopicComponent): void {
    this.subTopics.push(topic);
  }

  remove(topic: TopicComponent): void {
    const index = this.subTopics.findIndex((t) => t.id === topic.id);
    if (index !== -1) {
      this.subTopics.splice(index, 1);
    }
  }

  display(indent: string = "") {
    console.log(`${indent}- ${this.name} (v${this.version})`);
    this.subTopics.forEach((topic) => topic.display(indent + "  "));
  }

  get allContent(): string {
    let combinedContent = this.content;
    for (const topic of this.subTopics) {
      combinedContent += "\n" + topic.allContent;
    }
    return combinedContent;
  }

  getSubTopics(): TopicComponent[] {
    return this.subTopics;
  }
}

// --- Factory Pattern (Topic Creation) ---

export class TopicFactory {
  static create(
    props: {
      name: string;
      content: string;
      parentTopicId?: string;
    },
    id?: string
  ): Topic {
    return new Topic({ id: id ?? randomUUID(), ...props });
  }

  static createVersion(originalTopic: Topic, updatedContent: string): Topic {
    const newVersion = originalTopic.version + 1;
    return new Topic({
      ...originalTopic,
      content: updatedContent,
      version: newVersion,
      updatedAt: new Date(),
    });
  }
}
