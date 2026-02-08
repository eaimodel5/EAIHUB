// CLIENT-SIDE ANALYTICS & CLASSROOM SIMULATION
// Simulates a live classroom state. Slot 0 is reserved for the local user.

import { CURRICULUM_PATHS } from '../data/curriculum';
import { fetchProfile } from './profileService';
import { getOrCreateUserId } from './identity';
import { fetchMastery } from './masteryService';

export type StudentEvent = {
    timestamp: number;
    type: 'ANSWER' | 'HINT' | 'NAVIGATION' | 'ERROR';
    desc: string;
};

export type StudentSession = {
  id: string;
  isRealUser: boolean; // Flag to distinguish local user
  name: string;
  avatar: string;
  status: 'ONLINE' | 'IDLE' | 'OFFLINE' | 'WAITING';
  currentModule: string; 
  progress: number; 
  currentNodeId: string;
  // Hard Metrics
  stats: {
      exercisesDone: number;
      correctCount: number;
      accuracy: number; 
      streak: number;
      lastActiveSecondsAgo: number;
  };
  // Soft Metrics (SSOT)
  lastAnalysis: {
      phase: string; 
      kLevel: string; 
      agency: string; 
      sentiment: 'FLOW' | 'STRUGGLE' | 'BORED' | 'NEUTRAL';
      summary: string;
  };
  recentEvents: StudentEvent[];
  alerts: string[];
};

export type AnalyticsSnapshot = {
  totalModules: number;
  activeStudents: number;
  avgMastery: number;
  interventionNeeded: number;
  breachRate: number;
  students: StudentSession[];
};

// 3 Rich Mocks
const MOCK_PEERS: StudentSession[] = [
    { 
        id: 'mock-1', isRealUser: false, name: "Emma de Vries", avatar: "EV", status: 'ONLINE',
        currentModule: "Biologie", progress: 65, currentNodeId: "BIO_VWO_GEN_03",
        stats: { exercisesDone: 24, correctCount: 21, accuracy: 87, streak: 5, lastActiveSecondsAgo: 12 },
        lastAnalysis: { phase: "P4", kLevel: "K2", agency: "TD2", sentiment: "FLOW", summary: "Loopt soepel door translatie-opdrachten heen." },
        recentEvents: [
            { timestamp: Date.now() - 15000, type: 'ANSWER', desc: 'Correct antwoord op translatie' },
            { timestamp: Date.now() - 65000, type: 'NAVIGATION', desc: 'Start node BIO_03' }
        ],
        alerts: [] 
    },
    { 
        id: 'mock-2', isRealUser: false, name: "Liam Bakker", avatar: "LB", status: 'ONLINE',
        currentModule: "Wiskunde B", progress: 15, currentNodeId: "WISB_VWO_DIFF_01",
        stats: { exercisesDone: 8, correctCount: 3, accuracy: 37, streak: 0, lastActiveSecondsAgo: 140 },
        lastAnalysis: { phase: "P3", kLevel: "K1", agency: "TD5", sentiment: "STRUGGLE", summary: "Vraagt constant om uitleg, voert weinig zelf uit." },
        recentEvents: [
            { timestamp: Date.now() - 120000, type: 'HINT', desc: 'Vroeg om de definitie' },
            { timestamp: Date.now() - 240000, type: 'ERROR', desc: 'Fout antwoord limiet' }
        ],
        alerts: ["Low Agency Loop", "High Cognitive Load"] 
    },
    { 
        id: 'mock-3', isRealUser: false, name: "Sophie Jansen", avatar: "SJ", status: 'IDLE',
        currentModule: "Economie", progress: 88, currentNodeId: "ECO_HAVO_MARKT_04",
        stats: { exercisesDone: 42, correctCount: 40, accuracy: 95, streak: 12, lastActiveSecondsAgo: 450 },
        lastAnalysis: { phase: "P5", kLevel: "K3", agency: "TD1", sentiment: "NEUTRAL", summary: "Reflecteert op elasticiteit. Zeer zelfstandig." },
        recentEvents: [
            { timestamp: Date.now() - 400000, type: 'ANSWER', desc: 'Zelfreflectie ingediend' }
        ],
        alerts: [] 
    },
];

