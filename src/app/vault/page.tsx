import { prisma } from '@/lib/prisma';
import VaultTerminal from '@/components/VaultTerminal';
import { translations } from '@/lib/translations';
import { cookies } from 'next/headers';

export default async function VaultPage() {
  const cookieStore = await cookies();
  const lang = (await cookieStore).get('language')?.value || 'ar';
  
  // Fetch user profile on the server for security
  // If you have a real session, replace this with your auth check
  let username = "OPERATOR";
  try {
    const user = await prisma.authorizedUser.findFirst(); // Example fetch
    if (user) username = user.username;
  } catch (e) {
    username = "GUEST";
  }

  return <VaultTerminal initialLang={lang} initialUsername={username} />;
}