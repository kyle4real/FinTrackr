import { auth } from "@/auth";
import { SignInButton } from "@/components/auth";
import { Header } from "@/components/header";
import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import { Button } from "@/components/ui/button";
import { Spotlight } from "@/components/ui/spotlight";
import { Calendar } from "lucide-react";
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
        <div className="p-4 container  mx-auto relative z-10  w-full pt-20 md:pt-0">
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
        {/* <div className="absolute inset-0 top-0 bg-linear-to-t from-white to-white/0" /> */}
      </div>
      <div className="max-w-5xl mx-auto py-32 px-6">
        <h1 className="text-4xl md:text-5xl font-bold text-center tracking-tight">Features & Benefitss</h1>
        <p className="mt-4 font-normal text-base tracking-tight text-secondary-foreground max-w-lg text-center mx-auto">
          Seamlessly link your bank and investment accounts to visualize your complete financial landscape through
          interactive graphs, empowering smarter financial decisions.
        </p>
        <BentoGrid className="mt-12">
          <BentoCard
            cta="View transactions"
            href="/dashboard/transactions"
            Icon={Calendar}
            name="Calendar"
            description="View your transactions by date"
            className="col-span-3 lg:col-span-1"
            background={<div>hi</div>}
          />
          <BentoCard
            cta="View transactions"
            href="/dashboard/transactions"
            Icon={Calendar}
            name="Calendar"
            description="View your transactions by date"
            className="col-span-3 lg:col-span-2"
            background={<div>hi</div>}
          />
          <BentoCard
            cta="View transactions"
            href="/dashboard/transactions"
            Icon={Calendar}
            name="Calendar"
            description="View your transactions by date"
            className="col-span-3 lg:col-span-2"
            background={<div>hi</div>}
          />
          <BentoCard
            cta="View transactions"
            href="/dashboard/transactions"
            Icon={Calendar}
            name="Calendar"
            description="View your transactions by date"
            className="col-span-3 lg:col-span-1"
            background={<div>hi</div>}
          />
        </BentoGrid>
      </div>
    </div>
  );
}
