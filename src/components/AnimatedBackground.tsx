import React from "react";

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-[var(--bg-color)] transition-colors duration-400">
      {/* Ambient Radial background highlights */}
      <div 
        className="absolute w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] rounded-full blur-[80px] sm:blur-[120px] blob-drift-1" 
        style={{
          top: "-10%",
          left: "-5%",
          backgroundColor: "var(--blob1)",
        }}
      />
      <div 
        className="absolute w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] rounded-full blur-[80px] sm:blur-[140px] blob-drift-2" 
        style={{
          bottom: "-15%",
          right: "-10%",
          backgroundColor: "var(--blob2)",
        }}
      />
      <div 
        className="absolute w-[350px] sm:w-[450px] h-[350px] sm:h-[450px] rounded-full blur-[80px] sm:blur-[110px] blob-drift-3" 
        style={{
          top: "40%",
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: "var(--blob3)",
        }}
      />
    </div>
  );
}
