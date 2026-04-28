import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
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
  Search,
  MessageSquare,
  MessageSquareText,
  FileText,
  Star,
  Truck,
  Calendar,
  Facebook,
  ChevronDown,
  HelpCircle,
  Tag,
  Briefcase,
  ExternalLink
} from 'lucide-react';
import { format, addDays, startOfToday, isSameDay } from 'date-fns';
import { Link } from 'react-scroll';
import { cn } from './lib/utils';
import { GoogleGenAI, Type } from "@google/genai";

import { Logo } from './components/Logo';

// --- Neural Diagnostic Engine ---
let aiInstance: any = null;

const getAI = () => {
  if (aiInstance) return aiInstance;
  
  const apiKey = typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : undefined;
  
  if (!apiKey) {
    console.warn("GEMINI_API_KEY not found. AI diagnostics will be unavailable.");
    return null;
  }
  
  aiInstance = new GoogleGenAI({ apiKey });
  return aiInstance;
};

const AIDiagnostics = () => {
  const [symptoms, setSymptoms] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<null | {
    fault: string;
    complexity: number;
    time: string;
    cost: string;
    advice: string;
  }>(null);

  const analyzeSymptoms = async () => {
    if (!symptoms.trim()) return;
    const ai = getAI();
    if (!ai) {
      alert("AI diagnostics service is currently unavailable. Please contact us directly.");
      return;
    }

    setIsAnalyzing(true);
    setResult(null);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze these tech hardware symptoms: "${symptoms}". Provide a likely diagnosis for a repair shop.`,
        config: {
          systemInstruction: "You are an expert tech diagnostics engine for 'Revive-IT'. Your goal is to provide a professional, concise, and accurate diagnostic assessment. Return the result in a JSON format with exactly these keys: 'fault' (string), 'complexity' (integer 1-10), 'time' (string), 'cost' (string range in GBP e.g. '£80 - £120'), 'advice' (string). Be realistic and professional.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              fault: { type: Type.STRING },
              complexity: { type: Type.INTEGER },
              time: { type: Type.STRING },
              cost: { type: Type.STRING },
              advice: { type: Type.STRING },
            },
            required: ['fault', 'complexity', 'time', 'cost', 'advice']
          }
        }
      });

      const data = JSON.parse(response.text || '{}');
      setResult(data);
    } catch (error) {
      console.error("AI Diagnostic Error:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <section id="ai-lab" className="py-20 md:py-32 bg-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #0071E3 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="relative z-10"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-[#0071E3] text-[10px] font-black rounded-full mb-8 uppercase tracking-widest border border-blue-100">
              <Cpu className="w-3 h-3 animate-pulse" />
              Neural Diagnostic Lab
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-[#1D1D1F] mb-8 tracking-tight">
              Instant AI <br /><span className="text-[#0071E3]">Expert Triage.</span>
            </h2>
            <p className="text-base md:text-lg text-black/50 mb-10 leading-relaxed font-medium">
              Describe your device’s symptoms in plain English. Our neural engine will cross-reference thousands of repair patterns to provide an instant expert assessment.
            </p>
            
            <div className="apple-card p-1.5 md:p-2 bg-[#F5F5F7] border border-black/5 flex items-center gap-2 group focus-within:ring-2 focus-within:ring-[#0071E3]/20 transition-all">
              <input 
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="Ex: My MacBook screen flickers..."
                className="flex-1 bg-transparent border-none outline-none px-4 md:px-6 py-4 font-medium text-[#1D1D1F] placeholder:text-black/20 text-sm md:text-base"
                onKeyDown={(e) => e.key === 'Enter' && analyzeSymptoms()}
              />
              <button 
                onClick={analyzeSymptoms}
                disabled={isAnalyzing || !symptoms.trim()}
                className="bg-[#0071E3] text-white p-3 md:p-4 rounded-xl md:rounded-2xl hover:bg-[#0077ED] transition-all disabled:opacity-50 disabled:grayscale"
              >
                {isAnalyzing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
              </button>
            </div>
            
            <div className="mt-8 flex items-center gap-4 text-[10px] font-bold text-black/30 uppercase tracking-[0.2em]">
              <div className="flex -space-x-2">
                {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-blue-50 flex items-center justify-center"><Cpu className="w-3 h-3 text-[#0071E3]" /></div>)}
              </div>
              Powered by Gemini 3.1 Advanced
            </div>
          </motion.div>

          <div className="relative">
            <AnimatePresence mode="wait">
              {isAnalyzing ? (
                <motion.div
                  key="analyzing"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  className="apple-card p-8 md:p-12 bg-[#F5F5F7] text-center space-y-8 relative overflow-hidden h-[400px] md:h-[500px] flex flex-col items-center justify-center"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 to-transparent opacity-50" />
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="w-20 h-20 md:w-24 md:h-24 border-t-2 border-r-2 border-[#0071E3] rounded-full flex items-center justify-center p-3"
                  >
                    <div className="w-full h-full bg-blue-500/10 rounded-full flex items-center justify-center">
                       <Cpu className="w-6 h-6 md:w-8 md:h-8 text-[#0071E3]" />
                    </div>
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-bold text-[#1D1D1F] mb-2 tracking-tight">Processing Sequence...</h3>
                    <p className="text-black/40 text-sm font-medium">Analyzing diagnostic patterns</p>
                  </div>
                  <div className="w-32 md:w-48 h-1 bg-black/[0.05] rounded-full overflow-hidden mx-auto relative">
                    <motion.div 
                      initial={{ x: "-100%" }}
                      animate={{ x: "100%" }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 bg-[#0071E3] w-1/2"
                    />
                  </div>
                </motion.div>
              ) : result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="apple-card p-6 md:p-10 bg-white border border-[#0071E3]/20 shadow-[0_0_80px_rgba(0,113,227,0.1)] space-y-6 md:space-y-8 relative overlow-hidden"
                >
                  <div className="absolute top-0 right-0 p-6 opacity-[0.03] hidden md:block">
                    <Cpu className="w-32 h-32 text-[#0071E3]" />
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-50 text-[#0071E3] rounded-xl md:rounded-2xl flex items-center justify-center font-black">
                      {result.complexity}/10
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black text-black/30 uppercase tracking-widest">Assessment Detail</h4>
                      <h3 className="text-xl md:text-2xl font-bold text-[#1D1D1F] tracking-tight">{result.fault}</h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 md:gap-6">
                    <div className="p-4 md:p-5 bg-[#F5F5F7] rounded-[20px] md:rounded-[24px]">
                      <p className="text-[10px] font-bold text-black/30 uppercase tracking-widest mb-1 md:mb-2">Wait Time</p>
                      <p className="text-base md:text-lg font-bold text-[#1D1D1F]">{result.time}</p>
                    </div>
                    <div className="p-4 md:p-5 bg-blue-50 rounded-[20px] md:rounded-[24px]">
                      <p className="text-[10px] font-bold text-[#0071E3] uppercase tracking-widest mb-1 md:mb-2">Estimate</p>
                      <p className="text-base md:text-lg font-bold text-[#0071E3]">{result.cost}</p>
                    </div>
                  </div>

                  <div className="p-4 md:p-6 border border-black/5 rounded-[20px] md:rounded-[24px] space-y-2 md:space-y-3 font-medium">
                    <div className="flex items-center gap-2 text-[10px] font-black text-black/30 uppercase tracking-widest">
                      <ShieldCheck className="w-3 h-3" /> Expert Advice
                    </div>
                    <p className="text-sm text-black/60 leading-relaxed italic">
                      "{result.advice}"
                    </p>
                  </div>

                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                       const contactSection = document.getElementById('contact');
                       contactSection?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full bg-[#0071E3] text-white font-bold py-4 md:py-5 rounded-2xl shadow-lg shadow-blue-200/50 flex items-center justify-center gap-3 text-sm md:text-base"
                  >
                    Confirm Repair Booking <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="apple-card p-8 md:p-12 bg-[#F5F5F7] border border-dashed border-black/10 flex flex-col items-center justify-center text-center space-y-6 min-h-[300px] md:h-[500px]"
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-2xl md:rounded-3xl flex items-center justify-center apple-shadow">
                    <MessageSquareText className="w-8 h-8 md:w-10 md:h-10 text-black/10" />
                  </div>
                  <div className="max-w-xs">
                    <h3 className="text-base md:text-lg font-bold text-[#1D1D1F] mb-3 tracking-tight">Awaiting Fault Input</h3>
                    <p className="text-black/40 text-[13px] md:text-sm font-medium leading-relaxed">
                      Enter your device symptoms to the left to begin the neural analysis sequence.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-black/5" />
                    <span className="w-1.5 h-1.5 rounded-full bg-black/5" />
                    <span className="w-1.5 h-1.5 rounded-full bg-black/5" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

const AnatomyOfQuality = () => {
  const parts = [
    {
      title: "Logic Board Recovery",
      desc: "Micro-soldering under 40x magnification for surgical precision.",
      image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=1974&auto=format&fit=crop"
    },
    {
      title: "OEM-Grade Screens",
      desc: "Perfect color accuracy and true-tone support guaranteed.",
      image: "https://images.unsplash.com/photo-1588506543118-8f85f1c9f28a?q=80&w=2070&auto=format&fit=crop"
    },
    {
      title: "High-Cycle Batteries",
      desc: "Premium cells with 500+ charge cycle endurance.",
      image: "https://images.unsplash.com/photo-1593344484962-99978424bc25?q=80&w=1974&auto=format&fit=crop"
    },
    {
      title: "Thermal Management",
      desc: "Liquid metal and arctic-grade compounds for peak cooling.",
      image: "https://images.unsplash.com/photo-1591405351990-4726e33df48a?q=80&w=2070&auto=format&fit=crop"
    }
  ];

  return (
    <section className="py-20 md:py-32 bg-[#1D1D1F] text-white">
      <div className="max-w-5xl mx-auto px-6">
        <div className="mb-12 md:mb-20">
          <h2 className="text-[#0071E3] font-bold tracking-widest uppercase text-[10px] md:text-[11px] mb-4">Precision Components</h2>
          <h3 className="text-3xl md:text-5xl font-bold tracking-tight">The Anatomy of <span className="text-white/30">Quality.</span></h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {parts.map((part, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative aspect-[3/4] rounded-[24px] overflow-hidden group border border-white/5"
            >
              <img 
                src={part.image} 
                className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-1000 grayscale group-hover:grayscale-0" 
                alt={part.title}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1D1D1F]/90 via-[#1D1D1F]/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8">
                <h4 className="text-lg font-bold mb-3">{part.title}</h4>
                <p className="text-white/40 text-sm font-medium leading-relaxed group-hover:text-white/80 transition-colors">
                  {part.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- Components ---

const Navbar = ({ onFavoritesClick }: { onFavoritesClick: () => void }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const navLinks = [
    { name: 'Home', to: 'home', icon: <RefreshCw className="w-5 h-5" /> },
    { name: 'Process', to: 'how-it-works', icon: <HelpCircle className="w-5 h-5" /> },
    { name: 'AI Lab', to: 'ai-lab', icon: <Cpu className="w-5 h-5" /> },
    { name: 'Pricing', to: 'pricing', icon: <Tag className="w-5 h-5" /> },
    { name: 'Services', to: 'services', icon: <Briefcase className="w-5 h-5" /> },
    { name: 'FAQ', to: 'faq', icon: <MessageSquareText className="w-5 h-5" /> },
  ];

  return (
    <>
      <div className="lg:hidden fixed inset-0 z-[70] pointer-events-none">
        <AnimatePresence>
          {isExpanded && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsExpanded(false)}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm pointer-events-auto"
            />
          )}
        </AnimatePresence>
      </div>

      <motion.nav 
        initial={false}
        animate={{ 
          width: window.innerWidth >= 1024 ? 288 : (isExpanded ? 260 : 64)
        }}
        className={cn(
          "fixed top-0 left-0 bottom-0 z-[80] bg-white border-r border-black/5 flex flex-col apple-shadow-lg transition-all duration-300",
        )}
      >
        <div className="flex flex-col h-full py-6">
          <div className="mb-12 flex justify-center lg:justify-start lg:px-8">
            <div className="hidden lg:block overflow-hidden h-10">
              <Logo />
            </div>
            <div 
              onClick={() => setIsExpanded(!isExpanded)}
              className="lg:hidden w-10 h-10 bg-[#1D1D1F] rounded-xl flex items-center justify-center text-white cursor-pointer hover:bg-[#0071E3] transition-colors"
            >
              {isExpanded ? <X className="w-5 h-5" /> : <RefreshCw className="w-5 h-5" />}
            </div>
          </div>

          <nav className="flex-1 space-y-2 px-2 lg:px-4 leading-none">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.to}
                smooth={true}
                duration={800}
                offset={-50}
                spy={true}
                activeClass="bg-[#0071E3]/5 text-[#0071E3]"
                onClick={() => setIsExpanded(false)}
                className={cn(
                  "flex items-center gap-4 p-3.5 rounded-2xl transition-all font-bold text-sm tracking-tight cursor-pointer group",
                  "text-black/40 hover:bg-[#F5F5F7] hover:text-[#0071E3]"
                )}
              >
                <div className="shrink-0">{link.icon}</div>
                <span className={cn(
                  "whitespace-nowrap transition-all duration-300",
                  isExpanded ? "opacity-100 w-auto" : "lg:opacity-100 lg:w-auto opacity-0 w-0"
                )}>
                  {link.name}
                </span>
              </Link>
            ))}
            
            <a
              href="https://ais-pre-naqpmvhf3ms2lg46nbuwbw-644472806116.europe-west2.run.app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-3.5 rounded-2xl text-black/40 hover:bg-[#F5F5F7] transition-all font-bold text-sm tracking-tight group"
            >
              <ExternalLink className="w-5 h-5 shrink-0" />
              <span className={cn(
                "whitespace-nowrap transition-all duration-300",
                isExpanded ? "opacity-100 w-auto" : "lg:opacity-100 lg:w-auto opacity-0 w-0"
              )}>
                Portal
              </span>
            </a>
          </nav>

          <div className="mt-auto px-2 lg:px-4 space-y-4">
            <button 
              onClick={() => {
                onFavoritesClick();
                setIsExpanded(false);
              }}
              className="w-full flex items-center gap-4 p-3.5 rounded-2xl text-black/40 hover:bg-[#F5F5F7] transition-all group"
            >
              <Star className="w-5 h-5 text-[#0071E3] shrink-0 group-hover:scale-110 transition-transform" />
              <span className={cn(
                "font-bold text-sm whitespace-nowrap",
                isExpanded ? "opacity-100" : "lg:opacity-100 opacity-0"
              )}>
                Saved
              </span>
            </button>

            <div className={cn(
              "p-5 bg-[#1D1D1F] rounded-[24px] text-white relative overflow-hidden transition-all",
              !isExpanded && "lg:block hidden"
            )}>
              <p className="text-[8px] font-black opacity-30 uppercase tracking-[0.2em] mb-1">Support</p>
              <p className="text-sm font-bold truncate">07763 817558</p>
              <Link to="contact" smooth={true} className="mt-4 w-full py-3 bg-[#0071E3] rounded-xl flex items-center justify-center text-[9px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all cursor-pointer">
                Book
              </Link>
            </div>
            
            {!isExpanded && (
               <Link to="contact" smooth={true} className="lg:hidden w-10 h-10 bg-[#0071E3] rounded-xl flex items-center justify-center text-white mx-auto">
                 <Phone className="w-4 h-4" />
               </Link>
            )}
          </div>
        </div>
      </motion.nav>
    </>
  );
};

const Hero = () => {
  const { scrollY } = useScroll();
  const blob1Y = useTransform(scrollY, [0, 1000], [0, 200]);
  const blob2Y = useTransform(scrollY, [0, 1000], [0, -150]);
  const heroImageY = useTransform(scrollY, [0, 1000], [0, -80]);
  const heroContentY = useTransform(scrollY, [0, 1000], [0, 40]);

  return (
    <section id="home" className="relative min-h-[90vh] flex items-center pt-10 pb-20 lg:pt-0 lg:pb-0 overflow-hidden bg-white">
      {/* Mesh Gradient Background */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none">
        <motion.div style={{ y: blob1Y }} className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-100/40 blur-[120px]" />
        <motion.div style={{ y: blob2Y }} className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-slate-100/40 blur-[120px]" />
      </div>
 
      <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-16 md:gap-12 items-center">
        <motion.div
          style={{ y: heroContentY }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/[0.03] text-black/60 text-[10px] md:text-[11px] font-bold rounded-full mb-8 uppercase tracking-widest border border-black/[0.05]">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            #1 Repair Specialist in Moray
          </div>
          <h1 className="text-4xl xs:text-5xl md:text-7xl font-bold text-[#1D1D1F] leading-[1.1] md:leading-[1.05] tracking-tight mb-8">
            Don't Replace.<br />
            <span className="text-[#0071E3] relative">
              Revive it.
              <motion.span 
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                transition={{ delay: 0.5, duration: 1 }}
                className="absolute -bottom-2 left-0 h-1 md:h-1.5 bg-[#0071E3]/10 rounded-full"
              />
            </span>
          </h1>
          <p className="text-base md:text-xl text-black/60 mb-10 max-w-md leading-relaxed font-medium">
            Professional MacBook, PC, and data recovery services in Buckie. Precision repairs with a 12-month warranty.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="contact" smooth={true} className="bg-[#0071E3] text-white px-8 py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-[#0077ED] transition-all hover:scale-105 active:scale-95 apple-shadow cursor-pointer">
              Book a Repair <ArrowRight className="w-4 h-4" />
            </Link>
            <div className="flex gap-2">
              <a href="sms:447763817558" className="flex-1 bg-[#1D1D1F] text-white px-6 md:px-8 py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-blue-600 transition-all hover:scale-105 active:scale-95 apple-shadow cursor-pointer">
                SMS <MessageSquareText className="w-4 h-4" />
              </a>
              <Link to="services" smooth={true} className="flex-1 bg-white text-[#1D1D1F] border border-black/10 px-6 md:px-8 py-4 rounded-full font-bold flex items-center justify-center hover:bg-[#F5F5F7] transition-all cursor-pointer whitespace-nowrap">
                Services
              </Link>
            </div>
          </div>
          
          <div className="mt-12 md:mt-16 flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-8 h-8 md:w-9 md:h-9 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold overflow-hidden shadow-sm">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} alt="User" />
                </div>
              ))}
            </div>
            <div className="hidden sm:block h-10 w-px bg-black/5" />
            <div className="text-sm">
              <span className="block font-bold text-[#1D1D1F]">500+ Happy Customers</span>
              <div className="flex items-center gap-1">
                <div className="flex items-center gap-0.5 text-amber-400">
                  {"★★★★★".split("").map((s, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                </div>
                <span className="text-[11px] text-black/50 font-bold uppercase tracking-wider">4.9/5 Rating</span>
              </div>
            </div>
          </div>
        </motion.div>
 
        <motion.div
           style={{ y: heroImageY }}
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
           viewport={{ once: true }}
           className="relative mt-8 md:mt-0"
        >
          <div className="relative z-10 apple-card group">
            <div className="aspect-[4/5] overflow-hidden bg-slate-50">
              <img 
                src="https://images.unsplash.com/photo-1597740985671-2a8a3b80502e?q=80&w=2070&auto=format&fit=crop" 
                alt="Professional Tech Repair" 
                className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-1000"
              />
            </div>
          </div>
          
          {/* Floating UI Element */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="absolute -bottom-4 -left-4 md:-bottom-8 md:-left-8 glass p-4 md:p-6 rounded-[20px] md:rounded-[24px] apple-shadow flex items-center gap-3 md:gap-5 z-20 border border-white/50"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#0071E3] flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <ShieldCheck className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div>
              <p className="text-lg md:text-xl font-bold text-[#1D1D1F] leading-none mb-1">Guaranteed</p>
              <p className="text-[9px] md:text-[10px] font-bold text-black/40 uppercase tracking-widest">12-Month Warranty</p>
            </div>
          </motion.div>
 
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] md:w-[115%] md:h-[115%] border border-black/5 rounded-[32px] md:rounded-[48px] -z-10" />
        </motion.div>
      </div>
    </section>
  );
};

const Services = () => {
  const serviceGroups = [
    {
      title: "Core Repair",
      icon: <Laptop className="w-5 h-5" />,
      services: [
        "iPhone & Android Screen Repair",
        "MacBook & Laptop Servicing",
        "Battery Replacement",
        "Charging Port Fixes"
      ]
    },
    {
      title: "Hardware Upgrades",
      icon: <CpuIcon className="w-5 h-5" />,
      services: [
        "High-Speed SSD Upgrades",
        "Memory (RAM) Expansion",
        "Custom Workstation Builds",
        "Gaming PC Optimization"
      ]
    },
    {
      title: "Data Recovery",
      icon: <Database className="w-5 h-5" />,
      services: [
        "Corrupt Drive Recovery",
        "Secure Data Transfer",
        "System Image Backup",
        "Deleted File Retrieval"
      ]
    },
    {
      title: "Business Support",
      icon: <ShieldCheck className="w-5 h-5" />,
      services: [
        "IT Infrastructure Setup",
        "Security & Firewalling",
        "Remote Support Services",
        "Network Optimization"
      ]
    }
  ];

  return (
    <section id="services" className="py-20 md:py-32 bg-[#F5F5F7]">
      <div className="max-w-5xl mx-auto px-6">
        <div className="max-w-2xl mb-12 md:mb-20 text-center mx-auto">
          <h2 className="text-[#0071E3] font-bold tracking-widest uppercase text-[10px] md:text-[11px] mb-4">Our Expertise</h2>
          <h3 className="text-3xl md:text-5xl font-bold text-[#1D1D1F] tracking-tight">World-class repairs for your most essential devices.</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {serviceGroups.map((group, idx) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              className="apple-card p-10 group bg-white hover:scale-[1.02] transition-all duration-500"
            >
              <div className="w-12 h-12 bg-[#F5F5F7] rounded-2xl flex items-center justify-center mb-8 text-black/40 group-hover:bg-[#0071E3] group-hover:text-white transition-all duration-500">
                {group.icon}
              </div>
              <h4 className="text-2xl font-bold text-[#1D1D1F] mb-6 tracking-tight">{group.title}</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                {group.services.map(s => (
                  <li key={s} className="flex items-start gap-2.5 text-[13px] text-black/60 font-medium leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-[#0071E3] mt-0.5 shrink-0 opacity-40" />
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

const HowItWorks = () => {
  const steps = [
    {
      title: "Step 01",
      name: "Diagnosis",
      desc: "Initial analysis to find the root cause of the issue.",
      icon: <Search className="w-5 h-5" />,
      image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=2030&auto=format&fit=crop"
    },
    {
      title: "Step 02",
      name: "Repair",
      desc: "Precision engineering to return your device to peak performance.",
      icon: <Wrench className="w-5 h-5" />,
      image: "https://images.unsplash.com/photo-1597733336794-12d05021d510?q=80&w=1974&auto=format&fit=crop"
    },
    {
      title: "Step 03",
      name: "Quality Check",
      desc: "Rigorous testing to ensure everything is better than new.",
      icon: <ShieldCheck className="w-5 h-5" />,
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-32 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 md:mb-24 gap-8">
          <div className="max-w-xl">
            <h2 className="text-[#0071E3] font-bold tracking-widest uppercase text-[10px] md:text-[11px] mb-4">The Process</h2>
            <h3 className="text-3xl md:text-5xl font-bold text-[#1D1D1F] tracking-tight">Simple. Transparent.<br />Professional.</h3>
          </div>
          <p className="text-black/50 max-w-xs text-[13px] md:text-sm font-medium leading-relaxed">Everything we do is built on clarity. You'll know exactly what's happening at every stage.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-10 md:gap-12">
          {steps.map((step, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.8 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="apple-card overflow-hidden mb-8 h-48">
                <img 
                  src={step.image} 
                  alt={step.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
              </div>
              <div className="text-[48px] font-bold text-black/5 leading-none mb-6 group-hover:text-[#0071E3]/10 transition-colors duration-500">{step.title}</div>
              <div className="w-10 h-10 bg-[#F5F5F7] text-black/40 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#0071E3] group-hover:text-white transition-all duration-500">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-[#1D1D1F] mb-3 tracking-tight">{step.name}</h3>
              <p className="text-black/50 text-sm leading-relaxed font-medium">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  const reviews = [
    {
      name: "John Miller",
      location: "Buckie",
      text: "Revive-IT saved my business files when my MacBook failed. Professional, fast, and the tracking portal kept me sane. Highly recommend.",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=John"
    },
    {
      name: "Emma Ross",
      location: "Elgin",
      text: "The data recovery was flawless. I thought years of family photos were gone. They brought them back in 48 hours. Absolute lifesavers.",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma"
    }
  ];

  return (
    <section className="py-20 md:py-32 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-[#0071E3] font-bold tracking-widest uppercase text-[10px] md:text-[11px] mb-4">Customer Proof</h2>
          <h3 className="text-3xl md:text-5xl font-bold text-[#1D1D1F] tracking-tight">Voices of the community.</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-10">
          {reviews.map((review, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="apple-card p-8 md:p-10 bg-[#F5F5F7] group hover:scale-[1.01] transition-transform"
            >
              <div className="flex items-center gap-4 mb-6 md:mb-8">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-white shadow-sm">
                  <img src={review.image} alt={review.name} />
                </div>
                <div>
                  <p className="font-bold text-[#1D1D1F] text-sm md:text-base leading-none mb-1">{review.name}</p>
                  <p className="text-[9px] md:text-[10px] text-black/40 font-bold uppercase tracking-widest">{review.location}</p>
                </div>
              </div>
              <p className="text-base md:text-lg text-black/70 font-medium leading-relaxed italic">"{review.text}"</p>
              <div className="mt-6 md:mt-8 flex gap-1 text-amber-400">
                {"★★★★★".split("").map((s, i) => <Star key={i} className="w-3.5 h-3.5 md:w-4 md:h-4 fill-current" />)}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const TrackingInfo = () => {
  const containerRef = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const portalY = useTransform(scrollYProgress, [0, 1], [-100, 100]);
  const contentY = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <section id="tracking-info" ref={containerRef} className="py-20 md:py-32 bg-white overflow-hidden">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          <motion.div 
            style={{ y: contentY }}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-block px-3 py-1 bg-black/[0.03] text-black/40 text-[10px] md:text-[11px] font-bold rounded-full mb-6 uppercase tracking-widest border border-black/[0.05]">
              System Transparency
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-[#1D1D1F] mb-8 tracking-tight leading-tight">
              A portal into your <br className="hidden md:block" />device’s <span className="text-[#0071E3]">recovery.</span>
            </h2>
            <p className="text-base md:text-lg text-black/50 mb-10 md:mb-12 leading-relaxed font-medium">
              We believe in absolute clarity. Our custom-built ecosystem allows you to track every microscopic step of your repair in real-time.
            </p>
            
            <div className="space-y-8 md:space-y-10">
              <div className="flex gap-4 md:gap-6">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-[#F5F5F7] rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 text-black/40">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-[#1D1D1F] tracking-tight mb-1 md:mb-2">Live Progress Logs</h3>
                  <p className="text-black/50 text-[13px] md:text-sm font-medium leading-relaxed">Timestamped updates for every stage of the repair process.</p>
                </div>
              </div>

              <div className="flex gap-4 md:gap-6">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-[#F5F5F7] rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 text-black/40">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-[#1D1D1F] tracking-tight mb-1 md:mb-2">Document Portal</h3>
                  <p className="text-black/50 text-[13px] md:text-sm font-medium leading-relaxed">Instant access to digital invoices, reports, and warranty certificates.</p>
                </div>
              </div>
            </div>

            <div className="mt-12 md:mt-16">
              <a 
                href="https://ais-pre-naqpmvhf3ms2lg46nbuwbw-644472806116.europe-west2.run.app" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full sm:w-auto gap-2 bg-[#1D1D1F] text-white font-bold px-8 py-4 rounded-full hover:bg-[#0071E3] transition-all apple-shadow uppercase tracking-widest text-[10px] md:text-[11px]"
              >
                Access Portal <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
          
          <motion.div 
            style={{ y: portalY }}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute inset-0 bg-[#0071E3]/5 blur-[100px] rounded-full scale-110"></div>
            <div className="relative glass p-8 rounded-[32px] apple-shadow border border-white/60">
              <div className="space-y-8">
                <div className="flex items-center justify-between border-b border-black/5 pb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#0071E3] rounded-xl flex items-center justify-center">
                      <RefreshCw className="w-5 h-5 text-white animate-spin-slow" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-black/30 tracking-widest uppercase">ID: RV-842</p>
                      <p className="font-bold text-[#1D1D1F]">In Repair Portfolio</p>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-green-500/10 text-green-600 text-[10px] font-bold rounded-full uppercase tracking-wider border border-green-500/20">Verified</div>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-black/30">
                    <span>Calibration</span>
                    <span>72%</span>
                  </div>
                  <div className="w-full h-1.5 bg-black/[0.05] rounded-full overflow-hidden">
                    <div className="w-[72%] h-full bg-[#0071E3] rounded-full"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-[13px] font-medium text-black/60">
                      <CheckCircle2 className="w-4 h-4 text-green-500" /> Diagnosis Authenticated
                    </div>
                    <div className="flex items-center gap-3 text-[13px] font-medium text-black/60">
                      <CheckCircle2 className="w-4 h-4 text-green-500" /> Secure Encryption Lock
                    </div>
                    <div className="flex items-center gap-3 text-[13px] font-bold text-[#1D1D1F]">
                      <RefreshCw className="w-4 h-4 text-[#0071E3] animate-spin-slow" /> Micro-Component Repair
                    </div>
                  </div>
                </div>

                <div className="bg-black/[0.02] border border-black/[0.03] rounded-2xl p-5 shadow-inner">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 border border-white">
                      <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=James" alt="James" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-black/30 uppercase tracking-widest">Lead Engineer</p>
                      <p className="text-xs font-bold text-[#1D1D1F]">James Gordon</p>
                    </div>
                  </div>
                  <p className="text-[12px] text-black/50 font-medium italic">"System board stabilization is complete. Initiating final thermal testing sequence shortly."</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Contact = ({ setShowConfirmation }: { setShowConfirmation: (val: boolean) => void }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    description: '',
    type: 'inquiry',
    bookingDate: '',
    bookingTime: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [submittedData, setSubmittedData] = useState<any>(null);

  const today = startOfToday();
  const availableDates = Array.from({ length: 7 }, (_, i) => addDays(today, i + 1));
  const timeSlots = ["09:00", "10:30", "12:00", "13:30", "15:00", "16:30"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.type === 'booking' && (!formData.bookingDate || !formData.bookingTime)) return;
    setStatus('loading');
    setTimeout(() => {
      setSubmittedData({ ...formData });
      setStatus('success');
      if (formData.type === 'booking') setShowConfirmation(true);
      setFormData({ 
        firstName: '', lastName: '', email: '', description: '', type: 'inquiry', bookingDate: '', bookingTime: '' 
      });
    }, 800);
  };

  const getWhatsAppLink = (data = formData) => {
    const phone = "447763817558";
    const text = `🛠️ *REVIVE-IT NEW ${data.type.toUpperCase()}*\n\n*Customer:* ${data.firstName} ${data.lastName}\n*Contact:* ${data.email}\n${data.bookingDate ? `*Requested Slot:* ${data.bookingDate} @ ${data.bookingTime}\n` : ''}\n*Details:*\n${data.description}\n\n--- Sent from Revive-IT Website ---`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  };

  const getEmailLink = (data = formData) => {
    const subject = `[Website ${data.type.charAt(0).toUpperCase() + data.type.slice(1)}] ${data.firstName} ${data.lastName}`;
    const body = `Customer: ${data.firstName} ${data.lastName}\nEmail: ${data.email}\n${data.bookingDate ? `Requested Date: ${data.bookingDate} @ ${data.bookingTime}\n` : ''}\nMessage:\n${data.description}\n\nSent from Revive-IT Online`;
    return `mailto:info@revive-it.online?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const getSMSLink = (data = formData) => {
    const phone = "447763817558";
    const body = `REVIVE-IT: New ${data.type} from ${data.firstName}.\n${data.bookingDate ? `Slot: ${data.bookingDate} @ ${data.bookingTime}\n` : ''}Issue: ${data.description}`;
    return `sms:${phone}?body=${encodeURIComponent(body)}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <section id="contact" className="py-20 md:py-32 bg-[#F5F5F7]">
      <div className="max-w-5xl mx-auto px-6">
        <div className="apple-card bg-white p-6 md:p-16 grid md:grid-cols-2 gap-12 md:gap-16 items-start relative overflow-hidden">
          <div className="relative z-10 text-[#1D1D1F] md:sticky md:top-32">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 md:mb-8 tracking-tight leading-tight">Need technical <br /><span className="text-[#0071E3]">support?</span></h2>
            <p className="text-black/50 text-base md:text-lg mb-10 md:mb-12 max-w-xs font-medium leading-relaxed">
              Connect with our experts today. We provide free diagnostics and same-day initial quotes.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-4 md:gap-6">
              <a href="tel:07763817558" className="flex items-center gap-5 group">
                <div className="w-11 h-11 bg-[#F5F5F7] rounded-xl flex items-center justify-center group-hover:bg-[#0071E3] group-hover:text-white transition-all duration-500 text-black/40">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-black/30 font-bold uppercase tracking-widest">Call Technician</p>
                  <p className="text-lg font-bold">07763 817 558</p>
                </div>
              </a>
              <a href="mailto:info@revive-it.online" className="flex items-center gap-5 group">
                <div className="w-11 h-11 bg-[#F5F5F7] rounded-xl flex items-center justify-center group-hover:bg-[#0071E3] group-hover:text-white transition-all duration-500 text-black/40">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-black/30 font-bold uppercase tracking-widest">Email Support</p>
                  <p className="text-lg font-bold">info@revive-it.online</p>
                </div>
              </a>
              <a href="sms:447763817558" className="flex items-center gap-5 group">
                <div className="w-11 h-11 bg-[#F5F5F7] rounded-xl flex items-center justify-center group-hover:bg-[#0071E3] group-hover:text-white transition-all duration-500 text-black/40">
                  <MessageSquareText className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-black/30 font-bold uppercase tracking-widest">Text Us</p>
                  <p className="text-lg font-bold">07763 817 558</p>
                </div>
              </a>
              <a href="https://facebook.com/ReviveITMORAY" target="_blank" rel="noopener noreferrer" className="flex items-center gap-5 group">
                <div className="w-11 h-11 bg-[#F5F5F7] rounded-xl flex items-center justify-center group-hover:bg-[#0071E3] group-hover:text-white transition-all duration-500 text-black/40">
                  <Facebook className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-black/30 font-bold uppercase tracking-widest">Community</p>
                  <p className="text-lg font-bold">Facebook Page</p>
                </div>
              </a>
            </div>
          </div>

          <div className="w-full relative z-10">
            {status === 'success' ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#F5F5F7] p-10 rounded-[32px] text-center space-y-8 border border-black/5 shadow-inner"
              >
                <div className="w-20 h-20 bg-green-500/10 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/20">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#1D1D1F] mb-3 tracking-tight">Transmission Received</h3>
                  <p className="text-black/50 font-medium text-sm leading-relaxed mb-4">
                    Your request has been logged. For the **fastest processing**, please forward it to our lead technician via:
                  </p>
                  <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 py-2 px-4 rounded-full inline-block">
                    💡 Tip: We recommend WhatsApp for instant updates
                  </p>
                </div>
                
                <div className="flex flex-col gap-3">
                  <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-green-600 text-white font-bold py-4 rounded-xl transition-all hover:bg-green-700 uppercase tracking-widest text-[10px] shadow-lg shadow-green-200/50">
                    <MessageSquare className="w-4 h-4" /> WhatsApp Secure
                  </a>
                  <a href={getSMSLink(submittedData)} className="flex items-center justify-center gap-2 bg-[#1D1D1F] text-white font-bold py-4 rounded-xl transition-all hover:bg-blue-600 uppercase tracking-widest text-[10px]">
                    <MessageSquareText className="w-4 h-4" /> Direct SMS
                  </a>
                  <a href={getEmailLink(submittedData)} className="flex items-center justify-center gap-2 bg-[#0071E3] text-white font-bold py-4 rounded-xl transition-all hover:bg-[#0077ED] uppercase tracking-widest text-[10px] shadow-lg shadow-blue-200/50">
                    <Mail className="w-4 h-4" /> Official Email
                  </a>
                </div>
                <button 
                  onClick={() => { setStatus('idle'); setSubmittedData(null); }}
                  className="text-black/30 hover:text-[#0071E3] text-[10px] font-bold uppercase tracking-widest transition-all"
                >
                  Create New Request
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="bg-[#F5F5F7] p-1.5 rounded-2xl flex gap-1.5 border border-black/5">
                  <button type="button" onClick={() => setFormData(prev => ({ ...prev, type: 'inquiry' }))} className={cn("flex-1 py-3 px-4 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all", formData.type === 'inquiry' ? "bg-white shadow-sm text-[#0071E3]" : "text-black/30 hover:text-black/60")}>Inquiry</button>
                  <button type="button" onClick={() => setFormData(prev => ({ ...prev, type: 'booking' }))} className={cn("flex-1 py-3 px-4 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all", formData.type === 'booking' ? "bg-white shadow-sm text-[#0071E3]" : "text-black/30 hover:text-black/60")}>Booking</button>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-black/30 uppercase tracking-widest ml-1">First Name</label>
                    <input type="text" name="firstName" required value={formData.firstName} onChange={handleChange} className="w-full bg-[#F5F5F7] border border-black/5 rounded-2xl px-5 py-4 outline-none focus:bg-white focus:border-[#0071E3] transition-all font-medium text-[15px]" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-black/30 uppercase tracking-widest ml-1">Last Name</label>
                    <input type="text" name="lastName" required value={formData.lastName} onChange={handleChange} className="w-full bg-[#F5F5F7] border border-black/5 rounded-2xl px-5 py-4 outline-none focus:bg-white focus:border-[#0071E3] transition-all font-medium text-[15px]" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-black/30 uppercase tracking-widest ml-1">Email Address</label>
                  <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full bg-[#F5F5F7] border border-black/5 rounded-2xl px-5 py-4 outline-none focus:bg-white focus:border-[#0071E3] transition-all font-medium text-[15px]" />
                </div>

                {formData.type === 'booking' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-6 pt-2">
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-black/30 uppercase tracking-widest ml-1">Deployment Date</label>
                      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                        {availableDates.map((date) => {
                          const isSelected = formData.bookingDate === format(date, 'yyyy-MM-dd');
                          return (
                            <button key={date.toISOString()} type="button" onClick={() => setFormData(prev => ({ ...prev, bookingDate: format(date, 'yyyy-MM-dd') }))} className={cn("flex flex-col items-center justify-center py-3 rounded-xl border transition-all", isSelected ? "bg-[#0071E3] border-[#0071E3] text-white shadow-lg shadow-blue-200" : "bg-[#F5F5F7] border-transparent text-black/40 hover:bg-black/5")}>
                              <span className="text-[9px] uppercase font-bold opacity-60 mb-1">{format(date, 'EEE')}</span>
                              <span className="text-[15px] font-bold">{format(date, 'd')}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-black/30 uppercase tracking-widest ml-1">Time Slot</label>
                      <div className="flex flex-wrap gap-2">
                        {timeSlots.map((time) => {
                          const isSelected = formData.bookingTime === time;
                          return (
                            <button key={time} type="button" onClick={() => setFormData(prev => ({ ...prev, bookingTime: time }))} className={cn("px-4 py-2.5 rounded-xl border text-[13px] font-bold transition-all", isSelected ? "bg-[#0071E3] border-[#0071E3] text-white shadow-lg shadow-blue-200" : "bg-[#F5F5F7] border-transparent text-black/40 hover:bg-black/5")}>{time}</button>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-black/30 uppercase tracking-widest ml-1">{formData.type === 'booking' ? "Problem Description" : "Message"}</label>
                  <textarea name="description" required value={formData.description} onChange={handleChange} rows={4} className="w-full bg-[#F5F5F7] border border-black/5 rounded-2xl px-5 py-4 outline-none focus:bg-white focus:border-[#0071E3] transition-all resize-none font-medium text-[15px]" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button type="submit" className="bg-[#0071E3] text-white font-bold py-4 rounded-2xl transition-all hover:bg-[#0077ED] apple-shadow uppercase tracking-widest text-[11px]">Send Transmission</button>
                  <button type="button" onClick={() => window.open(getWhatsAppLink(), '_blank')} className="bg-[#F5F5F7] text-[#1D1D1F] font-bold py-4 rounded-2xl transition-all hover:bg-green-600 hover:text-white uppercase tracking-widest text-[11px] flex items-center justify-center gap-2">
                    <MessageSquare className="w-4 h-4" /> Instant WhatsApp
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
const LocalCoverage = () => {
  const towns = ["Buckie", "Elgin", "Fochabers", "Cullen", "Portsoy", "Keith", "Aberlour", "Forres"];
  
  return (
    <section className="py-16 bg-white border-t border-black/5">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <p className="text-[10px] font-bold text-black/30 uppercase tracking-[0.2em] mb-10">
          Serving Moray & The North Coast
        </p>
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-6">
          {towns.map(town => (
            <span key={town} className="text-[13px] font-bold text-[#1D1D1F]/40 uppercase tracking-widest hover:text-[#0071E3] transition-colors cursor-default">
              {town}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="py-16 md:py-20 bg-white border-t border-black/5">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
          <div>
            <Logo />
            <p className="mt-4 text-[11px] font-medium text-black/40">© {new Date().getFullYear()} Revive-IT. All rights reserved.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-x-6 md:gap-x-10 gap-y-4 text-[10px] md:text-[11px] font-bold uppercase tracking-widest">
            <Link to="how-it-works" smooth={true} className="text-black/60 hover:text-[#0071E3] transition-colors cursor-pointer">Process</Link>
            <Link to="ai-lab" smooth={true} className="text-[#0071E3] hover:opacity-80 transition-opacity cursor-pointer">AI Lab</Link>
            <Link to="pricing" smooth={true} className="text-black/60 hover:text-[#0071E3] transition-colors cursor-pointer">Pricing</Link>
            <Link to="faq" smooth={true} className="text-black/60 hover:text-[#0071E3] transition-colors cursor-pointer">FAQ</Link>
            <Link to="services" smooth={true} className="text-black/60 hover:text-[#0071E3] transition-colors cursor-pointer">Services</Link>
            <a href="https://facebook.com/ReviveITMORAY" target="_blank" rel="noopener noreferrer" className="text-black/60 hover:text-[#0071E3] transition-colors cursor-pointer flex items-center gap-1.5"><Facebook className="w-3.5 h-3.5" /> Social</a>
          </div>

          <div className="md:text-right border-t md:border-t-0 border-black/5 pt-8 md:pt-0 w-full md:w-auto">
            <p className="text-[10px] font-bold text-black/30 uppercase tracking-widest mb-1">Available In Buckie</p>
            <p className="text-lg md:text-xl font-bold text-[#1D1D1F]">07763 817558</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

const WhyChooseUs = () => {
  const containerRef = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const img1Y = useTransform(scrollYProgress, [0, 1], [-40, 40]);
  const img2Y = useTransform(scrollYProgress, [0, 1], [40, -40]);

  const points = [
    {
      title: "Apple Specialist",
      desc: "Deep expertise in MacBook components, software, and secure data handling.",
      icon: <Laptop className="w-5 h-5" />
    },
    {
      title: "Precision Tools",
      desc: "We use laboratory-grade diagnostic and repair equipment for every device.",
      icon: <CpuIcon className="w-5 h-5" />
    },
    {
      title: "Fast Recovery",
      desc: "Same-day diagnostics for 90% of devices dropped off at our Buckie center.",
      icon: <RefreshCw className="w-5 h-5" />
    }
  ];

  return (
    <section ref={containerRef} className="py-20 md:py-32 bg-white overflow-hidden">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
          <div className="flex-1">
            <h2 className="text-[#0071E3] font-bold tracking-widest uppercase text-[10px] md:text-[11px] mb-4">Why Revive-IT</h2>
            <h3 className="text-3xl md:text-5xl font-bold text-[#1D1D1F] mb-10 md:mb-12 tracking-tight leading-tight">
              Honest. Faster. <br className="hidden md:block" />Better engineering.
            </h3>
            
            <div className="space-y-10 md:space-y-12">
              {points.map((point, idx) => (
                <motion.div 
                  key={point.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="flex gap-6 md:gap-8 group"
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 bg-[#F5F5F7] text-black/30 rounded-xl md:rounded-2xl flex items-center justify-center font-bold group-hover:bg-[#0071E3] group-hover:text-white transition-all duration-500">
                    {point.icon}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-[#1D1D1F] mb-2 tracking-tight">{point.title}</h4>
                    <p className="text-black/50 text-[13px] md:text-sm font-medium leading-relaxed max-w-sm">{point.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          <div className="flex-1 relative">
            <div className="grid grid-cols-2 gap-4">
              <motion.div 
                style={{ y: img1Y }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="apple-card overflow-hidden mt-12"
              >
                <img 
                  src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2070&auto=format&fit=crop" 
                  className="w-full aspect-[4/5] object-cover group-hover:scale-105 transition-transform duration-700" 
                  alt="Micro-repair"
                />
              </motion.div>
              <div className="space-y-4">
                <motion.div 
                  style={{ y: img2Y }}
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="apple-card overflow-hidden"
                >
                  <img 
                    src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2030&auto=format&fit=crop" 
                    className="w-full aspect-[4/5] object-cover" 
                    alt="Precision Engineering"
                  />
                </motion.div>
                <div className="bg-[#0071E3] p-8 rounded-[24px] text-white">
                  <p className="text-xl font-bold mb-2">Moray Local</p>
                  <p className="text-xs font-bold opacity-80 uppercase tracking-widest leading-loose">Serving our local <br />community since 2015.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Main App ---

const LandingPage = ({ onEnter }: { onEnter: () => void, key?: string }) => {
  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[200] bg-[#1D1D1F] flex flex-center items-center justify-center overflow-hidden"
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#0071E3] rounded-full blur-[160px] animate-pulse" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="relative text-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="mb-12 inline-block"
        >
          <div className="w-24 h-24 border-2 border-[#0071E3] rounded-[24px] flex items-center justify-center relative group">
            <div className="absolute inset-0 bg-[#0071E3]/20 blur-xl group-hover:bg-[#0071E3]/40 transition-all duration-500 rounded-full" />
            <Wrench className="w-10 h-10 text-[#0071E3] relative z-10" />
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-2 border border-white/10 rounded-[30px] border-dashed" 
            />
          </div>
        </motion.div>

        <div className="overflow-hidden mb-4">
          <motion.h1 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-8xl font-black text-white tracking-tighter"
          >
            REVIVE<span className="text-[#0071E3] italic">-IT</span>
          </motion.h1>
        </div>

        <div className="overflow-hidden mb-8 md:mb-12">
          <motion.p 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-white/40 text-[10px] md:text-base font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] max-w-[280px] md:max-w-none mx-auto"
          >
            Precision Tech Restoration & Data Recovery
          </motion.p>
        </div>

        <motion.button
          onClick={onEnter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="group relative inline-flex items-center gap-4 bg-white text-[#1D1D1F] px-8 md:px-12 py-4 md:py-5 rounded-full font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-[#0071E3] hover:text-white transition-all duration-500 overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.1)]"
        >
          <span className="relative z-10">Enter Experience</span>
          <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </motion.button>

        {/* Ambient Decorative Text */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-4 md:gap-8 whitespace-nowrap opacity-10 pointer-events-none uppercase text-[8px] md:text-[10px] font-bold tracking-[0.3em] md:tracking-[0.5em] text-white">
          <span>Buckie • Scotland</span>
          <div className="hidden md:block w-1 h-1 bg-white rounded-full" />
          <span className="hidden md:inline">EST 2024</span>
          <div className="w-1 h-1 bg-white rounded-full" />
          <span>12M Warranty</span>
        </div>
      </div>
    </motion.div>
  );
};

const PriceGuide = () => {
  const categories = [
    {
      title: "MacBook",
      items: [
        { name: "Screen Replacement", price: "from £149" },
        { name: "Battery Replacement", price: "from £79" },
        { name: "Keyboard Repair", price: "from £99" },
        { name: "Logic Board Repair", price: "from £120" },
      ]
    },
    {
      title: "iPad & iPhone",
      items: [
        { name: "iPhone Screen", price: "from £45" },
        { name: "iPhone Battery", price: "from £35" },
        { name: "iPad Glass Repair", price: "from £65" },
        { name: "Charging Port Fix", price: "from £30" },
      ]
    },
    {
      title: "PC & Gaming",
      items: [
        { name: "Windows Reinstall", price: "from £40" },
        { name: "SSD Upgrade", price: "from £60" },
        { name: "Console Cleaning", price: "from £35" },
        { name: "Custom Build Labours", price: "from £50" },
      ]
    }
  ];

  return (
    <section id="pricing" className="py-20 md:py-32 bg-[#F5F5F7]">
      <div className="max-w-5xl mx-auto px-6">
        <div className="mb-12 md:mb-20 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-bold text-[#1D1D1F] tracking-tight mb-6"
          >
            Transparent Pricing.
          </motion.h2>
          <p className="text-black/50 text-[13px] md:text-base font-medium max-w-xl mx-auto">
            High-quality repairs shouldn't be a mystery. Here is a guide to our most common services.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {categories.map((cat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="apple-card p-8 bg-white"
            >
              <h3 className="text-xl font-bold mb-6 text-[#0071E3]">{cat.title}</h3>
              <div className="space-y-4">
                {cat.items.map((item, j) => (
                  <div key={j} className="flex justify-between items-center border-b border-black/5 pb-4 last:border-0 last:pb-0">
                    <span className="text-sm font-medium text-black/70">{item.name}</span>
                    <span className="text-sm font-bold text-[#1D1D1F]">{item.price}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: "How long does a library repair usually take?",
      a: "Most common repairs like iPhone screens or MacBook batteries are completed within 2–4 hours. Logic board repairs or data recovery can take 3–5 working days."
    },
    {
      q: "Is there a warranty on your work?",
      a: "Absolutely. All Revive-IT repairs come with a comprehensive 12-month warranty on parts and labour for your peace of mind."
    },
    {
      q: "Will I lose my data?",
      a: "We prioritize data safety. In 99% of hardware repairs, your data remains intact. However, we always recommend a backup before any technical service."
    },
    {
      q: "Do you use genuine parts?",
      a: "We use OEM (Original Equipment Manufacturer) or High-Grade components that meet or exceed original specifications to ensure your device feels like new."
    }
  ];

  return (
    <section id="faq" className="py-20 md:py-32 bg-white">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 md:mb-20 tracking-tight">Questions. Answered.</h2>
        <div className="space-y-2 md:space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-black/5 last:border-0 overflow-hidden">
              <button 
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full py-5 md:py-6 flex justify-between items-center text-left group"
              >
                <span className="text-base md:text-lg font-semibold text-[#1D1D1F] group-hover:text-[#0071E3] transition-colors pr-8">{faq.q}</span>
                <ChevronDown className={`w-4 h-4 md:w-5 md:h-5 text-black/30 transition-transform duration-500 shrink-0 ${openIndex === i ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <p className="pb-6 md:pb-8 text-[13px] md:text-base text-black/50 font-medium leading-relaxed">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [showFavoritesPopup, setShowFavoritesPopup] = useState(false);

  useEffect(() => {
    // If user has entered in this session, don't show landing
    const visited = sessionStorage.getItem('visited');
    if (visited) {
      setShowLanding(false);
    }
  }, []);

  const handleEnter = () => {
    setShowLanding(false);
    sessionStorage.setItem('visited', 'true');
  };

  useEffect(() => {
    if (showLanding) return;
    const timer = setTimeout(() => {
      const hasSeenPopup = localStorage.getItem('hasSeenFavoritesPopup');
      if (!hasSeenPopup) {
        setShowFavoritesPopup(true);
      }
    }, 8000);
    return () => clearTimeout(timer);
  }, [showLanding]);

  const closeFavoritesPopup = () => {
    setShowFavoritesPopup(false);
    localStorage.setItem('hasSeenFavoritesPopup', 'true');
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] font-sans text-[#1D1D1F] selection:bg-blue-100 selection:text-blue-900">
      <AnimatePresence mode="wait">
        {showLanding ? (
          <LandingPage key="landing" onEnter={handleEnter} />
        ) : (
          <motion.div 
            key="main-app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="pl-16 lg:pl-72"
          >
            <Navbar onFavoritesClick={() => setShowFavoritesPopup(true)} />
            <main className="w-full">
              <Hero />
              <HowItWorks />
              <AIDiagnostics />
              <AnatomyOfQuality />
              <PriceGuide />
              <Services />
              <WhyChooseUs />
              <TrackingInfo />
              <Testimonials />
              <FAQ />
              <Contact setShowConfirmation={setShowConfirmation} />
              <LocalCoverage />
              
              <AnimatePresence>
          {showFavoritesPopup && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeFavoritesPopup}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 30 }}
                className="relative bg-white rounded-[32px] p-8 max-w-sm w-full apple-shadow text-center overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1.5 bg-[#0071E3]"></div>
                <button 
                  onClick={closeFavoritesPopup}
                  className="absolute top-4 right-4 text-black/20 hover:text-black/60 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Star className="w-8 h-8 fill-current" />
                </div>
                
                <h3 className="text-xl font-bold text-[#1D1D1F] mb-4 tracking-tight">Keep Revive-IT Close</h3>
                <p className="text-black/50 text-sm font-medium leading-relaxed mb-8">
                  Technical issues never wait. Save us to your bookmarks so professional help is always one tap away.
                </p>
                
                <div className="bg-[#F5F5F7] rounded-2xl p-6 text-left mb-8 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-[10px] font-bold shrink-0 shadow-sm">1</div>
                    <p className="text-[12px] font-bold text-black/70">Press <span className="bg-white px-1.5 py-0.5 rounded border border-black/10 mx-1">Ctrl + D</span> on your keyboard</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-[10px] font-bold shrink-0 shadow-sm">2</div>
                    <p className="text-[12px] font-bold text-black/70 text-wrap">On mobile, tap <span className="inline-flex items-center gap-1 font-black">Share <ArrowRight className="w-3 h-3 rotate-[-45deg]" /></span> then <span className="font-black">"Add to Home Screen"</span></p>
                  </div>
                </div>
                
                <button 
                  onClick={closeFavoritesPopup}
                  className="w-full bg-[#0071E3] text-white font-bold py-4 rounded-xl hover:bg-[#0077ED] transition-all apple-shadow uppercase tracking-widest text-[10px]"
                >
                  Got it
                </button>
              </motion.div>
            </div>
          )}

          {showConfirmation && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowConfirmation(false)}
                className="absolute inset-0 bg-black/20 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative glass rounded-[32px] p-10 max-w-md w-full apple-shadow text-center"
              >
                <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8">
                  <Calendar className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-[#1D1D1F] mb-4 uppercase tracking-tight">Slot Requested!</h3>
                <p className="text-slate-600 mb-8 leading-relaxed">
                  Thanks for choosing your time. Please note that <span className="font-bold text-[#1D1D1F]">this slot is not confirmed</span> until a technician reviews it. We'll be in touch shortly to finalize!
                </p>
                <button 
                  onClick={() => setShowConfirmation(false)}
                  className="w-full bg-[#1D1D1F] text-white font-black py-4 rounded-2xl hover:bg-blue-600 transition-all apple-shadow uppercase tracking-widest text-[10px]"
                >
                  Got it, thanks!
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
      <Footer />
      </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}
