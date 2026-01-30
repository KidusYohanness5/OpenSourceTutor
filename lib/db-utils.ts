// Database Utility Functions for OpenSourceTutor
import sql from '@/lib/db';
import type {
  User,
  PracticeSession,
  UserProgress,
  ExerciseHistory,
  Achievement,
  UserAchievement,
  PracticeStreak,
  SkillArea,
  SessionType,
} from '@/types/database';

// ============================================
// USER OPERATIONS
// ============================================

export async function createUser(firebaseUid: string, email: string, displayName?: string) {
  const [user] = await sql<User[]>`
    INSERT INTO users (firebase_uid, email, display_name)
    VALUES (${firebaseUid}, ${email}, ${displayName || null})
    RETURNING *
  `;
  return user;
}

export async function getUserByFirebaseUid(firebaseUid: string) {
  const [user] = await sql<User[]>`
    SELECT * FROM users WHERE firebase_uid = ${firebaseUid}
  `;
  return user || null;
}

export async function getUserById(userId: string) {
  const [user] = await sql<User[]>`
    SELECT * FROM users WHERE id = ${userId}
  `;
  return user || null;
}

export async function updateUserLastLogin(userId: string) {
  await sql`
    UPDATE users 
    SET last_login = CURRENT_TIMESTAMP
    WHERE id = ${userId}
  `;
}

// ============================================
// PRACTICE SESSION OPERATIONS
// ============================================

export async function createPracticeSession(
  userId: string,
  sessionType: SessionType,
  exerciseTypeId?: string
) {
  const [session] = await sql<PracticeSession[]>`
    INSERT INTO practice_sessions (user_id, exercise_type_id, session_type, duration_seconds)
    VALUES (${userId}, ${exerciseTypeId || null}, ${sessionType}, 1)
    RETURNING *
  `;
  return session;
}

export async function updatePracticeSession(
  sessionId: string,
  data: {
    duration_seconds?: number;
    score?: number;
    accuracy_percentage?: number;
    notes_played?: any;
    mistakes_count?: number;
    ai_feedback?: string;
    ai_suggestions?: any;
    harmony_analysis?: any;
    completed?: boolean;
  }
) {
  const [session] = await sql<PracticeSession[]>`
    UPDATE practice_sessions SET
      duration_seconds = COALESCE(${data.duration_seconds ?? null}, duration_seconds),
      score = COALESCE(${data.score ?? null}, score),
      accuracy_percentage = COALESCE(${data.accuracy_percentage ?? null}, accuracy_percentage),
      notes_played = COALESCE(${data.notes_played ? sql.json(data.notes_played) : null}, notes_played),
      mistakes_count = COALESCE(${data.mistakes_count ?? null}, mistakes_count),
      ai_feedback = COALESCE(${data.ai_feedback ?? null}, ai_feedback),
      ai_suggestions = COALESCE(${data.ai_suggestions ? sql.json(data.ai_suggestions) : null}, ai_suggestions),
      harmony_analysis = COALESCE(${data.harmony_analysis ? sql.json(data.harmony_analysis) : null}, harmony_analysis),
      completed = COALESCE(${data.completed ?? null}, completed)
    WHERE id = ${sessionId}
    RETURNING *
  `;
  return session;
}

export async function getUserRecentSessions(userId: string, limit: number = 10) {
  const sessions = await sql<PracticeSession[]>`
    SELECT * FROM practice_sessions 
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
    LIMIT ${limit}
  `;
  return sessions;
}

export async function getUserSessionsByType(userId: string, sessionType: SessionType) {
  const sessions = await sql<PracticeSession[]>`
    SELECT * FROM practice_sessions 
    WHERE user_id = ${userId} AND session_type = ${sessionType}
    ORDER BY created_at DESC
  `;
  return sessions;
}

// ============================================
// USER PROGRESS OPERATIONS
// ============================================

