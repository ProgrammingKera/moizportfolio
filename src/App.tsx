import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Contact from './components/Contact'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'
import AdminPanel from './components/AdminPanel'

function App() {
  return (
    <Router>
      <Routes>
        {/* Admin Panel Route */}
        <Route path="/admin" element={<AdminPanel />} />
        
        {/* Main Portfolio Route */}
        <Route path="/" element={
          <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
            <Header />
            <Hero />
            <About />
            <Projects />
            <Skills />
            <Contact />
            <Footer />
            <WhatsAppButton />
          </div>
        } />
      </Routes>
    </Router>
  )
}

export default App