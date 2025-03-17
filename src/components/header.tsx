import { auth } from "@/auth";
import { formatName } from "@/lib/utils";
import { Session } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { SignInButton, SignOutButton } from "./auth";
import { DashboardLink } from "./dashboard-link";

export const HEADER_HEIGHT = "64px";

export type HeaderProps = {
  leftActions?: React.ReactNode;
};

export async function Header(props: HeaderProps) {
  const session = await auth();

  return (
    <header className="sticky top-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-b border-gray-100 z-50 h-[var(--header-height)]">
      <div className=" px-4 h-full flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {props.leftActions}
          <Link href="/" className="text-xl font-bold text-gray-900 tracking-tighter">
            FinTrackr
          </Link>
        </div>
        <div className="flex items-center gap-3">
          {session?.user && <DashboardLink />}
          {session?.user ? <UserMenu user={session.user} /> : <SignInButton />}
        </div>
      </div>
    </header>
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
