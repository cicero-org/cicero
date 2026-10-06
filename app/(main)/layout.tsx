import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Roboto } from 'next/font/google';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import '../globals.css';
import { ThemeProvider } from '@/components/theme/theme-provider';
import Nav from '@/components/layout/nav';
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const roboto = Roboto({ subsets: ['latin'], variable: '--font-roboto' });
import QueryProvider from '@/components/providers/QueryProvider';
import { Toaster } from '@/components/ui/sonner';
import { auth } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Cicero - Development',
  description:
    'Cicero is a web app for users to invest in their favorite NBA players potential. This works through a web interface that users can log into, browse/search different players and “Invest” into their current score. This ***score*** is defined through both the players performance through stats in game as well as the sentiment analysis of the players online reputation such as what people and analysts are posting about them online',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect('/login');
  if (!session.user.onboarding_status) redirect('/onboarding');

  return (
    <html lang="en" className={` ${inter.variable} ${roboto.variable}`}>
      <body className={`${inter.className}`}>
        <QueryProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <main className="container flex h-fit w-full max-w-7xl flex-col px-[1rem] md:h-screen lg:px-[2rem]">
              <Nav />
              {children}
            </main>
            <Toaster />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
