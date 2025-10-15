import "server-only";
import { 
  getQuizQuestionsWithFallback, 
  getPersonalityTypeWithFallback,
  getAllPersonalityTypes,
  getPersonalityTypeByTypeCodeWithFallback,
} from "@/models/quiz";
import { QuizQuestion, PersonalityType, MBTIType, SliderValue } from "@/types/quiz";

// 获取测试题目（带语言回退）
export async function getQuizQuestions(locale: string): Promise<QuizQuestion[]> {
  const questions = await getQuizQuestionsWithFallback(locale);
  
  if (!questions || questions.length === 0) {
    console.warn(`No quiz questions found for locale: ${locale}`);
    return [];
  }

  // 转换为 QuizQuestion 类型
  return questions.map(q => ({
    ...q,
    category: q.category as 'EI' | 'SN' | 'TF' | 'JP',
    option_a_value: q.option_a_value as 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P',
    option_b_value: q.option_b_value as 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P',
  }));
}

// 获取性格类型描述（带语言回退）
export async function getPersonalityType(
  mbtiType: MBTIType, 
  locale: string
): Promise<PersonalityType | null> {
  const type = await getPersonalityTypeWithFallback(mbtiType, locale);
  
  if (!type) {
    console.warn(`No personality type found for: ${mbtiType}, locale: ${locale}`);
    return null;
  }

  // 解析 JSON 字段
  return {
    ...type,
    mbti_type: type.mbti_type as MBTIType,
    strengths: type.strengths ? JSON.parse(type.strengths) : undefined,
    weaknesses: type.weaknesses ? JSON.parse(type.weaknesses) : undefined,
    compatibility_best: type.compatibility_best ? JSON.parse(type.compatibility_best) : undefined,
    compatibility_good: type.compatibility_good ? JSON.parse(type.compatibility_good) : undefined,
    compatibility_challenging: type.compatibility_challenging ? JSON.parse(type.compatibility_challenging) : undefined,
    famous_people: type.famous_people ? JSON.parse(type.famous_people) : undefined,
    keywords: type.keywords ? JSON.parse(type.keywords) : undefined,
  };
}

// 获取所有性格类型（用于列表页）
export async function getAllPersonalityTypesForLocale(
  locale: string
): Promise<PersonalityType[]> {
  const types = await getAllPersonalityTypes(locale);
  
  if (!types || types.length === 0) {
    return [];
  }

  return types.map(t => ({
    ...t,
    mbti_type: t.mbti_type as MBTIType,
    strengths: t.strengths ? JSON.parse(t.strengths) : undefined,
    weaknesses: t.weaknesses ? JSON.parse(t.weaknesses) : undefined,
    compatibility_best: t.compatibility_best ? JSON.parse(t.compatibility_best) : undefined,
    compatibility_good: t.compatibility_good ? JSON.parse(t.compatibility_good) : undefined,
    compatibility_challenging: t.compatibility_challenging ? JSON.parse(t.compatibility_challenging) : undefined,
    famous_people: t.famous_people ? JSON.parse(t.famous_people) : undefined,
    keywords: t.keywords ? JSON.parse(t.keywords) : undefined,
  }));
}

// 通过 type_code 获取类型（带语言回退）
export async function getPersonalityTypeByCode(
  typeCode: string,
  locale: string
): Promise<PersonalityType | null> {
  const type = await getPersonalityTypeByTypeCodeWithFallback(typeCode, locale);
  if (!type) return null;
  return {
    ...type,
    mbti_type: type.mbti_type as MBTIType,
    strengths: type.strengths ? JSON.parse(type.strengths) : undefined,
    weaknesses: type.weaknesses ? JSON.parse(type.weaknesses) : undefined,
    compatibility_best: type.compatibility_best ? JSON.parse(type.compatibility_best) : undefined,
    compatibility_good: type.compatibility_good ? JSON.parse(type.compatibility_good) : undefined,
    compatibility_challenging: type.compatibility_challenging ? JSON.parse(type.compatibility_challenging) : undefined,
    famous_people: type.famous_people ? JSON.parse(type.famous_people) : undefined,
    keywords: type.keywords ? JSON.parse(type.keywords) : undefined,
  };
}

// 计算 MBTI 类型（滑动量表版本）
export function calculateMBTI(
  answers: SliderValue[], 
  questions: QuizQuestion[]
): {
  mbtiType: MBTIType;
  scores: { EI: number; SN: number; TF: number; JP: number };
} {
  const scores = { EI: 0, SN: 0, TF: 0, JP: 0 };
  
  answers.forEach((sliderValue, questionIndex) => {
    const question = questions[questionIndex];
    
    // 🔥 核心逻辑：将滑动值（0-5）转换为分数
    // sliderValue = 0: 100% A选项（-5分）
    // sliderValue = 1: 80% A选项（-3分）
    // sliderValue = 2: 60% A选项（-1分）
    // sliderValue = 3: 60% B选项（+1分）
    // sliderValue = 4: 80% B选项（+3分）
    // sliderValue = 5: 100% B选项（+5分）
    
    // 计算原始分数（-5 到 +5）
    const rawScore = (sliderValue * 2) - 5;
    
    // 应用权重
    const weightedScore = rawScore * question.weight;
    
    // 根据题目的 option_a_value 和 option_b_value 来分配分数
    const category = question.category as keyof typeof scores;
    
    // 如果 option_a 是前面的字母（如 E, S, T, J），则正分给A，负分给B
    // 如果 option_a 是后面的字母（如 I, N, F, P），则负分给A，正分给B
    const isAFirst = ['E', 'S', 'T', 'J'].includes(question.option_a_value);
    
    if (isAFirst) {
      // A是E/S/T/J，B是I/N/F/P
      // 滑动向A（0-2）应该给正分，向B（3-5）应该给负分
      scores[category] += -weightedScore; // 注意：需要反转
    } else {
      // A是I/N/F/P，B是E/S/T/J
      // 滑动向A（0-2）应该给负分，向B（3-5）应该给正分
      scores[category] += weightedScore;
    }
  });

  const mbtiType = (
    (scores.EI > 0 ? 'E' : 'I') +
    (scores.SN > 0 ? 'S' : 'N') +
    (scores.TF > 0 ? 'T' : 'F') +
    (scores.JP > 0 ? 'J' : 'P')
  ) as MBTIType;

  return { mbtiType, scores };
}


