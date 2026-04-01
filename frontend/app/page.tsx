import { auth } from '@clerk/nextjs/server';
import { HomePageContent } from '@/components/home/home-page-content';

export default async function HomePage() {
  const { userId } = await auth();

  return <HomePageContent initialView={userId ? 'dashboard' : 'landing'} />;
}
