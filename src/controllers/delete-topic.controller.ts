import { DeleteTopicService } from "../services/delete-topic.service";

export class DeleteTopicController {
  constructor(private readonly deleteTopicService: DeleteTopicService) {}

  async handle(topicId: string): Promise<void> {
    await this.deleteTopicService.execute(topicId);
  }
}
