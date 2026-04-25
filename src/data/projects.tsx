import AceTernityLogo from "@/components/logos/aceternity";
import SlideShow from "@/components/slide-show";
import { Button } from "@/components/ui/button";
import { TypographyH3, TypographyP } from "@/components/ui/typography";
import { ArrowUpRight, Users } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
import { RiNextjsFill, RiNodejsFill, RiReactjsFill } from "react-icons/ri";
import {
  SiDocker,
  SiExpress,
  SiFirebase,
  SiJavascript,
  SiMongodb,
  SiPostgresql,
  SiPython,
  SiTailwindcss,
  SiTypescript,
  SiVite,
  SiHtml5,
  SiApachemaven,
  SiArduino,
  SiFlask,
  SiGooglecloud,
  SiOpenlayers,
  SiOpencv,
  SiSupabase,
  SiSpringboot,
} from "react-icons/si";
import { FaCss3Alt } from "react-icons/fa6";
import { TbBrandFramerMotion } from "react-icons/tb";

const ProjectsLinks = ({ live, repo, collaborator }: { live?: string; repo?: string; collaborator?: string }) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-start gap-3 my-3 mb-8">
      {live && (
        <Link
          className="font-mono underline flex gap-2"
          rel="noopener"
          target="_new"
          href={live}
        >
          <Button variant={"default"} size={"sm"}>
            Visit Website
            <ArrowUpRight className="ml-3 w-5 h-5" />
          </Button>
        </Link>
      )}
      {repo && (
        <Link
          className="font-mono underline flex gap-2"
          rel="noopener"
          target="_new"
          href={repo}
        >
          <Button variant={"default"} size={"sm"}>
            Github
            <ArrowUpRight className="ml-3 w-5 h-5" />
          </Button>
        </Link>
      )}
      {collaborator && (
        <Link
          className="font-mono underline flex gap-2"
          rel="noopener"
          target="_new"
          href={collaborator}
        >
          <Button variant={"outline"} size={"sm"}>
            Collaborator
            <Users className="ml-3 w-5 h-5" />
          </Button>
        </Link>
      )}
    </div>
  );
};

export type Skill = {
  title: string;
  bg: string;
  fg: string;
  icon: ReactNode;
};

const PROJECT_SKILLS = {
  next: { title: "Next.js", bg: "black", fg: "white", icon: <RiNextjsFill /> },
  node: { title: "Node.js", bg: "black", fg: "white", icon: <RiNodejsFill /> },
  python: { title: "Python", bg: "black", fg: "white", icon: <SiPython /> },
  postgres: { title: "PostgreSQL", bg: "black", fg: "white", icon: <SiPostgresql /> },
  mongo: { title: "MongoDB", bg: "black", fg: "white", icon: <SiMongodb /> },
  express: { title: "Express", bg: "black", fg: "white", icon: <SiExpress /> },
  tailwind: { title: "Tailwind", bg: "black", fg: "white", icon: <SiTailwindcss /> },
  docker: { title: "Docker", bg: "black", fg: "white", icon: <SiDocker /> },
  firebase: { title: "Firebase", bg: "black", fg: "white", icon: <SiFirebase /> },
  js: { title: "JavaScript", bg: "black", fg: "white", icon: <SiJavascript /> },
  ts: { title: "TypeScript", bg: "black", fg: "white", icon: <SiTypescript /> },
  react: { title: "React.js", bg: "black", fg: "white", icon: <RiReactjsFill /> },
  framerMotion: { title: "Framer Motion", bg: "black", fg: "white", icon: <TbBrandFramerMotion /> },
  vite: { title: "Vite", bg: "black", fg: "white", icon: <SiVite /> },
  html: { title: "HTML5", bg: "black", fg: "white", icon: <SiHtml5 /> },
  css: { title: "CSS3", bg: "black", fg: "white", icon: <FaCss3Alt /> },
  bootstrap: { title: "Bootstrap", bg: "black", fg: "white", icon: <SiGooglecloud /> },
  maven: { title: "Maven", bg: "black", fg: "white", icon: <SiApachemaven /> },
  flask: { title: "Flask", bg: "black", fg: "white", icon: <SiFlask /> },
  gemini: { title: "Gemini AI", bg: "black", fg: "white", icon: <SiGooglecloud /> },
  opencv: { title: "OpenCV", bg: "black", fg: "white", icon: <SiOpencv /> },
  supabase: { title: "Supabase", bg: "black", fg: "white", icon: <SiSupabase /> },
  springboot: { title: "Spring Boot", bg: "black", fg: "white", icon: <SiSpringboot /> },
};

