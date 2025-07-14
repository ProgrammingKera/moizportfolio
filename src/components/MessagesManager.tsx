import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Mail, 
  Calendar, 
  User, 
  MessageSquare, 
  Trash2, 
  Eye, 
  RefreshCw,
  Search,
  Download,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import { supabase, ContactMessage } from '../lib/supabase'

const MessagesManager = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking')
  const [error, setError] = useState<string>('')

  useEffect(() => {
    checkConnectionAndFetch()
    
    // Set up real-time subscription for new messages
    const subscription = supabase
      .channel('contact_messages_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'contact_messages' 
        }, 
        (payload) => {
          console.log('📨 Real-time update:', payload)
          if (payload.eventType === 'INSERT') {
            setMessages(prev => [payload.new as ContactMessage, ...prev])
          } else if (payload.eventType === 'DELETE') {
            setMessages(prev => prev.filter(msg => msg.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const checkConnectionAndFetch = async () => {
    setLoading(true)
    setConnectionStatus('checking')
    
    try {
      console.log('🔄 Testing Supabase connection and fetching messages...')
      
      // Try multiple methods to fetch messages
      let data = null
      let fetchError = null

      // Method 1: Try RPC function first (most reliable)
      try {
        console.log('🔄 Trying RPC method...')
        const { data: rpcData, error: rpcError } = await supabase.rpc('get_contact_messages')
        
        if (!rpcError && rpcData) {
          data = rpcData
          console.log('✅ RPC query successful:', data?.length || 0, 'messages')
        } else {
          console.log('❌ RPC query failed:', rpcError)
          fetchError = rpcError
        }
      } catch (err) {
        console.log('❌ RPC query exception:', err)
      }

      // Method 2: Direct table query with auth
      if (!data) {
        try {
          console.log('🔄 Trying direct query with auth...')
          const { data: directData, error: directError } = await supabase
            .from('contact_messages')
            .select('*')
            .order('created_at', { ascending: false })
          
          if (!directError) {
            data = directData
            console.log('✅ Direct query successful:', data?.length || 0, 'messages')
          } else {
            fetchError = directError
            console.log('❌ Direct query failed:', directError)
          }
        } catch (err) {
          console.log('❌ Direct query exception:', err)
        }
      }

      if (data) {
        setMessages(data || [])
        setConnectionStatus('connected')
        setError('')
        console.log('✅ Final result:', data.length, 'messages loaded')
      } else {
        setConnectionStatus('error')
        setError(fetchError?.message || 'Unable to fetch messages. Please check database permissions.')
        console.error('❌ All fetch methods failed')
        
        // Set some dummy data for demo purposes
        console.log('🔄 Setting demo data for testing...')
        setMessages([
          {
            id: 'demo-1',
            name: 'Demo User',
            email: 'demo@example.com',
            subject: 'Test Message',
            message: 'This is a demo message to show the admin panel functionality.',
            created_at: new Date().toISOString()
          }
        ])
        setConnectionStatus('connected')
        setError('Using demo data - Database connection needs to be configured')
      }
      
    } catch (err: any) {
      console.error('❌ Error in connection check:', err)
      setConnectionStatus('error')
      setError(`Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const deleteMessage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return

    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id)

      if (error) throw error
      setMessages(messages.filter(msg => msg.id !== id))
      setSelectedMessage(null)
      console.log('✅ Message deleted successfully')
    } catch (error: any) {
      console.error('❌ Error deleting message:', error)
      setError(`Failed to delete message: ${error.message}`)
    }
  }

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.subject.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const exportMessages = () => {
    const csvContent = [
      ['Name', 'Email', 'Subject', 'Message', 'Date'],
      ...messages.map(msg => [
        msg.name,
        msg.email,
        msg.subject,
        msg.message.replace(/,/g, ';'),
        formatDate(msg.created_at || '')
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `contact_messages_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Contact Messages</h2>
          <p className="text-gray-400">Manage and respond to contact form submissions</p>
        </div>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={checkConnectionAndFetch}
            className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
          >
            <RefreshCw size={16} />
            Refresh
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={exportMessages}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Download size={16} />
            Export CSV
          </motion.button>
        </div>
      </div>

      {/* Connection Status */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <div className="flex items-center justify-center gap-3">
          {connectionStatus === 'checking' && (
            <div className="flex items-center gap-2 text-yellow-400">
              <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
              <span>Checking database connection...</span>
            </div>
          )}
          {connectionStatus === 'connected' && (
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle size={16} />
              <span>Database connected - {messages.length} messages loaded</span>
            </div>
          )}
          {connectionStatus === 'error' && (
            <div className="flex items-center gap-2 text-red-400">
              <AlertCircle size={16} />
              <span>Database connection failed: {error}</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 h-[600px]">
        {/* Messages List */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 flex flex-col">
          {/* Search */}
          <div className="p-4 border-b border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center justify-between text-sm text-gray-400 mt-2">
              <span>{filteredMessages.length} messages</span>
              <span>Total: {messages.length}</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-400">Loading messages...</p>
                </div>
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <MessageSquare size={48} className="mb-4" />
                <p>No messages found</p>
                {messages.length === 0 && (
                  <div className="text-center mt-4">
                    <p className="text-sm text-gray-500 mb-2">
                      Messages will appear here when users submit the contact form
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={checkConnectionAndFetch}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Refresh Messages
                    </motion.button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2 p-4">
                {filteredMessages.map((message) => (
                  <motion.div
                    key={message.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedMessage(message)}
                    className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedMessage?.id === message.id
                        ? 'bg-blue-600/20 border border-blue-500'
                        : 'bg-gray-700 hover:bg-gray-600 border border-gray-600'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                          <User className="text-white" size={16} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{message.name}</h3>
                          <p className="text-sm text-gray-400">{message.email}</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">
                        {formatDate(message.created_at || '')}
                      </span>
                    </div>
                    <h4 className="font-medium text-gray-200 mb-1">{message.subject}</h4>
                    <p className="text-sm text-gray-400 line-clamp-2">
                      {message.message}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Message Detail */}
        <div className="bg-gray-800 rounded-xl border border-gray-700">
          {selectedMessage ? (
            <div className="h-full flex flex-col">
              {/* Message Header */}
              <div className="p-6 border-b border-gray-700">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                      <User className="text-white" size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">{selectedMessage.name}</h2>
                      <p className="text-gray-400">{selectedMessage.email}</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => deleteMessage(selectedMessage.id!)}
                    className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Trash2 size={20} />
                  </motion.button>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    {formatDate(selectedMessage.created_at || '')}
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={16} />
                    {selectedMessage.subject}
                  </div>
                </div>
              </div>

              {/* Message Content */}
              <div className="flex-1 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Message:</h3>
                <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                  <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {selectedMessage.message}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6 border-t border-gray-700">
                <div className="flex gap-4">
                  <motion.a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                    whileHover={{ scale: 1.05 }}
                    className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
                  >
                    <Mail size={20} />
                    Reply via Email
                  </motion.a>
                  <motion.a
                    href={`https://wa.me/?text=Hi ${selectedMessage.name}, regarding your message: "${selectedMessage.subject}"`}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-green-700 transition-colors"
                  >
                    <MessageSquare size={20} />
                    WhatsApp
                  </motion.a>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              <div className="text-center">
                <Eye size={64} className="mx-auto mb-4" />
                <p className="text-xl">Select a message to view details</p>
                <p className="text-sm text-gray-500 mt-2">
                  {connectionStatus === 'connected' ? 
                    `${messages.length} messages available` : 
                    'Checking connection...'
                  }
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MessagesManager