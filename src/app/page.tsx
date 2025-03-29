import { auth } from "@/auth";
import { SignInButton } from "@/components/auth";
import { Header } from "@/components/header";
import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import { Button } from "@/components/ui/button";
import { Spotlight } from "@/components/ui/spotlight";
import { Calendar, LineChart, Banknote, PiggyBank } from "lucide-react";
import { unstable_noStore as noStore } from "next/cache";
import Image from "next/image";
import Link from "next/link";

export default async function Page() {
  noStore();
  const session = await auth();

  return (
    <div className="min-h-screen">
      <Header />
      <div className="h-[40rem] w-full flex md:items-center md:justify-center bg-zinc-950 relative overflow-hidden">
        <div className="absolute inset-0 size-full container mx-auto">
          <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />
        </div>
        <div className="p-4 container mx-auto relative z-10 w-full pt-20 md:pt-0">
          <h1 className="text-4xl md:text-5xl font-bold text-center bg-clip-text text-transparent tracking-tight bg-gradient-to-b from-zinc-50 to-zinc-400 bg-opacity-50">
            Connect, Visualize, Empower: <br /> Your Financial Data at a Glance
          </h1>
          <p className="mt-4 font-normal text-base tracking-tight text-zinc-300 max-w-lg text-center mx-auto">
            Seamlessly link your bank and investment accounts to visualize your complete financial landscape through
            interactive graphs, empowering smarter financial decisions.
          </p>
          <div className="mx-auto w-fit mt-6 flex gap-3">
            {session?.user ? (
              <Button className="shadow-zinc-100/50" asChild>
                <Link href="/dashboard">Go to dashboard</Link>
              </Button>
            ) : (
              <SignInButton className="shadow-zinc-100/50" />
            )}
            <Button variant="secondary" className="bg-gradient-to-b from-zinc-50 to-zinc-400">
              Learn More
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-zinc-950 relative pb-32">
        <div className="max-w-5xl mx-auto px-6 backdrop-blur-2xl">
          <Image
            alt="example"
            src="/dash-example.png"
            width="1980"
            height="1080"
            className="object-contain rounded-md overflow-hidden h-auto"
          />
        </div>
      </div>

      <div className="max-w-5xl mx-auto py-32 px-6">
        <h1 className="text-4xl md:text-5xl font-bold text-center tracking-tight">Features & Benefits</h1>
        <p className="mt-4 font-normal text-base tracking-tight text-secondary-foreground max-w-lg text-center mx-auto">
          Powerful tools to help you understand your finances and reach your goals faster.
        </p>

        <BentoGrid className="mt-12">
          <BentoCard
            cta="Explore spending habits"
            href="/dashboard/transactions"
            Icon={Calendar}
            name="Smart Calendar"
            description="Visualize your spending and income patterns over time."
            className="col-span-3 lg:col-span-1"
            background={
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/30 to-purple-500/10 rounded-md" />
            }
          />
          <BentoCard
            cta="Dive into data"
            href="/dashboard/insights"
            Icon={LineChart}
            name="Interactive Charts"
            description="Track trends across accounts, categories, and custom tags."
            className="col-span-3 lg:col-span-2"
            background={
              <div className="absolute inset-0 bg-gradient-to-br from-green-400/30 to-blue-500/10 rounded-md" />
            }
          />
          <BentoCard
            cta="Link your accounts"
            href="/dashboard/accounts"
            Icon={Banknote}
            name="Bank Integration"
            description="Securely connect your checking, savings, and investment accounts."
            className="col-span-3 lg:col-span-2"
            background={
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/30 to-orange-500/10 rounded-md" />
            }
          />
          <BentoCard
            cta="Set & track goals"
            href="/dashboard/goals"
            Icon={PiggyBank}
            name="Financial Goals"
            description="Create savings goals and monitor your progress with confidence."
            className="col-span-3 lg:col-span-1"
            background={
              <div className="absolute inset-0 bg-gradient-to-br from-pink-400/30 to-rose-500/10 rounded-md" />
            }
          />
        </BentoGrid>
      </div>
      <footer className="border-t border-zinc-800 bg-zinc-950 py-6 text-center text-sm text-zinc-400 px-4">
        <p>
          This is a sandbox application built for demonstration purposes only. Data shown is not real and should not be
          used for financial decision-making.
        </p>
      </footer>
    </div>
  );
}
