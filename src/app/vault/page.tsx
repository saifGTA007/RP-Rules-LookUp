import { prisma } from '@/lib/prisma';
import VaultTerminal from '@/components/VaultTerminal';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';


export default async function VaultPage() {
  const cookieStore = await cookies();
  
  
  const sessionHash = cookieStore.get('user_session')?.value;

  // 1. If no cookie at all, kick them to login
  if (!sessionHash) {
    redirect('/');
  }

  // 2. Look for a user that owns this specific hardware hash
  const user = await prisma.authorizedUser.findFirst({
    where: { hardwareHash: sessionHash }
  });

  // 3. If the cookie exists but doesn't match any hardware in our DB, kick them
  if (!user) {
    // Optional: Delete the invalid cookie here if you want
    redirect('/');
  }

  // 4. Success - Only authorized hardware gets here
  return <VaultTerminal initialUsername={user.username} />;
}