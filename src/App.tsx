import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wrench, 
  ShieldAlert, 
  Database, 
  Cpu, 
  Phone, 
  Mail, 
  MapPin, 
  ArrowRight, 
  CheckCircle2, 
  Menu, 
  X,
  Laptop,
  Monitor,
  HardDrive,
  Cpu as CpuIcon,
  ShieldCheck,
  RefreshCw,
  Search
} from 'lucide-react';
import { Link } from 'react-scroll';
import { cn } from './lib/utils';

import { Logo } from './components/Logo';

// --- Components ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', to: 'home' },
    { name: 'Services', to: 'services' },
    { name: 'About', to: 'about' },
    { name: 'Contact', to: 'contact' },
  ];

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
      isScrolled 
        ? "bg-white/80 backdrop-blur-md border-slate-200 py-3 shadow-sm" 
        : "bg-transparent border-transparent py-5"
    )}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Logo className={cn(
          "cursor-pointer transition-opacity",
          !isScrolled && "md:opacity-100"
        )} />

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.to}
              smooth={true}
              duration={500}
              className={cn(
                "text-sm font-medium transition-colors cursor-pointer hover:text-blue-600",
                isScrolled ? "text-slate-600" : "text-slate-800"
              )}
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="contact"
            smooth={true}
            className="bg-slate-900 text-white px-6 py-3 rounded-full text-xs font-bold hover:bg-blue-600 transition-all shadow-lg cursor-pointer uppercase tracking-widest"
          >
            Get Help
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-slate-900"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white border-b border-slate-200 p-6 md:hidden shadow-xl"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.to}
                  smooth={true}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-semibold text-slate-900"
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="contact"
                smooth={true}
                onClick={() => setIsMobileMenuOpen(false)}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl text-center font-bold"
              >
                Book Repair
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  return (
    <section id="home" className="relative min-height-[90vh] flex items-center pt-20 overflow-hidden">
      {/* Background Decals */}
      <div className="absolute top-0 right-0 -z-10 w-1/2 h-full opacity-[0.03] pointer-events-none">
        <CpuIcon className="w-full h-full rotate-12" />
      </div>
      <div className="absolute -bottom-20 -left-20 -z-10 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <div className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-extrabold rounded-full mb-6 uppercase tracking-widest">
            #1 Computer Repair Specialist in Moray
          </div>
          <h1 className="text-6xl md:text-7xl font-extrabold text-slate-900 leading-[1.1] mb-6">
            Don't Replace.<br />
            <span className="text-blue-600 accent-underline">Revive It.</span>
          </h1>
          <p className="text-lg text-slate-600 mb-10 max-w-lg leading-relaxed">
            Professional PC repairs, upgrades, and virus removal in Moray. 
            We ensure your technology runs smoothly so you can focus on what matters.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="contact" smooth={true} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all hover:translate-y-[-2px] shadow-xl shadow-blue-200 cursor-pointer">
              Book a Free Diagnosis <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="services" smooth={true} className="bg-white text-slate-900 border-2 border-slate-200 px-8 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all cursor-pointer">
              Our Services
            </Link>
          </div>
          
          <div className="mt-12 flex items-center gap-6">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold overflow-hidden">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="User" />
                </div>
              ))}
            </div>
            <div className="text-sm">
              <span className="block font-bold text-slate-900">500+ Satisfied Customers</span>
              <div className="flex items-center gap-0.5 text-amber-400">
                {"★★★★★".split("").map((s, i) => <span key={i}>{s}</span>)}
                <span className="ml-1 text-slate-500 font-medium">4.9/5 Rating</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
           whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
           transition={{ duration: 1, ease: "circOut" }}
           viewport={{ once: true }}
           className="relative"
        >
          <div className="relative z-10 bg-white rounded-[2rem] shadow-2xl overflow-hidden border-8 border-white group">
            <div className="aspect-[4/3] overflow-hidden bg-slate-100">
              <img 
                src="https://images.unsplash.com/photo-1588508065123-287b28e013da?q=80&w=2070&auto=format&fit=crop" 
                alt="Technical Repair Workspace" 
                className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
              />
            </div>
            {/* Overlay UI elements */}
            <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg text-slate-900 font-bold text-[10px] uppercase shadow-lg border border-white/20">
              Active Optimization
            </div>
          </div>
          
          {/* Decorative Badge */}
          <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-4 z-20">
            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900 leading-none mb-1">9+</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Years Exp</p>
            </div>
          </div>
          {/* Background shapes */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] border-2 border-slate-100 rounded-[3rem] -z-10" />
        </motion.div>
      </div>
    </section>
  );
};

