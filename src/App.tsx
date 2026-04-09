import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, XCircle, RotateCcw, Check, GripVertical, X } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for Tailwind class merging
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- DATA ---

type Description = {
  id: string;
  targetId: string;
  text: string;
  colorClass: string;
};

const DESCRIPTIONS: Description[] = [
  {
    id: 'desc-steam',
    targetId: 'steam',
    text: 'Used to turn turbine to produce electricity using electromagnetic induction.',
    colorClass: 'bg-emerald-500 text-white',
  },
  {
    id: 'desc-coolant',
    targetId: 'coolant',
    text: 'Coolant takes heat from the core to the heat exchanger. Usually boric acid is also added to the water to absorb neutrons.',
    colorClass: 'bg-purple-500 text-white',
  },
  {
    id: 'desc-heat-exchanger',
    targetId: 'heat-exchanger',
    text: 'Heat produced from fission is converted to steam.',
    colorClass: 'bg-blue-600 text-white',
  },
  {
    id: 'desc-control-rods',
    targetId: 'control-rods',
    text: 'Absorb neutrons and controls the rate of the nuclear reaction. Usually made from steel with cadmium or boron.',
    colorClass: 'bg-sky-500 text-white',
  },
  {
    id: 'desc-shielding',
    targetId: 'shielding',
    text: 'Prevents radiation from escaping. Usually made from lead.',
    colorClass: 'bg-red-600 text-white',
  },
  {
    id: 'desc-moderator',
    targetId: 'moderator',
    text: 'Slows neutrons down so they produce further fission. Can also be made from deuterium.',
    colorClass: 'bg-orange-500 text-white',
  },
  {
    id: 'desc-fuel-rods',
    targetId: 'fuel-rods',
    text: 'Where fission takes places. Contain pellets of uranium-238 enriched with uranium-235.',
    colorClass: 'bg-green-700 text-white',
  },
];

type Target = {
  id: string;
  boxX: number;
  boxY: number;
  lineStartX: number;
  lineStartY: number;
  pointerX: number;
  pointerY: number;
  label: string;
};

const TARGETS: Target[] = [
  { id: 'control-rods', boxX: 10, boxY: 20, lineStartX: 290, lineStartY: 80, pointerX: 480, pointerY: 150, label: 'Control Rods' },
  { id: 'shielding', boxX: 10, boxY: 160, lineStartX: 290, lineStartY: 220, pointerX: 400, pointerY: 250, label: 'Radiation Shielding' },
  { id: 'moderator', boxX: 10, boxY: 300, lineStartX: 290, lineStartY: 360, pointerX: 460, pointerY: 400, label: 'Graphite Moderator' },
  { id: 'fuel-rods', boxX: 10, boxY: 440, lineStartX: 290, lineStartY: 500, pointerX: 475, pointerY: 450, label: 'Fuel Rods' },
  { id: 'coolant', boxX: 10, boxY: 580, lineStartX: 290, lineStartY: 640, pointerX: 800, pointerY: 700, label: 'Coolant Loop' },
  { id: 'heat-exchanger', boxX: 1110, boxY: 380, lineStartX: 1110, lineStartY: 440, pointerX: 1000, pointerY: 425, label: 'Heat Exchanger' },
  { id: 'steam', boxX: 1110, boxY: 120, lineStartX: 1110, lineStartY: 180, pointerX: 1050, pointerY: 190, label: 'Steam Output' },
];

