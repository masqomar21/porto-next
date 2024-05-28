import React from "react";
import { CgWorkAlt } from "react-icons/cg";
import { FaReact } from "react-icons/fa";
import { LuGraduationCap } from "react-icons/lu";


import corpcommentImg from "@/public/corpcomment.png";
import rmtdevImg from "@/public/rmtdev.png";
import wordanalyticsImg from "@/public/wordanalytics.png";

export const links = [
  {
    name: "Home",
    hash: "#home",
  },
  {
    name: "About",
    hash: "#about",
  },
  {
    name: "Projects",
    hash: "#projects",
  },
  {
    name: "Skills",
    hash: "#skills",
  },
  {
    name: "Experience",
    hash: "#experience",
  },
  {
    name: "Contact",
    hash: "#contact",
  },
] as const;

export const experiencesData = [
  {
    title: "Forn End Developer - PPKL 2022 ",
    location: "ITERA, Lampung, Indonesia",
    description:
      "In developing a website interface for the campus introduction event at ITERA, I focused on designing an engaging and user-friendly experience.",
    icon: React.createElement(LuGraduationCap),
    date: "2022",
  },
  {
    title: "Head of IT Sub Division - PEMIRA 2023",
    location: "ITERA, Lampung, Indonesia",
    description:
      "I was responsible for monitoring, coordinating, and developing a website for the student presidential election using Tailwind and CodeIgniter. My tasks included ensuring the site’s functionality, maintaining an efficient workflow, and implementing responsive design principles to provide a smooth user experience.",
    icon: React.createElement(LuGraduationCap),
    date: "2022 - 2023",
  },
  {
    title: "Full-Stack Developer - PT. Gatra Mapan (Internship)",
    location: "Malang, Indonesia",
    description:
      "developed a web application for the company's internal use. I was responsible for the front-end and back-end development, including the design and implementation of the database.",
    icon: React.createElement(CgWorkAlt),
    date: "2023",
  },
  {
    title: "Back-End Developer - PT. Cinda Lagika Gravia (Internship)",
    location: "Lampung, Indonesia",
    description:
      "developed a  web application for the company's internal use. I was responsible for the back-end development, including the design and implementation of the database.",
    icon: React.createElement(CgWorkAlt),
    date: "2023",
  },
] as const;

export const projectsData = [
  {
    title: "TiketPapa - Ticket Booking System (Front-End)",
    description:
      "A ticket booking system for a cinema. I was responsible for the front-end development, including the design and implementation of the user interface.",
    tags: ["React", "Next.js", "Tailwind", "Prisma", 'redux', 'redux-saga'],
    imageUrl: corpcommentImg,
  },
  {
    title: "BrainWave - Application for IOT monitoring",
    description:
      "An application for monitoring IOT devices. I was responsible for the front-end and back-end development, including implementation bluetooth connection for IOT device.",
    tags: ["React", "React Native", "Expo", "Tailwind"],
    imageUrl: corpcommentImg,
  },
  {
    title: "HR Management System - PT. Gatra Mapan",
    description:
      "A web application for managing employee data. I was responsible for the front-end and back-end development, including the design and implementation of the database.",
    tags: ["Bootstraps", "php", "Laravel", "MySql"],
    imageUrl: rmtdevImg,
  },
  {
    title: "Website KM ITERA",
    description:
      "A website for the campus introduction event at ITERA. I was responsible for the front-end development, including the design and implementation of the user interface.",
    tags: ["Tailwind", "PHP", "laravel", "MySql",],
    imageUrl: wordanalyticsImg,
  },
  {
    title: "ITERA Advanture 2",
    description:
      "a game that tells the story of a student who is looking for a way to get out of the campus. I was responsible for the design and implementation of the user interface.",
    tags: ["Unity", "Figma", "PhotoShop", "Illustrator",],
    imageUrl: wordanalyticsImg,
  },
] as const;

export const skillsData = [
  "HTML",
  "CSS",
  'PHP',
  'Python',
  'GO',
  "JavaScript",
  "TypeScript",
  "React",
  "React Native",
  "Next.js",
  "Node.js",
  "Git",
  "Tailwind",
  "Prisma",
  "MongoDB",
  "Redux",
  "Laravel",
  'CI',
  "Express",
  "MySQL",
  "PostgreSQL",
  "Ardino",
] as const;
