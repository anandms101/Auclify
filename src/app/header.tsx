"use client";

import Image from "next/image";
import Link from "next/link";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, NavigationMenuLink } from "@radix-ui/react-navigation-menu";
import { ModeToggle } from "@/components/mode-toggle";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"
import { useRef, useState } from "react";
import {
    NotificationCell,
    NotificationFeedPopover,
    NotificationIconButton,
} from "@knocklabs/react";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { IndianRupee } from "lucide-react";


export function Header() {
    const [isVisible, setIsVisible] = useState(false);
    const notifButtonRef = useRef(null);
    const session = useSession();

    const userId = session?.data?.user?.id;

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
                            {userId ? (
                                <>
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
                                </>
                            ) : null}
                        </NavigationMenuItem>
                    </div>
                    <div className="flex flex-row mr-4 items-center gap-4">
                        {userId ? (<>
                            <NotificationIconButton ref={notifButtonRef}
                                onClick={(e) => setIsVisible(!isVisible)} />
                            <NotificationFeedPopover
                                buttonRef={notifButtonRef}
                                isVisible={isVisible}
                                onClose={() => setIsVisible(false)}
                                renderItem={({ item, ...props }) => (
                                    <NotificationCell {...props} item={item}>
                                        <div className="rounded-xl">
                                            <Link
                                                className="text-blue-400 hover:text=blue-500"
                                                onClick={() => {
                                                    setIsVisible(false);
                                                }}
                                                href={`/items/${item?.data?.itemId}`}
                                            >
                                                Someone outbidded you on{" "}
                                                <span className="font-bold">{item?.data?.itemName}</span>{" "}
                                                by <IndianRupee />{item?.data?.bidAmount}
                                            </Link>
                                        </div>
                                    </NotificationCell>
                                )}
                            />
                        </>
                        ) : null}
                        <span className="pr-2">{session?.data?.user?.name}</span>
                        <span>
                            {userId ? (
                                <Button
                                    onClick={() =>
                                        signOut({
                                            callbackUrl: "/",
                                        })
                                    }
                                >
                                    Sign Out
                                </Button>
                            ) : (
                                <Button type="submit" onClick={() => signIn()}>
                                    Sign In
                                </Button>
                            )}
                        </span>
                        <span><ModeToggle ></ModeToggle></span>
                    </div>
                </NavigationMenuList>
            </NavigationMenu>
        </>
    );
}
