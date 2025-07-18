import z from "zod";

export const createTopicBody = z.object({
  body: z.object({
    name: z.string().min(1, {
      message: "Name is required",
    }),
    content: z.string().min(1, {
      message: "Content is required",
    }),
    parentTopicId: z.string().optional(),
  }),
});

export type CreateTopicBody = z.infer<typeof createTopicBody>["body"];
