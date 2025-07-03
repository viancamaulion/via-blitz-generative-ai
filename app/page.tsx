"use client"

import { useChat } from "@ai-sdk/react"
import { ModelToggle } from "@/components/ui/ModelToggle"
import { MODEL_OPTIONS, getDefaultModel } from "@/flags"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { BotMessage, UserMessage } from "@/components/messages"
import React, { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { WeatherDisplay } from "@/components/weather-display"

export default function Chat() {
  const [selectedModel, setSelectedModel] = useState<string>(getDefaultModel())
  const [value, setValue] = useState<string>("")
  const [files, setFiles] = useState<FileList | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { messages, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
    body: { model: selectedModel },
  })

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files
    if (selectedFiles) {
      const validFiles = Array.from(selectedFiles).filter(
        (file) =>
          file.type.startsWith("image/") || file.type.startsWith("text/")
      )
      if (validFiles.length === selectedFiles.length) {
        const dataTransfer = new DataTransfer()
        validFiles.forEach((file) => dataTransfer.items.add(file))
        setFiles(dataTransfer.files)
      } else {
        alert("Only image and text files are allowed")
      }
    }
  }

  function TextFilePreview({ file }: { file: File }) {
    const [content, setContent] = useState<string>("")
    useEffect(() => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result
        setContent(typeof text === "string" ? text.slice(0, 100) : "")
      }
      reader.readAsText(file)
    }, [file])
    return (
      <div>
        {content}
        {content.length >= 100 && "..."}
      </div>
    )
  }

  return (
    <div className='relative min-h-screen w-full'>
      <div className='flex flex-col w-full max-w-2xl mx-auto stretch relative'>
        {/* Model Toggle UI */}
        <div className='ml-8'>
          <ModelToggle
            options={MODEL_OPTIONS}
            selected={selectedModel}
            onChange={setSelectedModel}
          />
        </div>
        <div className='flex-grow overflow-y-auto px-4'>
          {messages.map((message, index) => {
            switch (message.role) {
              case "user":
                return (
                  <UserMessage
                    message={message.content}
                    attachments={message.experimental_attachments}
                  />
                )
              default:
                const parts = message.parts || []
                const weatherToolInvocation = parts.find(
                  (t) =>
                    t.type === "tool-invocation" &&
                    t.toolInvocation?.toolName === "getWeather"
                )
                const imageToolInvocation = parts.find(
                  (t) =>
                    t.type === "tool-invocation" &&
                    t.toolInvocation?.state === "result" &&
                    t.toolInvocation.result.imageUrl
                )
                if (imageToolInvocation) {
                  // Ensure the image URL is valid
                  return (
                    <div key={index} className='text-left mt-4 mb-4'>
                      <Image
                        src={
                          // @ts-ignore
                          imageToolInvocation.toolInvocation.result.imageUrl ||
                          ""
                        }
                        width={1024}
                        height={1024}
                        alt='Generated'
                        className='max-w-full rounded'
                      />
                      <p className='text-gray-500 mt-2'>
                        {/* @ts-ignore */}
                        {imageToolInvocation.toolInvocation.result.caption}
                      </p>
                    </div>
                  )
                }
                if (weatherToolInvocation) {
                  const weatherData =
                    // @ts-ignore
                    weatherToolInvocation.toolInvocation.result
                  return <WeatherDisplay weather={weatherData} />
                }
                return <BotMessage message={message.content} />
            }
          })}
        </div>
        <div className='fixed bottom-0 pb-2 bg-white left-0 w-full'>
          <div className='relative max-w-2xl mx-auto'>
            <div className='absolute bottom-full left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none'></div>
            <form
              onSubmit={(e) => {
                if (files) {
                  handleSubmit(e, { experimental_attachments: files })
                } else {
                  handleSubmit(e)
                }
                setValue("")
                setFiles(null)
              }}
              className='bg-background px-4 py-3 sticky bottom-0 w-full'
            >
              {/* File Previews Above Input */}
              {files && (
                <div className='flex gap-2 items-center overflow-x-auto max-w-full mb-2'>
                  {Array.from(files).map((file, index) => (
                    <div key={index} className='flex-shrink-0'>
                      {file.type.startsWith("image/") ? (
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className='w-12 h-12 object-cover rounded border'
                        />
                      ) : (
                        <div className='w-full h-12 overflow-hidden rounded border bg-gray-50 flex items-center text-xs p-2'>
                          <TextFilePreview file={file} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              <div className='flex items-center space-x-2 w-full relative'>
                <button
                  type='button'
                  onClick={() => fileInputRef.current?.click()}
                  className='p-2 rounded-full hover:bg-gray-100'
                  aria-label='Add file'
                >
                  <PlusIcon />
                </button>
                <input
                  type='file'
                  multiple
                  accept='image/*,text/*'
                  ref={fileInputRef}
                  className='hidden'
                  onChange={handleFileChange}
                />
                <Input
                  placeholder='Type your message... e.g generate me a latina mommy'
                  className='w-full rounded-lg pr-16 resize-none'
                  value={value}
                  min={8}
                  onChange={(e) => {
                    setValue(e.target.value)
                    handleInputChange(e)
                  }}
                />
                <Button
                  type='submit'
                  variant='ghost'
                  size='icon'
                  className='absolute top-1/2 right-0 -translate-y-1/2'
                >
                  <SendIcon className='w-5 h-5 p-[2px]' />
                  <span className='sr-only'>Send</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

function PlusIcon(props: any) {
  return (
    <svg
      {...props}
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <line x1='12' y1='5' x2='12' y2='19'></line>
      <line x1='5' y1='12' x2='19' y2='12'></line>
    </svg>
  )
}

function SendIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='m22 2-7 20-4-9-9-4Z' />
      <path d='M22 2 11 13' />
    </svg>
  )
}