export async function getUserProgress(userId: string, skillArea?: SkillArea) {
  if (skillArea) {
    const [progress] = await sql<UserProgress[]>`
      SELECT * FROM user_progress 
      WHERE user_id = ${userId} AND skill_area = ${skillArea}
    `;
    return progress || null;
  }
  
  const progress = await sql<UserProgress[]>`
    SELECT * FROM user_progress 
    WHERE user_id = ${userId}
    ORDER BY skill_area
  `;
  return progress;
}

export async function initializeUserProgress(userId: string, skillArea: SkillArea) {
  const [progress] = await sql<UserProgress[]>`
    INSERT INTO user_progress (user_id, skill_area, level, xp)
    VALUES (${userId}, ${skillArea}, 1, 0)
    ON CONFLICT (user_id, skill_area) DO NOTHING
    RETURNING *
  `;
  return progress;
}

export async function updateUserProgress(
  userId: string,
  skillArea: SkillArea,
  data: {
    xp_gained?: number;
    session_completed?: boolean;
    score?: number;
  }
) {
  // Get current progress
  const [current] = await sql<UserProgress[]>`
    SELECT * FROM user_progress 
    WHERE user_id = ${userId} AND skill_area = ${skillArea}
  `;

  if (!current) {
    return initializeUserProgress(userId, skillArea);
  }

  // Calculate new values
  const newXp = current.xp + (data.xp_gained || 0);
  const newLevel = Math.floor(newXp / 100) + 1;
  const newTotalSessions = current.total_sessions + (data.session_completed ? 1 : 0);
  
  // Update average and best scores - ensure they're never undefined
  let newAvgScore: number | null = current.average_score ?? null;
  let newBestScore: number | null = current.best_score ?? null;
  
  if (data.score !== undefined) {
    newAvgScore = current.average_score 
      ? (current.average_score * current.total_sessions + data.score) / newTotalSessions
      : data.score;
    newBestScore = Math.max(current.best_score || 0, data.score);
  }

  const [updated] = await sql<UserProgress[]>`
    UPDATE user_progress SET
      xp = ${newXp},
      level = ${newLevel},
      total_sessions = ${newTotalSessions},
      average_score = ${newAvgScore ?? null},
      best_score = ${newBestScore ?? null},
      mastery_percentage = LEAST(100, (${newLevel} * 10)),
      updated_at = CURRENT_TIMESTAMP
    WHERE user_id = ${userId} AND skill_area = ${skillArea}
    RETURNING *
  `;
  
  return updated;
}

// ============================================
// EXERCISE HISTORY OPERATIONS
// ============================================

export async function createExerciseHistory(
  practiceSessionId: string,
  userId: string,
  exerciseData: any,
  exerciseTypeId?: string
) {
  const [history] = await sql<ExerciseHistory[]>`
    INSERT INTO exercise_history (
      practice_session_id, 
      user_id, 
      exercise_type_id, 
      exercise_data
    )
    VALUES (
      ${practiceSessionId}, 
      ${userId}, 
      ${exerciseTypeId || null}, 
      ${sql.json(exerciseData)}
    )
    RETURNING *
  `;
  return history;
}

export async function updateExerciseHistory(
  historyId: string,
  data: {
    user_response?: any;
    correct?: boolean;
    time_taken_seconds?: number;
    feedback?: string;
    errors?: any[];
  }
) {
  const [history] = await sql<ExerciseHistory[]>`
    UPDATE exercise_history SET
      user_response = COALESCE(${data.user_response ? sql.json(data.user_response) : null}, user_response),
      correct = COALESCE(${data.correct !== undefined ? data.correct : null}, correct),
      time_taken_seconds = COALESCE(${data.time_taken_seconds || null}, time_taken_seconds),
      feedback = COALESCE(${data.feedback || null}, feedback),
      errors = COALESCE(${data.errors ? sql.json(data.errors) : null}, errors)
    WHERE id = ${historyId}
    RETURNING *
  `;
  return history;
}

// ============================================
// ACHIEVEMENTS OPERATIONS
// ============================================

export async function getAllAchievements() {
  const achievements = await sql<Achievement[]>`
    SELECT * FROM achievements ORDER BY category, xp_reward
  `;
  return achievements;
}

