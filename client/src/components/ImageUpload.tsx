import { useRef } from "react"
import api from "../apis/axiosInstance"

interface ImageUploadProps {
  onUploadSuccess: (url: string) => void
}

const ImageUpload = ({ onUploadSuccess }: ImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await api.post("/images/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      onUploadSuccess(response.data.url)
    } catch (error) {
      console.log("Error", error)
    }
  }

  return (
    <input
      ref={fileInputRef}
      type="file"
      onChange={handleFileChange}
      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 cursor-pointer"
    />
  )
}

export default ImageUpload