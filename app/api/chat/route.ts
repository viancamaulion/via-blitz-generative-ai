import { convertToCoreMessages, streamText } from "ai"
import { registry } from "@/lib/ai-config"
import { getDefaultModel } from "@/flags"
import fs from "fs/promises"
import { detectFileReaderIntent, fileReader } from "@/app/tools/fileReader"
import { ollama } from "ollama-ai-provider"
import { getWeather } from "@/app/tools/weatherTool"
import { generateImage } from "@/app/tools/generateImage"

/**
 * Saves an uploaded file (base64 encoded) to disk under /tmp with a unique, sanitized filename.
 * @param file - The uploaded file object containing a name and base64 content.
 * @returns The absolute path to the saved file on disk.
 */
async function uploadHelper(file: { name: string; content: string }) {
  const path = `/tmp/${Date.now()}_${file.name.replace(
    /[^a-zA-Z0-9_.-]/g,
    "_"
  )}`
  const buffer = Buffer.from(file.content.split(",")[1], "base64")
  await fs.writeFile(path, buffer)
  console.log("Saved attachment to", path)
  return path
}

/**
 * Main API handler for chat requests
 * Handles tool-augmented chat with support for attachments and multiple models.
 */
export async function POST(req: Request) {
  try {
    // Parse request body and extract relevant fields
    const { messages, model, experimental_attachments } = await req.json()
    const selectedModel = model || getDefaultModel()
    let attachmentPath: string | undefined = undefined

    // Handle file attachment (if present)
    const file = experimental_attachments?.[0]
    if (file && file.name && file.type?.startsWith("text/") && file.content) {
      attachmentPath = await uploadHelper(file)
    }

    // Prepare outgoing messages and extract latest user message
    let outgoingMessages = messages
    const latestUserMessage =
      outgoingMessages
        .filter((m: { role: string }) => m.role === "user")
        .slice(-1)[0]?.content || ""

    // Detect file reader intent (can extend for other tools/intents)
    const { isFileReaderIntent, path } = detectFileReaderIntent(
      latestUserMessage,
      attachmentPath
    )

    // Special handling for llama3.2 model
    if (selectedModel === "llama3.2") {
      // File reader tool invocation for llama3.2
      if (
        isFileReaderIntent &&
        experimental_attachments?.length !== 0 &&
        path
      ) {
        await fileReader.execute(
          { path },
          {
            toolCallId: "fileReader",
            messages: convertToCoreMessages(outgoingMessages),
          }
        )
        const result = streamText({
          model: ollama(selectedModel),
          temperature: 0,
          messages: convertToCoreMessages(outgoingMessages),
        })
        return result.toDataStreamResponse()
      }
      // Default to LLM for llama3.2
      const latestUserOnly = messages
        .filter((m: { role: string }) => m.role === "user")
        .slice(-1)[0]
      outgoingMessages = latestUserOnly ? [latestUserOnly] : []
      const result = streamText({
        model: ollama(selectedModel),
        messages: convertToCoreMessages(outgoingMessages),
      })
      return result.toDataStreamResponse()
    }

    // Default: stream with tool support (weather, fileReader, generateImage)
    try {
      const result = streamText({
        model: registry.languageModel(selectedModel),
        messages: convertToCoreMessages(outgoingMessages),
        tools: { 
          getWeather: {
            ...getWeather,
            execute: async (params: { location: string }, context: any) => {
              const result = await getWeather.execute(params, context);
              return result;
            }
          },
          fileReader,
          generateImage 
        },
        toolChoice: "auto",
      })
      return result.toDataStreamResponse()
    } catch (err: any) {
      // Handle tool invocation errors gracefully
      console.error("Tool call error:", err)
      return new Response(
        JSON.stringify({
          error:
            "The assistant tried to use a tool that is not available. Please try rephrasing your request or start a new chat session.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
    }
  } catch (error) {
    // Handle unexpected errors and return a generic error response
    console.error("API /api/chat error:", error)
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : String(error),
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
}
