import Image from "next/image";
import { SignOut } from "@/components/sign-out";
import { auth } from "@/auth";
import { SignIn } from "@/components/sign-in";
import Link from "next/link";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, NavigationMenuLink } from "@radix-ui/react-navigation-menu";
import { ModeToggle } from "@/components/mode-toggle";
import { navigationMenuTriggerStyle  } from "@/components/ui/navigation-menu"


export async function Header() {
    const session = await auth();

    return (
        <>
            {/* <div className="bg-gray-100 ">
                <div className="container flex justify-between items-center max-h-20">
                    <div className="flex pt-4 items-center">
                        <Link href="/">
                            <div className="hover:scale-110 transition-transform duration-300">
                                <Image
                                    src="/images/brand-logo/logo_transparent.png"
                                    alt="Auclify"
                                    width={130}
                                    height={130}
                                />
                            </div>
                        </Link>
                        <div>
                            <Link href="/items/create/">
                                Create Item
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <span className="pr-2">{session?.user?.name}</span>
                        <span>{session ? <SignOut /> : <SignIn />}</span>
                    </div>
                </div>
            </div> */}
            <NavigationMenu className="shadow-md">
                <NavigationMenuList className="flex flex-row items-center justify-between max-h-20">
                    <div className="flex flex-row items-center">
                        <NavigationMenuItem className="pt-4 hover:scale-110 transition-transform duration-300">
                            <Image
                                src="/images/brand-logo/logo_transparent.png"
                                alt="Auclify"
                                width={130}
                                height={130}
                            />
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <Link href="/items/create/" legacyBehavior passHref>
                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                Create an Item
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                    </div>
                    <div className="flex flex-row mr-4 items-center gap-4">
                        <span className="pr-2">{session?.user?.name}</span>
                        <span>{session ? <SignOut /> : <SignIn />}</span>
                        <span><ModeToggle ></ModeToggle></span>
                    </div>
                </NavigationMenuList>
            </NavigationMenu>
        </>
    );
}
