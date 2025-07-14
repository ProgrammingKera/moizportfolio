import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Award, GraduationCap, Code, Users } from 'lucide-react'

const About = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

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

  const achievements = [
    {
      icon: GraduationCap,
      title: "BS Software Engineering",
      subtitle: "University of Gujarat (2020-2024)",
      description: "CGPA: 3.52 - Specialized in web technologies and software development principles"
    },
    {
      icon: Award,
      title: "Software Engineering Society",
      subtitle: "Appreciation Award",
      description: "Active member solving complex tasks and managing events"
    },
    {
      icon: Users,
      title: "Class Representative",
      subtitle: "Leadership Recognition",
      description: "Recognized for leadership and communication skills"
    },
    {
      icon: Code,
      title: "Teaching Experience",
      subtitle: "1 Year",
      description: "Sharing knowledge and mentoring students in programming"
    }
  ]

  return (
    <section id="about" className="py-20 bg-gray-900">
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
                About Me
              </span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-8"></div>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <motion.div variants={itemVariants}>
              <h3 className="text-2xl font-bold text-white mb-6">
                Passionate Web Developer & Problem Solver
              </h3>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>
                  I am enthusiastic about pursuing a professional role in web development. I possess extensive knowledge 
                  in software engineering principles and have honed my skills in web technologies through academic 
                  projects and personal initiatives.
                </p>
                <p>
                  My expertise includes HTML, CSS, JavaScript, and modern frameworks like Vue.js and React.js. 
                  I am eager to leverage my technical knowledge and problem-solving abilities to contribute to 
                  innovative web development projects.
                </p>
                <p>
                  I am committed to continuous learning and staying current with industry trends, ensuring that 
                  I can provide the most efficient and modern solutions in my work. My goal is to create 
                  meaningful digital experiences that make a positive impact.
                </p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="relative">
              <div className="bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-700">
                <h4 className="text-xl font-bold text-white mb-6">Quick Facts</h4>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Location:</span>
                    <span className="font-semibold text-gray-200">Gujrat, Pakistan</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Email:</span>
                    <span className="font-semibold text-gray-200">mmoizrashad@gmail.com</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Phone:</span>
                    <span className="font-semibold text-gray-200">+92 344 7562543</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Degree:</span>
                    <span className="font-semibold text-gray-200">BS Software Engineering</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Experience:</span>
                    <span className="font-semibold text-gray-200">1+ Years Teaching</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div variants={itemVariants}>
            <h3 className="text-2xl font-bold text-white mb-8 text-center">
              Education & Achievements
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-700"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                    <achievement.icon className="text-white" size={24} />
                  </div>
                  <h4 className="font-bold text-white mb-2">{achievement.title}</h4>
                  <p className="text-sm text-blue-400 font-semibold mb-2">{achievement.subtitle}</p>
                  <p className="text-gray-400 text-sm">{achievement.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default About