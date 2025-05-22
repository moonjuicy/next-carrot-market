"use client";

import {
  ChatBubbleOvalLeftEllipsisIcon as OutlineChatIcon,
  HomeIcon as OutlineHomeIcon,
  NewspaperIcon as OutlineNewspaperIcon,
  UserIcon as OutlineUserIcon,
  VideoCameraIcon as OutlineVideoCameraIcon,
} from "@heroicons/react/24/outline";
import {
  ChatBubbleOvalLeftEllipsisIcon as SolidChatIcon,
  HomeIcon as SolidHomeIcon,
  NewspaperIcon as SolidNewspaperIcon,
  UserIcon as SolidUserIcon,
  VideoCameraIcon as SolidVideoCameraIcon,
} from "@heroicons/react/24/solid";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface TabItem {
  href: string;
  icon: {
    outline: typeof OutlineHomeIcon;
    solid: typeof SolidHomeIcon;
  };
  translationKey: string;
}

const tabs: TabItem[] = [
  {
    href: "/products",
    icon: {
      outline: OutlineHomeIcon,
      solid: SolidHomeIcon,
    },
    translationKey: "home",
  },
  {
    href: "/life",
    icon: {
      outline: OutlineNewspaperIcon,
      solid: SolidNewspaperIcon,
    },
    translationKey: "life",
  },
  {
    href: "/chat",
    icon: {
      outline: OutlineChatIcon,
      solid: SolidChatIcon,
    },
    translationKey: "chat",
  },
  {
    href: "/live",
    icon: {
      outline: OutlineVideoCameraIcon,
      solid: SolidVideoCameraIcon,
    },
    translationKey: "shopping",
  },
  {
    href: "/profile",
    icon: {
      outline: OutlineUserIcon,
      solid: SolidUserIcon,
    },
    translationKey: "myKarrot",
  },
];

export default function TabBar() {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("tabs");

  return (
    <div className="fixed bottom-0 w-full mx-auto max-w-screen-md grid grid-cols-5 border-neutral-600 border-t px-5 py-3 *:text-white">
      {tabs.map(({ href, icon: { outline: OutlineIcon, solid: SolidIcon }, translationKey }) => (
        <Link key={href} href={href} className="flex flex-col items-center gap-px">
          {pathname === `/${locale}${href}` ? (
            <SolidIcon className="w-7 h-7" />
          ) : (
            <OutlineIcon className="w-7 h-7" />
          )}
          <span>{t(translationKey)}</span>
        </Link>
      ))}
    </div>
  );
}
