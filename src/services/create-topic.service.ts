import { HttpException } from "../exceptions/http.exception";
import { TopicFactory } from "../models/topic.model";
import { InMemoryTopicPersistence } from "../persistence/in-memory-topic.persistence";

type CreateTopicProps = {
  name: string;
  content: string;
  parentTopicId?: string;
};

export class CreateTopicService {
  constructor(private topicPersistence: InMemoryTopicPersistence) {}

  async execute(createTopicProps: CreateTopicProps): Promise<void> {
    //if parentTopicId, validate
    if (createTopicProps.parentTopicId) {
      const parentTopic = await this.topicPersistence.findById(
        createTopicProps.parentTopicId
      );
      if (!parentTopic) {
        throw new HttpException(404, "Bad Request", {
          message: "Parent topic not found",
          parentTopicId: createTopicProps.parentTopicId,
          source: "CreateTopicService",
        });
      }
    }

    const topic = TopicFactory.create(createTopicProps);

    await this.topicPersistence.create(topic);
  }
}