export type Project = {
  id: string;
  category: string;
  title: string;
  src: string;
  screenshots: string[];
  skills: { frontend: Skill[]; backend: Skill[] };
  content: React.ReactNode | any;
  github?: string;
  live?: string;
  collaborator?: string;
};

const projects: Project[] = [
  {
    id: "eduease",
    category: "AI Proctored Platform",
    title: "EduEase",
    src: "/assets/projects-screenshots/eduease/main.png",
    screenshots: [],
    skills: {
      frontend: [PROJECT_SKILLS.react, PROJECT_SKILLS.tailwind],
      backend: [PROJECT_SKILLS.firebase, PROJECT_SKILLS.node, PROJECT_SKILLS.gemini],
    },
    live: "https://eduease-jade.vercel.app/",
    github: "https://github.com/gouravkumar23/eduEase",
    collaborator: "https://github.com/mujju0Luna",
    get content() {
      return (
        <div>
          <TypographyP className="font-mono ">
            Intelligent Learning and Testing Platform featuring AI-powered examination with real-time monitoring and secure session control.
          </TypographyP>
          <ProjectsLinks live={this.live} repo={this.github} collaborator={this.collaborator} />
          <TypographyH3 className="my-4 mt-8">Key Features</TypographyH3>
          <ul className="list-disc ml-6 font-mono">
            <li>AI proctoring (face detection, noise analysis, tab tracking)</li>
            <li>Automated MCQ generation using Gemini API</li>
            <li>4-tier architecture integrating frontend, Firebase, and AI services</li>
            <li>Introduced Concepts of rooms for targeted Studies and Context AI systems for improved personalized learning techniques.</li>
          </ul>
        </div>
      );
    },
  },
  {
    id: "dancces",
    category: "Network Security",
    title: "DANCCES",
    src: "/assets/projects-screenshots/dancces/main.png",
    screenshots: [],
    skills: {
      frontend: [PROJECT_SKILLS.python],
      backend: [PROJECT_SKILLS.python, PROJECT_SKILLS.docker],
    },
    live: "https://drive.google.com/file/d/1iqtyRYBMamkz3fSpMg1lhLBrqRYGr1Ur/view?usp=sharing",
    github: "https://github.com/gouravkumar23/DANCCES",
    get content() {
      return (
        <div>
          <TypographyP className="font-mono ">
            Distributed Autonomous Network Compliance System for decentralized endpoint management with autonomous enforcement at device level.
          </TypographyP>
          <ProjectsLinks live={this.live} repo={this.github} />
          <TypographyH3 className="my-4 mt-8">Key Features</TypographyH3>
          <ul className="list-disc ml-6 font-mono">
            <li>Cryptographic command validation</li>
            <li>Real-time heartbeat monitoring and firewall/DNS control</li>
            <li>Remote system execution capabilities</li>
            <li>Scalable architecture designed for high-security environments</li>
          </ul>
        </div>
      );
    },
  },
  {
    id: "datadynomo2",
    category: "Management Platform",
    title: "DataDynomo2",
    src: "/assets/projects-screenshots/datadynomo2/main.png",
    screenshots: [],
    skills: {
      frontend: [PROJECT_SKILLS.react, PROJECT_SKILLS.ts, PROJECT_SKILLS.tailwind],
      backend: [PROJECT_SKILLS.firebase],
    },
    live: "https://datadynomo2.vercel.app/",
    github: "https://github.com/gouravkumar23/datadynomo2",
    get content() {
      return (
        <div>
          <TypographyP className="font-mono ">
            Full-stack Hackathon Management Platform with QR-based secure check-ins and role-based dashboards.
          </TypographyP>
          <ProjectsLinks live={this.live} repo={this.github} />
          <TypographyH3 className="my-4 mt-8">Key Features</TypographyH3>
          <ul className="list-disc ml-6 font-mono">
            <li>Real-time announcements and voting systems</li>
            <li>Project allocations and audit logging</li>
            <li>Secure QR-based check-in system</li>
            <li>Comprehensive admin and participant dashboards</li>
          </ul>
        </div>
      );
    },
  },
  {
    id: "universal-mailing",
    category: "Backend Service",
    title: "Universal Mailing Service",
    src: "/assets/projects-screenshots/qwerty-mailing/main.png",
    screenshots: [],
    skills: {
      frontend: [],
      backend: [PROJECT_SKILLS.node, PROJECT_SKILLS.express],
    },
    github: "https://github.com/qwertymailingdemon/qwertyMailingService",
    get content() {
      return (
        <div>
          <TypographyP className="font-mono ">
            Centralized email service supporting OTP, password reset, and notifications across multiple applications.
          </TypographyP>
          <ProjectsLinks repo={this.github} />
          <TypographyH3 className="my-4 mt-8">Key Features</TypographyH3>
          <ul className="list-disc ml-6 font-mono">
            <li>Secure API-based mailing system</li>
            <li>Scalable deployment on Render</li>
            <li>Authentication and rate limiting</li>
          </ul>
        </div>
      );
    },
  },
  {
    id: "scrum-assistant",
    category: "AI Assistant",
    title: "Scrum-Assisstant",
    src: "/assets/projects-screenshots/scrum-assistant/main.png",
    screenshots: [],
    skills: {
      frontend: [PROJECT_SKILLS.react, PROJECT_SKILLS.tailwind],
      backend: [PROJECT_SKILLS.flask, PROJECT_SKILLS.firebase, PROJECT_SKILLS.gemini],
    },
    live: "https://scrumassisstant.vercel.app/",
    github: "https://github.com/gouravkumar23/Scrum-Assisstant",
    get content() {
      return (
        <div>
          <TypographyP className="font-mono ">
            Intelligent Scrum Master Assistant that automates Scrum duties and integrates with WhatsApp for team management.
          </TypographyP>
          <ProjectsLinks live={this.live} repo={this.github} />
          <TypographyH3 className="my-4 mt-8">Key Features</TypographyH3>
          <ul className="list-disc ml-6 font-mono">
            <li>WhatsApp integration for real-time team updates</li>
            <li>AI-guided project and team management</li>
            <li>Scalable architecture supporting 1000+ users</li>
          </ul>
        </div>
      );
    },
  },
  {
    id: "baymax",
    category: "AI Summarization",
    title: "BayMax",
    src: "/assets/projects-screenshots/baymax/main.png",
    screenshots: [],
    skills: {
      frontend: [PROJECT_SKILLS.react, PROJECT_SKILLS.tailwind],
      backend: [PROJECT_SKILLS.flask, PROJECT_SKILLS.firebase],
    },
    live: "https://jazzy-dodol-06b17d.netlify.app/",
    github: "https://github.com/gouravkumar23/BayMax",
    get content() {
      return (
        <div>
          <TypographyP className="font-mono ">
            AI-Powered IT Incident Summarization platform designed to provide analytical dashboards for IT management.
          </TypographyP>
          <ProjectsLinks live={this.live} repo={this.github} />
          <TypographyH3 className="my-4 mt-8">Key Features</TypographyH3>
          <ul className="list-disc ml-6 font-mono">
            <li>BART-based AI summarization</li>
            <li>Analytical dashboards for incident tracking</li>
          </ul>
        </div>
      );
    },
  },
  {
    id: "java-quiz",
    category: "Web App",
    title: "Online Quiz Application",
    src: "/assets/logo-dark.svg",
    screenshots: [],
    skills: {
      frontend: [PROJECT_SKILLS.html, PROJECT_SKILLS.css],
      backend: [PROJECT_SKILLS.springboot],
    },
    github: "https://github.com/gouravkumar23/JavaQuiz",
    get content() {
      return (
        <div>
          <TypographyP className="font-mono ">
            Web-based platform for hosting and managing online quizzes built with Java and Spring Boot.
          </TypographyP>
          <ProjectsLinks repo={this.github} />
        </div>
      );
    },
  },
  {
    id: "clubease",
    category: "Management System",
    title: "ClubEase",
    src: "/assets/logo-dark.svg",
    screenshots: [],
    skills: {
      frontend: [PROJECT_SKILLS.js, PROJECT_SKILLS.html, PROJECT_SKILLS.css],
      backend: [PROJECT_SKILLS.supabase],
    },
    github: "https://github.com/gouravkumar23/club_manaement_system",
    get content() {
      return (
        <div>
          <TypographyP className="font-mono ">
            Club management platform with Supabase APIs and real-time frontend data manipulation.
          </TypographyP>
          <ProjectsLinks repo={this.github} />
        </div>
      );
    },
  },
  {
    id: "trash-detection",
    category: "Computer Vision",
    title: "Trash Detection System",
    src: "/assets/logo-dark.svg",
    screenshots: [],
    skills: {
      frontend: [PROJECT_SKILLS.html, PROJECT_SKILLS.css],
      backend: [PROJECT_SKILLS.python, PROJECT_SKILLS.opencv, PROJECT_SKILLS.gemini],
    },
    github: "https://github.com/gouravkumar23/Trash-Detection",
    get content() {
      return (
        <div>
          <TypographyP className="font-mono ">
            System that detects and classifies trash into 3 categories, offering actionable solutions using Gemini API.
          </TypographyP>
          <ProjectsLinks repo={this.github} />
        </div>
      );
    },
  },
];

export default projects;