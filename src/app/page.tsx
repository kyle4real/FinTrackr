import { Header } from "@/components/header";
import { unstable_noStore as noStore } from "next/cache";

export default async function Page() {
  noStore();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="relative w-fit mx-auto">hello</div>
      </main>
    </div>
  );
}
