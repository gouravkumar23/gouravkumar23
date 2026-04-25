"use client";
import Image from "next/image";
import React from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalTrigger,
  useModal,
} from "../ui/animated-modal";
import { FloatingDock } from "../ui/floating-dock";
import Link from "next/link";

import SmoothScroll from "../smooth-scroll";
import projects, { Project } from "@/data/projects";
import { cn } from "@/lib/utils";

const ProjectContents = ({ project }: { project: Project }) => {
  return (
    <div className="p-2 md:p-4">
      <h4 className="text-xl md:text-3xl text-neutral-800 dark:text-neutral-100 font-bold text-center mb-6 md:mb-10">
        {project.title}
      </h4>
      <div className="flex flex-col md:flex-row md:justify-evenly gap-6 mb-10">
        <div className="flex flex-col items-center gap-3">
          <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">
            Frontend
          </p>
          {project.skills.frontend && project.skills.frontend.length > 0 && (
            <FloatingDock items={project.skills.frontend} />
          )}
        </div>
        {project.skills.backend && project.skills.backend.length > 0 && (
          <div className="flex flex-col items-center gap-3">
            <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">
              Backend
            </p>
            <FloatingDock items={project.skills.backend} />
          </div>
        )}
      </div>
      <div className="prose dark:prose-invert max-w-none">
        {project.content}
      </div>
    </div>
  );
};

const ModalFooterContent = ({ project }: { project: Project }) => {
  const { setOpen } = useModal();
  return (
    <ModalFooter className="gap-4 flex-row justify-end">
      <button 
        onClick={() => setOpen(false)}
        className="px-4 py-2 bg-gray-200 text-black dark:bg-zinc-800 dark:text-white border border-transparent rounded-md text-sm transition-colors hover:bg-gray-300 dark:hover:bg-zinc-700"
      >
        Cancel
      </button>
      <Link href={project.live || "#"} target="_blank">
        <button className="bg-black text-white dark:bg-white dark:text-black text-sm px-4 py-2 rounded-md border border-transparent transition-opacity hover:opacity-90">
          Visit
        </button>
      </Link>
    </ModalFooter>
  );
};

const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <div className="flex items-center justify-center w-full">
      <Modal>
        <ModalTrigger className="bg-transparent flex justify-center group/modal-btn w-full">
          <div
            className="relative w-full max-w-[400px] h-auto rounded-lg overflow-hidden shadow-lg"
            style={{ aspectRatio: "3/2" }}
          >
            <Image
              className="absolute w-full h-full top-0 left-0 hover:scale-[1.05] transition-all object-cover"
              src={project.src}
              alt={project.title}
              width={400}
              height={300}
            />
            <div className="absolute w-full h-1/2 bottom-0 left-0 bg-gradient-to-t from-black via-black/85 to-transparent pointer-events-none">
              <div className="flex flex-col h-full items-start justify-end p-4 md:p-6">
                <div className="text-base md:text-lg text-left text-white font-bold">{project.title}</div>
                <div className="text-[10px] md:text-xs bg-white text-black rounded-lg w-fit px-2 py-0.5 mt-1">
                  {project.category}
                </div>
              </div>
            </div>
          </div>
        </ModalTrigger>
        <ModalBody className="w-[95vw] md:max-w-4xl md:max-h-[80%] overflow-auto">
          <SmoothScroll isInsideModal={true}>
            <ModalContent>
              <ProjectContents project={project} />
            </ModalContent>
          </SmoothScroll>
          <ModalFooterContent project={project} />
        </ModalBody>
      </Modal>
    </div>
  );
};

const ProjectsSection = () => {
  return (
    <section id="projects" className="max-w-7xl mx-auto px-4 py-48 md:py-80">
      <Link href={"#projects"}>
        <h2
          className={cn(
            "bg-clip-text text-4xl text-center text-transparent md:text-7xl",
            "bg-gradient-to-b from-black/80 to-black/50",
            "dark:bg-gradient-to-b dark:from-white/80 dark:to-white/20 dark:bg-opacity-50 mb-16 md:mb-32"
          )}
        >
          Projects
        </h2>
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
};

export default ProjectsSection;