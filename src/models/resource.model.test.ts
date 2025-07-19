import { Resource, ResourceFactory } from "./resource.model";

describe("Resource Model", () => {
  it("should create a resource with the correct properties", () => {
    const resource = new Resource({
      id: "1",
      topicId: "topic-1",
      url: "https://example.com",
      description: "An example resource",
      type: "article",
    });

    expect(resource.id).toBe("1");
    expect(resource.topicId).toBe("topic-1");
    expect(resource.url).toBe("https://example.com");
    expect(resource.description).toBe("An example resource");
    expect(resource.type).toBe("article");
    expect(resource.createdAt).toBeInstanceOf(Date);
    expect(resource.updatedAt).toBeInstanceOf(Date);
  });
});

describe("ResourceFactory", () => {
  it("should create a new resource with a random id if not provided", () => {
    const resource = ResourceFactory.create({
      topicId: "topic-1",
      url: "https://example.com",
      description: "An example resource",
      type: "article",
    });

    expect(resource).toBeInstanceOf(Resource);
    expect(resource.id).toEqual(expect.any(String));
  });

  it("should create a new resource with the provided id", () => {
    const resource = ResourceFactory.create(
      {
        topicId: "topic-1",
        url: "https://example.com",
        description: "An example resource",
        type: "article",
      },
      "custom-id"
    );

    expect(resource).toBeInstanceOf(Resource);
    expect(resource.id).toBe("custom-id");
  });
});