import React, { useState, useEffect, useRef, useCallback } from 'react';

interface GameNeuroLinkerProps {
  onClose: () => void;
}

interface Node {
  id: number;
  angle: number; // Position on the circle (0-360)
  life: number;  // 0-100, fades in then turns critical
  type: 'DATA' | 'GLITCH';
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

const GameNeuroLinker: React.FC<GameNeuroLinkerProps> = ({ onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [stability, setStability] = useState(100);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);

  // Game State Refs (for animation loop)
  const state = useRef({
    rotation: 0, // Current scanner angle
    speed: 2, // Rotation speed
    level: 1,
    nodes: [] as Node[],
    particles: [] as Particle[],
    lastSpawn: 0,
    isPlaying: true,
    score: 0,
    stability: 100
  });

  // Helper: Degrees to Radians
  const d2r = (deg: number) => (deg * Math.PI) / 180;

  const spawnNode = () => {
    // Spawn a node at a random angle
    let angle = Math.random() * 360;
    const scannerAngle = state.current.rotation % 360;
    
    // Ensure it doesn't spawn right in front of the scanner (give reaction time)
    // Reaction window tightens as levels go up
    const safeZone = Math.max(20, 45 - (state.current.level * 5));
    if (Math.abs(angle - scannerAngle) < safeZone) {
        angle = (angle + 180) % 360;
    }

    // Chance for GLITCH node at higher levels (Level 3+)
    // Glitch nodes decay faster or punish harder (simple implementation: visual distinction for now)
    const type = (state.current.level >= 3 && Math.random() > 0.8) ? 'GLITCH' : 'DATA';

    state.current.nodes.push({
      id: Date.now() + Math.random(),
      angle: angle,
      life: 0,
      type: type
    });
  };

  const createExplosion = (x: number, y: number, color: string) => {
      for (let i = 0; i < 8; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 3 + 1;
          state.current.particles.push({
              id: Math.random(),
              x, y,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              life: 1.0,
              color
          });
      }
  };

  const handleAction = useCallback((e?: React.SyntheticEvent | Event) => {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }

    if (!state.current.isPlaying) return;

    const scannerAngle = state.current.rotation % 360;
    
    // ADJUSTED SENSITIVITY:
    // Was 25 (too easy), now 18 (tighter).
    // Higher levels could even demand more precision, but let's keep it consistent for muscle memory.
    const hitThreshold = 18; 
    
    let hit = false;

    // Check for hits
    state.current.nodes = state.current.nodes.filter(node => {
      const diff = Math.abs(node.angle - scannerAngle);
      const dist = Math.min(diff, 360 - diff);

      if (dist < hitThreshold) {
        // HIT!
        hit = true;
        const points = node.type === 'GLITCH' ? 25 : 10;
        state.current.score += points;
        state.current.stability = Math.min(100, state.current.stability + 5);
        
        // Level Up Logic
        const newLevel = Math.floor(state.current.score / 50) + 1;
        if (newLevel > state.current.level) {
            state.current.level = newLevel;
            setLevel(newLevel);
            // Speed boost on level up
            state.current.speed = Math.min(12, 2 + (newLevel * 0.8));
            createExplosion(0, 0, '#ffffff'); // Center flash
        } else {
             // Slight speed ramp within level
             state.current.speed = Math.min(12, state.current.speed + 0.05);
        }

        setScore(state.current.score);
        setStability(state.current.stability);
        
        // Visuals are handled in render mostly, but could trigger sound here
        return false; // Remove node
      }
      return true; // Keep node
    });

    if (hit) {
         // Good hit
    } else {
        // MISS!
        state.current.stability -= 10;
        setStability(state.current.stability);
    }
    
    if (state.current.stability <= 0) {
        endGame();
    }
  }, []);

  const endGame = () => {
      state.current.isPlaying = false;
      setGameOver(true);
      const saved = localStorage.getItem('neurolinker_highscore');
      if (!saved || state.current.score > parseInt(saved)) {
          localStorage.setItem('neurolinker_highscore', state.current.score.toString());
          setHighScore(state.current.score);
      } else {
          setHighScore(parseInt(saved));
      }
  };

