import { tool } from "ai"
import z from "zod"
import fs from "fs/promises"

export const fileReader = tool({
  description: "Read the contents of a file given its path on the server.",
  parameters: z.object({
    path: z
      .string()
      .describe("The absolute or relative path to the file to read."),
  }),
  execute: async ({ path }: { path: string }) => {
    try {
      const data = await fs.readFile(path, "utf8")
      return { content: data }
    } catch (error: any) {
      return { error: `Could not read file: ${error.message}` }
    }
  },
})

// Detects if the user is asking to read a file and determines the path to use.
// If the path argument is a file object (not a string), do not use it as a path.
export function detectFileReaderIntent(
  userMessage: string,
  path: unknown
): {
  isFileReaderIntent: boolean
  path: string | undefined
} {
  const fileReaderIntent = /\b(file|read|content)\b/i.test(userMessage)
  let filePath: string | undefined = undefined

  // Only use path if it is a string (not a file object)
  if (typeof path === "string") {
    filePath = path
  }

  // If the user message contains an explicit path, use it
  if (fileReaderIntent) {
    const pathMatch = userMessage.match(/in ([a-zA-Z\s]+)/i)
    if (pathMatch) {
      filePath = pathMatch[1].trim()
    }
  }
  return { isFileReaderIntent: fileReaderIntent, path: filePath }
}
