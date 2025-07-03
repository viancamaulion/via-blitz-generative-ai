import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Dynamic Models - Vercel AI SDK",
  description:
    "Next.js chatbot with dynamic model selection powered by the Vercel AI SDK, Feature Flags and Edge Config.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <div className='flex flex-col w-full max-w-2xl pt-16 pb-20 mx-auto stretch relative '>
          <div className='ml-8'>MY CUSTOM CHAT ASSISTANT</div>
          {children}
        </div>
      </body>
    </html>
  )
}