  const restartGame = (e?: React.SyntheticEvent) => {
      if(e) {
          e.preventDefault();
          e.stopPropagation();
      }
      state.current = {
          rotation: 0,
          speed: 2,
          level: 1,
          nodes: [],
          particles: [],
          lastSpawn: 0,
          isPlaying: true,
          score: 0,
          stability: 100
      };
      setScore(0);
      setLevel(1);
      setStability(100);
      setGameOver(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.code === 'Space' || e.code === 'Enter') {
            e.preventDefault(); // Prevent scrolling
            if (gameOver) restartGame();
            else handleAction();
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleAction, gameOver]);

  // Main Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = (time: number) => {
        // 1. Setup Canvas
        const { width, height } = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);

        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) * 0.35;

        // Clear
        ctx.fillStyle = '#0b1120';
        ctx.fillRect(0, 0, width, height);

        if (state.current.isPlaying) {
            // Update Rotation
            state.current.rotation = (state.current.rotation + state.current.speed) % 360;
            
            // Spawning Logic based on Level
            // Faster spawns at higher levels
            const baseInterval = 2000;
            const levelFactor = state.current.level * 250;
            const spawnInterval = Math.max(400, baseInterval - levelFactor);
            
            if (time - state.current.lastSpawn > spawnInterval) {
                spawnNode();
                state.current.lastSpawn = time;
            }
        }

        // 2. Draw HUD Elements (Static Rings)
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 0.7, 0, Math.PI * 2);
        ctx.stroke();

        // 3. Draw Nodes
        state.current.nodes = state.current.nodes.filter(node => {
            // Update Node Life - Decays faster at higher levels
            const decayRate = 0.5 + (state.current.level * 0.1);
            if (state.current.isPlaying) node.life += decayRate;

            // Calculate Position
            const rad = d2r(node.angle);
            const x = centerX + Math.cos(rad) * radius;
            const y = centerY + Math.sin(rad) * radius;

            // Node Attributes
            const isGlitch = node.type === 'GLITCH';
            const color = isGlitch ? '#ef4444' : '#3b82f6';
            
            // Node decay/fail condition
            // Glitch nodes explode faster (120 vs 150)
            const maxLife = isGlitch ? 120 : 150;

            if (node.life > maxLife) {
                state.current.stability -= 15;
                setStability(state.current.stability);
                createExplosion(x, y, '#ef4444');
                return false; // Remove dead node
            }

            // Pulse effect
            const size = (isGlitch ? 8 : 6) + Math.sin(time / 100) * 2;
            
            ctx.fillStyle = color;
            ctx.shadowColor = color;
            ctx.shadowBlur = 10;
            
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
            
            // Draw life ring for critical nodes
            if (node.life > 100) {
                 ctx.strokeStyle = '#ef4444';
                 ctx.lineWidth = 2;
                 ctx.beginPath();
                 ctx.arc(x, y, size + 4, 0, Math.PI * 2);
                 ctx.stroke();
            }

            return true;
        });

        // 4. Draw Scanner
        const scanRad = d2r(state.current.rotation);
        const tipX = centerX + Math.cos(scanRad) * radius;
        const tipY = centerY + Math.sin(scanRad) * radius;

        // The line
        const grad = ctx.createLinearGradient(centerX, centerY, tipX, tipY);
        grad.addColorStop(0, 'rgba(56, 189, 248, 0)');
        grad.addColorStop(1, 'rgba(56, 189, 248, 1)');
        
        ctx.strokeStyle = grad;
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(tipX, tipY);
        ctx.stroke();

        // The Scanner Tip Glow
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#06b6d4';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(tipX, tipY, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // 5. Particles
        state.current.particles = state.current.particles.filter(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.05;
            
            ctx.fillStyle = p.color;
            ctx.globalAlpha = Math.max(0, p.life);
            ctx.beginPath();
            ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1.0;
            
            return p.life > 0;
        });

        if (state.current.stability <= 0 && state.current.isPlaying) {
            endGame();
        }

        animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => cancelAnimationFrame(animationFrameId);
  }, [spawnNode]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-[#0b1120] border border-cyan-500/30 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.15)] p-4 sm:p-6 w-full max-w-md relative overflow-hidden flex flex-col h-[90vh] sm:h-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4 z-10 shrink-0">
            <div>
                <h2 className="text-cyan-400 font-bold text-xl tracking-widest font-mono uppercase">Neuro-Linker</h2>
                <div className="flex items-center gap-3">
                    <p className="text-[10px] text-cyan-600 uppercase">Synchroniseer de nodes</p>
                    <span className="text-[10px] bg-cyan-900/50 text-cyan-200 px-2 rounded border border-cyan-800">LVL {level}</span>
                </div>
            </div>
            <button 
                onClick={onClose}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-slate-300 hover:text-white transition-colors"
                aria-label="Sluiten"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

        {/* Game Container */}
        <div 
            className="relative w-full aspect-square bg-[#0f172a]/50 rounded-full border border-slate-800 overflow-hidden mb-4 shrink-0 touch-none select-none"
            onPointerDown={handleAction}
        >
            <canvas ref={canvasRef} className="w-full h-full block" />
            
            {/* Center Core Stats */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                    <div className="text-3xl font-bold text-white font-mono tracking-tighter">{score}</div>
                    <div className="text-[9px] text-slate-500 tracking-widest uppercase">LINKS</div>
                </div>
            </div>

            {/* Game Over Overlay */}
            {gameOver && (
                <div className="absolute inset-0 z-20 bg-black/80 flex flex-col items-center justify-center text-center p-4 backdrop-blur-sm animate-in fade-in">
                    <h3 className="text-red-500 font-bold text-2xl mb-1 font-mono tracking-wider">SYSTEM FAILURE</h3>
                    <p className="text-slate-400 text-xs mb-4">Neural Stability Critical</p>
                    
                    <div className="bg-white/5 rounded p-3 mb-6 w-full max-w-[200px]">
                        <div className="flex justify-between text-xs text-slate-300 mb-1">
                            <span>SCORE</span>
                            <span className="text-white font-bold">{score}</span>
                        </div>
                        <div className="flex justify-between text-xs text-slate-300 mb-1">
                            <span>LEVEL</span>
                            <span className="text-cyan-400 font-bold">{level}</span>
                        </div>
                        <div className="flex justify-between text-xs text-slate-300">
                            <span>BEST</span>
                            <span className="text-cyan-400 font-bold">{highScore || score}</span>
                        </div>
                    </div>

                    <button 
                        onPointerDown={restartGame}
                        className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm rounded-full shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all active:scale-95 tracking-widest pointer-events-auto"
                    >
                        REBOOT
                    </button>
                </div>
            )}
        </div>

        {/* Stability Bar */}
        <div className="mb-2 shrink-0">
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mb-1">
                <span>SYSTEM STABILITY</span>
                <span className={stability < 30 ? 'text-red-500 animate-pulse' : 'text-cyan-400'}>{Math.round(stability)}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div 
                    className={`h-full transition-all duration-300 ${stability < 30 ? 'bg-red-500 shadow-[0_0_10px_#ef4444]' : 'bg-cyan-500 shadow-[0_0_10px_#06b6d4]'}`}
                    style={{ width: `${Math.max(0, stability)}%` }}
                ></div>
            </div>
        </div>
        
        {/* Large Touch Button for Mobile */}
        <div className="flex-1 flex items-end justify-center pb-2 sm:hidden">
            <button 
                onPointerDown={handleAction}
                className="w-full py-6 bg-cyan-900/30 border border-cyan-500/30 rounded-xl text-cyan-400 font-mono text-xl tracking-widest uppercase active:bg-cyan-500/20 transition-all active:scale-[0.98] shadow-lg"
            >
                TAP TO LINK
            </button>
        </div>

        {/* Desktop Instructions */}
        <div className="text-center text-[10px] text-slate-500 font-mono hidden sm:block mt-auto">
            PRESS [SPACE] TO LINK
        </div>

      </div>
    </div>
  );
};

export default GameNeuroLinker;