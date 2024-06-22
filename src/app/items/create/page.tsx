import { database } from "@/db/database";
import { items } from "@/db/schema";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export default async function Home() {
    
  const session = await auth()

  if (!session || !session.user) {
    return null
  }

  return (
    <main className="container mx-auto py-12">
      <h1 className="text-4xl font-bold">Items</h1>
      <form className="flex flex-col border p-8 rounded-xl space-y-4 max-w-md" action={async (formData: FormData) => {
        "use server"
        await database.insert(items).values({
          name: formData.get("name") as string,
          userId: session?.user?.id!
        });
        revalidatePath("/");
      }}>
        <Input className="max-w-lg" name="name" placeholder="Name your item" />
        <Button className="self-end" type="submit">Post Item</Button>
      </form>
    </main>
  );
}
