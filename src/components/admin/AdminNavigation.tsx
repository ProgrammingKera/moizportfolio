import React from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  Award, 
  GraduationCap, 
  FolderOpen, 
  FileText, 
  Image, 
  MessageSquare,
  BarChart3,
  LogOut 
} from 'lucide-react'

interface AdminNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
  onLogout: () => void
}

const AdminNavigation = ({ activeTab, onTabChange, onLogout }: AdminNavigationProps) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'skills', label: 'Skills', icon: Award },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'projects', label: 'Projects', icon: FolderOpen },
    { id: 'cv', label: 'CV Management', icon: FileText },
    { id: 'profile', label: 'Profile Image', icon: Image },
    { id: 'messages', label: 'Messages', icon: MessageSquare }
  ]

  return (
    <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <BarChart3 className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Admin Panel</h1>
            <p className="text-sm text-gray-400">Portfolio Management</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {navItems.map((item) => (
            <motion.button
              key={item.id}
              whileHover={{ x: 5 }}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                activeTab === item.id
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </motion.button>
          ))}
        </div>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-700">
        <motion.button
          whileHover={{ scale: 1.02 }}
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
        >
          <LogOut size={20} />
          Logout
        </motion.button>
      </div>
    </div>
  )
}

export default AdminNavigation