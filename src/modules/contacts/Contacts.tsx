import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Search,
  Phone,
  Mail,
  MapPin,
  Star,
  MoreHorizontal,
  User,
  Building,
  Edit,
  Trash2,
} from 'lucide-react'
import type { Contact } from '../../types'

// Sample data
const sampleContacts: Contact[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '(555) 123-4567',
    company: 'Tech Corp',
    job_title: 'Product Manager',
    category: 'work',
    favorite: true,
    created_at: Date.now(),
    updated_at: Date.now(),
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.chen@email.com',
    phone: '(555) 234-5678',
    company: 'Design Studio',
    job_title: 'Lead Designer',
    category: 'work',
    favorite: false,
    created_at: Date.now(),
    updated_at: Date.now(),
  },
  {
    id: '3',
    name: 'Emily Davis',
    email: 'emily.d@email.com',
    phone: '(555) 345-6789',
    category: 'personal',
    favorite: true,
    notes: 'Met at the conference last month',
    created_at: Date.now(),
    updated_at: Date.now(),
  },
  {
    id: '4',
    name: 'James Wilson',
    email: 'james.w@realestate.com',
    phone: '(555) 456-7890',
    company: 'Premier Realty',
    job_title: 'Real Estate Agent',
    category: 'work',
    favorite: false,
    created_at: Date.now(),
    updated_at: Date.now(),
  },
  {
    id: '5',
    name: 'Savannah',
    email: 'savannah@email.com',
    phone: '(555) 567-8901',
    category: 'personal',
    favorite: true,
    notes: 'Love of my life',
    created_at: Date.now(),
    updated_at: Date.now(),
  },
]

const categories = [
  { id: 'all', label: 'All Contacts', icon: User },
  { id: 'favorites', label: 'Favorites', icon: Star },
  { id: 'work', label: 'Work', icon: Building },
  { id: 'personal', label: 'Personal', icon: User },
]

function ContactCard({ contact, isSelected, onClick }: {
  contact: Contact
  isSelected: boolean
  onClick: () => void
}) {
  const initials = contact.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const colors = [
    'from-pink-500 to-rose-500',
    'from-blue-500 to-cyan-500',
    'from-purple-500 to-indigo-500',
    'from-green-500 to-emerald-500',
    'from-orange-500 to-amber-500',
  ]
  const colorIndex = contact.name.charCodeAt(0) % colors.length

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ x: 4 }}
      onClick={onClick}
      className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all ${
        isSelected ? 'bg-indigo-500/20' : 'hover:bg-white/5'
      }`}
    >
      {/* Avatar */}
      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${colors[colorIndex]} flex items-center justify-center text-white font-bold`}>
        {contact.photo ? (
          <img src={contact.photo} alt={contact.name} className="w-full h-full rounded-full object-cover" />
        ) : (
          initials
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium text-white truncate">{contact.name}</p>
          {contact.favorite && (
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 flex-shrink-0" />
          )}
        </div>
        <p className="text-sm text-white/50 truncate">
          {contact.company || contact.email}
        </p>
      </div>
    </motion.div>
  )
}

