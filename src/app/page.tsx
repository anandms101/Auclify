import Image from "next/image";
import {database} from "@/db/database";
import {bids as bidsSchema} from "@/db/schema";

export default async function Home() {

  const bids = await database.query.bids.findMany({});

  return (
    <main className="container mx-auto py-12">
      <form action={async (formData: FormData) => { "use server" 
      await database.insert(bidsSchema).values({});
      }}>
        <input name="bid" placeholder="Bid" />
        <button type="submit">Submit</button>
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
