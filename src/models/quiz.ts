import { quizQuestions, quizResults, personalityTypes } from "@/db/schema";
import { db } from "@/db";
import { desc, eq, and } from "drizzle-orm";

// ==================== Quiz Questions ====================

// 获取指定语言的题目
export async function getQuizQuestions(
  locale: string
): Promise<(typeof quizQuestions.$inferSelect)[] | undefined> {
  const data = await db()
    .select()
    .from(quizQuestions)
    .where(and(
      eq(quizQuestions.locale, locale), 
      eq(quizQuestions.is_active, true)
    ))
    .orderBy(quizQuestions.question_number);

  return data;
}

// 获取题目（带语言回退：优先指定语言，否则日语）
export async function getQuizQuestionsWithFallback(
  locale: string
): Promise<(typeof quizQuestions.$inferSelect)[] | undefined> {
  let data = await getQuizQuestions(locale);
  
  // 如果没有找到且不是日语，则回退到日语
  if ((!data || data.length === 0) && locale !== 'ja') {
    data = await getQuizQuestions('ja');
  }
  
  return data;
}

// 插入题目（用于批量导入）
export async function insertQuizQuestion(
  data: typeof quizQuestions.$inferInsert
): Promise<typeof quizQuestions.$inferSelect | undefined> {
  const [question] = await db().insert(quizQuestions).values(data).returning();
  return question;
}

// 更新题目
export async function updateQuizQuestion(
  id: number,
  data: Partial<typeof quizQuestions.$inferInsert>
): Promise<typeof quizQuestions.$inferSelect | undefined> {
  const [question] = await db()
    .update(quizQuestions)
    .set({ ...data, updated_at: new Date() })
    .where(eq(quizQuestions.id, id))
    .returning();
  return question;
}

// ==================== Personality Types ====================

// 获取指定MBTI类型的指定语言描述
export async function getPersonalityType(
  mbtiType: string,
  locale: string
): Promise<typeof personalityTypes.$inferSelect | undefined> {
  const [type] = await db()
    .select()
    .from(personalityTypes)
    .where(
      and(
        eq(personalityTypes.mbti_type, mbtiType),
        eq(personalityTypes.locale, locale),
        eq(personalityTypes.is_active, true)
      )
    )
    .limit(1);

  return type;
}

// 获取性格类型（带语言回退）
export async function getPersonalityTypeWithFallback(
  mbtiType: string,
  locale: string
): Promise<typeof personalityTypes.$inferSelect | undefined> {
  let type = await getPersonalityType(mbtiType, locale);
  
  // 如果没有找到且不是日语，则回退到日语
  if (!type && locale !== 'ja') {
    type = await getPersonalityType(mbtiType, 'ja');
  }
  
  return type;
}

// 获取所有性格类型（指定语言）
export async function getAllPersonalityTypes(
  locale: string
): Promise<(typeof personalityTypes.$inferSelect)[] | undefined> {
  const data = await db()
    .select()
    .from(personalityTypes)
    .where(and(
      eq(personalityTypes.locale, locale), 
      eq(personalityTypes.is_active, true)
    ))
    .orderBy(personalityTypes.mbti_type);

  return data;
}

// 按 type_code 获取指定语言
export async function getPersonalityTypeByTypeCode(
  typeCode: string,
  locale: string
): Promise<typeof personalityTypes.$inferSelect | undefined> {
  const [type] = await db()
    .select()
    .from(personalityTypes)
    .where(
      and(
        eq(personalityTypes.type_code, typeCode),
        eq(personalityTypes.locale, locale),
        eq(personalityTypes.is_active, true)
      )
    )
    .limit(1);

  return type;
}

// 按 type_code 获取（带语言回退）
export async function getPersonalityTypeByTypeCodeWithFallback(
  typeCode: string,
  locale: string
): Promise<typeof personalityTypes.$inferSelect | undefined> {
  let type = await getPersonalityTypeByTypeCode(typeCode, locale);
  if (!type && locale !== 'ja') {
    type = await getPersonalityTypeByTypeCode(typeCode, 'ja');
  }
  return type;
}

// 插入性格类型（用于批量导入多语言数据）
export async function insertPersonalityType(
  data: typeof personalityTypes.$inferInsert
): Promise<typeof personalityTypes.$inferSelect | undefined> {
  const [type] = await db()
    .insert(personalityTypes)
    .values(data)
    .returning();
  return type;
}

// 更新性格类型
export async function updatePersonalityType(
  id: number,
  data: Partial<typeof personalityTypes.$inferInsert>
): Promise<typeof personalityTypes.$inferSelect | undefined> {
  const [type] = await db()
    .update(personalityTypes)
    .set({ ...data, updated_at: new Date() })
    .where(eq(personalityTypes.id, id))
    .returning();
  return type;
}

// ==================== Quiz Results ====================

// 插入测试结果
export async function insertQuizResult(
  data: typeof quizResults.$inferInsert
): Promise<typeof quizResults.$inferSelect | undefined> {
  const [result] = await db()
    .insert(quizResults)
    .values(data)
    .returning();
  return result;
}

// 根据UUID查找测试结果
export async function findQuizResultByUuid(
  uuid: string
): Promise<typeof quizResults.$inferSelect | undefined> {
  const [result] = await db()
    .select()
    .from(quizResults)
    .where(eq(quizResults.uuid, uuid))
    .limit(1);

  return result;
}

// 增加分享计数
export async function incrementShareCount(
  uuid: string
): Promise<typeof quizResults.$inferSelect | undefined> {
  const result = await findQuizResultByUuid(uuid);
  if (!result) return undefined;

  const [updated] = await db()
    .update(quizResults)
    .set({ share_count: result.share_count + 1 })
    .where(eq(quizResults.uuid, uuid))
    .returning();

  return updated;
}

// 增加浏览计数
export async function incrementViewCount(
  uuid: string
): Promise<typeof quizResults.$inferSelect | undefined> {
  const result = await findQuizResultByUuid(uuid);
  if (!result) return undefined;

  const [updated] = await db()
    .update(quizResults)
    .set({ view_count: result.view_count + 1 })
    .where(eq(quizResults.uuid, uuid))
    .returning();

  return updated;
}

// 获取测试结果总数
export async function getQuizResultsTotal(): Promise<number> {
  const total = await db().$count(quizResults);
  return total;
}


