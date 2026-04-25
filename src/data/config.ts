const config = {
  title: "Gourav Kumar Gunjari | AI & Software Developer",
  description: {
    long: "Explore the portfolio of Gourav Kumar Gunjari, a Computer Science student specializing in Data Science, AI, and Software Development. Experienced in building AI-powered platforms, distributed systems, and intelligent automation tools.",
    short:
      "Portfolio of Gourav Kumar Gunjari, an AI enthusiast and Software Developer building intelligent systems.",
  },
  keywords: [
    "Gourav Kumar Gunjari",
    "Gourav Gunjari",
    "Software Developer",
    "AI Developer",
    "Data Science",
    "Machine Learning",
    "Full Stack Developer",
    "Anurag University",
    "SmartQuizHub",
    "DANCCES",
    "AI Proctored Examination",
    "Distributed Systems",
  ],
  author: "Gourav Kumar Gunjari",
  email: "gunjarigourav@gmail.com",
  site: "https://gouravkumar23.github.io/profile",

  get ogImg() {
    return this.site + "/assets/seo/og-image.png";
  },
  social: {
    twitter: "https://x.com/gourav_gunjari", // Placeholder if not provided
    linkedin: "https://linkedin.com/in/gunjari-gourav-kumar",
    instagram: "https://www.instagram.com/gourav_gunjari/", // Placeholder
    facebook: "https://www.facebook.com/gourav.gunjari", // Placeholder
    github: "https://github.com/gouravkumar23",
  },
};
export { config };