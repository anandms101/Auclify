/* eslint-disable @next/next/no-async-client-component */
'use client';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createItemAction } from "./action";

export default async function Home() {
  return (
    <main className="container mx-auto py-12">
      <h1 className="text-4xl font-bold">Items</h1>
      <form className="flex flex-col border p-8 rounded-xl space-y-4 max-w-md"
        onSubmit={async (event) => {
          event.preventDefault()
          const form = event.currentTarget as HTMLFormElement;
          const formData = new FormData(form);
          await createItemAction(formData);
        }}>
        <Input required className="max-w-lg" name="name" placeholder="Name your item" />
        <Input required type="number" name="startingPrice" placeholder="Starting price" />
        <Input required type="file" name="image" />
        <Button className="self-end" type="submit">Post Item</Button>
      </form>
    </main>
  );
}
