import React, { useState, useEffect } from 'react'
import AdminNavigation from './admin/AdminNavigation'
import PersonalInfoManager from './admin/PersonalInfoManager'
import SkillsManager from './admin/SkillsManager'
import MessagesManager from './MessagesManager'

interface AdminDashboardProps {
  onLogout: () => void
}

const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState('dashboard')

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview />
      case 'personal':
        return <PersonalInfoManager />
      case 'skills':
        return <SkillsManager />
      case 'education':
        return <div className="text-white">Education Manager - Coming Soon</div>
      case 'projects':
        return <div className="text-white">Projects Manager - Coming Soon</div>
      case 'cv':
        return <div className="text-white">CV Manager - Coming Soon</div>
      case 'profile':
        return <div className="text-white">Profile Image Manager - Coming Soon</div>
      case 'messages':
        return <MessagesManager />
      default:
        return <DashboardOverview />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="flex h-[calc(100vh-140px)]">
        <AdminNavigation 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          onLogout={onLogout} 
        />
        <div className="flex-1 p-6 overflow-y-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}

// Dashboard Overview Component
const DashboardOverview = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
        <p className="text-gray-400">Welcome to your portfolio admin panel</p>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-2">Personal Info</h3>
          <p className="text-gray-400 text-sm">Manage your basic information</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-2">Skills</h3>
          <p className="text-gray-400 text-sm">Add and update your skills</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-2">Projects</h3>
          <p className="text-gray-400 text-sm">Showcase your work</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-2">Messages</h3>
          <p className="text-gray-400 text-sm">View contact messages</p>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard