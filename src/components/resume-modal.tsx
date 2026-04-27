"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, Download, ExternalLink } from "lucide-react";

interface ResumeModalProps {
  resumeUrl: string;
  children: React.ReactNode;
}

const ResumeModal = ({ resumeUrl, children }: ResumeModalProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-5xl w-[95vw] h-[90vh] flex flex-col p-0 overflow-hidden bg-zinc-950 border-zinc-800">
        <DialogHeader className="p-4 border-b border-zinc-800 flex flex-row items-center justify-between space-y-0">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <FileText className="text-brand" />
            Resume
          </DialogTitle>
          <div className="flex items-center gap-2 mr-8">
            <Button variant="outline" size="sm" asChild className="hidden sm:flex">
              <a href={resumeUrl} download="Gourav_Kumar_Gunjari_Resume.pdf">
                <Download className="w-4 h-4 mr-2" />
                Download
              </a>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          </div>
        </DialogHeader>
        <div className="flex-1 w-full bg-zinc-900 relative">
          <iframe
            src={`${resumeUrl}#toolbar=0`}
            className="w-full h-full border-none"
            title="Resume PDF"
          />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 sm:hidden">
            <Button asChild className="bg-brand hover:bg-brand/90 text-white">
              <a href={resumeUrl} download="Gourav_Kumar_Gunjari_Resume.pdf">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResumeModal;