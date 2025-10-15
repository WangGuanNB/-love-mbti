"use client";

import { useState } from "react";
import { QuizQuestion, SliderValue } from "@/types/quiz";
import { Card, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react";

interface SliderQuestionProps {
  question: QuizQuestion;
  value?: SliderValue;
  onChange: (value: SliderValue) => void;
}

export default function SliderQuestion({ 
  question, 
  value, 
  onChange 
}: SliderQuestionProps) {
  const [hoveredValue, setHoveredValue] = useState<SliderValue | null>(null);
  
  const sliderOptions: SliderValue[] = [0, 1, 2, 3, 4, 5];
  
  // 仅高亮“被选中/悬停”的那一个，其余保持未选中样式
  const getHeartColor = (optionValue: SliderValue, currentValue?: SliderValue) => {
    const isHovering = hoveredValue !== null && optionValue === hoveredValue;
    const isSelected = hoveredValue === null && currentValue !== undefined && optionValue === currentValue;

    if (isHovering || isSelected) {
      return optionValue <= 2
        ? "text-pink-500 fill-pink-500"
        : "text-cyan-500 fill-cyan-500";
    }

    // 未选中：仅描边颜色，避免联动填充
    return optionValue <= 2 ? "text-pink-200 fill-transparent" : "text-cyan-200 fill-transparent";
  };
  
  const getHeartSize = (optionValue: SliderValue) => {
    // 保持原有心形尺寸不变
    if (optionValue === 0 || optionValue === 5) return "h-12 w-12";
    if (optionValue === 1 || optionValue === 4) return "h-10 w-10";
    return "h-8 w-8";
  };

  return (
    <Card className="mb-6">
      <CardContent className="py-5 px-6 md:px-8">
        {/* 题目 */}
        <h2 className="mb-3 text-center text-xl font-bold lg:text-2xl">
          {question.question_text}
        </h2>

        {/* 滑动量表 */}
        <div className="mb-3">
          <div className="flex items-center justify-center gap-2 md:gap-3">
            {sliderOptions.map((optionValue) => (
              <button
                key={optionValue}
                type="button"
                onClick={() => onChange(optionValue)}
                onMouseEnter={() => setHoveredValue(optionValue)}
                onMouseLeave={() => setHoveredValue(null)}
                className="transition-all duration-200 hover:scale-110"
                aria-label={`选择 ${optionValue}`}
              >
                <Heart 
                  className={`${getHeartSize(optionValue)} ${getHeartColor(optionValue, value)} transition-all`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* 标签 */}
        <div className="flex items-center justify-between text-sm text-muted-foreground lg:text-base">
          <div className="flex items-center gap-2">
            <span className="font-medium text-pink-600">A</span>
            <span>{question.option_a_label}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span>{question.option_b_label}</span>
            <span className="font-medium text-cyan-600">B</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


