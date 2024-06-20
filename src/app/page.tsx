import Image from "next/image";
import { database } from "@/db/database";
import { bids as bidsSchema } from "@/db/schema";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { revalidatePath } from "next/cache";
import { SignIn } from "@/components/sign-in";
import { auth } from "@/auth";
import { SignOut } from "@/components/sign-out";



export default async function Home() {

  const bids = await database.query.bids.findMany({});
  const session = await auth()

  return (
    <main className="container mx-auto py-12">

      {session ?
        <Button variant="destructive"><SignOut /></Button>
        :
        <Button variant="default"><SignIn /></Button>
      }

      <form action={async (formData: FormData) => {
        "use server"
        await database.insert(bidsSchema).values({});
        revalidatePath("/");
      }}>
        <Input name="bid" placeholder="Bid" />
        <Button type="submit">Submit</Button>
      </form>

      {
        bids.map((bid) => (
          <div key={bid.id}>
            <h2>{bid.id}</h2>
          </div>
        ))
      }
    </main>
  );
}
