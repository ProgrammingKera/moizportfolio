import React, { useState, useEffect } from 'react'
import { Menu, X, Github, Linkedin, Mail, Shield } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { href: '#home', label: 'Home' },
    { href: '#about', label: 'About' },
    { href: '#projects', label: 'Projects' },
    { href: '#skills', label: 'Skills' },
    { href: '#contact', label: 'Contact' }
  ]

  const socialLinks = [
    { href: 'https://github.com/mmoizrashad', icon: Github, label: 'GitHub' },
    { href: 'https://www.linkedin.com/in/muhammad-moiz-rashad-swe', icon: Linkedin, label: 'LinkedIn' },
    { href: 'mailto:mmoizrashad@gmail.com', icon: Mail, label: 'Email' }
  ]

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-gray-900/90 backdrop-blur-md shadow-lg border-b border-gray-700' 
          : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
          >
            Moiz Rashad
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <motion.a
                key={item.href}
                href={item.href}
                whileHover={{ y: -2 }}
                className="text-gray-300 hover:text-blue-400 transition-colors duration-200 font-medium"
              >
                {item.label}
              </motion.a>
            ))}
          </div>

          {/* Social Links & Admin */}
          <div className="hidden md:flex items-center space-x-4">
            {socialLinks.map((link) => (
              <motion.a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                className="p-2 text-gray-400 hover:text-blue-400 transition-colors duration-200"
              >
                <link.icon size={20} />
              </motion.a>
            ))}
            
            {/* Admin Panel Link */}
            <motion.a
              href="/admin"
              whileHover={{ scale: 1.1, y: -2 }}
              className="p-2 text-gray-400 hover:text-purple-400 transition-colors duration-200"
              title="Admin Panel"
            >
              <Shield size={20} />
            </motion.a>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-300"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 py-4 border-t border-gray-700"
            >
              <div className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  <motion.a
                    key={item.href}
                    href={item.href}
                    whileHover={{ x: 10 }}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-gray-300 hover:text-blue-400 transition-colors duration-200 font-medium"
                  >
                    {item.label}
                  </motion.a>
                ))}
                <div className="flex space-x-4 pt-4">
                  {socialLinks.map((link) => (
                    <motion.a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1 }}
                      className="p-2 text-gray-400 hover:text-blue-400 transition-colors duration-200"
                    >
                      <link.icon size={20} />
                    </motion.a>
                  ))}
                  <motion.a
                    href="/admin"
                    whileHover={{ scale: 1.1 }}
                    className="p-2 text-gray-400 hover:text-purple-400 transition-colors duration-200"
                    title="Admin Panel"
                  >
                    <Shield size={20} />
                  </motion.a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  )
}

export default Header