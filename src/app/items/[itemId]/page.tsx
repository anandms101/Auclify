import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { database } from "@/db/database";
import { Item, items, bids } from "@/db/schema";
import { env } from "@/env";
import { desc, eq } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";
import { createBidAction } from "@/app/items/[itemId]/actions";
import { formatDistance } from 'date-fns';
import { IndianRupee } from "lucide-react";

export default async function ItemPage(
    { params: { itemId } }: { params: { itemId: string } }
) {

    const item = await database.query.items.findFirst({
        where: eq(items.id, parseInt(itemId))
    });

    if (!item) {
        return (
            <>
                <div className="flex flex-col space-y-4 justify-center items-center container mx-auto py-12">
                    <h2 className="font-bold text-xl">stop wandering!</h2>
                    <Image src="/404notFound.svg" width={200} height={200} alt="Empty Cart" />
                    <Link href='/'>
                        <Button >Go to HomePage</Button>
                    </Link>
                </div>
            </>
        )
    }

    function getImageUrlFromR2Url(itemImageName: string) {
        return `${env.NEXT_PUBLIC_BUCKET_URL}${itemImageName}`;
    }

    function formatDate(timestamp: Date) {
        return formatDistance(timestamp, new Date(), { addSuffix: true })
    }

    const CardComponent = ({ item }: { item: Item }) => {
        return (
            <Card key={item.id} className="flex flex-col space-y-4 justify-center items-center">
                <CardHeader>
                    <CardTitle>Buy {item.name}</CardTitle>
                </CardHeader>
                <CardContent>
                    <Image src={getImageUrlFromR2Url(item.image)} alt={item.name} width={200} height={200} />
                </CardContent>
                <CardFooter>
                    <span className="flex flex-col">
                        <span>Current Bid <Badge>{item.currentBid}</Badge></span>
                        <span>Starting price <Badge variant="outline">{item.startingPrice}</Badge></span>
                        <span>Bid intervel <Badge variant="secondary">{item.bidInterval}</Badge></span>
                    </span>
                </CardFooter>
            </Card>
        )
    }

    const CurrentBidsComponent = () => {
        return (
            <>
                <Card className="border-none shadow-none flex flex-col space-y-4 justify-center items-center">
                    <CardHeader>
                        <CardTitle>Bids placed</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {allBids.map((bid) => (
                            <div key={bid.id} className="flex flex-row gap-6">
                                <span className="flex flex-row"> <Badge variant="outline"><IndianRupee className="size-3" />{bid.amount}</Badge></span>
                                <span className="font-bold ">{bid.user.name}</span>
                                <span>{formatDate(bid.timestamp)}</span>
                            </div>
                        ))}
                    </CardContent>
                    <CardFooter>
                        <span className="flex flex-col">
                            <form action={createBidAction.bind(null, item.id)}>
                                <Button > Place a Bid </Button>
                            </form>
                        </span>
                    </CardFooter>
                </Card>
            </>
        )
    }

    const allBids = await database.query.bids.findMany({
        where: eq(bids.itemId, parseInt(itemId)),
        orderBy: desc(bids.id),
        with: {
            user: {
                columns: {
                    image: true,
                    name: true
                }
            }
        },
    });

    const EmptyBidsComponent = () => {
        return (
            <>
                <Card className="border-none shadow-none flex flex-col space-y-4 justify-center items-center">
                    <CardHeader>
                        <CardTitle>No Bids placed</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Image src="/noBid.svg" width={200} height={200} alt="No Bids" />
                    </CardContent>
                    <CardFooter>
                        <span className="flex flex-col">
                            <form action={createBidAction.bind(null, item.id)}>
                                <Button> Place a Bid </Button>
                            </form>
                        </span>
                    </CardFooter>
                </Card>
            </>
        )
    }

    return (
        <>
            <main className="grid grid-cols-2 gap-4 container mx-auto py-12" style={{ gridTemplateColumns: '1fr 1.5fr' }}>
                <div>
                    <CardComponent item={item} />
                </div>
                <div>
                    {allBids.length === 0 ? <EmptyBidsComponent /> : <CurrentBidsComponent />}
                </div>
            </main>
        </>
    )
}