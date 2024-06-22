import { database } from "@/db/database";
import { bids as bidsSchema, items } from "@/db/schema";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export default async function Home() {

  const allItems = await database.query.items.findMany();
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

      <h2 className="text-2xl font-bold">Items for Bid</h2>

      <div className="grid grid-cols-4 gap-4">
      {
        allItems.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle>{item.name}</CardTitle>
            </CardHeader>
          </Card>
        ))
      }
      </div>



    </main>
  );
}
