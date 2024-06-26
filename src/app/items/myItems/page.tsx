import { database } from "@/db/database";
import { auth } from "@/auth";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { env } from "@/env";
import { eq} from "drizzle-orm";
import { items, Item } from "@/db/schema";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function getImageUrlFromR2Url(itemImageName: string) {
  return `${env.NEXT_PUBLIC_BUCKET_URL}${itemImageName}`;
}

export default async function Home() {


  const session = await auth();

  if (!session || !session.user) {
    return null
  }

  const allItems = await database.query.items.findMany({
    where: eq(items.userId, session.user.id!)
  });

  const isItemsEmpty = allItems.length === 0;

  const CardComponent = ({ item }: { item: Item }) => {
    return (
      <Card key={item.id}>
        <CardHeader>
          <CardTitle>{item.name}</CardTitle>
          <CardDescription>{item.startingPrice}</CardDescription>
        </CardHeader>
        <CardContent>
          <Image src={getImageUrlFromR2Url(item.image)} alt={item.name} width={200} height={200} />
        </CardContent>
      </Card>
    )
  }

  const EmptyItemsPageComponent = () => {
    return (
      <>
      <div className="flex flex-col space-y-4 justify-center items-center">
        <h2 className="font-bold text-xl">Oops! you don&apos;t have any items to sell</h2>
        <Image  src="/emptyItemsCart.svg" width={200} height={200} alt="Empty Cart" />
        <Link href='/items/create/'>
          <Button >Sell an Item</Button>
        </Link>
        </div>
      </>
    )
  }

  return (
    <main className="container mx-auto py-12">
      {isItemsEmpty ? (<EmptyItemsPageComponent />) : (<><h2 className="text-2xl font-bold">Items for Bid</h2>
        <div className="grid grid-cols-4 gap-4">
          {
            allItems.map((item) => (
              <CardComponent key={item.id} item={item} />
            ))
          }
        </div></>)
      }
    </main >
  );
}
