import z from "zod";

export const UpdateTopicBodySchema = z.object({
  body: z.object({
    name: z.string().min(3, {
      message: "Name is required",
    }),
    content: z.string().min(3, {
      message: "Content is required",
    }),
  }),
});
