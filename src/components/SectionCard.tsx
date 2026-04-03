"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

interface SectionCardProps {
  title: string;
  category: string;
  description: string;
  image?: string;
}

const SectionCard = ({ title, category, description, image }: SectionCardProps) => {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="glass-card overflow-hidden h-full flex flex-col"
    >
      <div className="h-64 w-full bg-[var(--sakata-green-deep)] overflow-hidden relative">
        {image ? (
            <img src={image} alt={title} className="w-full h-full object-cover opacity-60 hover:scale-105 transition-transform duration-700" />
        ) : (
            <div className="w-full h-full flex items-center justify-center opacity-10">
               <span className="text-4xl font-bold italic">Sakata</span>
            </div>
        )}
        <div className="absolute top-4 left-4 bg-[var(--sakata-gold)] text-black px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
           {category}
        </div>
      </div>
      
      <div className="p-8 flex-1 flex flex-col">
        <h3 className="text-2xl font-bold mb-4">{title}</h3>
        <p className="text-sm opacity-60 leading-relaxed mb-8 flex-1">
          {description}
        </p>
        
        <div className="flex justify-between items-center mt-auto pt-6 border-t border-[var(--glass-border)]">
          <button className="text-xs font-bold uppercase tracking-widest text-[var(--sakata-gold)] flex items-center gap-2 hover:gap-4 transition-all">
             Apprendre plus <ArrowUpRight size={14} />
          </button>
          
          <button className="text-[10px] font-bold uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity">
             Rejoindre le Forum
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default SectionCard;
