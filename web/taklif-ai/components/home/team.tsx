"use client";

import { Card } from "@/components/ui/card";
import { Github, Linkedin, Twitter } from "lucide-react";
import XIcon from '@mui/icons-material/X';
import Image from "next/image";
import { motion } from "framer-motion";

interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio: string;
  social: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
}

const teamMembers: TeamMember[] = [
  {
    name: "Zaki Kurdya",
    role: "Lead, AI Engineer",
    image: "/zaki.jpg",
    bio: "PhD in Machine Learning with focus on educational AI systems",
    social: {
      github: "https://www.linkedin.com/in/zakikurdya/",
      linkedin: "https://www.linkedin.com/in/zakikurdya/",
      twitter: "https://x.com/ZakiKurdya"
    }
  },
  {
    name: "Salem Amassi",
    role: "LLM-For-Production Developer",
    image: "salem.jpg",
    bio: "15 years experience in curriculum development and educational technology",
    social: {
      linkedin: "https://linkedin.com/in/salem-amassi-b961aa229",
      github: "https://github.com/salemAmassi"
    }
  },
  {
    name: "Mohammed Basil",
    role: "Full-Stack Web Developer",
    image: "mohammed.jpg",
    bio: "Expert in building scalable educational platforms and AI integration",
    social: {
      github: "https://github.com/Mohammedbasi",
      linkedin: "#"
    }
  },
  {
    name: "Shady Telbany",
    role: "Full-Stack Web Developer",
    image: "shady.jpg",
    bio: "Passionate about creating intuitive and accessible learning experiences",
    social: {
      github: "https://github.com/ShDXMT",
      linkedin: "https://www.linkedin.com/in/shadytelbany/",
      twitter: "https://x.com/shady_telbani"
    }
  }
];

function TeamMemberCard({ member }: { member: TeamMember }) {
  return (
    <Card className="p-6 transition-all duration-300 bg-gradient-to-br from-white to-violet-50/30 dark:from-gray-900 dark:to-violet-950/20 hover:bg-violet-50 dark:hover:bg-violet-900/20 hover:shadow-lg dark:hover:shadow-violet-900/50">
      <div className="text-center">
        <div className="relative w-32 h-32 mx-auto mb-4">
          <div className="absolute inset-0 bg-violet-200 dark:bg-violet-800 rounded-full blur-lg opacity-20"></div>
          <Image
            src={member.image}
            alt={member.name}
            fill
            className="rounded-full object-cover relative z-10"
          />
        </div>
        <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
        <p className="text-violet-600 dark:text-violet-400 font-medium mb-2">{member.role}</p>
        <div className="flex justify-center space-x-3">
          {member.social.github && (
            <a href={member.social.github} className="text-muted-foreground hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
              <Github className="h-5 w-5" />
            </a>
          )}
          {member.social.linkedin && (
            <a href={member.social.linkedin} className="text-muted-foreground hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
              <Linkedin className="h-5 w-5" />
            </a>
          )}
          {member.social.twitter && (
            <a href={member.social.twitter} className="text-muted-foreground hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
              <XIcon fontSize="small" />
            </a>
          )}
        </div>
      </div>
    </Card>
    </motion.div>
    
  );
}

export function HomeTeam() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-violet-50 dark:from-background dark:to-violet-950/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-violet-600 to-violet-400 bg-clip-text text-transparent">
            Meet Our Team
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A diverse group of experts committed to revolutionizing education through AI technology
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member) => (
            <TeamMemberCard key={member.name} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
}