export default function App() {
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (isSubmitted) return;
    
    const descId = e.dataTransfer.getData('text/plain');
    if (!descId) return;

    setMatches((prev) => {
      const newMatches = { ...prev };
      // Remove this description from any other target it might be in
      Object.keys(newMatches).forEach((key) => {
        if (newMatches[key] === descId) {
          delete newMatches[key];
        }
      });
      // Assign to new target
      newMatches[targetId] = descId;
      return newMatches;
    });
  };

  const handleRemove = (targetId: string) => {
    if (isSubmitted) return;
    setMatches((prev) => {
      const newMatches = { ...prev };
      delete newMatches[targetId];
      return newMatches;
    });
  };

  const checkAnswers = () => {
    setIsSubmitted(true);
  };

  const reset = () => {
    setMatches({});
    setIsSubmitted(false);
  };

  const unmatchedDescriptions = DESCRIPTIONS.filter(
    (desc) => !Object.values(matches).includes(desc.id)
  );

  const allMatched = Object.keys(matches).length === DESCRIPTIONS.length;

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 font-sans text-slate-800">
      <div className="max-w-[1600px] mx-auto space-y-6">
        
        {/* Header */}
        <header className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Nuclear Reactor Anatomy</h1>
            <p className="text-slate-500 mt-1">Drag the descriptions to their correct attachment points on the diagram.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={reset}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
            <button
              onClick={checkAnswers}
              disabled={!allMatched || isSubmitted}
              className={cn(
                "flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all",
                !allMatched || isSubmitted
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg"
              )}
            >
              <Check className="w-4 h-4" />
              Check Answers
            </button>
          </div>
        </header>

        <div className="flex flex-col gap-6">
          
          {/* Top Area: Interactive Diagram */}
          <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative h-[600px] lg:h-[700px] flex items-center justify-center">
            
            {/* SVG Diagram Container */}
            <div className="w-full h-full overflow-auto relative">
              <svg 
                viewBox="0 0 1400 800" 
                className="w-full h-full min-w-[1200px]"
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#475569" />
                  </marker>
                  <linearGradient id="steamGrad" x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#ef4444" />
                  </linearGradient>
                </defs>

                {/* --- REACTOR GRAPHICS --- */}
                <g id="reactor-core">
                  {/* Outer Shielding */}
                  <rect x="380" y="150" width="340" height="480" fill="#d1fae5" stroke="#059669" strokeWidth="12" rx="16" />
                  
                  {/* Pressure Vessel */}
                  <rect x="410" y="180" width="280" height="420" fill="#fef08a" stroke="#ca8a04" strokeWidth="8" rx="80" />
                  
                  {/* Moderator Blocks */}
                  <rect x="440" y="300" width="50" height="240" fill="#9ca3af" />
                  <rect x="525" y="300" width="50" height="240" fill="#9ca3af" />
                  <rect x="610" y="300" width="50" height="240" fill="#9ca3af" />

                  {/* Fuel Rods */}
                  <rect x="460" y="320" width="10" height="200" fill="#f97316" />
                  <rect x="545" y="320" width="10" height="200" fill="#f97316" />
                  <rect x="630" y="320" width="10" height="200" fill="#f97316" />

                  {/* Control Rods */}
                  <line x1="465" y1="50" x2="465" y2="250" stroke="#1e293b" strokeWidth="8" />
                  <line x1="550" y1="50" x2="550" y2="350" stroke="#1e293b" strokeWidth="8" />
                  <line x1="635" y1="50" x2="635" y2="150" stroke="#1e293b" strokeWidth="8" />
                </g>

                <g id="heat-exchange-loop">
                  {/* Hot Gas Duct */}
                  <path d="M 690 250 L 820 250 L 820 150 L 950 150 L 950 200" fill="none" stroke="#fcd34d" strokeWidth="36" strokeLinejoin="round" />
                  {/* Cool Gas Duct */}
                  <path d="M 950 650 L 950 700 L 820 700 L 820 600 L 690 600" fill="none" stroke="#fef08a" strokeWidth="36" strokeLinejoin="round" />
                  
                  {/* Gas Circulator */}
                  <circle cx="820" cy="700" r="35" fill="#fef08a" stroke="#ca8a04" strokeWidth="6" />
                  <path d="M 800 680 L 840 720 M 800 720 L 840 680 M 820 670 L 820 730 M 790 700 L 850 700" stroke="#ca8a04" strokeWidth="4" />

                  {/* Heat Exchanger Vessel */}
                  <rect x="900" y="200" width="100" height="450" fill="#fef08a" stroke="#ca8a04" strokeWidth="8" rx="50" />
                  
                  {/* Steam/Water Pipe (ZigZag) */}
                  <path d="M 1000 550 L 950 550 L 920 520 L 980 490 L 920 460 L 980 430 L 920 400 L 980 370 L 920 340 L 980 310 L 920 280 L 980 250 L 950 220 L 950 190 L 1080 190" fill="none" stroke="url(#steamGrad)" strokeWidth="16" strokeLinejoin="round" />
                  
                  {/* Water Circulator */}
                  <circle cx="1020" cy="550" r="30" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="6" />
                  <path d="M 1005 535 L 1035 565 M 1005 565 L 1035 535 M 1020 525 L 1020 575 M 995 550 L 1045 550" stroke="#1d4ed8" strokeWidth="4" />
                </g>

                {/* --- TARGETS & DROP ZONES --- */}
                {TARGETS.map((target) => {
                  const matchedDescId = matches[target.id];
                  const matchedDesc = DESCRIPTIONS.find(d => d.id === matchedDescId);
                  const isCorrect = isSubmitted && matchedDesc?.targetId === target.id;
                  const isIncorrect = isSubmitted && matchedDesc && matchedDesc.targetId !== target.id;

                  return (
                    <g key={target.id}>
                      {/* Connecting Line */}
                      <path 
                        d={`M ${target.lineStartX} ${target.lineStartY} L ${target.pointerX} ${target.pointerY}`}
                        fill="none"
                        stroke="#94a3b8"
                        strokeWidth="3"
                        strokeDasharray="6 6"
                        markerEnd="url(#arrow)"
                      />
                      
                      {/* Target Point Circle */}
                      <circle 
                        cx={target.pointerX} 
                        cy={target.pointerY} 
                        r="8" 
                        fill="white" 
                        stroke="#0f172a" 
                        strokeWidth="4" 
                      />

                      {/* Drop Zone ForeignObject */}
                      <foreignObject 
                        x={target.boxX} 
                        y={target.boxY} 
                        width="280" 
                        height="120"
                      >
                        <div 
                          className={cn(
                            "w-full h-full rounded-xl border-2 transition-all flex items-center justify-center p-2 relative",
                            matchedDesc ? "border-transparent" : "border-dashed border-slate-300 bg-slate-50/50",
                            !isSubmitted && !matchedDesc && "hover:border-blue-400 hover:bg-blue-50/50"
                          )}
                          onDragOver={(e) => {
                            e.preventDefault();
                            e.dataTransfer.dropEffect = 'move';
                          }}
                          onDrop={(e) => handleDrop(e, target.id)}
                        >
                          {!matchedDesc && (
                            <span className="text-slate-400 text-sm font-medium text-center">
                              Drop {target.label} here
                            </span>
                          )}

                          {matchedDesc && (
                            <motion.div
                              layoutId={matchedDesc.id}
                              className={cn(
                                "absolute inset-0 p-3 rounded-xl shadow-md flex items-center gap-3 cursor-grab active:cursor-grabbing border-4 border-transparent transition-all",
                                matchedDesc.colorClass,
                                isSubmitted && "cursor-default",
                                isCorrect && "border-green-500 ring-2 ring-inset ring-black",
                                isIncorrect && "border-red-500 ring-2 ring-inset ring-black"
                              )}
                              draggable={!isSubmitted}
                              onDragStart={(e: any) => handleDragStart(e, matchedDesc.id)}
                            >
                              <p className="text-sm leading-snug font-medium flex-1">{matchedDesc.text}</p>
                              
                              {!isSubmitted && (
                                <button 
                                  onClick={() => handleRemove(target.id)}
                                  className="p-1 hover:bg-black/20 rounded-full transition-colors shrink-0"
                                  title="Remove"
                                >
                                  <XCircle className="w-5 h-5 text-white/80" />
                                </button>
                              )}

                              {isSubmitted && (
                                <div className={cn(
                                  "shrink-0 p-1 rounded-full border-2 border-black shadow-sm",
                                  isCorrect ? "bg-green-500" : "bg-red-500"
                                )}>
                                  {isCorrect ? (
                                    <Check className="w-5 h-5 text-white stroke-[3]" />
                                  ) : (
                                    <X className="w-5 h-5 text-white stroke-[3]" />
                                  )}
                                </div>
                              )}
                            </motion.div>
                          )}
                        </div>
                      </foreignObject>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Bottom Area: Description Bank */}
          <div className="w-full bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
            <h2 className="text-lg font-semibold mb-4 px-2 text-center text-slate-700">Descriptions Bank</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {unmatchedDescriptions.map((desc) => (
                <motion.div
                  key={desc.id}
                  layoutId={desc.id}
                  draggable={!isSubmitted}
                  onDragStart={(e: any) => handleDragStart(e, desc.id)}
                  className={cn(
                    "p-4 rounded-xl shadow-sm cursor-grab active:cursor-grabbing flex gap-3 items-start w-[280px]",
                    desc.colorClass,
                    isSubmitted && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <GripVertical className="w-5 h-5 opacity-50 shrink-0 mt-0.5" />
                  <p className="text-sm leading-snug font-medium">{desc.text}</p>
                </motion.div>
              ))}
              {unmatchedDescriptions.length === 0 && (
                <div className="w-full flex items-center justify-center text-slate-400 text-sm text-center p-8 border-2 border-dashed border-slate-200 rounded-xl">
                  All descriptions placed!
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
