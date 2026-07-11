export const dynamic = "force-dynamic";
import { LandingPage } from "@/components/landing-page";
import { getHomepageSections } from "@/lib/data";

export default async function Home() {
  const sections = await getHomepageSections();
  const hero = sections.find((section) => section.key === "hero");

  return <LandingPage hero={hero} />;
}
