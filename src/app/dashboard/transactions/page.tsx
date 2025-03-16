import { auth } from "@/auth";
import { getInstitutions, getTransactions } from "@/lib/actions/bank";
import { redirect } from "next/navigation";
import { TransactionsTable } from "./table";

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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Your transactions</h1>
      </div>
      <TransactionsTable transactionsResponse={transactionsResponse} institutionsResponse={institutionsResponse} />
    </div>
  );
}
