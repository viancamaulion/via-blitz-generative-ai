import React, { useState } from "react"

interface GeneratedImageMessageProps {
  base64: string
  alt?: string
  caption?: string
  imageUrl?: string
}

export default function GeneratedImageMessage({
  base64,
  alt,
  caption,
  imageUrl,
}: GeneratedImageMessageProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const handleImageLoad = () => setLoading(false)
  const handleImageError = () => {
    setLoading(false)
    setError(true)
  }

  const handleDownload = () => {
    const link = document.createElement("a")
    link.href = `data:image/png;base64,${base64}`
    link.download = "generated-image.png"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className='w-full flex flex-col items-center my-2'>
      <div className='relative w-full flex flex-col items-center'>
        {loading && !error && (
          <div className='flex items-center justify-center w-full h-64 bg-gray-100 animate-pulse rounded'>
            <span className='text-gray-400'>Loading image...</span>
          </div>
        )}
        {error ? (
          <div className='flex flex-col items-center w-full h-64 bg-red-50 text-red-400 rounded justify-center'>
            <span className='mb-2'>Failed to load image.</span>
            <button
              className='px-3 py-1 bg-gray-200 rounded hover:bg-gray-300'
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        ) : (
          <img
            src={imageUrl || `data:image/png;base64,${base64}`}
            alt={alt || "Generated image"}
            className={`w-full max-w-md rounded shadow ${
              loading ? "hidden" : "block"
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            draggable={false}
          />
        )}
      </div>
      <div className='flex flex-row items-center gap-2 mt-2'>
        <button
          className='px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700'
          onClick={handleDownload}
          disabled={error}
        >
          Download
        </button>
        {caption && (
          <span className='text-gray-600 text-sm ml-2'>{caption}</span>
        )}
      </div>
    </div>
  )
}
