import { auth } from "@/auth";
import { PlaidLinkButton } from "@/components/plaid-link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getAccounts } from "@/lib/actions/bank";
import { createPlaidLinkToken } from "@/lib/actions/user";
import { cn } from "@/lib/utils";
import { ChevronRight, Plus } from "lucide-react";
import { redirect } from "next/navigation";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format cents
const formatCents = (amount: number) => {
  const cents = Math.abs(Math.round((amount - Math.floor(amount)) * 100));
  return cents.toString().padStart(2, "0");
};

export default async function Page() {
  const session = await auth();

  if (!session?.user) {
    return redirect("/");
  }

  const { accounts } = await getAccounts(session.user.id);

  const token = await createPlaidLinkToken({
    id: session.user.id,
    name: session.user.name,
  });

  return (
    <div>
      <div>
        <h1 className="text-3xl font-semibold tracking-tight mb-6">
          You have {accounts.length} linked account{accounts.length === 1 ? "" : "s"}
        </h1>
      </div>
      <div className="flex flex-wrap gap-4">
        {accounts.map((account) => (
          <Card
            key={account.id}
            className={cn(
              "h-[175px] w-[300px] overflow-hidden rounded-2xl p-6 flex flex-col",
              "bg-gradient-to-br from-white/60 to-white/30 dark:from-white/10 dark:to-white/5",
              "backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.06)]",
              "border border-white/40 dark:border-white/10",
              "relative self-stretch"
            )}
          >
            <div className="flex justify-between items-start mb-2">
              <div className="backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium flex items-center gap-1.5">
                {/* {getAccountIcon(account.accountType)} */}
                {account.subtype}
              </div>
              <div className="text-foreground/80 text-sm font-medium">•••• {account.mask}</div>
            </div>

            <div className="mt-auto">
              <div className="flex items-baseline mb-1">
                <span className="text-2xl font-bold">{formatCurrency(account.currentBalance)}</span>
                <span className="text-foreground/80 ml-1 text-lg">.{formatCents(account.currentBalance)}</span>
              </div>
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-foreground/90 text-lg">{account.name}</h3>
                <Button size="icon" variant="ghost" className="size-8 rounded-full backdrop-blur-sm cursor-pointer">
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">View details</span>
                </Button>
              </div>
            </div>
          </Card>
        ))}
        <PlaidLinkButton token={token} userId={session.user.id}>
          <Card
            className={cn(
              "h-[175px] w-[300px] overflow-hidden rounded-2xl p-6 flex flex-col",
              "bg-gradient-to-br from-white/60 to-white/30 dark:from-white/10 dark:to-white/5",
              "backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.06)]",
              "border border-white/40 dark:border-white/10",
              "relative"
            )}
          >
            {/* Content */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="size-9 rounded-full flex backdrop-blur-sm  items-center justify-center mb-4">
                <Plus className="size-6 text-primary" />
              </div>
              <h3 className="font-medium text-lg">Link New Account</h3>
              <p className="text-sm text-muted-foreground mt-1 text-center max-w-[200px]">
                Connect your bank or investment accounts
              </p>
            </div>
          </Card>
        </PlaidLinkButton>
      </div>
    </div>
  );
}
