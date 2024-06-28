import { database } from "@/db/database";
import { auth } from "@/app/api/auth/[...nextauth]/auth";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { env } from "@/env";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Item, items } from "@/db/schema";
import { eq, ne } from "drizzle-orm";

function getImageUrlFromR2Url(itemImageName: string) {
  return `${env.NEXT_PUBLIC_BUCKET_URL}${itemImageName}`;
}

export default async function Home() {

  const session = await auth();
  const userId = session?.user?.id;

  if (!session || !session.user || !userId) {
    return null
  }

  const allItems = await database.query.items.findMany(
    {
      where:ne(items.userId, userId)
    }
  );

  const EmptyItemsPageComponent = () => {
    return (
      <>
        <div className="flex flex-col space-y-4 justify-center items-center">
          <h2 className="font-bold text-xl">Oops! There&apos;s no item available</h2>
          <Image src="/emptyItemsCart.svg" width={200} height={200} alt="Empty Cart" />
        </div>
      </>
    )
  }

  const CardComponent = ({ item }: { item: Item }) => {
    return (
      <>
        <Card key={item.id}>
          <CardHeader>
            <CardTitle>{item.name}</CardTitle>
            <CardDescription>{item.startingPrice}</CardDescription>
          </CardHeader>
          <CardContent>
            <Image src={getImageUrlFromR2Url(item.image)} alt={item.name} width={200} height={200} />
          </CardContent>
          <CardFooter>
            <Link href={`/items/${item.id}/`}>
              <Button>Buy this item</Button>
            </Link>
          </CardFooter>
        </Card>
      </>
    )
  }

  return (
    <main className="container mx-auto py-12">
      {allItems.length === 0 ? <EmptyItemsPageComponent /> : (
        <>
          <h2 className="text-2xl font-bold">Items for Bid</h2>
          <div className="grid grid-cols-4 gap-4">
            {
              allItems.map((item) => (
                <CardComponent key={item.id} item={item} />
              ))
            }
          </div>
        </>
      )}
    </main>
  );
}
