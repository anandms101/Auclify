import { pgTable, serial } from "drizzle-orm/pg-core";

export const bids = pgTable("auclify_bids", {
  id: serial("id").primaryKey(),
});
