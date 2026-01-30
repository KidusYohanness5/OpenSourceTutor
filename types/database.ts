// Database Types for OpenSourceTutor
// These match the PostgreSQL schema

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';

export type SessionType = 
  | 'jazz_harmony' 
  | 'sight_reading' 
  | 'blue_notes' 
  | 'chord_progressions' 
  | 'functional_harmony' 
  | 'free_practice';

export type SkillArea = 
  | 'blue_notes' 
  | 'functional_harmony' 
  | 'chord_progressions' 
  | 'sight_reading' 
  | 'improvisation' 
  | 'rhythm';

export type ExerciseCategory = 
  | 'jazz_harmony' 
  | 'sight_reading' 
  | 'blue_notes' 
  | 'chord_progressions' 
  | 'functional_harmony';

export type AchievementCategory = 'practice' | 'mastery' | 'streak' | 'special';

// ============================================
// DATABASE TABLE TYPES
// ============================================

export interface User {
  id: string;
  firebase_uid: string;
  email: string;
  display_name?: string;
  skill_level: SkillLevel;
  created_at: string;
  updated_at: string;
  last_login?: string;
}

export interface ExerciseType {
  id: string;
  name: string;
  category: ExerciseCategory;
  description?: string;
  difficulty_level?: SkillLevel;
  created_at: string;
}

export interface Note {
  note: string;      // e.g., "C4", "Eb3"
  time: number;      // timestamp in seconds
  velocity?: number; // MIDI velocity (0-127)
  duration?: number; // note duration in seconds
}

export interface HarmonyAnalysis {
  key?: string;
  scale?: string;
  chords?: string[];
  blue_notes?: string[];
  functional_analysis?: string;
  suggestions?: string[];
}

export interface PracticeSession {
  id: string;
  user_id: string;
  exercise_type_id?: string;
  session_type: SessionType;
  duration_seconds: number;
  score?: number;
  accuracy_percentage?: number;
  notes_played?: Note[];
  mistakes_count: number;
  ai_feedback?: string;
  ai_suggestions?: Record<string, any>;
  harmony_analysis?: HarmonyAnalysis;
  completed: boolean;
  created_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  skill_area: SkillArea;
  level: number;
  xp: number;
  xp_to_next_level: number;
  total_practice_time_seconds: number;
  total_sessions: number;
  average_score?: number;
  best_score?: number;
  mastery_percentage: number;
  updated_at: string;
}

export interface ExerciseError {
  type: string;        // e.g., "wrong_note", "timing_error"
  expected?: string;
  played?: string;
  severity?: 'minor' | 'major';
}

export interface ExerciseHistory {
  id: string;
  practice_session_id: string;
  user_id: string;
  exercise_type_id?: string;
  exercise_data: Record<string, any>;
  user_response?: Record<string, any>;
  correct?: boolean;
  time_taken_seconds?: number;
  attempts: number;
  feedback?: string;
  errors?: ExerciseError[];
  created_at: string;
}

export interface Achievement {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  category: AchievementCategory;
  requirement: Record<string, any>;
  xp_reward: number;
  created_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
}

export interface PracticeStreak {
  id: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_practice_date?: string;
}

// ============================================
// API REQUEST/RESPONSE TYPES
// ============================================

export interface CreatePracticeSessionRequest {
  exercise_type_id?: string;
  session_type: SessionType;
}

export interface UpdatePracticeSessionRequest {
  duration_seconds: number;
  notes_played?: Note[];
  completed?: boolean;
}

export interface AnalyzeHarmonyRequest {
  notes: Note[];
  context?: string;
  session_type: SessionType;
}

export interface AnalyzeHarmonyResponse {
  feedback: string;
  suggestions: string[];
  harmony_analysis: HarmonyAnalysis;
  score?: number;
  accuracy_percentage?: number;
}

// ============================================
// FRONTEND STATE TYPES
// ============================================

export interface UserStats {
  total_practice_time: number;
  total_sessions: number;
  current_streak: number;
  achievements_count: number;
  overall_progress: number;
}

export interface DashboardData {
  user: User;
  stats: UserStats;
  recent_sessions: PracticeSession[];
  progress_by_skill: UserProgress[];
  achievements: (Achievement & { unlocked?: boolean })[];
}

// ============================================
// UTILITY TYPES
// ============================================

export type DatabaseInsert<T> = Omit<T, 'id' | 'created_at' | 'updated_at'>;
export type DatabaseUpdate<T> = Partial<Omit<T, 'id' | 'created_at'>>;

// Example usage:
// type NewUser = DatabaseInsert<User>;
// type UserUpdate = DatabaseUpdate<User>;
