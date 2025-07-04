// UserMessage.tsx
import React from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { MemoizedReactMarkdown } from "./markdown"
import { Attachment as BaseAttachment } from "ai"

type Attachment = BaseAttachment & { caption?: string }

function MessageContent({ message }: { message: string }) {
  return (
    <MemoizedReactMarkdown className='prose'>{message}</MemoizedReactMarkdown>
  )
}
interface MessageProps {
  message: string
  attachments?: Attachment[]
  isTyping?: boolean
}

export function UserMessage({ message, attachments }: MessageProps) {
  return (
    <div className='flex justify-end mb-4 mt-4'>
      <Card className='sm:max-w-[70%]'>
        <CardContent className='p-3'>
          <MessageContent message={message} />
          {attachments && (
            <div className='flex gap-2 items-center overflow-x-auto max-w-full mb-2'>
              {attachments.map((attachment, index) => (
                <div key={index} className='flex-shrink-0'>
                  {attachment.contentType?.startsWith("image/") ? (
                    <img
                      src={attachment?.url}
                      alt={attachment?.name}
                      className='w-12 h-12 object-cover rounded border'
                    />
                  ) : (
                    <div className='w-full h-auto overflow-hidden rounded border bg-gray-50 flex items-center text-xs p-1'>
                      {attachment.name}{" "}
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='16'
                        height='16'
                        fill='none'
                        className='ml-2'
                        stroke='currentColor'
                        stroke-width='2'
                        stroke-linecap='round'
                        stroke-linejoin='round'
                        viewBox='0 0 24 24'
                      >
                        <path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' />
                        <polyline points='14 2 14 8 20 8' />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      <Avatar className='w-8 h-8 ml-2 mt-2'>
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
    </div>
  )
}

function ImageWithLoaderAndDownload({
  attachment,
}: {
  attachment: Attachment
}) {
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(false)

  const handleDownload = () => {
    const link = document.createElement("a")
    link.href = attachment.url
    link.download = (attachment.name || "generated-image") + ".png"
    link.click()
  }

  return (
    <div className='w-full flex flex-col items-center'>
      <div className='relative w-full'>
        {loading && !error && (
          <div className='flex justify-center items-center absolute inset-0 bg-white bg-opacity-60 z-10'>
            <svg
              className='animate-spin h-8 w-8 text-gray-400'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
            >
              <circle
                className='opacity-25'
                cx='12'
                cy='12'
                r='10'
                stroke='currentColor'
                strokeWidth='4'
              ></circle>
              <path
                className='opacity-75'
                fill='currentColor'
                d='M4 12a8 8 0 018-8v8z'
              ></path>
            </svg>
          </div>
        )}
        {error ? (
          <div className='flex flex-col items-center justify-center w-full h-48 border rounded bg-gray-50'>
            <svg
              className='h-10 w-10 text-red-400 mb-2'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
            <span className='text-sm text-red-500'>Failed to load image.</span>
          </div>
        ) : (
          <img
            src={attachment.url}
            alt={attachment.name || "Generated Image"}
            className='w-full max-h-[400px] object-contain rounded border mb-2'
            onLoad={() => setLoading(false)}
            onError={() => {
              setLoading(false)
              setError(true)
            }}
            style={{ display: loading ? "none" : "block" }}
          />
        )}
      </div>
      {!error && (
        <button
          className='mt-2 px-3 py-1 rounded bg-blue-500 text-white text-xs hover:bg-blue-600 transition-colors'
          onClick={handleDownload}
        >
          Download
        </button>
      )}
      {attachment.caption && !error && (
        <div className='text-xs text-gray-500 text-center mt-1'>
          {attachment.caption}
        </div>
      )}
    </div>
  )
}

export function BotMessage({ message, attachments, isTyping }: MessageProps) {
  return (
    <div className='flex mb-4 w-full'>
      <Avatar className='w-8 h-8 mr-2 mt-2'>
        <AvatarFallback>S</AvatarFallback>
      </Avatar>
      <Card className='sm:max-w-[70%] w-full'>
        <CardContent className='p-3'>
          {isTyping ? (
            <div className="whitespace-pre-wrap rounded-lg rounded-tl-none text-blue-500 p-4">
            <div className="flex gap-1">
              <span className="animate-pulse">●</span>
              <span className="animation-delay-200 animate-pulse">●</span>
              <span className="animation-delay-400 animate-pulse">●</span>
            </div>
          </div>
          ) : (
            <MessageContent message={message} />
          )}
          {attachments && attachments.length > 0 && (
            <div className='flex flex-col gap-4 mt-2'>
              {attachments.map((attachment, idx) =>
                attachment.contentType?.startsWith("image/") ? (
                  <ImageWithLoaderAndDownload
                    key={idx}
                    attachment={attachment}
                  />
                ) : null
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