function ContactDetails({ contact, onEdit, onDelete }: {
  contact: Contact
  onEdit: () => void
  onDelete: () => void
}) {
  const initials = contact.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="glass-card h-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white">
            {initials}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-white">{contact.name}</h2>
              {contact.favorite && (
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              )}
            </div>
            {contact.job_title && contact.company && (
              <p className="text-white/60">
                {contact.job_title} at {contact.company}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            className="p-2 rounded-xl hover:bg-white/10 transition-colors"
          >
            <Edit className="w-5 h-5 text-white/60" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 rounded-xl hover:bg-red-500/20 transition-colors"
          >
            <Trash2 className="w-5 h-5 text-white/60" />
          </button>
        </div>
      </div>

      {/* Contact info */}
      <div className="space-y-4">
        {contact.email && (
          <a
            href={`mailto:${contact.email}`}
            className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Mail className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-white/50">Email</p>
              <p className="text-white">{contact.email}</p>
            </div>
          </a>
        )}

        {contact.phone && (
          <a
            href={`tel:${contact.phone}`}
            className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
              <Phone className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-white/50">Phone</p>
              <p className="text-white">{contact.phone}</p>
            </div>
          </a>
        )}

        {contact.address && (
          <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-white/50">Address</p>
              <p className="text-white">{contact.address}</p>
            </div>
          </div>
        )}

        {contact.company && (
          <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
              <Building className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-white/50">Company</p>
              <p className="text-white">{contact.company}</p>
            </div>
          </div>
        )}
      </div>

      {/* Notes */}
      {contact.notes && (
        <div className="mt-6 pt-6 border-t border-white/10">
          <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider mb-3">
            Notes
          </h3>
          <p className="text-white/80">{contact.notes}</p>
        </div>
      )}

      {/* Quick actions */}
      <div className="mt-6 pt-6 border-t border-white/10 flex gap-3">
        {contact.email && (
          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href={`mailto:${contact.email}`}
            className="flex-1 glass-button-primary text-center"
          >
            Send Email
          </motion.a>
        )}
        {contact.phone && (
          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href={`tel:${contact.phone}`}
            className="flex-1 glass-button text-center"
          >
            Call
          </motion.a>
        )}
      </div>
    </div>
  )
}

export default function Contacts() {
  const [contacts, setContacts] = useState<Contact[]>(sampleContacts)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredContacts = contacts
    .filter((c) => {
      if (selectedCategory === 'all') return true
      if (selectedCategory === 'favorites') return c.favorite
      return c.category === selectedCategory
    })
    .filter(
      (c) =>
        !searchQuery ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.company?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name))

  const handleDeleteContact = (id: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== id))
    if (selectedContact?.id === id) {
      setSelectedContact(null)
    }
  }

  return (
    <div className="max-w-7xl mx-auto flex gap-6 h-[calc(100vh-150px)]">
      {/* Sidebar */}
      <div className="w-72 flex-shrink-0 flex flex-col">
        <div className="glass-card flex-1 flex flex-col">
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="glass-input pl-10 py-2 text-sm"
            />
          </div>

          {/* Categories */}
          <div className="space-y-1 mb-4 pb-4 border-b border-white/10">
            {categories.map((cat) => {
              const Icon = cat.icon
              const count =
                cat.id === 'all'
                  ? contacts.length
                  : cat.id === 'favorites'
                  ? contacts.filter((c) => c.favorite).length
                  : contacts.filter((c) => c.category === cat.id).length
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-indigo-500/20 text-white'
                      : 'text-white/70 hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{cat.label}</span>
                  <span className="ml-auto text-sm text-white/50">{count}</span>
                </button>
              )
            })}
          </div>

          {/* Contact list */}
          <div className="flex-1 overflow-auto space-y-1">
            <AnimatePresence>
              {filteredContacts.map((contact) => (
                <ContactCard
                  key={contact.id}
                  contact={contact}
                  isSelected={selectedContact?.id === contact.id}
                  onClick={() => setSelectedContact(contact)}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Add contact button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="glass-button-primary w-full flex items-center justify-center gap-2 mt-4"
          >
            <Plus className="w-4 h-4" />
            Add Contact
          </motion.button>
        </div>
      </div>

      {/* Contact details */}
      <div className="flex-1">
        <AnimatePresence mode="wait">
          {selectedContact ? (
            <motion.div
              key={selectedContact.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full"
            >
              <ContactDetails
                contact={selectedContact}
                onEdit={() => console.log('Edit contact')}
                onDelete={() => handleDeleteContact(selectedContact.id)}
              />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card h-full flex items-center justify-center"
            >
              <div className="text-center">
                <User className="w-16 h-16 mx-auto mb-4 text-white/20" />
                <p className="text-white/50">Select a contact to view details</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
