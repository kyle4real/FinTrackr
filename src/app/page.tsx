import { auth } from "@/auth";
import { SignInButton, SignOutButton } from "@/components/auth";
import { formatName } from "@/lib/utils";
import { Session } from "next-auth";
import { unstable_noStore as noStore } from "next/cache";

import Image from "next/image";
import Link from "next/link";

export default async function Page() {
  noStore();

  const session = await auth();

  const connectedItems = [
    {
      bankName: "Chase",
      accountName: "Checking",
      balance: 1000,
      currency: "USD",
    },
    {
      bankName: "Chase",
      accountName: "Savings",
      balance: 5000,
      currency: "USD",
    },
    {
      bankName: "Wells Fargo",
      accountName: "Checking",
      balance: 2000,
      currency: "USD",
    },
    {
      bankName: "Wells Fargo",
      accountName: "Savings",
      balance: 3000,
      currency: "USD",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-b border-gray-100 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-900">
            Transaction Map
          </Link>
          <div>{session?.user ? <UserMenu user={session.user} /> : <SignInButton />}</div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pt-24 pb-16">
        <div className="flex">
          {connectedItems.map((item, index) => (
            <div key={index} className="w-1/2 p-4">
              {item.accountName}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

function UserMenu({ user }: { user: NonNullable<Session["user"]> }) {
  return (
    <div className="relative group">
      <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors">
        {user.image ? (
          <Image src={user.image} alt={formatName(user.name)} width={32} height={32} className="rounded-full" />
        ) : (
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-gray-500 text-sm font-medium">{(user.name || "U").charAt(0)}</span>
          </div>
        )}
        <span className="text-sm font-medium text-gray-700">{formatName(user.name)}</span>
        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className="absolute right-0 mt-1 w-36 py-1 bg-white rounded-lg shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
        <SignOutButton />
      </div>
    </div>
  );
}
