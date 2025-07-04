// import React, { forwardRef } from "react"

// interface FileInputProps {
//   onFileRead: (file: { name: string; type: string; content: string | ArrayBuffer | null }) => void
//   accept?: string
//   multiple?: boolean
//   style?: React.CSSProperties
// }

// const FileInput = forwardRef<HTMLInputElement, FileInputProps>(
//   ({ onFileRead, accept, multiple, style }, ref) => {
//     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//       const files = e.target.files
//       if (!files || files.length === 0) return
//       Array.from(files).forEach(file => {
//         const reader = new FileReader()
//         reader.onload = () => {
//           onFileRead({
//             name: file.name,
//             type: file.type,
//             content: reader.result,
//           })
//         }
//         reader.onerror = () => {
//           onFileRead({
//             name: file.name,
//             type: file.type,
//             content: null,
//           })
//         }
//         if (file.type.startsWith("text/")) {
//           reader.readAsText(file)
//         } else {
//           reader.readAsDataURL(file)
//         }
//       })
//     }
//     return (
//       <input
//         type="file"
//         ref={ref}
//         accept={accept}
//         multiple={multiple}
//         style={style}
//         onChange={handleChange}
//         className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
//       />
//     )
//   }
// )

// export default FileInput
