import Image from "next/image";
import {database} from "@/db/database";
import {bids} from "@/db/schema";

export default function Home() {
  return (
    <main className="">
      <form action={async (formData: FormData) => { "use server" 
      await database.insert(bids).values({});
      }}>
        <input name="bid" placeholder="Bid" />
        <button type="submit">Submit</button>
      </form>
    </main>
  );
}
