"use client";
import React, { useEffect, useState } from "react";
import {
  FaEnvelope,
  FaGit,
  FaGithub,
  FaLinkedin,
  FaPhone,
  FaReact,
  FaPython,
  FaJava,
  FaDocker,
  FaNodeJs,
  FaExternalLinkAlt,
} from "react-icons/fa6";
import {
  RiFirebaseFill,
  RiJavascriptFill,
} from "react-icons/ri";
import {
  SiFlask,
  SiGooglecloud,
  SiMysql,
  SiTypescript,
} from "react-icons/si";

// @ts-ignore
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import { config } from "@/data/config";
import { useMediaQuery } from "@/hooks/use-media-query";

const CONTACT_LINKS = [
  {
    name: "Email",
    content: config.email,
    href: `mailto:${config.email}`,
    icon: <FaEnvelope />,
  },
  {
    name: "Phone",
    content: "+91 9676473925",
    href: "tel:+919676473925",
    icon: <FaPhone />,
  },
  {
    name: "LinkedIn",
    href: config.social.linkedin,
    content: "gunjari-gourav-kumar",
    icon: <FaLinkedin />,
  },
  {
    name: "GitHub",
    href: config.social.github,
    content: "gouravkumar23",
    icon: <FaGithub />,
  },
];

const TOOLS = [
  { name: "Python", icon: <FaPython size={"40px"} color={"#3776AB"} /> },
  { name: "Java", icon: <FaJava size={"40px"} color={"#007396"} /> },
  { name: "JavaScript", icon: <RiJavascriptFill size={"40px"} color={"#f0db4f"} /> },
  { name: "TypeScript", icon: <SiTypescript size={"40px"} color={"#007acc"} /> },
  { name: "React", icon: <FaReact size={"40px"} color={"#61dafb"} /> },
  { name: "Node.js", icon: <FaNodeJs size={"40px"} color={"#6cc24a"} /> },
  { name: "Flask", icon: <SiFlask size={"40px"} color={"#fff"} /> },
  { name: "Firebase", icon: <RiFirebaseFill size={"40px"} color={"#FFCA28"} /> },
  { name: "Docker", icon: <FaDocker size={"40px"} color={"#2496ed"} /> },
  { name: "MySQL", icon: <SiMysql size={"40px"} color={"#4479A1"} /> },
  { name: "Git", icon: <FaGit size={"40px"} color={"#f05032"} /> },
  { name: "Gemini AI", icon: <SiGooglecloud size={"40px"} color={"#4285F4"} /> },
];

const CERTIFICATES = [
  { name: "Software Architecture Foundations", issuer: "LinkedIn Learning", date: "Apr 2026", link: "https://drive.google.com/file/d/1HC36k_jP-U5HRUWSHfjsRoAOCdLp76mU/view" },
  { name: "Quickstart: LangSmith Fleet", issuer: "LangChain Academy", date: "Apr 2026", link: "https://drive.google.com/file/d/1HC36k_jP-U5HRUWSHfjsRoAOCdLp76mU/view" },
  { name: "Quickstart: LangGraph Essentials - Python", issuer: "LangChain Academy", date: "Apr 2026", link: "https://drive.google.com/file/d/1HC36k_jP-U5HRUWSHfjsRoAOCdLp76mU/view" },
  { name: "Docker for Developers", issuer: "LinkedIn Learning", date: "Apr 2026", link: "https://drive.google.com/file/d/1ssYShpr5T1KVFYO58AUOICFdFL5JksnJ/view" },
  { name: "Prompt Engineering", issuer: "LinkedIn Learning", date: "Jan 2024", link: "https://drive.google.com/file/d/1HJJ2tOzLK-1qcEhdWI8qxIvtnjPyOIvB/view" },
  { name: "Qlik Data Literacy", issuer: "Qlik", date: "Feb 2024", link: "https://drive.google.com/file/d/151Lu6SHdX0idCp76uXvE54R1efh83M2f/view" },
];

