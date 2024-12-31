"use client";

import { Card } from "@/components/ui/card";
import { Github, Linkedin, Twitter } from "lucide-react";
import Image from "next/image";

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
    name: "Sarah Chen",
    role: "AI Research Lead",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&auto=format&fit=crop&q=80",
    bio: "PhD in Machine Learning with focus on educational AI systems",
    social: {
      github: "#",
      linkedin: "#",
      twitter: "#"
    }
  },
  {
    name: "Michael Rodriguez",
    role: "Education Specialist",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&auto=format&fit=crop&q=80",
    bio: "15 years experience in curriculum development and educational technology",
    social: {
      linkedin: "#",
      twitter: "#"
    }
  },
  {
    name: "Aisha Patel",
    role: "Full Stack Developer",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&auto=format&fit=crop&q=80",
    bio: "Expert in building scalable educational platforms and AI integration",
    social: {
      github: "#",
      linkedin: "#"
    }
  },
  {
    name: "David Kim",
    role: "UX/UI Designer",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&auto=format&fit=crop&q=80",
    bio: "Passionate about creating intuitive and accessible learning experiences",
    social: {
      github: "#",
      linkedin: "#",
      twitter: "#"
    }
  }
];

function TeamMemberCard({ member }: { member: TeamMember }) {
  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-violet-50/30 dark:from-gray-900 dark:to-violet-950/20">
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
        <p className="text-muted-foreground mb-4">{member.bio}</p>
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
              <Twitter className="h-5 w-5" />
            </a>
          )}
        </div>
      </div>
    </Card>
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