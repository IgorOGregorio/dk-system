import { randomUUID } from "node:crypto";

export class Resource {
  id: string;
  topicId: string;
  url: string;
  description: string;
  type: "video" | "article" | "pdf";
  createdAt: Date;
  updatedAt: Date;

  constructor(props: {
    id: string;
    topicId: string;
    url: string;
    description: string;
    type: "video" | "article" | "pdf";
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = props.id;
    this.topicId = props.topicId;
    this.url = props.url;
    this.description = props.description;
    this.type = props.type;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }
}

export class ResourceFactory {
  static create(
    props: {
      topicId: string;
      url: string;
      description: string;
      type: "video" | "article" | "pdf";
    },
    id?: string
  ): Resource {
    return new Resource({ id: id ?? randomUUID(), ...props });
  }
}
