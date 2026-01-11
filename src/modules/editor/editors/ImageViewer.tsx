import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  RotateCcw,
  FlipHorizontal,
  FlipVertical,
  Download,
  Maximize2,
  RefreshCw,
  Move,
  Crop,
  Sliders,
} from 'lucide-react'

interface ImageViewerProps {
  url: string
  filename: string
}

export default function ImageViewer({ url, filename }: ImageViewerProps) {
  const [scale, setScale] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [flipH, setFlipH] = useState(false)
  const [flipV, setFlipV] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 })

  // Filters
  const [brightness, setBrightness] = useState(100)
  const [contrast, setContrast] = useState(100)
  const [saturation, setSaturation] = useState(100)
  const [showFilters, setShowFilters] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)

  const zoomIn = () => setScale((prev) => Math.min(prev + 0.25, 5))
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.25, 0.25))
  const rotateRight = () => setRotation((prev) => prev + 90)
  const rotateLeft = () => setRotation((prev) => prev - 90)
  const toggleFlipH = () => setFlipH((prev) => !prev)
  const toggleFlipV = () => setFlipV((prev) => !prev)

  const reset = () => {
    setScale(1)
    setRotation(0)
    setFlipH(false)
    setFlipV(false)
    setPosition({ x: 0, y: 0 })
    setBrightness(100)
    setContrast(100)
    setSaturation(100)
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    if (e.deltaY < 0) {
      zoomIn()
    } else {
      zoomOut()
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleDownload = () => {
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
  }

  const filterStyle = {
    filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`,
  }

  const transformStyle = {
    transform: `translate(${position.x}px, ${position.y}px) scale(${scale}) rotate(${rotation}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`,
  }

  return (
    <div className="h-full flex flex-col bg-slate-900/50">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-2 border-b border-white/10 bg-black/20">
        <div className="flex items-center gap-1">
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
            onClick={rotateLeft}
            className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
            title="Rotate Left"
          >
            <RotateCcw className="w-5 h-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={rotateRight}
            className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
            title="Rotate Right"
          >
            <RotateCw className="w-5 h-5" />
          </motion.button>

          <div className="w-px h-6 bg-white/10 mx-2" />

          {/* Flip */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleFlipH}
            className={`p-2 rounded-lg hover:bg-white/10 ${flipH ? 'text-indigo-400' : 'text-white/70 hover:text-white'}`}
            title="Flip Horizontal"
          >
            <FlipHorizontal className="w-5 h-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleFlipV}
            className={`p-2 rounded-lg hover:bg-white/10 ${flipV ? 'text-indigo-400' : 'text-white/70 hover:text-white'}`}
            title="Flip Vertical"
          >
            <FlipVertical className="w-5 h-5" />
          </motion.button>

          <div className="w-px h-6 bg-white/10 mx-2" />

          {/* Filters */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-lg hover:bg-white/10 ${showFilters ? 'text-indigo-400' : 'text-white/70 hover:text-white'}`}
            title="Adjustments"
          >
            <Sliders className="w-5 h-5" />
          </motion.button>

          <div className="w-px h-6 bg-white/10 mx-2" />

          {/* Reset */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={reset}
            className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
            title="Reset"
          >
            <RefreshCw className="w-5 h-5" />
          </motion.button>
        </div>

        <div className="flex items-center gap-2">
          {/* Image info */}
          <span className="text-sm text-white/50">
            {filename}
          </span>

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

      {/* Filter panel */}
      {showFilters && (
        <div className="flex items-center gap-6 p-3 border-b border-white/10 bg-black/10">
          <div className="flex items-center gap-2">
            <span className="text-sm text-white/50 w-20">Brightness</span>
            <input
              type="range"
              min="0"
              max="200"
              value={brightness}
              onChange={(e) => setBrightness(Number(e.target.value))}
              className="w-32 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-sm text-white w-10">{brightness}%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-white/50 w-20">Contrast</span>
            <input
              type="range"
              min="0"
              max="200"
              value={contrast}
              onChange={(e) => setContrast(Number(e.target.value))}
              className="w-32 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-sm text-white w-10">{contrast}%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-white/50 w-20">Saturation</span>
            <input
              type="range"
              min="0"
              max="200"
              value={saturation}
              onChange={(e) => setSaturation(Number(e.target.value))}
              className="w-32 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-sm text-white w-10">{saturation}%</span>
          </div>
        </div>
      )}

      {/* Image display */}
      <div
        ref={containerRef}
        className="flex-1 overflow-hidden flex items-center justify-center bg-[#1a1a2e] cursor-grab active:cursor-grabbing"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Checkerboard background for transparency */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(45deg, #333 25%, transparent 25%),
              linear-gradient(-45deg, #333 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, #333 75%),
              linear-gradient(-45deg, transparent 75%, #333 75%)
            `,
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
          }}
        />

        <motion.img
          src={url}
          alt={filename}
          className="max-w-none select-none"
          style={{
            ...filterStyle,
            ...transformStyle,
            transition: isDragging ? 'none' : 'transform 0.2s ease-out',
          }}
          draggable={false}
          onLoad={(e) => {
            const img = e.target as HTMLImageElement
            setImageSize({ width: img.naturalWidth, height: img.naturalHeight })
          }}
        />
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-white/10 bg-black/20 text-sm text-white/50">
        <span>
          {imageSize.width} x {imageSize.height} pixels
        </span>
        <span>
          Scroll to zoom • Drag to pan
        </span>
      </div>
    </div>
  )
}
