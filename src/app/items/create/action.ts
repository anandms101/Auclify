'use server';

import { database } from "@/db/database";
import { items } from "@/db/schema";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getSignedUrlForS3Object } from "@/lib/s3";

export async function createUploadUrl(key: string, type: string) {
  return await getSignedUrlForS3Object(key, type);
}

export async function createItemAction(formData: FormData){
    const session = await auth()
    
    if (!session || !session.user) {
        return null
    }
    
    const file = formData.get("image") as File;
    const uploadUrl = await createUploadUrl(file.name, file.type);
    const uploadFormData = new FormData();
    await fetch(uploadUrl, {
        method: "PUT",
        body: file,
    });
    await database.insert(items).values({
        name: formData.get("name") as string,
        userId: session?.user?.id!,
        startingPrice: Number(formData.get("startingPrice")),
        image: file.name,
    });
    redirect("/")
}