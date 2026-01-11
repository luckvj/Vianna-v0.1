import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Folder,
  Home,
  CheckCircle,
  Clock,
  Calendar,
  Users,
  FileText,
  MoreHorizontal,
  ChevronRight,
  DollarSign,
  Bed,
  Bath,
  Square,
} from 'lucide-react'
import { format } from 'date-fns'
import type { Project } from '../../types'

// Sample data
const sampleProjects: Project[] = [
  {
    id: '1',
    name: 'Website Redesign',
    description: 'Complete overhaul of company website with new branding',
    status: 'active',
    color: '#3b82f6',
    icon: 'folder',
    progress: 65,
    deadline: Date.now() + 86400000 * 14,
    is_property: false,
    created_at: Date.now() - 86400000 * 30,
    updated_at: Date.now(),
  },
  {
    id: '2',
    name: 'Mobile App Development',
    description: 'Build iOS and Android apps for the platform',
    status: 'active',
    color: '#8b5cf6',
    icon: 'folder',
    progress: 35,
    deadline: Date.now() + 86400000 * 60,
    is_property: false,
    created_at: Date.now() - 86400000 * 45,
    updated_at: Date.now(),
  },
  {
    id: '3',
    name: '123 Oak Street',
    description: 'Beautiful 3-bedroom home in quiet neighborhood',
    status: 'active',
    color: '#10b981',
    icon: 'home',
    progress: 50,
    is_property: true,
    property_address: '123 Oak Street, Springfield, IL 62701',
    property_price: 285000,
    property_beds: 3,
    property_baths: 2,
    property_sqft: 1850,
    property_status: 'available',
    created_at: Date.now() - 86400000 * 7,
    updated_at: Date.now(),
  },
  {
    id: '4',
    name: '456 Maple Avenue',
    description: 'Charming starter home, recently renovated',
    status: 'active',
    color: '#ec4899',
    icon: 'home',
    progress: 75,
    is_property: true,
    property_address: '456 Maple Avenue, Springfield, IL 62702',
    property_price: 195000,
    property_beds: 2,
    property_baths: 1,
    property_sqft: 1200,
    property_status: 'under_contract',
    created_at: Date.now() - 86400000 * 14,
    updated_at: Date.now(),
  },
]

const statusColors = {
  active: 'bg-green-500',
  on_hold: 'bg-yellow-500',
  completed: 'bg-blue-500',
  archived: 'bg-gray-500',
}

const propertyStatusLabels = {
  available: 'Available',
  under_contract: 'Under Contract',
  sold: 'Sold',
  off_market: 'Off Market',
}

