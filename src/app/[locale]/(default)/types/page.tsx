import { getAllPersonalityTypesForLocale } from "@/services/quiz";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Heart } from "lucide-react";
import { getTypesPage } from "@/services/page";
import { getCanonicalUrl } from "@/lib/utils";
import ShowcaseImage from "@/components/blocks/types/showcase-image";

export const dynamic = "force-static";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const page = await getTypesPage(locale);
  
  const canonicalUrl = getCanonicalUrl(locale, "/types");
  
  return {
    title: `${page.heading} | 恋爱MBTI性格类型测试`,
    description: page.subtitle,
    openGraph: {
      title: page.heading,
      description: page.subtitle,
      type: "website",
      url: canonicalUrl,
    },
    twitter: {
      card: "summary_large_image",
      title: page.heading,
      description: page.subtitle,
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        ja: "/ja/types",
        zh: "/zh/types", 
        en: "/en/types",
      },
    },
  };
}

export default async function TypesListPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const types = await getAllPersonalityTypesForLocale(locale);
  const page = await getTypesPage(locale);

  const toPlain = (text?: string) =>
    (text || "").replace(/\n+/g, " ").replace(/\s+/g, " ");

  return (
    <div className="container py-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          {page.heading}
        </h1>
        <p className="mt-2 text-muted-foreground">{page.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {types.map((item) => (
          <Card
            key={`${item.mbti_type}-${item.locale}`}
            className="overflow-hidden rounded-3xl border bg-card/60 shadow-sm transition hover:shadow-md"
          >
            <CardContent className="p-0">
              {/* 头部：类型代码 */}
              <div className="px-6 pt-6">
                <div className="text-center text-sky-600 font-extrabold tracking-widest text-xl">
                  {item.type_code || item.mbti_type}
                </div>
              </div>

              {/* 图片占位（后续替换为真实图片） */}
              <div className="flex items-center justify-center py-6">
                {item.icon_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.icon_url}
                    alt={item.title}
                    className="h-48 w-auto object-contain drop-shadow-sm"
                  />
                ) : (
                  <ShowcaseImage
                    code={(item.type_code || item.mbti_type).toUpperCase()}
                    title={item.title}
                    className="h-48 w-auto object-contain"
                  />
                )}
              </div>

              {/* 文本 */}
              <div className="px-6 pb-2">
                <div className="text-center text-xl font-bold mb-1">{item.title}</div>
                <p
                  className="text-sm text-muted-foreground leading-6 h-20 overflow-hidden"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {toPlain(item.basic_personality)}
                </p>
              </div>

              {/* 操作 */}
              <div className="px-6 pb-6 pt-2">
                <Link href={`/${locale}/types/${item.type_code || item.mbti_type}`}>
                  <Button className="w-full rounded-full" variant="secondary">
                    {page.learnMore}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}


