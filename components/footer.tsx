"use client";
import React from "react";
import Container from "./container";
import { motion } from "motion/react";
import { LinkPreview } from "./link-preview";

export const Footer = () => {
  return (
    <Container className="pb-10">
      <footer className="my-8 flex flex-col items-center gap-4">
        <Signature />
        <div className="flex flex-col items-center gap-1.5">
          <div className="text-foreground/40 text-center text-sm text-balance">
            My github{" "}
            <LinkPreview url="https://github.com/sect-55/sect-55">
              repos
            </LinkPreview>.
          </div>
          <div className="text-foreground/40 text-sm text-balance">
            inspired by{" "}
            <LinkPreview url="https://www.manuarora.in/">
              Manu
            </LinkPreview>
          </div>
        </div>
      </footer>
    </Container>
  );
};

const Signature = () => {
  return (
    <motion.svg
      viewBox="0 0 200 60"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto h-8"
    >
      <motion.text
        x="100"
        y="45"
        textAnchor="middle"
        fontFamily="'Georgia', 'Times New Roman', serif"
        fontStyle="italic"
        fontWeight="400"
        fontSize="48"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth={1}
        initial={{
          strokeDasharray: 300,
          strokeDashoffset: 300,
          fillOpacity: 0,
        }}
        whileInView={{
          strokeDashoffset: 0,
          fillOpacity: 1,
        }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{
          strokeDashoffset: { duration: 3, ease: "easeInOut" },
          fillOpacity: { duration: 1, delay: 2.5, ease: "easeInOut" },
        }}
        className="text-foreground"
      >
        secT
      </motion.text>
    </motion.svg>
  );
};
