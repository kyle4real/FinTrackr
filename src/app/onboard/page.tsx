import { auth } from "@/auth";
import { Header } from "@/components/header";
import { PlaidLinkButton } from "@/components/plaid-link";
import { createPlaidLinkToken } from "@/lib/actions/user";
import { PlusIcon } from "lucide-react";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth();

  if (!session?.user) {
    return redirect("/");
  }

  const token = await createPlaidLinkToken({
    id: session.user.id,
    name: session.user.name,
  });

  return (
    <div className="min-h-screen">
      <Header />

      <div className="py-40 w-full grid place-items-center">
        <div className="max-w-md">
          <h1 className="text-4xl font-bold text-center">Welcome to FinTrackr</h1>
          <p className="mt-4 font-normal text-base tracking-tight text-secondary-foreground max-w-lg text-center mx-auto">
            Please add your first account to get started.
          </p>

          <div className="mt-12 mx-auto w-fit">
            <PlaidLinkButton
              onComplete={async () => {
                "use server";

                revalidatePath("/dashboard");
                redirect("/dashboard");
              }}
              token={token}
              userId={session.user.id}
            >
              Link New Account <PlusIcon />
            </PlaidLinkButton>
          </div>
        </div>
      </div>
    </div>
  );
}
