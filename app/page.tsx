export const revalidate = 3600;
import { LandingPage } from "@/components/landing-page";
import { fallbackProducts, getHomepageSections, getProductBySlug } from "@/lib/data";

export default async function Home() {
  const sections = await getHomepageSections();
  const hero = sections.find((section) => section.key === "hero");
  const product = (await getProductBySlug("renewal-serum")) ?? fallbackProducts[0];

  return <LandingPage hero={hero} product={product} />;
}
