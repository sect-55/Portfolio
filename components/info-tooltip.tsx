"use client";

import React, { useState } from "react";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import { AnimatePresence, motion } from "motion/react";
import { POP_IN_VARIANT, SPRING_CONFIG } from "@/lib/motion-config";

export const InfoTooltip = ({ text }: { text: string }) => {
  const [isOpen, setOpen] = useState(false);

  return (
    <HoverCardPrimitive.Root
      openDelay={100}
      closeDelay={200}
      onOpenChange={setOpen}
    >
      <HoverCardPrimitive.Trigger asChild>
        <motion.button
          type="button"
          className="ml-1.5 inline-flex cursor-help items-center align-middle"
          aria-label="More info"
          animate={{ rotate: [0, -8, 8, -4, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
          whileHover={{ scale: 1.25 }}
        >
          <span className="text-lg leading-none">🤔</span>
        </motion.button>
      </HoverCardPrimitive.Trigger>

      <HoverCardPrimitive.Portal>
        <HoverCardPrimitive.Content
          className="z-100 origin-(--radix-hover-card-content-transform-origin) perspective-distant"
          side="top"
          align="center"
          sideOffset={8}
        >
          <AnimatePresence>
            {isOpen && (
              <motion.div
                variants={POP_IN_VARIANT}
                initial="initial"
                animate="animate"
                transition={SPRING_CONFIG}
                className="max-w-[280px] rounded-lg border border-foreground/10 bg-background/95 px-3 py-2 text-sm text-foreground/70 shadow-xl backdrop-blur-md"
              >
                {text}
              </motion.div>
            )}
          </AnimatePresence>
        </HoverCardPrimitive.Content>
      </HoverCardPrimitive.Portal>
    </HoverCardPrimitive.Root>
  );
};
