"use client";

import React from "react";
import SectionHeading from "./section-heading";
import { motion } from "framer-motion";
import { useSectionInView } from "@/lib/hooks";

export default function About() {
  const { ref } = useSectionInView("About");

  return (
    <motion.section
      ref={ref}
      className="mb-28 max-w-[45rem] text-center leading-8 sm:mb-40 scroll-mt-28"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.175 }}
      id="about"
    >
      <SectionHeading>About me</SectionHeading>
      <p className="mb-3">
      During my time in college, I focused heavily on delving into the world of .{" "}
        <span className="font-medium">programming</span>,  actively engaged in various 
        projects and coding practices to strengthen my understanding and skills 
        in different {" "}
        <span className="font-medium">programming languages and current technologies</span>.{" "}
        <span > I am always enthusiastic about continuously learning and honing my skills in this field.</span> 
        In the world of development, I am accustomed to using various programming languages and tools such
        <span className="font-medium">
          PHP, JavaScipts, CI, laravel, React, React-Navite, Next.js, Node.js, MySQL, and MongoDB
        </span>
        . I am also familiar with TypeScript, Prisma and Squelize. I am always looking to
        learn new technologies.
      </p>

      <p>
        <span className="italic">When I'm not coding</span>, I enjoy playing
        video games, and watching movies or anime. I also enjoy{" "}
        <span className="font-medium">learning new things</span>. I am currently
        learning about{" "}
        <span className="font-medium">DevOps</span>
      </p>
    </motion.section>
  );
}
