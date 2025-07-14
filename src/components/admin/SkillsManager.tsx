import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit, Trash2, Save, X, Award } from 'lucide-react'
import { skillsApi, Skill } from '../../lib/adminApi'

const SkillsManager = () => {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const categories = [
    'Frontend Development',
    'Backend Development',
    'Database & Data',
    'Tools & Technologies',
    'AI & Machine Learning',
    'Soft Skills'
  ]

  const colorOptions = [
    { name: 'Blue to Cyan', value: 'from-blue-500 to-cyan-500' },
    { name: 'Green to Emerald', value: 'from-green-500 to-emerald-500' },
    { name: 'Purple to Pink', value: 'from-purple-500 to-pink-500' },
    { name: 'Orange to Red', value: 'from-orange-500 to-red-500' },
    { name: 'Indigo to Purple', value: 'from-indigo-500 to-purple-500' },
    { name: 'Pink to Rose', value: 'from-pink-500 to-rose-500' },
    { name: 'Yellow to Orange', value: 'from-yellow-500 to-orange-500' },
    { name: 'Gray to Black', value: 'from-gray-500 to-black' }
  ]

  useEffect(() => {
    loadSkills()
  }, [])

  const loadSkills = async () => {
    try {
      setLoading(true)
      const data = await skillsApi.getAll()
      setSkills(data)
    } catch (error: any) {
      setMessage({ type: 'error', text: `Failed to load skills: ${error.message}` })
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingSkill({
      name: '',
      category: categories[0],
      level: 50,
      color: colorOptions[0].value
    })
    setIsCreating(true)
  }

  const handleEdit = (skill: Skill) => {
    setEditingSkill({ ...skill })
    setIsCreating(false)
  }

  const handleSave = async () => {
    if (!editingSkill) return

    try {
      if (isCreating) {
        const newSkill = await skillsApi.create(editingSkill)
        setSkills(prev => [...prev, newSkill])
        setMessage({ type: 'success', text: 'Skill created successfully!' })
      } else {
        const updatedSkill = await skillsApi.update(editingSkill.id!, editingSkill)
        setSkills(prev => prev.map(s => s.id === updatedSkill.id ? updatedSkill : s))
        setMessage({ type: 'success', text: 'Skill updated successfully!' })
      }
      setEditingSkill(null)
      setIsCreating(false)
      setTimeout(() => setMessage(null), 3000)
    } catch (error: any) {
      setMessage({ type: 'error', text: `Failed to save skill: ${error.message}` })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return

    try {
      await skillsApi.delete(id)
      setSkills(prev => prev.filter(s => s.id !== id))
      setMessage({ type: 'success', text: 'Skill deleted successfully!' })
      setTimeout(() => setMessage(null), 3000)
    } catch (error: any) {
      setMessage({ type: 'error', text: `Failed to delete skill: ${error.message}` })
    }
  }

  const handleCancel = () => {
    setEditingSkill(null)
    setIsCreating(false)
  }

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = []
    }
    acc[skill.category].push(skill)
    return acc
  }, {} as Record<string, Skill[]>)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading skills...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Skills Management</h2>
          <p className="text-gray-400">Manage your technical and soft skills</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={handleCreate}
          className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 flex items-center gap-2"
        >
          <Plus size={16} />
          Add Skill
        </motion.button>
      </div>

      {/* Status Message */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg border ${
            message.type === 'success'
              ? 'bg-green-900/30 border-green-500 text-green-200'
              : 'bg-red-900/30 border-red-500 text-red-200'
          }`}
        >
          {message.text}
        </motion.div>
      )}

      {/* Edit Modal */}
      <AnimatePresence>
        {editingSkill && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700"
            >
              <h3 className="text-xl font-bold text-white mb-6">
                {isCreating ? 'Add New Skill' : 'Edit Skill'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Skill Name</label>
                  <input
                    type="text"
                    value={editingSkill.name}
                    onChange={(e) => setEditingSkill(prev => prev ? { ...prev, name: e.target.value } : null)}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., React.js"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Category</label>
                  <select
                    value={editingSkill.category}
                    onChange={(e) => setEditingSkill(prev => prev ? { ...prev, category: e.target.value } : null)}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Skill Level: {editingSkill.level}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={editingSkill.level}
                    onChange={(e) => setEditingSkill(prev => prev ? { ...prev, level: parseInt(e.target.value) } : null)}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Color Theme</label>
                  <div className="grid grid-cols-2 gap-2">
                    {colorOptions.map(color => (
                      <button
                        key={color.value}
                        onClick={() => setEditingSkill(prev => prev ? { ...prev, color: color.value } : null)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          editingSkill.color === color.value
                            ? 'border-blue-500'
                            : 'border-gray-600 hover:border-gray-500'
                        }`}
                      >
                        <div className={`w-full h-4 bg-gradient-to-r ${color.value} rounded mb-1`}></div>
                        <span className="text-xs text-gray-300">{color.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={handleSave}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all duration-300"
                >
                  <Save size={16} />
                  Save
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={handleCancel}
                  className="flex-1 bg-gray-700 text-gray-300 py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-gray-600 transition-colors"
                >
                  <X size={16} />
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skills Grid */}
      <div className="space-y-8">
        {Object.entries(groupedSkills).map(([category, categorySkills]) => (
          <div key={category} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Award size={20} />
              {category}
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categorySkills.map(skill => (
                <motion.div
                  key={skill.id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-gray-700 rounded-lg p-4 border border-gray-600"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-white">{skill.name}</h4>
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        onClick={() => handleEdit(skill)}
                        className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <Edit size={16} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        onClick={() => handleDelete(skill.id!)}
                        className="p-1 text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="flex justify-between text-sm text-gray-400 mb-1">
                      <span>Level</span>
                      <span>{skill.level}%</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <div
                        className={`h-2 bg-gradient-to-r ${skill.color} rounded-full transition-all duration-500`}
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                  <div className={`w-full h-1 bg-gradient-to-r ${skill.color} rounded mt-2`}></div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SkillsManager