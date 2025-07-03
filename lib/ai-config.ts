import { createOpenAI } from "@ai-sdk/openai"
import { createProviderRegistry } from "ai"
import { createOllama } from "ollama-ai-provider"

export const registry = createProviderRegistry({
  openai: createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  }),
  ollama: createOllama({
    baseURL: process.env.OLLAMA_URL,
  }),
})
