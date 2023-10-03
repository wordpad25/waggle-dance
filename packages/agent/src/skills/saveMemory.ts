import { Document } from "langchain/document";
import { z } from "zod";

import { vectorStoreFromIndex } from "../utils/vectorStore";
import AbstractedSkill from "./AbstractedSkill";

const schema = z.object({
  memory: z
    .string()
    .nonempty()
    .describe("The memory to store in the vector store"),
  namespace: z
    .string()
    .nonempty()
    .describe(
      "The namespace to save the memory to. Use the NAMESPACE variable for memory isolation. This improves security and prevents context poisoning.",
    ),
});

const saveMemorySkill = new AbstractedSkill({
  name: "saveMemory",
  description: `Save memory in your memory palace for later retrieval by other team members.`,
  func: async (input, _runManager) => {
    const { memory, namespace } = schema.parse(input);
    const vectorStore = await vectorStoreFromIndex(namespace);
    const document = new Document({ pageContent: memory, metadata: {} });
    const added = (await vectorStore.addDocuments([document])).join(", ");
    return added;
  },
  schema,
});

export default saveMemorySkill;
