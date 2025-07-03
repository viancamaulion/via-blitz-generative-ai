export const MODEL_OPTIONS = [
  { label: "ollama", value: "llama3.2" },
  { label: "gpt-4o", value: "openai:gpt-4o" },
]

export function getDefaultModel(): string {
  return MODEL_OPTIONS[0].value
}