function ProjectCard({ project, onClick }: { project: Project; onClick: () => void }) {
  const Icon = project.is_property ? Home : Folder

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="glass-card cursor-pointer group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${project.color}20` }}
          >
            <Icon className="w-6 h-6" style={{ color: project.color }} />
          </div>
          <div>
            <h3 className="font-medium text-white">{project.name}</h3>
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${statusColors[project.status]}`}
              />
              <span className="text-xs text-white/50 capitalize">
                {project.status.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>
        <button className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-white/10 transition-all">
          <MoreHorizontal className="w-4 h-4 text-white/50" />
        </button>
      </div>

      {/* Property details */}
      {project.is_property && (
        <div className="mb-4 p-3 rounded-xl bg-white/5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-lg font-bold text-white">
              ${project.property_price?.toLocaleString()}
            </span>
            <span className={`text-xs px-2 py-1 rounded-full ${
              project.property_status === 'available'
                ? 'bg-green-500/20 text-green-400'
                : project.property_status === 'under_contract'
                ? 'bg-yellow-500/20 text-yellow-400'
                : 'bg-blue-500/20 text-blue-400'
            }`}>
              {propertyStatusLabels[project.property_status || 'available']}
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-white/60">
            <span className="flex items-center gap-1">
              <Bed className="w-4 h-4" />
              {project.property_beds}
            </span>
            <span className="flex items-center gap-1">
              <Bath className="w-4 h-4" />
              {project.property_baths}
            </span>
            <span className="flex items-center gap-1">
              <Square className="w-4 h-4" />
              {project.property_sqft?.toLocaleString()} sqft
            </span>
          </div>
        </div>
      )}

      {/* Description */}
      <p className="text-sm text-white/60 mb-4 line-clamp-2">
        {project.description}
      </p>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-white/50">Progress</span>
          <span className="text-sm text-white">{project.progress}%</span>
        </div>
        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${project.progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{ backgroundColor: project.color }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-white/40">
        {project.deadline && (
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            Due {format(new Date(project.deadline), 'MMM d')}
          </span>
        )}
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            12 tasks
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            3
          </span>
        </div>
      </div>
    </motion.div>
  )
}

function ProjectDetails({ project, onClose }: { project: Project; onClose: () => void }) {
  const Icon = project.is_property ? Home : Folder

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="glass-card h-full overflow-auto"
    >
      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${project.color}20` }}
        >
          <Icon className="w-8 h-8" style={{ color: project.color }} />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-white mb-1">{project.name}</h2>
          <div className="flex items-center gap-3">
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                statusColors[project.status]
              } bg-opacity-20 text-white`}
            >
              {project.status.replace('_', ' ')}
            </span>
            {project.deadline && (
              <span className="text-sm text-white/50 flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Due {format(new Date(project.deadline), 'MMM d, yyyy')}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Property details */}
      {project.is_property && (
        <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-white/10">
          <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider mb-4">
            Property Details
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-white/50">Address</p>
              <p className="text-white">{project.property_address}</p>
            </div>
            <div>
              <p className="text-sm text-white/50">Price</p>
              <p className="text-2xl font-bold text-white">
                ${project.property_price?.toLocaleString()}
              </p>
            </div>
            <div className="flex gap-6">
              <div>
                <p className="text-sm text-white/50">Beds</p>
                <p className="text-white text-lg">{project.property_beds}</p>
              </div>
              <div>
                <p className="text-sm text-white/50">Baths</p>
                <p className="text-white text-lg">{project.property_baths}</p>
              </div>
              <div>
                <p className="text-sm text-white/50">Sqft</p>
                <p className="text-white text-lg">
                  {project.property_sqft?.toLocaleString()}
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm text-white/50">Status</p>
              <p className="text-white">
                {propertyStatusLabels[project.property_status || 'available']}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Description */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider mb-2">
          Description
        </h3>
        <p className="text-white/80">{project.description}</p>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider">
            Progress
          </h3>
          <span className="text-white font-bold">{project.progress}%</span>
        </div>
        <div className="h-3 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${project.progress}%`,
              backgroundColor: project.color,
            }}
          />
        </div>
      </div>

      {/* Linked items */}
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer transition-all">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-white">Tasks</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white/50">12</span>
            <ChevronRight className="w-4 h-4 text-white/50" />
          </div>
        </div>
        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer transition-all">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-blue-400" />
            <span className="text-white">Files</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white/50">5</span>
            <ChevronRight className="w-4 h-4 text-white/50" />
          </div>
        </div>
        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer transition-all">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-purple-400" />
            <span className="text-white">Contacts</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white/50">3</span>
            <ChevronRight className="w-4 h-4 text-white/50" />
          </div>
        </div>
        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer transition-all">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-orange-400" />
            <span className="text-white">Events</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white/50">2</span>
            <ChevronRight className="w-4 h-4 text-white/50" />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function Projects() {
  const [projects] = useState<Project[]>(sampleProjects)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [filter, setFilter] = useState<'all' | 'projects' | 'properties'>('all')

  const filteredProjects = projects.filter((p) => {
    if (filter === 'all') return true
    if (filter === 'properties') return p.is_property
    return !p.is_property
  })

  return (
    <div className="max-w-7xl mx-auto flex gap-6 h-[calc(100vh-150px)]">
      {/* Project list */}
      <div className={`${selectedProject ? 'w-2/3' : 'flex-1'} flex flex-col`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-white">Projects</h2>
            <div className="flex glass rounded-xl p-1">
              {(['all', 'projects', 'properties'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                    filter === f
                      ? 'bg-indigo-500 text-white'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glass-button-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Project
          </motion.button>
        </div>

        {/* Projects grid */}
        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence>
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={() => setSelectedProject(project)}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Project details */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: '33.333%', opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="flex-shrink-0"
          >
            <ProjectDetails
              project={selectedProject}
              onClose={() => setSelectedProject(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
