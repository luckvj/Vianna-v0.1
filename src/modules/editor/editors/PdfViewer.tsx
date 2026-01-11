import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Download,
  Printer,
  Maximize2,
  Search,
} from 'lucide-react'

interface PdfViewerProps {
  url: string
}

export default function PdfViewer({ url }: PdfViewerProps) {
  const [scale, setScale] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')

  const zoomIn = () => setScale((prev) => Math.min(prev + 0.25, 3))
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.25, 0.5))
  const rotate = () => setRotation((prev) => (prev + 90) % 360)

  const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1))
  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages))

  const handleDownload = () => {
    const a = document.createElement('a')
    a.href = url
    a.download = 'document.pdf'
    a.click()
  }

  const handlePrint = () => {
    const iframe = document.createElement('iframe')
    iframe.style.display = 'none'
    iframe.src = url
    document.body.appendChild(iframe)
    iframe.onload = () => {
      iframe.contentWindow?.print()
      setTimeout(() => document.body.removeChild(iframe), 1000)
    }
  }

  return (
    <div className="h-full flex flex-col bg-slate-900/50">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-2 border-b border-white/10 bg-black/20">
        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={zoomOut}
            className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
            title="Zoom Out"
          >
            <ZoomOut className="w-5 h-5" />
          </motion.button>
          <span className="text-sm text-white min-w-[60px] text-center">
            {Math.round(scale * 100)}%
          </span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={zoomIn}
            className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
            title="Zoom In"
          >
            <ZoomIn className="w-5 h-5" />
          </motion.button>

          <div className="w-px h-6 bg-white/10 mx-2" />

          {/* Rotation */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={rotate}
            className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
            title="Rotate"
          >
            <RotateCw className="w-5 h-5" />
          </motion.button>

          <div className="w-px h-6 bg-white/10 mx-2" />

          {/* Page navigation */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-50"
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>
          <span className="text-sm text-white">
            {currentPage} / {totalPages}
          </span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-50"
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search in document..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500 w-48"
            />
          </div>

          <div className="w-px h-6 bg-white/10 mx-2" />

          {/* Actions */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePrint}
            className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
            title="Print"
          >
            <Printer className="w-5 h-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDownload}
            className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
            title="Download"
          >
            <Download className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* PDF View */}
      <div className="flex-1 overflow-auto flex items-start justify-center p-8 bg-slate-800/50">
        <div
          style={{
            transform: `scale(${scale}) rotate(${rotation}deg)`,
            transformOrigin: 'top center',
          }}
          className="transition-transform"
        >
          {/* Using iframe for PDF display - most compatible method */}
          <iframe
            src={`${url}#page=${currentPage}`}
            className="w-[800px] h-[1000px] bg-white rounded-lg shadow-2xl"
            title="PDF Viewer"
          />
        </div>
      </div>

      {/* Page thumbnails sidebar could go here */}
    </div>
  )
}
