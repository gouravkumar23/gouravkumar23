"use client";
import React, { useEffect, useState } from "react";
import {
  FaCss3,
  FaDocker,
  FaEnvelope,
  FaGit,
  FaGithub,
  FaHtml5,
  FaLinkedin,
  FaNodeJs,
  FaPhone,
  FaReact,
  FaPython,
  FaJava,
  FaExternalLinkAlt,
} from "react-icons/fa6";
import {
  RiFirebaseFill,
  RiJavascriptFill,
  RiTailwindCssFill,
} from "react-icons/ri";
import {
  SiExpress,
  SiFlask,
  SiGooglecloud,
  SiMysql,
  SiPostman,
  SiTypescript,
} from "si";

// @ts-ignore
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import { config } from "@/data/config";

const CONTACT_LINKS = [
  {
    name: "Email",
    content: config.email,
    href: `mailto:${config.email}`,
    icon: <FaEnvelope height={"50px"} />,
  },
  {
    name: "Phone",
    content: "+91 9676473925",
    href: "tel:+919676473925",
    icon: <FaPhone height={"50px"} />,
  },
  {
    name: "LinkedIn",
    href: config.social.linkedin,
    content: "/gunjari-gourav-kumar",
    icon: <FaLinkedin height={"50px"} />,
  },
  {
    name: "GitHub",
    href: config.social.github,
    content: "/gouravkumar23",
    icon: <FaGithub height={"50px"} />,
  },
];

const TOOLS = [
  { name: "Python", icon: <FaPython size={"50px"} color={"#3776AB"} /> },
  { name: "Java", icon: <FaJava size={"50px"} color={"#007396"} /> },
  { name: "JavaScript", icon: <RiJavascriptFill size={"50px"} color={"#f0db4f"} /> },
  { name: "TypeScript", icon: <SiTypescript size={"50px"} color={"#007acc"} /> },
  { name: "React", icon: <FaReact size={"50px"} color={"#61dafb"} /> },
  { name: "Node.js", icon: <FaNodeJs size={"50px"} color={"#6cc24a"} /> },
  { name: "Flask", icon: <SiFlask size={"50px"} color={"#fff"} /> },
  { name: "Firebase", icon: <RiFirebaseFill size={"50px"} color={"#FFCA28"} /> },
  { name: "Docker", icon: <FaDocker size={"50px"} color={"#2496ed"} /> },
  { name: "MySQL", icon: <SiMysql size={"50px"} color={"#4479A1"} /> },
  { name: "Git", icon: <FaGit size={"50px"} color={"#f05032"} /> },
  { name: "Gemini AI", icon: <SiGooglecloud size={"50px"} color={"#4285F4"} /> },
];

const CERTIFICATES = [
  { name: "Software Architecture Foundations", issuer: "LinkedIn Learning", date: "Apr 2026", link: "https://drive.google.com/file/d/1HC36k_jP-U5HRUWSHfjsRoAOCdLp76mU/view" },
  { name: "Quickstart: LangSmith Fleet", issuer: "LangChain Academy", date: "Apr 2026", link: "https://drive.google.com/file/d/1HC36k_jP-U5HRUWSHfjsRoAOCdLp76mU/view" },
  { name: "Quickstart: LangGraph Essentials - Python", issuer: "LangChain Academy", date: "Apr 2026", link: "https://drive.google.com/file/d/1HC36k_jP-U5HRUWSHfjsRoAOCdLp76mU/view" },
  { name: "Docker for Developers", issuer: "LinkedIn Learning", date: "Apr 2026", link: "https://drive.google.com/file/d/1ssYShpr5T1KVFYO58AUOICFdFL5JksnJ/view" },
  { name: "Prompt Engineering", issuer: "LinkedIn Learning", date: "Jan 2024", link: "https://drive.google.com/file/d/1HJJ2tOzLK-1qcEhdWI8qxIvtnjPyOIvB/view" },
  { name: "Qlik Data Literacy", issuer: "Qlik", date: "Feb 2024", link: "https://drive.google.com/file/d/151Lu6SHdX0idCp76uXvE54R1efh83M2f/view" },
  { name: "Code Maze", issuer: "Anurag University", date: "Sep 2023", link: "https://drive.google.com/file/d/11PwNeuCX3OP0V1F_fRPQzgn-empL2S3b/view" },
  { name: "Blockchain", issuer: "Udemy", date: "Oct 2023", link: "https://drive.google.com/file/d/1HCKYJxXhXuOr9HtX1u-Eq54IfdRvksfC/view" },
  { name: "Data Visualization", issuer: "LinkedIn Learning", date: "Jan 2024", link: "https://drive.google.com/file/d/1HLf4UtWW36XZVO_Nt89b6GFeOqIYXuOU/view" },
  { name: "DSA in Java", issuer: "Infosys Springboard", date: "Oct 2023", link: "https://drive.google.com/file/d/1HPYjO7kX_pUHZo1q_jU3Xd03-YnrOUZG/view" },
  { name: "HTML", issuer: "Infosys Springboard", date: "Nov 2023", link: "https://drive.google.com/file/d/1HrTK9ZGVoM3Tw9hWwJqYoUBfuhoBFcOw/view" },
  { name: "Java for Beginners", issuer: "Infosys Springboard", date: "Oct 2023", link: "https://drive.google.com/file/d/1HPcbnvyzxrbCsH4AOwU558OIV6aNNXdk/view" },
  { name: "NumPy & Pandas", issuer: "Infosys Springboard", date: "Nov 2023", link: "https://drive.google.com/file/d/1HVi9JXJu8hvhG_1Ca20n7cdWucZFUhdk/view" },
];

