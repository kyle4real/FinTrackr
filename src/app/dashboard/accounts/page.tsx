import { auth } from "@/auth";
import { PlaidLinkButton } from "@/components/plaid-link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getInstitutions } from "@/lib/actions/bank";
import { createPlaidLinkToken } from "@/lib/actions/user";
import { cn } from "@/lib/utils";
import { ChevronRight, PlusIcon } from "lucide-react";
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

  const { totalAccounts, institutions } = await getInstitutions(session.user.id);

  const token = await createPlaidLinkToken({
    id: session.user.id,
    name: session.user.name,
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">
          You have {totalAccounts} account{totalAccounts === 1 ? "" : "s"} linked
          {institutions.length === 1 ? "" : "s"}
        </h1>
        <PlaidLinkButton token={token} userId={session.user.id}>
          Link New Account <PlusIcon />
        </PlaidLinkButton>
      </div>
      <div className="flex flex-col gap-8">
        {institutions.map((institution) => (
          <div key={institution.institutionId}>
            <h2 className="text-xl font-medium mb-2">{institution.institutionName}</h2>
            <div className="flex flex-wrap gap-4">
              {institution.accounts.map((account) => (
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
                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-8 rounded-full backdrop-blur-sm cursor-pointer"
                      >
                        <ChevronRight className="h-4 w-4" />
                        <span className="sr-only">View details</span>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
