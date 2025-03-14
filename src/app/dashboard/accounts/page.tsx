import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ChevronRight, Plus } from "lucide-react";

const connectedItems = [
  {
    id: "1",
    bankName: "Chase",
    accountName: "Checking",
    balance: 1000,
    currency: "USD",
    color: "from-blue-500 to-blue-600",
    lastFour: "1234",
  },
  {
    id: "2",
    bankName: "Chase",
    accountName: "Savings",
    balance: 5000,
    currency: "USD",
    color: "from-emerald-500 to-emerald-600",
    lastFour: "5678",
  },
  {
    id: "3",
    bankName: "Wells Fargo",
    accountName: "Checking",
    balance: 2000,
    currency: "USD",
    color: "from-purple-500 to-purple-600",
    lastFour: "9012",
  },
  {
    id: "4",
    bankName: "Wells Fargo",
    accountName: "Savings",
    balance: 3000,
    currency: "USD",
    color: "from-amber-500 to-amber-600",
    lastFour: "3456",
  },
];

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

export default function Page() {
  return (
    <div className="px-6 py-4">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight mb-6">You have {connectedItems.length} linked accounts</h1>
      </div>
      <div className="flex flex-wrap gap-4">
        {connectedItems.map((account) => (
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
                {account.accountName}
              </div>
              <div className="text-foreground/80 text-sm font-medium">•••• {account.lastFour}</div>
            </div>

            <div className="mt-auto">
              <div className="flex items-baseline mb-1">
                <span className="text-2xl font-bold">{formatCurrency(account.balance)}</span>
                <span className="text-foreground/80 ml-1 text-lg">.{formatCents(account.balance)}</span>
              </div>
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-foreground/90 text-lg">{account.bankName}</h3>
                <Button size="icon" variant="ghost" className="size-8 rounded-full backdrop-blur-sm cursor-pointer">
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">View details</span>
                </Button>
              </div>
            </div>
          </Card>
        ))}
        {/* <PlaidLinkButton token={}> */}
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
        {/* </PlaidLinkButton> */}
      </div>
    </div>
  );
}
