import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Code, Database, Globe, Smartphone, Server, Brain, GitBranch, Users } from 'lucide-react'

const Skills = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const skillCategories = [
    {
      title: "Frontend Development",
      icon: Globe,
      color: "from-blue-500 to-cyan-500",
      skills: [
        { name: "HTML5", level: 95 },
        { name: "CSS3", level: 90 },
        { name: "JavaScript", level: 88 },
        { name: "Vue.js", level: 85 },
        { name: "React.js", level: 82 },
        { name: "Bootstrap", level: 90 }
      ]
    },
    {
      title: "Backend Development",
      icon: Server,
      color: "from-green-500 to-emerald-500",
      skills: [
        { name: "Node.js", level: 85 },
        { name: "Express.js", level: 88 },
        { name: "RESTful APIs", level: 85 },
        { name: "PHP", level: 75 },
        { name: "Python Flask", level: 70 }
      ]
    },
    {
      title: "Database & Data",
      icon: Database,
      color: "from-purple-500 to-pink-500",
      skills: [
        { name: "MySQL", level: 85 },
        { name: "Data Structures", level: 80 },
        { name: "Database Design", level: 82 },
        { name: "Data Analytics", level: 75 }
      ]
    },
    {
      title: "Tools & Technologies",
      icon: GitBranch,
      color: "from-orange-500 to-red-500",
      skills: [
        { name: "Git & GitHub", level: 88 },
        { name: "Problem Solving", level: 90 },
        { name: "OOP Principles", level: 85 },
        { name: "Software Architecture", level: 80 }
      ]
    },
    {
      title: "AI & Machine Learning",
      icon: Brain,
      color: "from-indigo-500 to-purple-500",
      skills: [
        { name: "Python", level: 75 },
        { name: "pyDecision", level: 70 },
        { name: "MCDM Algorithms", level: 68 },
        { name: "Data Analysis", level: 72 }
      ]
    },
    {
      title: "Soft Skills",
      icon: Users,
      color: "from-pink-500 to-rose-500",
      skills: [
        { name: "Communication", level: 92 },
        { name: "Team Leadership", level: 88 },
        { name: "Teaching", level: 90 },
        { name: "Project Management", level: 85 }
      ]
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

  const progressVariants = {
    hidden: { width: 0 },
    visible: (level: number) => ({
      width: `${level}%`,
      transition: {
        duration: 1.5,
        ease: "easeOut"
      }
    })
  }

  return (
    <section id="skills" className="py-20 bg-gray-900">
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
                Skills & Expertise
              </span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-8"></div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              A comprehensive overview of my technical skills and professional competencies
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {skillCategories.map((category, categoryIndex) => (
              <motion.div
                key={categoryIndex}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-700"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-xl flex items-center justify-center`}>
                    <category.icon className="text-white" size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-white">{category.title}</h3>
                </div>

                <div className="space-y-4">
                  {category.skills.map((skill, skillIndex) => (
                    <div key={skillIndex}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-300 font-medium">{skill.name}</span>
                        <span className="text-gray-400 text-sm">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <motion.div
                          variants={progressVariants}
                          initial="hidden"
                          animate={inView ? "visible" : "hidden"}
                          custom={skill.level}
                          className={`h-2 bg-gradient-to-r ${category.color} rounded-full`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Professional Skills Summary */}
          <motion.div variants={itemVariants} className="mt-16">
            <div className="bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-700">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">
                Professional Highlights
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Code className="text-white" size={28} />
                  </div>
                  <h4 className="font-bold text-white mb-2">Frontend Frameworks</h4>
                  <p className="text-gray-400 text-sm">React.js, Vue.js with modern CSS frameworks</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Server className="text-white" size={28} />
                  </div>
                  <h4 className="font-bold text-white mb-2">Backend Development</h4>
                  <p className="text-gray-400 text-sm">Node.js, Express.js, RESTful API design</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Database className="text-white" size={28} />
                  </div>
                  <h4 className="font-bold text-white mb-2">Database Management</h4>
                  <p className="text-gray-400 text-sm">MySQL, data modeling, optimization</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <GitBranch className="text-white" size={28} />
                  </div>
                  <h4 className="font-bold text-white mb-2">Development Tools</h4>
                  <p className="text-gray-400 text-sm">Git, GitHub, problem-solving methodologies</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default Skills