"use server";

import { auth } from "@/app/api/auth/[...nextauth]/auth";
import { database } from "@/db/database";
import { bids, items } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { Knock } from "@knocklabs/node";
import { env } from "@/env";

const knock = new Knock(env.KNOCK_SECRET_KEY);

export async function createBidAction(itemId: number) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!session || !session.user || !session.user.id || !userId) {
    throw new Error("Please login!");
  }

  const item = await database.query.items.findFirst({
    where: eq(items.id, itemId),
  });

  if (!item) {
    throw new Error("Item not found!");
  }

  await database.insert(bids).values({
    userId: session.user.id,
    itemId: itemId,
    amount: item.currentBid + item.bidInterval,
    timestamp: new Date(),
  });

  await database
    .update(items)
    .set({
      currentBid: item.currentBid + item.bidInterval,
    })
    .where(eq(items.id, itemId));

  const currentBids = await database.query.bids.findMany({
    where: eq(bids.itemId, itemId),
    with: {
      user: true,
    },
  });

  const recipients: {
    id: string;
    name: string;
    email: string;
  }[] = [];

  for (const bid of currentBids) {
    if (
      bid.userId !== userId &&
      !recipients.find((recipient) => recipient.id === bid.userId)
    ) {
      recipients.push({
        id: bid.userId + "",
        name: bid.user.name ?? "Anonymous",
        email: bid.user.email,
      });
    }
  }

  if (recipients.length > 0) {
    await knock.workflows.trigger("user-placed-bid", {
      actor: {
        id: userId,
        name: session.user.name ?? "Anonymous",
        email: session.user.email,
        collection: "users",
      },
      recipients,
      data: {
        itemId,
        bidAmount: item.currentBid + item.bidInterval,
        itemName: item.name,
      },
    });
  }

  revalidatePath("/items/${itemId}");
}
