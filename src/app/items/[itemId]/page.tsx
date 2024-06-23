import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { database } from "@/db/database";
import { Item, items } from "@/db/schema";
import { env } from "@/env";
import { eq } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";

export default async function ItemPage(
    { params: { itemId } }: { params: { itemId: string } }
) {

    const item = await database.query.items.findFirst({
        where: eq(items.id, parseInt(itemId))
    });

    if (!item) {
        return (
            <>
                <h1>Item not found</h1>
            </>
        )
    }

    function getImageUrlFromR2Url(itemImageName: string) {
        return `${env.NEXT_PUBLIC_BUCKET_URL}${itemImageName}`;
    }

    const CardComponent = ({ item }: { item: Item }) => {
        return (
            <Card key={item.id}>
                <CardHeader>
                    <CardTitle>Buy {item.name}</CardTitle>
                </CardHeader>
                <CardContent>
                    <Image src={getImageUrlFromR2Url(item.image)} alt={item.name} width={200} height={200} />
                </CardContent>
                <CardFooter>
                    <span className="flex flex-col">
                        <span>Starting price <Badge>{item.startingPrice}</Badge></span>
                        <span>Bid intervel <Badge variant="secondary">{item.bidIntervel}</Badge></span>
                    </span>
                </CardFooter>
            </Card>
        )
    }

    const bids = [
        {
            id: 1,
            amount: 100,
            bidder: "John Doe",
            createdAt: new Date(),
        },
        {
            id: 2,
            amount: 200,
            bidder: "Jane Doe",
            createdAt: new Date(),
        },
        {
            id: 3,
            amount: 300,
            bidder: "John Doe",
            createdAt: new Date()
        },
    ]

    // const bids: Bid[] = [];

    // interface Bid {
    //     id: number;
    //     amount: number;
    //     bidder: string;
    //     createdAt: Date;
    // }

    const CurrentBidsComponent = () => {
        return (
            <>
                {bids.map((bid) => (
                    <div key={bid.id} >
                        <span>{bid.bidder}</span>
                        <span>{bid.amount}</span>
                    </div>
                ))}
            </>
        )
    }

    const EmptyBidsComponent = () => {
        return (
            <>
                <h2>No Bids placed for this item as of now </h2>
            </>
        )
    }

    return (
        <>
            <div className="grid grid-cols-2 gap-8 m-4">
                <div>
                    <CardComponent item={item} />
                </div>
                <div>
                    {bids.length === 0 ? <EmptyBidsComponent /> : <CurrentBidsComponent />}
                </div>
            </div>
        </>
    )
}