export const fetchAnalytics = async (): Promise<AnalyticsSnapshot> => {
  const userId = getOrCreateUserId();
  const { profile } = await fetchProfile(userId);
  
  // 1. Determine Slot 0 (Real User or Placeholder)
  let realUserSession: StudentSession;

  if (profile && profile.name) {
      // User has started
      const path = CURRICULUM_PATHS.find(p => p.subject === profile.subject);
      let progress = 0;
      let nodeId = 'START';
      let exercisesDone = 0;
      let correctCount = 0;
      let history: any[] = [];
      
      if (path) {
          const pathId = `${path.subject}_${path.level}`.toUpperCase().replace(/\s/g, '');
          const mastery = await fetchMastery(userId, pathId);
          if (mastery.item) {
              const total = path.nodes.length;
              history = mastery.item.history || [];
              progress = Math.round((history.length / total) * 100);
              nodeId = mastery.item.currentNodeId || 'DONE';
              exercisesDone = history.length * 2; 
              correctCount = Math.floor(exercisesDone * 0.9);
          }
      }

      realUserSession = {
          id: userId,
          isRealUser: true,
          name: `${profile.name} (LIVE)`,
          avatar: "YOU",
          status: 'ONLINE',
          currentModule: profile.subject || 'Onbekend',
          progress: progress,
          currentNodeId: nodeId,
          stats: {
              exercisesDone,
              correctCount,
              accuracy: exercisesDone > 0 ? Math.round((correctCount / exercisesDone) * 100) : 100,
              streak: 3, // Mock streak for demo
              lastActiveSecondsAgo: 2
          },
          lastAnalysis: {
              phase: "P3", 
              kLevel: "K2", 
              agency: "TD3", 
              sentiment: "FLOW",
              summary: "Actieve sessie. Systeem monitort input."
          },
          recentEvents: [
              { timestamp: Date.now() - 5000, type: 'NAVIGATION', desc: 'Dashboard geopend' },
              ...history.slice(-2).map(h => ({ timestamp: h.createdAt, type: 'ANSWER' as const, desc: `Evidence: ${h.nodeId}` }))
          ],
          alerts: []
      };
  } else {
      // User has not started
      realUserSession = {
          id: 'placeholder',
          isRealUser: true,
          name: "Wachten op student...",
          avatar: "?",
          status: 'WAITING',
          currentModule: "-",
          progress: 0,
          currentNodeId: "-",
          stats: { exercisesDone: 0, correctCount: 0, accuracy: 0, streak: 0, lastActiveSecondsAgo: 0 },
          lastAnalysis: { phase: "-", kLevel: "-", agency: "-", sentiment: "NEUTRAL", summary: "-" },
          recentEvents: [],
          alerts: []
      };
  }

  // 2. Combine
  const students = [realUserSession, ...MOCK_PEERS];

  // 3. Stats
  const activeStudents = students.filter(s => s.status === 'ONLINE').length;
  const avgMastery = Math.round(students.reduce((acc, s) => acc + s.progress, 0) / students.length);
  const interventionNeeded = students.filter(s => s.lastAnalysis.sentiment === 'STRUGGLE' || s.alerts.length > 0).length;
  const breachRate = 0.02; // Mocked

  return {
      totalModules: CURRICULUM_PATHS.length,
      activeStudents,
      avgMastery,
      interventionNeeded,
      breachRate,
      students
  };
};

export const pushIntervention = async (studentId: string, type: string, payload: any) => {
    console.log(`[Teacher] Pushing intervention to ${studentId}: ${type}`, payload);
    return { success: true, timestamp: Date.now() };
};