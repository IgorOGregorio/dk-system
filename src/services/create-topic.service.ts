import { TopicNotFoundError } from "../errors/domain.error";
import { TopicFactory } from "../models/topic.model";
import { ITopicRepository } from "../repositories/itopic.repository";

type CreateTopicProps = {
  name: string;
  content: string;
  parentTopicId?: string;
};

export class CreateTopicService {
  constructor(private topicRepository: ITopicRepository) {}

  async execute(createTopicProps: CreateTopicProps): Promise<void> {
    //if parentTopicId, validate
    if (createTopicProps.parentTopicId) {
      const parentTopic = await this.topicRepository.findById(
        createTopicProps.parentTopicId
      );
      if (!parentTopic) {
        throw new TopicNotFoundError(createTopicProps.parentTopicId);
      }
    }

    const topic = TopicFactory.create(createTopicProps);

    await this.topicRepository.create(topic);
  }
}
