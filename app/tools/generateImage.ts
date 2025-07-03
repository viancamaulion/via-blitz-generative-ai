import { openai } from "@ai-sdk/openai"
import { tool } from "ai"
import { z } from "zod"
import fs from "fs"
import path from "path"

export const generateImage = tool({
  description: "Generate an image based on a prompt using DALL E-3.",
  parameters: z.object({
    prompt: z.string().describe("The prompt to generate the image from."),
  }),
  execute: async ({ prompt }) => {
    console.log("Generating image with prompt:", prompt)
    const { image } = await import("ai").then((m) =>
      m.experimental_generateImage({
        model: openai.image("dall-e-3"),
        prompt,
        size: "500x500",
        providerOptions: { openai: { style: "vivid", quality: "standard" } },
      })
    )
    let base64Image: string = ""
    if (typeof image === "string") {
      base64Image = image
    } else if (image && typeof image === "object") {
      base64Image = image.base64 || ""
      if (base64Image && Buffer.isBuffer(base64Image)) {
        base64Image = base64Image.toString("base64")
      }
    }
    const fileName = `image-${Date.now()}.png`
    const filePath = path.join("/tmp", fileName)
    fs.writeFileSync(filePath, Buffer.from(base64Image, "base64"))
    const imageUrl = `/api/tmp-images/${fileName}`
    console.log("Image saved to:", filePath, imageUrl)
    return {
      imageUrl,
      contentType: "image/png",
      caption: `Generated image for prompt: "${prompt}"`,
    }
  },
})
