"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Share2, RefreshCw, Heart } from "lucide-react";
import Link from "next/link";
import { PersonalityType, QuizResult } from "@/types/quiz";
import { toast } from "sonner";
import { useState } from "react";

interface QuizResultClientProps {
  result: QuizResult;
  typeData: PersonalityType;
  locale: string;
}

export default function QuizResultClient({ 
  result, 
  typeData, 
  locale 
}: QuizResultClientProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/${locale === 'ja' ? '' : locale + '/'}quiz/result/${result.uuid}`;
    
    // 尝试使用Web Share API
    if (navigator.share) {
      try {
        await navigator.share({
          title: `我的恋爱MBTI类型是 ${result.mbti_type}`,
          text: `${typeData.title} - 快来测试你的恋爱性格类型！`,
          url: shareUrl,
        });
        
        // 增加分享计数
        await fetch('/api/quiz/share', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uuid: result.uuid }),
        });
        
        return;
      } catch (error) {
        // 用户取消分享或不支持
      }
    }

    // 降级方案：复制链接
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('链接已复制到剪贴板！');
      
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('复制失败，请手动复制链接');
    }
  };

  return (
    <div className="container py-16">
      <div className="mx-auto max-w-4xl">
        {/* 结果标题 */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-pink-100 px-4 py-2 dark:bg-pink-900/30">
            <Heart className="h-5 w-5 text-pink-500" />
            <span className="text-sm font-medium text-pink-700 dark:text-pink-300">
              你的恋爱性格类型
            </span>
          </div>
          
          <h1 className="mb-4 text-5xl font-bold lg:text-6xl">
            {result.mbti_type}
          </h1>
          
          <h2 className="mb-2 text-3xl font-semibold text-primary">
            {typeData.title}
          </h2>
          
          {typeData.subtitle && (
            <p className="text-xl text-muted-foreground">
              {typeData.subtitle}
            </p>
          )}
        </div>

        {/* 1. 基本性格 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>基本性格</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base lg:text-lg leading-relaxed whitespace-pre-line font-medium">
              {typeData.basic_personality}
            </p>
          </CardContent>
        </Card>

        {/* 2. 恋爱特征 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>恋爱特征</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base lg:text-lg leading-relaxed whitespace-pre-line font-medium">
              {typeData.love_characteristics}
            </p>
          </CardContent>
        </Card>

        {/* 3. 适合对象 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>适合对象</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base lg:text-lg leading-relaxed whitespace-pre-line font-medium">
              {typeData.suitable_partner}
            </p>
            
            {/* 相性匹配标签 */}
            {typeData.compatibility_best && typeData.compatibility_best.length > 0 && (
              <div className="mt-6">
                <h4 className="mb-3 font-semibold text-pink-600">💕 最佳匹配</h4>
                <div className="flex flex-wrap gap-2">
                  {typeData.compatibility_best.map((type) => (
                    <Badge key={type} variant="default" className="px-3 py-1">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {typeData.compatibility_good && typeData.compatibility_good.length > 0 && (
              <div className="mt-4">
                <h4 className="mb-3 font-semibold text-blue-600">💙 不错的匹配</h4>
                <div className="flex flex-wrap gap-2">
                  {typeData.compatibility_good.map((type) => (
                    <Badge key={type} variant="secondary" className="px-3 py-1">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 4. 匹配建议 */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>匹配建议</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base lg:text-lg leading-relaxed whitespace-pre-line font-medium">
              {typeData.matching_advice}
            </p>
          </CardContent>
        </Card>

        {/* 操作按钮 */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button size="lg" onClick={handleShare}>
            {copied ? (
              <>
                <Heart className="mr-2 h-5 w-5" />
                已复制链接
              </>
            ) : (
              <>
                <Share2 className="mr-2 h-5 w-5" />
                分享结果
              </>
            )}
          </Button>
          
          <Button variant="outline" size="lg" asChild>
            <Link href="/quiz">
              <RefreshCw className="mr-2 h-5 w-5" />
              重新测试
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}


