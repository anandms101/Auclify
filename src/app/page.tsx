import { database } from "@/db/database";
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