export async function getUserAchievements(userId: string) {
  const achievements = await sql<(Achievement & { unlocked_at: string })[]>`
    SELECT a.*, ua.unlocked_at
    FROM achievements a
    INNER JOIN user_achievements ua ON a.id = ua.achievement_id
    WHERE ua.user_id = ${userId}
    ORDER BY ua.unlocked_at DESC
  `;
  return achievements;
}

export async function unlockAchievement(userId: string, achievementId: string) {
  const [userAchievement] = await sql<UserAchievement[]>`
    INSERT INTO user_achievements (user_id, achievement_id)
    VALUES (${userId}, ${achievementId})
    ON CONFLICT (user_id, achievement_id) DO NOTHING
    RETURNING *
  `;
  return userAchievement;
}

export async function checkAndUnlockAchievements(userId: string) {
  // Get user's total sessions
  const [stats] = await sql<[{ total_sessions: number }]>`
    SELECT COUNT(*) as total_sessions
    FROM practice_sessions
    WHERE user_id = ${userId} AND completed = true
  `;

  const achievements = await getAllAchievements();
  const unlocked: Achievement[] = [];

  for (const achievement of achievements) {
    const req = achievement.requirement;
    let shouldUnlock = false;

    if (req.type === 'sessions' && stats.total_sessions >= req.count) {
      shouldUnlock = true;
    }
    // Add more achievement logic here

    if (shouldUnlock) {
      const result = await unlockAchievement(userId, achievement.id);
      if (result) unlocked.push(achievement);
    }
  }

  return unlocked;
}

// ============================================
// STREAK OPERATIONS
// ============================================

export async function getUserStreak(userId: string) {
  const [streak] = await sql<PracticeStreak[]>`
    SELECT * FROM practice_streaks WHERE user_id = ${userId}
  `;
  return streak || null;
}

export async function updatePracticeStreak(userId: string) {
  const today = new Date().toISOString().split('T')[0];
  
  const [streak] = await sql<PracticeStreak[]>`
    INSERT INTO practice_streaks (user_id, current_streak, longest_streak, last_practice_date)
    VALUES (${userId}, 1, 1, ${today})
    ON CONFLICT (user_id) DO UPDATE SET
      current_streak = CASE 
        WHEN practice_streaks.last_practice_date = DATE(${today}) - INTERVAL '1 day' 
        THEN practice_streaks.current_streak + 1
        WHEN practice_streaks.last_practice_date = DATE(${today})
        THEN practice_streaks.current_streak
        ELSE 1
      END,
      longest_streak = GREATEST(
        practice_streaks.longest_streak,
        CASE 
          WHEN practice_streaks.last_practice_date = DATE(${today}) - INTERVAL '1 day'
          THEN practice_streaks.current_streak + 1
          ELSE 1
        END
      ),
      last_practice_date = ${today}
    RETURNING *
  `;
  
  return streak;
}

// ============================================
// DASHBOARD DATA
// ============================================

export async function getDashboardData(userId: string) {
  const user = await getUserById(userId);
  const recentSessions = await getUserRecentSessions(userId, 5);
  const progressBySkill = await getUserProgress(userId);
  const achievements = await getUserAchievements(userId);
  const streak = await getUserStreak(userId);

  const [stats] = await sql<[{
    total_practice_time: number;
    total_sessions: number;
    avg_score: number;
  }]>`
    SELECT 
      COALESCE(SUM(duration_seconds), 0) as total_practice_time,
      COUNT(*) as total_sessions,
      COALESCE(AVG(score), 0) as avg_score
    FROM practice_sessions
    WHERE user_id = ${userId} AND completed = true
  `;

  return {
    user,
    stats: {
      total_practice_time: stats.total_practice_time,
      total_sessions: stats.total_sessions,
      current_streak: streak?.current_streak || 0,
      achievements_count: achievements.length,
      overall_progress: Math.round(stats.avg_score || 0),
    },
    recent_sessions: recentSessions,
    progress_by_skill: progressBySkill,
    achievements,
  };
}