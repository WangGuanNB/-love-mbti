import { redirect, notFound } from "next/navigation";
import { getCanonicalUrl } from "@/lib/utils";
import { getPersonalityTypeByCode, getPersonalityType } from "@/services/quiz";
import { MBTI_TO_CODE, ALL_TYPE_CODES } from "@/lib/type-mapping";
import TypeDetailClient from "@/components/blocks/types/type-detail-client";
import { getTypesPage } from "@/services/page";
import { findQuizResultByUuid, incrementViewCount } from "@/models/quiz";

export async function generateStaticParams() {
  const locales = ["ja", "zh", "en"];
  // 仅对 type_code 做 SSG；MBTI 旧路由会 301 到新路由
  return ALL_TYPE_CODES.flatMap((slug) => locales.map((locale) => ({ locale, slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  // 如果是 MBTI，先映射为 code 用于生成元数据（SSR 阶段不会真的重定向）
  const code = (MBTI_TO_CODE[slug.toUpperCase()] || slug).toString();
  const type = await getPersonalityTypeByCode(code, locale);
  if (!type) return { title: "性格类型加载中..." };

  const canonicalUrl = getCanonicalUrl(locale, `/types/${code}`);
  const description = type.basic_personality
    ? type.basic_personality.substring(0, 160).trim() + "..."
    : type.title;

  return {
    title: `${type.mbti_type} - ${type.title} | 恋爱MBTI性格类型`,
    description,
    openGraph: {
      title: `${type.mbti_type} - ${type.title}`,
      description,
      type: "article",
      url: canonicalUrl,
      images: type.cover_image_url
        ? [
            { url: type.cover_image_url, width: 1200, height: 630, alt: `${type.mbti_type} - ${type.title}` },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${type.mbti_type} - ${type.title}`,
      description,
      images: type.cover_image_url ? [type.cover_image_url] : undefined,
    },
    alternates: {
      canonical: canonicalUrl,
      languages: { ja: `/ja/types/${code}`, zh: `/zh/types/${code}`, en: `/en/types/${code}` },
    },
  };
}

export default async function TypePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{ uuid?: string }>;
}) {
  const { locale, slug } = await params;
  const { uuid } = await searchParams;
  const pageI18n = await import(`@/i18n/pages/types/${locale}.detail.json`).then(m=>m.default).catch(async()=> (await import("@/i18n/pages/types/en.detail.json")).default);

  // 旧 MBTI 路由：301 到新路由（/types/{code}）
  const maybeCode = (MBTI_TO_CODE[slug.toUpperCase()] || slug).toString();
  if (MBTI_TO_CODE[slug?.toUpperCase()]) {
    redirect(`/${locale}/types/${maybeCode}`);
  }

  // 现在按 type_code 读取
  const personalityType = await getPersonalityTypeByCode(maybeCode, locale);
  if (!personalityType) notFound();

  let scores: any = undefined;
  if (uuid) {
    const quizResult = await findQuizResultByUuid(uuid);
    if (quizResult && quizResult.mbti_type === personalityType.mbti_type) {
      scores = JSON.parse(quizResult.scores);
      await incrementViewCount(uuid);
    }
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${personalityType.mbti_type} - ${personalityType.title}`,
    description:
      personalityType.subtitle || personalityType.basic_personality.substring(0, 160),
    inLanguage: locale,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <TypeDetailClient
        personalityType={personalityType}
        locale={locale}
        uuid={uuid}
        scores={scores}
        i18n={pageI18n}
      />
    </>
  );
}



