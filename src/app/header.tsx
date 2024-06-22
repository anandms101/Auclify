import Image from "next/image"
import { SignOut } from "@/components/sign-out";
import { auth } from "@/auth";
import { SignIn } from "@/components/sign-in";
import Link from "next/link";


export async function Header() {

    const session = await auth();

    return (
        <>
            <div className="bg-gray-100 ">
                <div className="container flex justify-between items-center max-h-20">
                    <div className="flex pt-4">
                        <Link href="/" >
                            <div className="hover:scale-110 transition-transform duration-300">
                                <Image src="/images/brand-logo/logo_transparent.png" alt="Auclify" width={130} height={130} />
                            </div>
                        </Link>
                    </div>
                    <div className="flex items-center">
                        <span className="pr-2">
                            {session?.user?.name}
                        </span>
                        <span>
                            {session ?
                                <SignOut />
                                :
                                <SignIn />
                            }
                        </span>
                    </div>
                </div>
            </div>
        </>
    )
}