import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ExternalLink, Github, Code, Database, Smartphone, Globe, ShoppingCart, FileText, Users, Award, Mail } from 'lucide-react'
import ProjectModal from './ProjectModal'

const Projects = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedProject, setSelectedProject] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const projects = [
    {
      id: 1,
      title: "PharmaTech",
      subtitle: "Pharmaceutical Management System",
      description: "A complete pharmaceutical solution with modules like product forecasting, vendor integration, real-time dashboards, and analytics. It includes a POS system to streamline inventory and sales tracking.",
      image: "https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=800",
      tech: ["Vue.js", "Node.js", "MySQL", "Express.js"],
      category: "fullstack",
      features: [
        "Product forecasting algorithms",
        "Vendor integration module",
        "Real-time dashboard",
        "Data analytics and reporting",
        "Inventory management",
        "Sales tracking"
      ],
      icon: Database,
      demoUrl: "#",
      githubUrl: "#"
    },
    {
      id: 2,
      title: "POS System",
      subtitle: "Point of Sale Integration",
      description: "User-friendly POS interface that syncs sales and inventory in real-time. Enables smooth retail transactions and generates sales reports for pharmacists.",
      image: "https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=800",
      tech: ["Express.js", "Vue.js", "MySQL"],
      category: "frontend",
      features: [
        "Real-time inventory sync",
        "Transaction processing",
        "Sales reporting",
        "User-friendly interface",
        "Receipt generation"
      ],
      icon: ShoppingCart,
      demoUrl: "#",
      githubUrl: "#"
    },
    {
      id: 3,
      title: "Army Medical Test Website",
      subtitle: "Informational Portal",
      description: "Informative front-end website that guides candidates applying for army medical tests with resources and updates about eligibility and preparation.",
      image: "https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg?auto=compress&cs=tinysrgb&w=800",
      tech: ["HTML", "CSS", "JavaScript"],
      category: "frontend",
      features: [
        "Eligibility information",
        "Preparation resources",
        "Application guidance",
        "Responsive design",
        "Resource downloads"
      ],
      icon: FileText,
      demoUrl: "#",
      githubUrl: "#"
    },
    {
      id: 4,
      title: "EziTech Website Clone",
      subtitle: "Static Website Recreation",
      description: "A static clone of the EziTech official website, made as a practice project to improve front-end skills. It mimics the layout, responsiveness, and styling of the original site.",
      image: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800",
      tech: ["HTML", "CSS", "JavaScript"],
      category: "frontend",
      features: [
        "Pixel-perfect design",
        "Responsive layout",
        "Interactive elements",
        "Modern styling",
        "Cross-browser compatibility"
      ],
      icon: Globe,
      demoUrl: "#",
      githubUrl: "#"
    },
    {
      id: 5,
      title: "Study E-Visa Guidance",
      subtitle: "Educational Counseling Platform",
      description: "A counseling platform for students applying to European universities. Features include scholarship finder, eligibility checker, document upload system, visa guide, and automatic Europass CV generator.",
      image: "https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=800",
      tech: ["HTML", "CSS", "JavaScript", "Node.js", "MySQL"],
      category: "fullstack",
      features: [
        "Scholarship finder",
        "Eligibility checker",
        "Document upload system",
        "Visa guidance",
        "Europass CV generator",
        "University database"
      ],
      icon: Users,
      demoUrl: "#",
      githubUrl: "#"
    },
    {
      id: 6,
      title: "Library Management System",
      subtitle: "Digital Library Solution",
      description: "A web-based system for managing library books, users, and reservations. Includes dashboards for librarians, automatic reservation handling, and overdue tracking.",
      image: "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=800",
      tech: ["HTML", "CSS", "JavaScript", "PHP", "MySQL"],
      category: "fullstack",
      features: [
        "Book catalog management",
        "User registration system",
        "Reservation handling",
        "Overdue tracking",
        "Librarian dashboard",
        "Search functionality"
      ],
      icon: FileText,
      demoUrl: "#",
      githubUrl: "#"
    },
    {
      id: 7,
      title: "PharmaMastermind",
      subtitle: "AI Decision Support System",
      description: "An AI-based inventory decision support system using KPIs like Stock Turnover, Gross Margin, and Backorder Rate. It recommends optimized stock strategies using MCDM algorithms.",
      image: "https://images.pexels.com/photos/3683056/pexels-photo-3683056.jpeg?auto=compress&cs=tinysrgb&w=800",
      tech: ["Python Flask", "pyDecision", "AI/ML"],
      category: "ai",
      features: [
        "KPI analysis",
        "MCDM algorithms",
        "Stock optimization",
        "Predictive analytics",
        "Decision recommendations",
        "Performance metrics"
      ],
      icon: Award,
      status: "In Progress",
      demoUrl: "#",
      githubUrl: "#"
    }
  ]

  const categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'fullstack', label: 'Full Stack' },
    { id: 'frontend', label: 'Frontend' },
    { id: 'ai', label: 'AI/ML' }
  ]

  const filteredProjects = selectedCategory === 'all' 
    ? projects 
    : projects.filter(project => project.category === selectedCategory)

  const openModal = (project: any) => {
    setSelectedProject(project)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedProject(null)
  }

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
    <section id="projects" className="py-20 bg-gray-800">
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="max-w-7xl mx-auto"
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Featured Projects
              </span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-8"></div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Explore my portfolio of web applications, from pharmaceutical management systems to AI-powered solutions
            </p>
          </motion.div>

          {/* Category Filter */}
          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
                }`}
              >
                {category.label}
              </motion.button>
            ))}
          </motion.div>

          {/* Projects Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategory}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  variants={itemVariants}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="bg-gray-900 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-700 cursor-pointer"
                  onClick={() => openModal(project)}
                >
                  <div className="relative overflow-hidden h-48">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                      onError={(e) => {
                        // Fallback to a gradient background if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.parentElement!.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
                          title="View Details"
                          onClick={(e) => {
                            e.stopPropagation()
                            openModal(project)
                          }}
                        >
                          <ExternalLink size={16} />
                        </motion.button>
                        <motion.a
                          href={project.githubUrl}
                          whileHover={{ scale: 1.1 }}
                          className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
                          title="View Code"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Github size={16} />
                        </motion.a>
                      </div>
                    </div>
                    {project.status && (
                      <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {project.status}
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                        <project.icon className="text-white" size={20} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{project.title}</h3>
                        <p className="text-sm text-blue-400 font-semibold">{project.subtitle}</p>
                      </div>
                    </div>

                    <p className="text-gray-400 mb-4 line-clamp-3">{project.description}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tech.map((tech, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm font-medium border border-gray-600"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="space-y-2 mb-4">
                      <h4 className="font-semibold text-white text-sm">Key Features:</h4>
                      <ul className="text-sm text-gray-400 space-y-1">
                        {project.features.slice(0, 3).map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation()
                          openModal(project)
                        }}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all duration-300"
                      >
                        <ExternalLink size={16} />
                        View Details
                      </motion.button>
                      <motion.a
                        href={project.githubUrl}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 border-2 border-gray-600 text-gray-400 rounded-lg hover:border-blue-600 hover:text-blue-400 transition-all duration-300"
                      >
                        <Github size={20} />
                      </motion.a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Call to Action */}
          <motion.div variants={itemVariants} className="text-center mt-16">
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-8 border border-gray-700">
              <h3 className="text-2xl font-bold text-white mb-4">
                Interested in Working Together?
              </h3>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                I'm always excited to take on new challenges and create innovative solutions. 
                Let's discuss how I can help bring your project to life.
              </p>
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300"
              >
                <Mail size={20} />
                Start a Project
              </motion.a>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Project Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </section>
  )
}

export default Projects