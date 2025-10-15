"use client";

import { useState, useEffect } from 'react';
import { useRouter } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { toast } from 'sonner';
import SliderQuestion from './slider-question';
import { QuizQuestion, SliderValue } from '@/types/quiz';
import { calculateMBTI } from '@/lib/quiz-calc';

interface QuizClientProps {
  questions: QuizQuestion[];
  locale: string;
}

export default function QuizClient({ questions, locale }: QuizClientProps) {
  const router = useRouter();
  // 直接进入做题页：默认已开始
  const [started, setStarted] = useState(true);
  // 分页作答：每页 6 题
  const QUESTIONS_PER_PAGE = 6;
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState<SliderValue[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalQuestions = questions.length;
  const answeredCount = answers.filter((v) => v !== undefined).length;
  const progress = (answeredCount / totalQuestions) * 100;

  const pageStart = currentPage * QUESTIONS_PER_PAGE;
  const pageEnd = Math.min(pageStart + QUESTIONS_PER_PAGE, totalQuestions);
  const currentPageQuestions = questions.slice(pageStart, pageEnd);
  const isLastPage = pageEnd >= totalQuestions;
  const canProceed = currentPageQuestions.every((_, idx) => answers[pageStart + idx] !== undefined);

  // 翻页后确保滚动到顶部（在渲染完成后触发更稳妥）
  useEffect(() => {
    try {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    } catch (_) {
      // noop
    }
  }, [currentPage]);

  // 处理答案选择
  const handleAnswerAtIndex = (globalIndex: number, value: SliderValue) => {
    const newAnswers = [...answers];
    newAnswers[globalIndex] = value;
    setAnswers(newAnswers);
  };

  // 下一页/提交
  const handleNextPage = () => {
    if (!canProceed) {
      toast.error('请先完成本页所有题目');
      return;
    }

    if (!isLastPage) {
      setCurrentPage((p) => p + 1);
      // 翻到下一页后滚动到顶部
      try {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (_) {}
      return;
    }

    handleSubmit();
  };

  // 上一页
  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage((p) => p - 1);
    }
  };

  // 提交测试
  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // 🔥 使用滑动量表计算逻辑
      const { mbtiType, scores } = calculateMBTI(answers, questions);
      
      // 保存结果到数据库
      const response = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mbtiType,
          scores,
          answers,
          locale,
        }),
      });

      if (!response.ok) throw new Error('Failed to submit');

      const { uuid } = await response.json();
      
      // 跳转到性格类型详情页（传递 uuid 用于分享）
      router.push(`/types/${mbtiType}?uuid=${uuid}`);
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('提交失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 开始页面
  if (!started) {
    return (
      <div className="container py-16">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-8 flex justify-center">
            <div className="rounded-full bg-pink-100 p-6 dark:bg-pink-900/30">
              <Heart className="h-16 w-16 text-pink-500" />
            </div>
          </div>
          
          <h1 className="mb-4 text-4xl font-bold lg:text-5xl">
            开始你的恋爱性格诊断
          </h1>
          
          <p className="mb-8 text-lg text-muted-foreground lg:text-xl">
            回答{totalQuestions}个问题，3分钟了解真实的自己
          </p>
          
          <Button 
            size="lg" 
            onClick={() => setStarted(true)}
            className="px-8 py-6 text-lg"
          >
            开始测试
          </Button>
          
          <p className="mt-6 text-sm text-muted-foreground">
            请根据第一直觉选择，没有对错之分
          </p>
        </div>
      </div>
    );
  }

  // 测试进行中

  return (
    <div className="container py-8">
      <div className="mx-auto max-w-3xl">
        {/* 进度条 */}
        <div className="mb-8">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium">
              已答 {answeredCount} / {totalQuestions}
            </span>
            <span className="text-muted-foreground">
              {Math.round(progress)}%
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* 当前页（最多6题） */}
        <div className="space-y-6">
          {currentPageQuestions.map((q, idx) => {
            const globalIndex = pageStart + idx;
            const currentValue = answers[globalIndex];
            return (
              <SliderQuestion
                key={globalIndex}
                question={q}
                value={currentValue}
                onChange={(v) => handleAnswerAtIndex(globalIndex, v)}
              />
            );
          })}
        </div>

        {/* 导航按钮 */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePreviousPage}
            disabled={currentPage === 0}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            上一页
          </Button>

          <Button
            onClick={handleNextPage}
            disabled={!canProceed || isSubmitting}
          >
            {isLastPage ? '查看结果' : '下一页'}
            {!isLastPage && <ChevronRight className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}


