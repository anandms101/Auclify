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
                <Card className="border-none shadow-none flex flex-col space-y-4 justify-center items-center">
                    <CardHeader>
                        <CardTitle>Bids placed</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {bids.map((bid) => (
                            <div key={bid.id}>
                                <span>{bid.bidder}</span>
                                <span>{bid.amount}</span>
                            </div>
                        ))}
                    </CardContent>
                    <CardFooter>
                        <span className="flex flex-col">
                            <Link href="/"><Button> Place a Bid </Button></Link>
                        </span>
                    </CardFooter>
                </Card>
            </>
        )
    }

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
                            <Link href="/"><Button> Place a Bid </Button></Link>
                        </span>
                    </CardFooter>
                </Card>
            </>
        )
    }

    return (
        <>
            <main className="grid grid-cols-2 gap-4 container mx-auto py-12" style={{gridTemplateColumns: '1fr 1.5fr'}}>
                <div>
                    <CardComponent item={item} />
                </div>
                <div>
                    {bids.length === 0 ? <EmptyBidsComponent /> : <CurrentBidsComponent />}
                </div>
            </main>
        </>
    )
}