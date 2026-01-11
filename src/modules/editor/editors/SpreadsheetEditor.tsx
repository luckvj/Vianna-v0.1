import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Plus,
  Trash2,
  Download,
  Upload,
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ChevronDown,
} from 'lucide-react'
import * as XLSX from 'xlsx'

interface SpreadsheetEditorProps {
  content: ArrayBuffer | string[][]
  filename: string
  onChange: (content: string[][]) => void
}

interface Cell {
  value: string
  style?: {
    bold?: boolean
    italic?: boolean
    align?: 'left' | 'center' | 'right'
    color?: string
    bgColor?: string
  }
}

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

function getColumnLabel(index: number): string {
  let label = ''
  while (index >= 0) {
    label = ALPHABET[index % 26] + label
    index = Math.floor(index / 26) - 1
  }
  return label
}

export default function SpreadsheetEditor({ content, filename, onChange }: SpreadsheetEditorProps) {
  const [data, setData] = useState<Cell[][]>([])
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null)
  const [selectedRange, setSelectedRange] = useState<{
    start: { row: number; col: number }
    end: { row: number; col: number }
  } | null>(null)
  const [editingCell, setEditingCell] = useState<{ row: number; col: number } | null>(null)
  const [inputValue, setInputValue] = useState('')
  const [sheets, setSheets] = useState<string[]>(['Sheet1'])
  const [activeSheet, setActiveSheet] = useState(0)

  // Initialize with empty grid or load from content
  useEffect(() => {
    if (content instanceof ArrayBuffer) {
      // Parse Excel file
      const workbook = XLSX.read(content, { type: 'array' })
      const sheetNames = workbook.SheetNames
      setSheets(sheetNames)

      const sheet = workbook.Sheets[sheetNames[0]]
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as string[][]

      // Convert to Cell format
      const cells: Cell[][] = []
      const maxRows = Math.max(jsonData.length, 50)
      const maxCols = Math.max(
        ...jsonData.map((row) => (Array.isArray(row) ? row.length : 0)),
        26
      )

      for (let i = 0; i < maxRows; i++) {
        const row: Cell[] = []
        for (let j = 0; j < maxCols; j++) {
          row.push({
            value: jsonData[i]?.[j]?.toString() || '',
          })
        }
        cells.push(row)
      }
      setData(cells)
    } else if (Array.isArray(content)) {
      // Already parsed data
      const cells: Cell[][] = content.map((row) =>
        row.map((value) => ({ value: value?.toString() || '' }))
      )
      // Ensure minimum size
      while (cells.length < 50) {
        cells.push(Array(26).fill({ value: '' }))
      }
      cells.forEach((row) => {
        while (row.length < 26) {
          row.push({ value: '' })
        }
      })
      setData(cells)
    } else {
      // Create empty grid
      const emptyGrid: Cell[][] = Array(50)
        .fill(null)
        .map(() =>
          Array(26)
            .fill(null)
            .map(() => ({ value: '' }))
        )
      setData(emptyGrid)
    }
  }, [content])

  const updateCell = useCallback((row: number, col: number, value: string) => {
    setData((prev) => {
      const newData = [...prev]
      if (!newData[row]) {
        newData[row] = Array(26).fill({ value: '' })
      }
      newData[row] = [...newData[row]]
      newData[row][col] = { ...newData[row][col], value }

      // Update onChange with plain string array
      const stringData = newData.map((r) => r.map((c) => c.value))
      onChange(stringData)

      return newData
    })
  }, [onChange])

  const handleCellClick = (row: number, col: number) => {
    setSelectedCell({ row, col })
    setInputValue(data[row]?.[col]?.value || '')
  }

  const handleCellDoubleClick = (row: number, col: number) => {
    setEditingCell({ row, col })
    setInputValue(data[row]?.[col]?.value || '')
  }

  const handleCellBlur = () => {
    if (editingCell) {
      updateCell(editingCell.row, editingCell.col, inputValue)
      setEditingCell(null)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!selectedCell) return

    const { row, col } = selectedCell

    switch (e.key) {
      case 'Enter':
        if (editingCell) {
          handleCellBlur()
          setSelectedCell({ row: row + 1, col })
        } else {
          setEditingCell({ row, col })
          setInputValue(data[row]?.[col]?.value || '')
        }
        break
      case 'Tab':
        e.preventDefault()
        handleCellBlur()
        setSelectedCell({ row, col: col + 1 })
        break
      case 'Escape':
        setEditingCell(null)
        break
      case 'ArrowUp':
        if (!editingCell && row > 0) {
          setSelectedCell({ row: row - 1, col })
        }
        break
      case 'ArrowDown':
        if (!editingCell && row < data.length - 1) {
          setSelectedCell({ row: row + 1, col })
        }
        break
      case 'ArrowLeft':
        if (!editingCell && col > 0) {
          setSelectedCell({ row, col: col - 1 })
        }
        break
      case 'ArrowRight':
        if (!editingCell && col < (data[0]?.length || 26) - 1) {
          setSelectedCell({ row, col: col + 1 })
        }
        break
      case 'Delete':
      case 'Backspace':
        if (!editingCell) {
          updateCell(row, col, '')
        }
        break
      default:
        if (!editingCell && e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
          setEditingCell({ row, col })
          setInputValue(e.key)
        }
    }
  }

  const exportToExcel = useCallback(() => {
    const stringData = data.map((row) => row.map((cell) => cell.value))
    const ws = XLSX.utils.aoa_to_sheet(stringData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
    XLSX.writeFile(wb, filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`)
  }, [data, filename])

  const addRow = useCallback(() => {
    setData((prev) => [...prev, Array(prev[0]?.length || 26).fill({ value: '' })])
  }, [])

  const addColumn = useCallback(() => {
    setData((prev) => prev.map((row) => [...row, { value: '' }]))
  }, [])

  const deleteRow = useCallback(() => {
    if (selectedCell && data.length > 1) {
      setData((prev) => prev.filter((_, i) => i !== selectedCell.row))
      setSelectedCell(null)
    }
  }, [selectedCell, data.length])

  const deleteColumn = useCallback(() => {
    if (selectedCell && (data[0]?.length || 0) > 1) {
      setData((prev) => prev.map((row) => row.filter((_, i) => i !== selectedCell.col)))
      setSelectedCell(null)
    }
  }, [selectedCell, data])

  return (
    <div className="h-full flex flex-col bg-slate-900/50">
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-2 border-b border-white/10 bg-black/20">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={addRow}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/10"
        >
          <Plus className="w-4 h-4" />
          Row
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={addColumn}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/10"
        >
          <Plus className="w-4 h-4" />
          Column
        </motion.button>

        <div className="w-px h-6 bg-white/10 mx-2" />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={deleteRow}
          disabled={!selectedCell}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-50"
        >
          <Trash2 className="w-4 h-4" />
          Row
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={deleteColumn}
          disabled={!selectedCell}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-50"
        >
          <Trash2 className="w-4 h-4" />
          Column
        </motion.button>

        <div className="flex-1" />

        {/* Cell reference */}
        {selectedCell && (
          <span className="px-3 py-1 rounded bg-white/10 text-sm text-white font-mono">
            {getColumnLabel(selectedCell.col)}
            {selectedCell.row + 1}
          </span>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={exportToExcel}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-500 text-white text-sm font-medium"
        >
          <Download className="w-4 h-4" />
          Export .xlsx
        </motion.button>
      </div>

      {/* Formula bar */}
      <div className="flex items-center gap-2 p-2 border-b border-white/10 bg-black/10">
        <span className="text-sm text-white/50 w-16">
          {selectedCell ? `${getColumnLabel(selectedCell.col)}${selectedCell.row + 1}` : ''}
        </span>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value)
            if (selectedCell) {
              updateCell(selectedCell.row, selectedCell.col, e.target.value)
            }
          }}
          className="flex-1 px-3 py-1 rounded bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500"
          placeholder="Enter value or formula"
        />
      </div>

      {/* Spreadsheet grid */}
      <div className="flex-1 overflow-auto" onKeyDown={handleKeyDown} tabIndex={0}>
        <table className="border-collapse min-w-full">
          <thead className="sticky top-0 z-10">
            <tr>
              <th className="sticky left-0 z-20 w-12 h-8 bg-slate-800 border border-white/10 text-xs text-white/50" />
              {Array(data[0]?.length || 26)
                .fill(null)
                .map((_, i) => (
                  <th
                    key={i}
                    className="min-w-[100px] h-8 bg-slate-800 border border-white/10 text-xs text-white/50 font-medium"
                  >
                    {getColumnLabel(i)}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td className="sticky left-0 w-12 h-8 bg-slate-800 border border-white/10 text-xs text-white/50 text-center font-medium">
                  {rowIndex + 1}
                </td>
                {row.map((cell, colIndex) => {
                  const isSelected =
                    selectedCell?.row === rowIndex && selectedCell?.col === colIndex
                  const isEditing =
                    editingCell?.row === rowIndex && editingCell?.col === colIndex

                  return (
                    <td
                      key={colIndex}
                      onClick={() => handleCellClick(rowIndex, colIndex)}
                      onDoubleClick={() => handleCellDoubleClick(rowIndex, colIndex)}
                      className={`min-w-[100px] h-8 border border-white/10 text-sm transition-all ${
                        isSelected
                          ? 'bg-indigo-500/20 border-indigo-500'
                          : 'bg-slate-900/50 hover:bg-white/5'
                      }`}
                    >
                      {isEditing ? (
                        <input
                          type="text"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          onBlur={handleCellBlur}
                          autoFocus
                          className="w-full h-full px-2 bg-white text-black text-sm focus:outline-none"
                        />
                      ) : (
                        <div className="px-2 truncate text-white">{cell.value}</div>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sheet tabs */}
      <div className="flex items-center gap-1 p-2 border-t border-white/10 bg-black/20">
        {sheets.map((sheet, index) => (
          <button
            key={sheet}
            onClick={() => setActiveSheet(index)}
            className={`px-4 py-1.5 rounded-lg text-sm transition-all ${
              activeSheet === index
                ? 'bg-white/10 text-white'
                : 'text-white/50 hover:text-white hover:bg-white/5'
            }`}
          >
            {sheet}
          </button>
        ))}
        <button
          onClick={() => setSheets((prev) => [...prev, `Sheet${prev.length + 1}`])}
          className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
