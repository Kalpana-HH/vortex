/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  category: 'Build & Hardware' | 'Programming & Control' | 'Outreach & CAD' | 'Events';
  tags: string[];
  readTime: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: 'Mechanical' | 'Software' | 'Design & Outreach' | 'Mentors' | 'All-Rounder';
  bio: string;
  favTool: string;
  favComponent: string;
  quote: string;
  yearsExperience?: number;
}

export interface TrainingResource {
  id: string;
  title: string;
  description: string;
  category: 'CAD' | 'Hardware' | 'Programming' | 'Notebook & Outreach';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  readTime: string;
  codeSnippet?: string;
  codeLanguage?: string;
  guideSteps: string[];
  externalLinks?: { label: string; url: string }[];
}

export interface PortfolioItem {
  id: string;
  teamName: string;
  teamNumber: string;
  title: string;
  season: string;
  awards: string[];
  location: string;
  description: string;
  fileName: string;
  fileSize: string;
  uploadDate: string;
  summarySections?: {
    title: string;
    content: string;
  }[];
}
