"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Share2, RefreshCw, Heart, TrendingUp, TrendingDown } from "lucide-react";
import Link from "next/link";
import { MBTI_TO_CODE } from "@/lib/type-mapping";
import { PersonalityType, MBTIType } from "@/types/quiz";
import { toast } from "sonner";
import { useState } from "react";
import ShowcaseImage from "./showcase-image";

interface TypeDetailClientProps {
  personalityType: PersonalityType;
  locale: string;
  uuid?: string; // 可选：用户的测试UUID
  scores?: {
    EI: number;
    SN: number;
    TF: number;
    JP: number;
  };
  i18n?: {
    badgeLabel: string;
    basicTitle: string;
    loveTitle: string;
    strengthsTitle: string;
    weaknessesTitle: string;
    suitableTitle: string;
    bestMatch: string;
    goodMatch: string;
    challenging: string;
    adviceTitle: string;
    keywords: string;
    share: string;
    shareDisabled: string;
    startQuiz: string;
    retakeQuiz: string;
  };
}

export default function TypeDetailClient({
  personalityType,
  locale,
  uuid,
  scores,
  i18n,
}: TypeDetailClientProps) {
  const [copied, setCopied] = useState(false);
  const SHARE_ENABLED = false;

  const handleShare = async () => {
    const shareUrl = uuid
      ? `${window.location.origin}/${locale}/types/${personalityType.type_code || personalityType.mbti_type}?uuid=${uuid}`
      : `${window.location.origin}/${locale}/types/${personalityType.type_code || personalityType.mbti_type}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${personalityType.mbti_type} - ${personalityType.title}`,
          text: `${personalityType.subtitle || ''} - 快来测试你的恋爱性格类型！`,
          url: shareUrl,
        });
        if (uuid) {
          await fetch('/api/quiz/share', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ uuid }),
          });
        }
        return;
      } catch (_) {
        // 用户取消或不支持
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('链接已复制到剪贴板！');
      setTimeout(() => setCopied(false), 2000);
    } catch (_) {
      toast.error('复制失败，请手动复制链接');
    }
  };

  return (
    <div className="container py-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-start grid-cols-1 gap-8 md:grid-cols-[320px_1fr]">
          {/* 左列：标题 + 图片 */}
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-pink-100 px-4 py-2 dark:bg-pink-900/30">
              <Heart className="h-5 w-5 text-pink-500" />
              <span className="text-sm font-medium text-pink-700 dark:text-pink-300">
                {i18n?.badgeLabel || (uuid ? '你的恋爱性格类型' : '恋爱性格类型')}
              </span>
            </div>
            <div className="mb-4 flex flex-wrap items-baseline gap-3">
              <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
                {personalityType.mbti_type}
              </h1>
              <h2 className="text-2xl font-semibold text-primary lg:text-3xl">
                {personalityType.title}
              </h2>
            </div>

            <div className="overflow-hidden rounded-xl border bg-card/40 shadow-sm">
              <div className="relative h-64 w-full md:h-[420px]">
                <ShowcaseImage
                  code={(personalityType.type_code || personalityType.mbti_type).toUpperCase()}
                  title={`${personalityType.mbti_type} - ${personalityType.title}`}
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
          </div>

          {/* 右列：正文内容 */}
          <div className="flex flex-col justify-center md:min-h-[420px]">
            <h3 className="mb-3 text-2xl font-bold">{i18n?.basicTitle || '基本性格'}</h3>
            <p className="mb-0 whitespace-pre-line text-base font-medium leading-relaxed lg:text-lg">
              {personalityType.basic_personality}
            </p>
          </div>
        </div>

        {/* 下方内容，全宽排列 */}
        <div className="mt-10">

        {/* 个人分数展示（如果有） */}
        {scores && (
          <Card className="mb-8 bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20">
          <CardHeader>
            <CardTitle>{i18n?.basicTitle || '基本性格'}</CardTitle>
          </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {scores.EI > 0 ? 'E' : 'I'}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {scores.EI > 0 ? '外向' : '内向'}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {Math.abs(scores.EI)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {scores.SN > 0 ? 'S' : 'N'}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {scores.SN > 0 ? '感觉' : '直觉'}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {Math.abs(scores.SN)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {scores.TF > 0 ? 'T' : 'F'}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {scores.TF > 0 ? '思考' : '情感'}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {Math.abs(scores.TF)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {scores.JP > 0 ? 'J' : 'P'}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {scores.JP > 0 ? '判断' : '知觉'}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {Math.abs(scores.JP)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 顶部已展示基本性格，这里不再重复 */}

        {/* 2. 恋爱性质 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{i18n?.loveTitle || '恋爱性质'}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-line text-base font-medium leading-relaxed lg:text-lg">
              {personalityType.love_characteristics}
            </p>
          </CardContent>
        </Card>

        {/* 3. 优势与注意点 */}
        {(personalityType.strengths || personalityType.weaknesses) && (
          <div className="mb-8 grid gap-4 md:grid-cols-2">
            {personalityType.strengths && personalityType.strengths.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    {i18n?.strengthsTitle || '优势特质'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {personalityType.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-500">✓</span>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {personalityType.weaknesses && personalityType.weaknesses.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingDown className="h-5 w-5 text-orange-500" />
                    {i18n?.weaknessesTitle || '需要注意'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {personalityType.weaknesses.map((weakness, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-orange-500">!</span>
                        <span>{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* 4. 适合什么样的恋爱，什么样的对象？ */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{i18n?.suitableTitle || '适合什么样的恋爱，什么样的对象？'}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-line text-base font-medium leading-relaxed lg:text-lg">
              {personalityType.suitable_partner}
            </p>

            {/* 相性匹配标签 */}
            {personalityType.compatibility_best && personalityType.compatibility_best.length > 0 && (
              <div className="mt-6">
                <h4 className="mb-3 font-semibold text-pink-600 dark:text-pink-400">
                  💕 {i18n?.bestMatch || '最佳匹配'}
                </h4>
                <div className="flex flex-wrap gap-2">
                    {personalityType.compatibility_best.map((type) => (
                    <Link key={type} href={`/${locale}/types/${MBTI_TO_CODE[type] || type}`}>
                      <Badge
                        variant="default"
                        className="cursor-pointer px-3 py-1 transition-all hover:scale-105"
                      >
                        {type}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {personalityType.compatibility_good && personalityType.compatibility_good.length > 0 && (
              <div className="mt-4">
                <h4 className="mb-3 font-semibold text-blue-600 dark:text-blue-400">
                  💙 {i18n?.goodMatch || '不错的匹配'}
                </h4>
                <div className="flex flex-wrap gap-2">
                    {personalityType.compatibility_good.map((type) => (
                    <Link key={type} href={`/${locale}/types/${MBTI_TO_CODE[type] || type}`}>
                      <Badge
                        variant="secondary"
                        className="cursor-pointer px-3 py-1 transition-all hover:scale-105"
                      >
                        {type}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {personalityType.compatibility_challenging && personalityType.compatibility_challenging.length > 0 && (
              <div className="mt-4">
                <h4 className="mb-3 font-semibold text-gray-600 dark:text-gray-400">
                  🤔 {i18n?.challenging || '需要磨合'}
                </h4>
                <div className="flex flex-wrap gap-2">
                    {personalityType.compatibility_challenging.map((type) => (
                    <Link key={type} href={`/${locale}/types/${MBTI_TO_CODE[type] || type}`}>
                      <Badge
                        variant="outline"
                        className="cursor-pointer px-3 py-1 transition-all hover:scale-105"
                      >
                        {type}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 5. 匹配建议 */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>{i18n?.adviceTitle || '匹配建议'}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-line text-base font-medium leading-relaxed lg:text-lg">
              {personalityType.matching_advice}
            </p>
          </CardContent>
        </Card>

        {/* 关键词标签 */}
        {personalityType.keywords && personalityType.keywords.length > 0 && (
          <div className="mb-12 text-center">
            <h3 className="mb-4 text-lg font-semibold">{i18n?.keywords || '关键词'}</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {personalityType.keywords.map((keyword, index) => (
                <Badge key={index} variant="outline" className="px-4 py-2 text-sm">
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* 操作按钮 */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          {SHARE_ENABLED ? (
            <Button size="lg" onClick={handleShare}>
              {copied ? (
                <>
                  <Heart className="mr-2 h-5 w-5" />
                  已复制链接
                </>
              ) : (
                <>
                  <Share2 className="mr-2 h-5 w-5" />
                  {i18n?.share || '分享结果'}
                </>
              )}
            </Button>
          ) : (
            <Button size="lg" variant="secondary" disabled title="功能开发中，敬请期待">
              <Share2 className="mr-2 h-5 w-5" />
              {i18n?.shareDisabled || '分享结果（即将上线）'}
            </Button>
          )}

          {!uuid && (
            <Button variant="outline" size="lg" asChild>
              <Link href="/quiz">
                <Heart className="mr-2 h-5 w-5" />
                {i18n?.startQuiz || '开始测试'}
              </Link>
            </Button>
          )}

          {uuid && (
            <Button variant="outline" size="lg" asChild>
              <Link href="/quiz">
                <RefreshCw className="mr-2 h-5 w-5" />
                {i18n?.retakeQuiz || '重新测试'}
              </Link>
            </Button>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}

