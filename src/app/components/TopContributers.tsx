"use client";

import { cn } from "@/lib/utils";
import { AnimatedList } from "@/components/magicui/animated-list";
import { users } from "@/models/server/config";
import { Models, Query } from "node-appwrite";
import { UserPrefs } from "@/store/Auth";
import convertDateToRelativeTime from "@/utils/relativeTime";
import { avatars } from "@/models/client/config";

const Notification = ({ user }: { user: Models.User<UserPrefs> }) => (
  <figure
    className={cn(
      "flex items-center gap-3 rounded-2xl p-4 transition-all duration-200 hover:scale-[103%]",
      "bg-white/70 dark:bg-zinc-900/60 backdrop-blur-md shadow-sm",
      "border border-gray-200/20 dark:border-white/10"
    )}
  >
    <img
      src={avatars.getInitials(user.name, 40, 40).href}
      alt={user.name}
      className="rounded-xl size-10 sm:size-12"
    />
    <div className="flex flex-col overflow-hidden">
      <span className="text-sm sm:text-base font-medium text-gray-900 dark:text-white truncate">
        {user.name}
      </span>
      <span className="text-xs text-gray-500">
        {convertDateToRelativeTime(new Date(user.$updatedAt))} ·{" "}
        {user.prefs.reputation} rep
      </span>
    </div>
  </figure>
);

export default async function TopContributors() {
  const topUsers = await users.list<UserPrefs>([Query.limit(10)]);

  return (
    <div className="relative flex w-full max-w-md flex-col gap-3 rounded-2xl bg-white/10 dark:bg-zinc-900/40 backdrop-blur-xl p-6 shadow-lg">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
        🌟 Top Contributors
      </h2>
      <AnimatedList>
        {topUsers.users.map((user) => (
          <Notification key={user.$id} user={user} />
        ))}
      </AnimatedList>
    </div>
  );
}