function Page() {
  const [toolsLoaded, setToolsLoaded] = useState(false);
  useEffect(() => {
    setToolsLoaded(true);
  }, []);
  return (
    <div className="container mx-auto px-4 md:px-[50px] xl:px-[200px] text-zinc-300 pt-20 pb-20">
      <div className="flex flex-col lg:flex-row gap-5">
        <aside className="w-full md:basis-1/4">
          <div
            className="p-4 md:p-8 lg:p-10 rounded-2xl border-[.5px] border-zinc-600"
            style={{ backdropFilter: "blur(2px)" }}
          >
            <div className="flex flex-row lg:flex-col items-center">
              <div className="flex justify-center items-center lg:w-full lg:aspect-square bg-zinc-800 rounded-xl lg:mb-5">
                <img
                  className="rounded-full p-4 lg:p-10 w-[100px] md:w-[150px] lg:w-[200px] aspect-square bg-zinc-800"
                  alt="me"
                  src="/assets/me.jpg"
                />
              </div>
              <div className="flex flex-col gap-3 lg:items-center ml-10 md:ml-20 lg:ml-0">
                <p className="text-center text-xl">{config.author}</p>
                <div className="text-xs bg-zinc-700 w-fit px-3 py-1 rounded-full">
                  AI & Software Developer
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <hr className="my-10 border-zinc-600" />
              <ul className="flex flex-col gap-3">
                {CONTACT_LINKS.map((link) => (
                  <li key={link.name}>
                    <a
                      className="flex items-center px-3 gap-3 w-full h-12 border-zinc-700 bg-zinc-800 hover:border-zinc-600 border-[.5px] rounded-md "
                      href={link.href}
                    >
                      <div className="w-8">{link.icon}</div>
                      <div className="flex flex-col">
                        <div className="text-sm">{link.name}</div>
                        <div className="text-xs text-zinc-500">
                          {link.content}
                        </div>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
        <main className="basis-3/4 w-full">
          <div
            className="p-10 border-[.5px] rounded-md border-zinc-600"
            style={{ backdropFilter: "blur(2px)" }}
          >
            <h1 className="text-3xl mb-10 lg:md-20">About me</h1>
            <p className="mb-10 text-roboto">
              Hey there! I&apos;m Gourav, a Computer Science student at Anurag University with a deep passion for AI, Data Science, and Software Engineering. I specialize in building intelligent systems that solve real-world problems, from AI-proctored examination platforms to distributed network compliance systems.
            </p>
            <p className="mb-10">
              I recently completed a Software Development Internship at DRDO (RCI), where I developed C-based software for defense-grade hardware protocols. I love exploring new technologies like Agentic AI, RAG systems, and Context-Aware AI.
            </p>
            
            <h1 className="text-3xl mb-10 lg:md-20">Education</h1>
            <div className="mb-10 space-y-4">
              <div>
                <h3 className="text-xl font-bold">Bachelor of Computer Science</h3>
                <p className="text-zinc-400">Anurag University | Expected 2026</p>
                <p className="text-sm">CGPA: 8.79 | Coursework: Data Science with CSE</p>
              </div>
              <div>
                <h3 className="text-xl font-bold">Schooling</h3>
                <p className="text-zinc-400">St. Francis De Sales High School | 2020</p>
                <p className="text-sm">CGPA: 10</p>
              </div>
            </div>

            <h1 className="text-3xl mb-10 lg:md-20">Certificates</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
              {CERTIFICATES.map((cert, index) => (
                <a 
                  key={index} 
                  href={cert.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-4 border-[.5px] border-zinc-700 bg-zinc-800/50 rounded-lg hover:border-zinc-500 transition-colors group"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-sm group-hover:text-white transition-colors">{cert.name}</h4>
                      <p className="text-xs text-zinc-400">{cert.issuer}</p>
                      <p className="text-[10px] text-zinc-500 mt-1">{cert.date}</p>
                    </div>
                    <FaExternalLinkAlt className="text-zinc-600 group-hover:text-zinc-400 text-xs" />
                  </div>
                </a>
              ))}
            </div>

            <h1 className="text-3xl mb-10 lg:md-20">Stuff I use</h1>
            <div className="mb-5">
              {!toolsLoaded ? (
                <p className="h-[100px]"></p>
              ) : (
                <Splide
                  options={{
                    type: "loop",
                    interval: 2000,
                    autoplay: true,
                    pagination: false,
                    speed: 2000,
                    perPage: 5,
                    perMove: 1,
                    rewind: true,
                    easing: "cubic-bezier(0.25, 1, 0.5, 1)",
                    arrows: false,
                  }}
                >
                  {TOOLS.map((tool) => (
                    <SplideSlide key={tool.name}>
                      <div className="w-fit p-2 border-[.5px] border-zinc-600 rounded-md">
                        {tool.icon}
                      </div>
                    </SplideSlide>
                  ))}
                </Splide>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Page;