import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, Database } from 'lucide-react'
import { supabase, ContactMessage, testConnection } from '../lib/supabase'

const Contact = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking')
  const [errorMessage, setErrorMessage] = useState('')

  // Test connection on component mount
  useEffect(() => {
    const checkConnection = async () => {
      console.log('🔄 Testing Supabase connection...')
      try {
        const { data, error } = await supabase
          .from('contact_messages')
          .select('count', { count: 'exact' })
          .limit(1)
        
        if (error) {
          console.error('❌ Connection test failed:', error)
          setConnectionStatus('error')
          setErrorMessage(error.message)
        } else {
          console.log('✅ Connection successful!')
          setConnectionStatus('connected')
          setErrorMessage('')
        }
      } catch (err: any) {
        console.error('❌ Connection error:', err)
        setConnectionStatus('error')
        setErrorMessage(err.message)
      }
    }
    checkConnection()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      console.log('📤 Submitting form data:', formData)
      
      // Clean and validate form data
      const cleanData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim()
      }

      // Validate required fields
      if (!cleanData.name || !cleanData.email || !cleanData.subject || !cleanData.message) {
        throw new Error('All fields are required')
      }

      // Try direct insert with service role bypass
      console.log('🔄 Attempting to insert message...')
      
      const { data, error } = await supabase
        .from('contact_messages')
        .insert([cleanData])
        .select()

      if (error) {
        console.error('❌ Supabase insert error:', error)
        console.error('Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        
        // Try alternative approach - direct RPC call
        console.log('🔄 Trying alternative insert method...')
        const { data: rpcData, error: rpcError } = await supabase.rpc('insert_contact_message', {
          p_name: cleanData.name,
          p_email: cleanData.email,
          p_subject: cleanData.subject,
          p_message: cleanData.message
        })
        
        if (rpcError) {
          console.error('❌ RPC insert also failed:', rpcError)
          throw new Error(`Database error: ${error.message}`)
        }
        
        console.log('✅ Message saved via RPC:', rpcData)
      } else {
        console.log('✅ Message saved successfully:', data)
      }

      setSubmitStatus('success')
      setFormData({ name: '', email: '', subject: '', message: '' })
      
      // Reset status after 5 seconds
      setTimeout(() => setSubmitStatus('idle'), 5000)
    } catch (error: any) {
      console.error('❌ Error submitting form:', error)
      setSubmitStatus('error')
      setErrorMessage(error.message)
      setTimeout(() => setSubmitStatus('idle'), 5000)
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: "mmoizrashad@gmail.com",
      href: "mailto:mmoizrashad@gmail.com"
    },
    {
      icon: Phone,
      title: "Phone",
      value: "+92 344 7562543",
      href: "tel:+923447562543"
    },
    {
      icon: MapPin,
      title: "Location",
      value: "Mohallah Sheikhan Sarai Alamgir, Gujrat, Pakistan",
      href: "#"
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  }

  return (
    <section id="contact" className="py-20 bg-gray-800">
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="max-w-6xl mx-auto"
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Get In Touch
              </span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-8"></div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Ready to start your next project? Let's discuss how we can work together to bring your ideas to life.
            </p>
            
            {/* Database Connection Status */}
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm">
              {connectionStatus === 'checking' && (
                <div className="flex items-center gap-2 text-yellow-400 bg-yellow-900/30 px-4 py-2 rounded-full border border-yellow-600">
                  <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                  <span>Checking database connection...</span>
                </div>
              )}
              {connectionStatus === 'connected' && (
                <div className="flex items-center gap-2 text-green-400 bg-green-900/30 px-4 py-2 rounded-full border border-green-600">
                  <Database size={16} />
                  <span>Database connected - Ready to receive messages!</span>
                </div>
              )}
              {connectionStatus === 'error' && (
                <div className="flex items-center gap-2 text-red-400 bg-red-900/30 px-4 py-2 rounded-full border border-red-600">
                  <AlertCircle size={16} />
                  <span>Database connection failed: {errorMessage}</span>
                </div>
              )}
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <motion.div variants={itemVariants} className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-white mb-6">Let's Connect</h3>
                <p className="text-gray-300 mb-8 leading-relaxed">
                  I'm always interested in new opportunities and exciting projects. 
                  Whether you have a question about my work, want to discuss a potential 
                  collaboration, or just want to say hello, I'd love to hear from you.
                </p>
              </div>

              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ x: 10 }}
                    className="flex items-center gap-4 p-4 bg-gray-900 rounded-xl hover:bg-gray-700 transition-colors duration-300 border border-gray-700"
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                      <info.icon className="text-white" size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{info.title}</h4>
                      {info.href !== "#" ? (
                        <a
                          href={info.href}
                          className="text-gray-300 hover:text-blue-400 transition-colors duration-200"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-gray-300">{info.value}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
                <h4 className="text-xl font-bold mb-3">Available for Work</h4>
                <p className="mb-4">
                  I'm currently open to new opportunities and freelance projects. 
                  Let's discuss how I can help bring your vision to life.
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm">Available for hire</span>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div variants={itemVariants}>
              <form onSubmit={handleSubmit} className="bg-gray-900 rounded-2xl p-8 space-y-6 border border-gray-700">
                <h3 className="text-2xl font-bold text-white mb-6">Send a Message</h3>

                {/* Status Messages */}
                {submitStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 p-4 bg-green-900/30 text-green-400 rounded-lg border border-green-600"
                  >
                    <CheckCircle size={20} />
                    <span>Message sent successfully! I'll get back to you soon.</span>
                  </motion.div>
                )}

                {submitStatus === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 p-4 bg-red-900/30 text-red-400 rounded-lg border border-red-600"
                  >
                    <AlertCircle size={20} />
                    <div>
                      <p>Failed to send message: {errorMessage}</p>
                      <p className="text-sm mt-1">Please try again or contact me directly.</p>
                    </div>
                  </motion.div>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200 bg-gray-800 text-white placeholder-gray-400"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-300 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200 bg-gray-800 text-white placeholder-gray-400"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-gray-300 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200 bg-gray-800 text-white placeholder-gray-400"
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-300 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200 resize-none bg-gray-800 text-white placeholder-gray-400"
                    placeholder="Tell me about your project or inquiry..."
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting || connectionStatus === 'error'}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold flex items-center justify-center gap-3 hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Send Message
                    </>
                  )}
                </motion.button>

                {connectionStatus === 'error' && (
                  <div className="text-center">
                    <p className="text-red-400 text-sm">
                      ⚠️ Database connection failed. Please try again later.
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      Error: {errorMessage}
                    </p>
                  </div>
                )}
              </form>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Contact