import React, { useState, useEffect } from 'react';

const phrases = [
  "Hi, I'm Felix",
  "I'm a software developer",
  "Networking enthusiast",
  "Let's connect",  
];

export default function App() {
  const [activeTab, setActiveTab] = useState('all');
  const [darkMode, setDarkMode] = useState(true);
  
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);

  // Backend test connection state
  const [serverMessage, setServerMessage] = useState('Connecting to backend...');

  // Contact form state
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState({ submitting: false, message: '', success: false });

  useEffect(() => {
    if (darkMode) {
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
    }
  }, [darkMode]);

  // Fetch test from Flask backend
  useEffect(() => {
    fetch('[https://portfolio-2-uzlj.onrender.com/api/test](https://portfolio-2-uzlj.onrender.com/api/test)')
      .then((res) => res.json())
      .then((data) => setServerMessage(data.message))
      .catch((err) => {
        console.error("Connection error:", err);
        setServerMessage('Failed to connect to backend.');
      });
  }, []);

  // Typewriter effect loop
  useEffect(() => {
    const fullText = phrases[loopNum % phrases.length];
    let timer;

    if (isDeleting) {
      timer = setTimeout(() => {
        setCurrentText(fullText.substring(0, currentText.length - 1));
        if (currentText === '') {
          setIsDeleting(false);
          setLoopNum((prev) => prev + 1);
        }
      }, 50);
    } else {
      timer = setTimeout(() => {
        setCurrentText(fullText.substring(0, currentText.length + 1));
        if (currentText === fullText) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      }, 100);
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, loopNum]);
  
  const projects = [
    {
      title: "SMEP Mobile Loan Platform",
      category: "web",
      description: "Web-based user registration and loan application interface built with PHP, MySQL, and CSS.",
      tech: ["PHP", "MySQL", "CSS"]
    },
    {
      title: "ESP32 Security Alarm",
      category: "embedded",
      description: "MicroPython motion detection system mapping PIR sensors, LEDs, and buzzers on an ESP32 microcontroller.",
      tech: ["MicroPython", "ESP32", "Hardware"]
    },
    {
      title: "Flask Certificate Generator",
      category: "python",
      description: "Python backend using Flask and Pillow (PIL) to dynamically generate and customize certificates from CSV data.",
      tech: ["Python", "Flask", "Pillow"]
    },
    {
      title: "Cisco Packet Tracer Topologies",
      category: "networking",
      description: "Simulated enterprise network architectures featuring VLANs, static routing, switch configuration, and security hardening.",
      tech: ["Cisco CCNA", "Packet Tracer", "Networking"]
    }
  ];

  const filteredProjects = activeTab === 'all' 
    ? projects 
    : projects.filter(p => p.category === activeTab);

  // Handle Contact Form Submission to Flask Backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({ submitting: true, message: 'Sending message...', success: false });

    try {
      const response = await fetch('[https://portfolio-2-uzlj.onrender.com/api/contact](https://portfolio-2-uzlj.onrender.com/api/contact)', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setFormStatus({
          submitting: false,
          message: data.message,
          success: true,
        });
        setFormData({ name: '', email: '', message: '' }); // Clear form
      } else {
        setFormStatus({
          submitting: false,
          message: data.message || 'Something went wrong.',
          success: false,
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setFormStatus({
        submitting: false,
        message: 'Failed to connect to the server.',
        success: false,
      });
    }
  };

  return (
    <div>
      {/* NAVIGATION BAR */}
      <nav>
        <div className="nav-container">
          <span className="logo">FELLAH.DEV</span>
          <div className="nav-links">
            <a href="#about">About</a>
            <a href="#skills">Skills</a>
            <a href="#projects">Projects</a>
            <a href="#contact">Contact</a>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="theme-toggle-btn"
          >
            {darkMode ? '🌙' : '☀️'}
          </button>
        </div>
      </nav>

      {/* BACKEND CONNECTION STATUS BANNER */}
      <div style={{ backgroundColor: '#0f172a', padding: '10px', textAlign: 'center', borderBottom: '1px solid #1e293b', fontSize: '0.9rem', color: '#38bdf8' }}>
        <span>Flask Backend Status: </span>
        <strong style={{ color: '#10b981' }}>{serverMessage}</strong>
      </div>

      {/* HERO SECTION */}
      <section id="about" className="hero">
        <div>
          <div className="badge">AVAILABLE FOR WORK</div>
          <h1 style={{ minHeight: '1.2em', fontSize: '2rem' }}>
            <span>{currentText}</span>
            <span className="typewriter-cursor"></span>
          </h1>
          <p>
            Computer Science practitioner & network engineering student focused on building secure systems, resilient network topologies, and modern web applications.
          </p>
          <div className="hero-buttons">
            <a href="#projects" className="btn-primary">View my work</a>
            <a href="#contact" className="btn-secondary">Get in touch</a>
          </div>
        </div>

        <div className="hero-card">
          <div>
            <span className="hero-card-meta">Core Expertise</span>
            <h3>Systems & Networks</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="card-item">
              <span>Cisco CCNA Routing</span>
              <span>Active</span>
            </div>
            <div className="card-item">
              <span>Full-Stack Development</span>
              <span>React & PHP</span>
            </div>
          </div>
          <div className="status-badge">
            <span className="status-dot"></span>
            Open to projects & collaboration
          </div>
        </div>
      </section>

      {/* SKILLS SECTION */}
      <section id="skills" style={{ backgroundColor: 'rgba(15, 23, 42, 0.4)', borderTop: '1px solid #1e293b', borderBottom: '1px solid #1e293b' }}>
        <h2 className="section-title">Technical Expertise</h2>
        <div className="skills-grid">
          <div className="skill-box">
            <div className="skill-icon">💻</div>
            <h3>Software Development</h3>
            <p>Building responsive frontends with React, Vite, and custom CSS, alongside backend automation using Python, Flask, PHP, MySQL, Java, and C++.</p>
          </div>
          <div className="skill-box">
            <div className="skill-icon">🌐</div>
            <h3>Networking & Cisco</h3>
            <p>Configuring routers and switches via CLI, managing VLANs, IP subnets, static routing, security hardening, and analyzing traffic with Wireshark.</p>
          </div>
          <div className="skill-box">
            <div className="skill-icon">⚙️</div>
            <h3>Systems & Hardware</h3>
            <p>Linux & Windows system administration, shell scripting, permission management, and programming embedded microcontrollers like the ESP32.</p>
          </div>
        </div>
      </section>

      {/* PROJECTS SECTION */}
      <section id="projects">
        <div className="projects-header">
          <div>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 'bold', marginBottom: '8px' }}>Featured Projects</h2>
            <p style={{ color: '#94a3b8' }}>Explore some of my recent work and engineering assignments.</p>
          </div>
          <div className="filter-tabs">
            {['all', 'web', 'python', 'networking', 'embedded'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`filter-btn ${activeTab === tab ? 'active' : ''}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="projects-grid">
          {filteredProjects.map((project, index) => (
            <div key={index} className="project-card">
              <div>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
              </div>
              <div className="tech-tags">
                {project.tech.map((t, i) => (
                  <span key={i} className="tech-tag">{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" style={{ backgroundColor: 'rgba(15, 23, 42, 0.4)', borderTop: '1px solid #1e293b' }}>
        <div className="contact-container">
          <h2 style={{ fontSize: '2.25rem', fontWeight: 'bold', marginBottom: '12px' }}>Let's Connect</h2>
          <p style={{ color: '#94a3b8' }}>Have a project in mind, a networking inquiry, or want to collaborate? Drop a message below.</p>

          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label>Your Name</label>
              <input 
                type="text" 
                required 
                placeholder="John Doe" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                required 
                placeholder="john@example.com" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea 
                rows="4" 
                required 
                placeholder="Let's build something great together..."
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
              ></textarea>
            </div>
            <button type="submit" className="submit-btn" disabled={formStatus.submitting}>
              {formStatus.submitting ? 'Sending...' : 'Send Message'}
            </button>

            {formStatus.message && (
              <div style={{ color: formStatus.success ? '#10b981' : '#ef4444', marginTop: '10px', fontSize: '0.9rem' }}>
                {formStatus.message}
              </div>
            )}
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        © {new Date().getFullYear()} Fellah. Built with Vite, React & External CSS.
      </footer>
    </div>
  );
}