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

  return <Charts transactionsResponse={transactionsResponse} institutionsResponse={institutionsResponse} />;
}
