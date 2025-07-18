
import { createTopicController } from "./create-topic.controller";
import { CreateTopicService } from "../services/create-topic.service";
import { CreateTopicBody } from "../schemas/create-topic-body.schema";
import { HttpException } from "../exceptions/http.exception";

// Mock the service dependency
jest.mock("../services/create-topic.service");

describe("CreateTopicController", () => {
  let executeSpy: jest.SpyInstance;

  beforeEach(() => {
    // Spy on the execute method of the CreateTopicService prototype
    executeSpy = jest.spyOn(CreateTopicService.prototype, "execute");
  });

  afterEach(() => {
    // Restore the original method after each test
    executeSpy.mockRestore();
  });

  it("should be defined", () => {
    expect(createTopicController).toBeDefined();
  });

  it("should call the service's execute method with the correct body", async () => {
    const topicBody: CreateTopicBody = {
      name: "Test Topic",
      content: "This is some test content.",
    };

    // Set up the mock to resolve successfully
    executeSpy.mockResolvedValue(undefined);

    await createTopicController.handle(topicBody);

    expect(executeSpy).toHaveBeenCalledTimes(1);
    expect(executeSpy).toHaveBeenCalledWith(topicBody);
  });

  it("should propagate errors from the service", async () => {
    const topicBody: CreateTopicBody = {
      name: "Error Topic",
      content: "This should fail.",
    };

    const expectedError = new HttpException(400, "Bad Request", {
      message: "Invalid input",
    });

    // Set up the mock to reject with a specific error
    executeSpy.mockRejectedValue(expectedError);

    // Expect the controller's handle method to reject with the same error
    await expect(createTopicController.handle(topicBody)).rejects.toThrow(
      HttpException
    );
    await expect(createTopicController.handle(topicBody)).rejects.toEqual(
      expectedError
    );
  });
});
