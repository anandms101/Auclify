import Image from "next/image";
import { database } from "@/db/database";
import { bids as bidsSchema, items } from "@/db/schema";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { revalidatePath } from "next/cache";
import { SignIn } from "@/components/sign-in";
import { auth } from "@/auth";
import { SignOut } from "@/components/sign-out";



export default async function Home() {

  const allItems = await database.query.items.findMany();
  const session = await auth()

  if (!session || !session.user) {
    return null
  }

  return (
    <main className="container mx-auto py-12">

      {session ?
        <SignOut />
        :
        <SignIn />
      }
      {session?.user && <span>{session.user.name}</span>}
      <form action={async (formData: FormData) => {
        "use server"
        await database.insert(items).values({
          name: formData.get("name") as string,
          userId: session?.user?.id!
        });
        revalidatePath("/");
      }}>
        <Input name="name" placeholder="Name your item" />
        <Button type="submit">Post Item</Button>
      </form>

      {
        allItems.map((item) => (
          <div key={item.id}>
            <h2>{item.name}</h2>
          </div>
        ))
      }
    </main>
  );
}
