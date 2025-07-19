// --- Composite Pattern (Topic Hierarchy) ---

import { randomUUID } from "node:crypto";

export interface TopicComponent {
  id: string;
  name: string;
  version: string;
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
  version: string;
  parentTopicId?: string;
  private subTopics: Topic[] = [];

  constructor(props: {
    id: string;
    name: string;
    content: string;
    createdAt?: Date;
    updatedAt?: Date;
    version?: string;
    parentTopicId?: string;
  }) {
    this.id = props.id;
    this.name = props.name;
    this.content = props.content;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
    this.version = props.version || "1";
    this.parentTopicId = props.parentTopicId;
  }

  // --- Composite Methods ---
  add(topic: Topic): void {
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

  getSubTopics(): Topic[] {
    return this.subTopics;
  }
}

// --- Factory Pattern (Topic Creation) ---

export class TopicFactory {
  static create(
    props: {
      name: string;
      content: string;
    },
    id?: string
  ): Topic {
    return new Topic({ id: id ?? randomUUID(), ...props });
  }

  static createVersion(
    originalTopic: Topic,
    updatedData: {
      name: string;
      content: string;
    }
  ): Topic {
    const subTopics = originalTopic.getSubTopics();
    let newVersion: string;

    if (subTopics.length > 0) {
      const lastSubtopic = subTopics[subTopics.length - 1];
      const lastVersionString = lastSubtopic.version;
      const versionParts = lastVersionString.split(".");
      const lastPart = parseInt(versionParts[versionParts.length - 1], 10);
      versionParts[versionParts.length - 1] = (lastPart + 1).toString();
      newVersion = versionParts.join(".");
    } else {
      newVersion = `${originalTopic.version}.1`;
    }

    const newTopic = new Topic({
      id: randomUUID(),
      ...updatedData,
      parentTopicId: originalTopic.id,
      version: newVersion,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    originalTopic.add(newTopic);
    return newTopic;
  }
}
