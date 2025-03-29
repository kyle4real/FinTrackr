import { auth } from "@/auth";
import { getInstitutions, getTransactions } from "@/lib/actions/bank";
import { redirect } from "next/navigation";
import { Charts } from "./charts";

export default async function Page() {
  const session = await auth();

  if (!session?.user) {
    return redirect("/");
  }

  const [transactionsResponse, institutionsResponse] = await Promise.all([
    await getTransactions(session.user.id),
    await getInstitutions(session.user.id),
  ]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Welcome back, {session.user.name}!</p>
      </div>
      <Charts transactionsResponse={transactionsResponse} institutionsResponse={institutionsResponse} />
    </div>
  );
}
