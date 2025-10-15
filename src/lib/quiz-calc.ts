// 仅客户端使用的纯计算逻辑（不依赖任何服务端模块）
import { MBTIType, QuizQuestion, SliderValue } from "@/types/quiz";

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

    // 将滑动值（0-5）转换为分数
    const rawScore = sliderValue * 2 - 5; // -5 到 +5

    // 应用权重
    const weightedScore = rawScore * question.weight;

    const category = question.category as keyof typeof scores;

    // 如果 A 是 E/S/T/J，则分数需要取反
    const isAFirst = ["E", "S", "T", "J"].includes(
      question.option_a_value
    );

    if (isAFirst) {
      scores[category] += -weightedScore;
    } else {
      scores[category] += weightedScore;
    }
  });

  const mbtiType = (
    (scores.EI > 0 ? "E" : "I") +
    (scores.SN > 0 ? "S" : "N") +
    (scores.TF > 0 ? "T" : "F") +
    (scores.JP > 0 ? "J" : "P")
  ) as MBTIType;

  return { mbtiType, scores };
}


