import { getQuizQuestions } from "@/services/quiz";
import QuizClient from "@/components/blocks/quiz/quiz-client";
import { getCanonicalUrl } from "@/lib/utils";
import Empty from "@/components/blocks/empty";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const canonicalUrl = getCanonicalUrl(locale, '/quiz');

  // 多语言标题
  const titles: Record<string, string> = {
    ja: '恋愛MBTI性格診断 - 3分であなたの恋愛タイプを発見',
    en: 'Love MBTI Test - Discover Your Romance Type in 3 Minutes',
    zh: '恋爱MBTI性格测试 - 3分钟了解你的恋爱类型',
    pt: 'Teste MBTI do Amor - Descubra Seu Tipo em 3 Minutos',
    ms: 'Ujian MBTI Cinta - Temui Jenis Anda dalam 3 Minit',
  };

  const descriptions: Record<string, string> = {
    ja: '無料の恋愛MBTI性格診断テストで、あなたの恋愛スタイルと相性の良いパートナーを発見しましょう。',
    en: 'Free MBTI personality test for love and relationships. Discover your romance style and compatible partners.',
    zh: '免费的恋爱MBTI性格测试，发现你的恋爱风格和最佳伴侣匹配。',
    pt: 'Teste gratuito de personalidade MBTI para amor e relacionamentos. Descubra seu estilo romântico.',
    ms: 'Ujian personaliti MBTI percuma untuk cinta dan perhubungan. Temui gaya romantik anda.',
  };

  return {
    title: titles[locale] || titles['ja'],
    description: descriptions[locale] || descriptions['ja'],
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function QuizPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // 🔥 服务端从数据库读取题目（SSR，SEO 友好）
  const questions = await getQuizQuestions(locale);

  // 如果没有题目，显示空状态
  if (!questions || questions.length === 0) {
    return (
      <Empty 
        message="测试题目暂未准备好，请稍后再试。" 
      />
    );
  }

  // 传递给客户端组件
  return <QuizClient questions={questions} locale={locale} />;
}