function Page() {
  const [toolsLoaded, setToolsLoaded] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    setToolsLoaded(true);
  }, []);

  return (
    <div className="container mx-auto px-4 md:px-[50px] xl:px-[150px] text-zinc-300 pt-24 pb-20">
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-1/3 xl:w-1/4">
          <div
            className="p-6 md:p-8 rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-24"
          >
            <div className="flex flex-col items-center text-center">
              <div className="relative w-32 h-32 md:w-40 md:h-40 mb-6">
                <img
                  className="rounded-full w-full h-full object-cover border-4 border-zinc-800"
                  alt="me"
                  src="/assets/me.jpg"
                />
                <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-zinc-900"></div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">{config.author}</h2>
              <p className="text-sm text-brand font-medium mb-6">AI & Software Developer</p>
              
              <div className="w-full space-y-3">
                {CONTACT_LINKS.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="flex items-center gap-3 p-3 rounded-xl bg-zinc-800/50 border border-zinc-700 hover:border-brand transition-colors group"
                  >
                    <div className="text-zinc-400 group-hover:text-brand transition-colors">
                      {link.icon}
                    </div>
                    <div className="text-left overflow-hidden">
                      <p className="text-[10px] uppercase tracking-wider text-zinc-500">{link.name}</p>
                      <p className="text-xs text-zinc-300 truncate">{link.content}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 space-y-8">
          <section className="p-6 md:p-10 rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
            <h1 className="text-3xl font-bold text-white mb-6">About Me</h1>
            <div className="space-y-4 text-zinc-400 leading-relaxed">
              <p>
                Hey there! I&apos;m Gourav, a Computer Science student at Anurag University with a deep passion for AI, Data Science, and Software Engineering. I specialize in building intelligent systems that solve real-world problems.
              </p>
              <p>
                I recently completed a Software Development Internship at DRDO (RCI), where I developed C-based software for defense-grade hardware protocols. I love exploring new technologies like Agentic AI, RAG systems, and Context-Aware AI.
              </p>
            </div>
          </section>

          <section className="p-6 md:p-10 rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-white mb-6">Education</h2>
            <div className="space-y-6">
              <div className="relative pl-6 border-l-2 border-zinc-800">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-brand"></div>
                <h3 className="text-lg font-bold text-white">Bachelor of Computer Science</h3>
                <p className="text-brand text-sm">Anurag University | Expected 2026</p>
                <p className="text-sm text-zinc-500 mt-1">CGPA: 8.79 | Data Science Specialization</p>
              </div>
              <div className="relative pl-6 border-l-2 border-zinc-800">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-zinc-700"></div>
                <h3 className="text-lg font-bold text-white">Schooling</h3>
                <p className="text-zinc-400 text-sm">St. Francis De Sales High School | 2020</p>
                <p className="text-sm text-zinc-500 mt-1">CGPA: 10/10</p>
              </div>
            </div>
          </section>

          <section className="p-6 md:p-10 rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-white mb-6">Tech Stack</h2>
            <div className="py-4">
              {toolsLoaded && (
                <Splide
                  options={{
                    type: "loop",
                    interval: 2000,
                    autoplay: true,
                    pagination: false,
                    speed: 1000,
                    perPage: isMobile ? 3 : 5,
                    gap: "1rem",
                    arrows: false,
                  }}
                >
                  {TOOLS.map((tool) => (
                    <SplideSlide key={tool.name}>
                      <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-zinc-800/30 border border-zinc-800 hover:border-zinc-700 transition-all">
                        {tool.icon}
                        <span className="text-[10px] text-zinc-500 font-medium">{tool.name}</span>
                      </div>
                    </SplideSlide>
                  ))}
                </Splide>
              )}
            </div>
          </section>

          <section className="p-6 md:p-10 rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-white mb-6">Certificates</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {CERTIFICATES.map((cert, index) => (
                <a 
                  key={index} 
                  href={cert.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-4 rounded-xl border border-zinc-800 bg-zinc-800/30 hover:border-brand transition-all group"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h4 className="font-bold text-sm text-zinc-200 group-hover:text-white transition-colors">{cert.name}</h4>
                      <p className="text-xs text-zinc-500 mt-1">{cert.issuer}</p>
                      <p className="text-[10px] text-brand mt-2">{cert.date}</p>
                    </div>
                    <FaExternalLinkAlt className="text-zinc-600 group-hover:text-brand text-xs shrink-0" />
                  </div>
                </a>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default Page;