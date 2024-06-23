import Image from "next/image";
import { SignOut } from "@/components/sign-out";
import { auth } from "@/auth";
import { SignIn } from "@/components/sign-in";
import Link from "next/link";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, NavigationMenuLink } from "@radix-ui/react-navigation-menu";
import { ModeToggle } from "@/components/mode-toggle";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"


export async function Header() {
    const session = await auth();

    return (
        <>
            <NavigationMenu className="shadow-md">
                <NavigationMenuList className="flex flex-row items-center justify-between max-h-20">
                    <div className="flex flex-row items-center">
                        <NavigationMenuItem className="pt-4 hover:scale-110 transition-transform duration-300">
                            <Link href="/">
                                <Image
                                    src="/images/brand-logo/logo_transparent.png"
                                    alt="Auclify"
                                    width={130}
                                    height={130}
                                />
                            </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <Link href="/" legacyBehavior passHref>
                                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                    Available Item(s)
                                </NavigationMenuLink>
                            </Link>
                            <Link href="/items/create/" legacyBehavior passHref>
                                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                    Sell an Item
                                </NavigationMenuLink>
                            </Link>
                            <Link href="/items/myItems/" legacyBehavior passHref>
                                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                    My Item(s)
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
