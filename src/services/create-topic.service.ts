import { TopicNotFoundError } from "../errors/domain.error";
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
        throw new TopicNotFoundError(createTopicProps.parentTopicId);
      }
    }

    const topic = TopicFactory.create(createTopicProps);

    await this.topicPersistence.create(topic);
  }
}