const Services = () => {
  const serviceGroups = [
    {
      title: "Core Repair",
      icon: <Monitor className="w-6 h-6" />,
      services: [
        "Desktop & Laptop Repairs",
        "Operating System Fixes",
        "Blue Screen Troubleshooting",
        "Screen & Keyboard Replacement",
        "Power & Port Repairs"
      ]
    },
    {
      title: "Hardware Upgrades",
      icon: <CpuIcon className="w-6 h-6" />,
      services: [
        "SSD Upgrades & Migration",
        "RAM & GPU Upgrades",
        "Custom PC Builds",
        "CPU & Motherboard Replacement",
        "Cooling System Optimization"
      ]
    },
    {
      title: "Security & Speed",
      icon: <ShieldCheck className="w-6 h-6" />,
      services: [
        "Virus & Malware Removal",
        "System Optimization",
        "Security Software Setup",
        "Ransomware Recovery",
        "Performance Audits"
      ]
    },
    {
      title: "Data Services",
      icon: <Database className="w-6 h-6" />,
      services: [
        "Expert Data Recovery",
        "Secure Data Transfers",
        "Drive Cloning",
        "Cloud & Local Backups",
        "Storage Solutions"
      ]
    }
  ];

  return (
    <section id="services" className="py-24 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-blue-600 font-extrabold tracking-widest uppercase text-xs mb-4">Our Expertise</h2>
            <h3 className="text-4xl font-bold text-slate-900 leading-tight">Keeping your technology running at its absolute best.</h3>
          </div>
          <p className="text-slate-500 max-w-sm text-sm">Reliable, efficient, and customer-focused service tailored to local individuals and small businesses.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {serviceGroups.map((group, idx) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 hover:bg-white hover:shadow-2xl hover:border-transparent transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-6 shadow-sm text-slate-500 group-hover:text-blue-600 transition-colors">
                {group.icon}
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-4 tracking-tight">{group.title}</h4>
              <ul className="space-y-3">
                {group.services.map(s => (
                  <li key={s} className="flex items-start gap-2 text-sm text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = `Repair Inquiry - ${formData.firstName} ${formData.lastName}`;
    const body = `Customer Name: ${formData.firstName} ${formData.lastName}\nEmail: ${formData.email}\n\nProblem Description:\n${formData.description}`;
    
    window.location.href = `mailto:info@revive-it.uk?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <section id="contact" className="py-24 bg-slate-50 border-t border-slate-100 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-white rounded-[3rem] p-8 md:p-16 flex flex-col md:grid md:grid-cols-2 gap-16 items-center overflow-hidden relative shadow-2xl border border-slate-100">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 blur-3xl rounded-full translate-x-20 -translate-y-20 opacity-50" />
          
          <div className="relative z-10 text-slate-900">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">Need a fix? <br /><span className="text-blue-600 accent-underline">Let's get started.</span></h2>
            <p className="text-slate-500 text-lg mb-10 max-w-sm">
              Get in touch for a free diagnosis. We serve Moray and surroundings with reliable computer support.
            </p>
            
            <div className="space-y-6">
              <a href="tel:07763817558" className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Call us</p>
                  <p className="text-xl font-black">07763 817558</p>
                </div>
              </a>
              <a href="mailto:Info@revive-it.uk" className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Email us</p>
                  <p className="text-xl font-black text-nowrap">Info@revive-it.uk</p>
                </div>
              </a>
            </div>
          </div>

          <div className="w-full bg-slate-50 p-8 rounded-[2rem] shadow-sm relative z-10 border border-slate-100">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">First Name</label>
                  <input 
                    type="text" 
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all font-medium" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Last Name</label>
                  <input 
                    type="text" 
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all font-medium" 
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all font-medium" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Issue Description</label>
                <textarea 
                  rows={4} 
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all resize-none font-medium"
                ></textarea>
              </div>
              <button 
                type="submit"
                className="w-full bg-slate-900 text-white font-black py-4 rounded-xl hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
              >
                Send Message <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="py-12 bg-slate-50 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <Logo />
          
          <div className="flex items-center gap-8 text-[10px] font-bold uppercase tracking-widest">
            <Link to="home" smooth={true} className="text-blue-600 border-b-2 border-blue-600 pb-1 cursor-pointer">Home</Link>
            <Link to="services" smooth={true} className="text-slate-500 hover:text-blue-600 transition-colors cursor-pointer">Services</Link>
            <Link to="contact" smooth={true} className="text-slate-500 hover:text-blue-600 transition-colors cursor-pointer">Contact</Link>
          </div>

          <div className="text-right">
            <p className="text-xl font-black text-slate-900">07763 817558</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

const WhyChooseUs = () => {
  const points = [
    {
      title: "9+ Years Experience",
      desc: "Delivering professional PC repairs, upgrades, and virus removal with long-standing expertise.",
      icon: <Wrench className="w-6 h-6" />
    },
    {
      title: "Free Diagnosis",
      desc: "Honest assessment before any repair work begins, ensuring transparency and trust.",
      icon: <Search className="w-6 h-6" />
    },
    {
      title: "Convenient Service",
      desc: "Pickup and drop-off available across Moray, making the repair process stress-free.",
      icon: <ArrowRight className="w-6 h-6" />
    }
  ];

  return (
    <section id="about" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="flex-1">
            <h2 className="text-blue-600 font-extrabold tracking-widest uppercase text-sm mb-4">Why Choose Us</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8 leading-tight">
              Honest, Fast, and Professional <br /> Support for Moray.
            </h3>
            
            <div className="space-y-10">
              {points.map((point, idx) => (
                <motion.div 
                  key={point.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="flex gap-6"
                >
                  <div className="w-14 h-14 shrink-0 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold">
                    {point.icon}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 mb-2">{point.title}</h4>
                    <p className="text-slate-600 max-w-sm">{point.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          <div className="flex-1 relative">
            <div className="grid grid-cols-2 gap-4">
              <motion.img 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                src="https://images.unsplash.com/photo-1597733336794-12d05021d510?q=80&w=1974&auto=format&fit=crop" 
                className="w-full aspect-[4/5] object-cover rounded-[2rem] shadow-lg" 
              />
              <div className="space-y-4 pt-12">
                <motion.img 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  src="https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=2030&auto=format&fit=crop" 
                  className="w-full aspect-[4/5] object-cover rounded-[2rem] shadow-lg" 
                />
                <div className="bg-blue-600 p-8 rounded-[2rem] text-white">
                  <p className="text-lg font-bold mb-2">Local Support</p>
                  <p className="text-sm opacity-80">Serving Moray with pride for nearly a decade.</p>
                </div>
              </div>
            </div>
            {/* Decal */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-slate-900 rounded-full flex items-center justify-center text-white font-bold p-6 text-center border-4 border-white">
              <span className="text-xs leading-tight">CERTIFIED EXPERT REPAIR</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Main App ---

export default function App() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      <Navbar />
      <main>
        <Hero />
        <Services />
        <WhyChooseUs />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
