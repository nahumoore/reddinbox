"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useRedditAccounts } from "@/stores/reddit-accounts";
import { generateRedditAuthUrl } from "@/utils/reddit/generate-auth-url";
import {
  IconAlertTriangle,
  IconApi,
  IconBrandReddit,
  IconCake,
  IconCoins,
  IconCrown,
  IconShieldCheck,
  IconStar,
  IconTrash,
  IconTrophy,
  IconUser,
  IconUsers,
  IconUserX,
} from "@tabler/icons-react";
import { useState } from "react";

interface ProfileStatsProps {
  totalKarma: number | null;
  linkKarma: number | null;
  commentKarma: number | null;
  coins: number | null;
  numFriends: number | null;
}

interface ProfileHeaderProps {
  name: string;
  iconImg: string | null;
  snoovatarImg: string | null;
  createdUtc: number | null;
  isActive: boolean;
}

interface AccountStatusProps {
  verified: boolean | null;
  hasVerifiedEmail: boolean | null;
  isEmployee: boolean | null;
  isModerator: boolean | null;
  isGold: boolean | null;
  isSuspended: boolean | null;
}

interface ActivityInfoProps {
  oauthScopes: string[] | null;
  lastApiCall: string | null;
}

function ProfileHeader({
  name,
  iconImg,
  snoovatarImg,
  createdUtc,
  isActive,
}: ProfileHeaderProps) {
  const avatarSrc = snoovatarImg || iconImg;
  const createdDate = createdUtc ? new Date(createdUtc * 1000) : null;

  return (
    <Card className="mb-6">
      <CardContent className="flex justify-between items-center">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Avatar className="size-20">
            <AvatarImage
              src={avatarSrc || undefined}
              alt={`${name}'s avatar`}
            />
            <AvatarFallback className="text-lg font-semibold">
              <IconUser className="size-8" />
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h1 className="text-2xl font-bold">u/{name}</h1>
            </div>

            {createdDate && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <IconCake className="size-4" />
                <span>
                  Cake day:{" "}
                  {createdDate.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            )}
          </div>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            const authUrl = generateRedditAuthUrl();
            window.location.href = authUrl;
          }}
        >
          Authenticate
          <IconBrandReddit />
        </Button>
      </CardContent>
    </Card>
  );
}

function ProfileStats({
  totalKarma,
  linkKarma,
  commentKarma,
  coins,
  numFriends,
}: ProfileStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <IconTrophy className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Karma
              </p>
              <p className="text-2xl font-bold">
                {totalKarma?.toLocaleString() ?? 0}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-secondary/50">
              <IconTrophy className="size-5 text-secondary-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Comment Karma
              </p>
              <p className="text-2xl font-bold">
                {commentKarma?.toLocaleString() ?? 0}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/20">
              <IconCoins className="size-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Coins</p>
              <p className="text-2xl font-bold">
                {coins?.toLocaleString() ?? 0}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
              <IconUsers className="size-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Friends
              </p>
              <p className="text-2xl font-bold">
                {numFriends?.toLocaleString() ?? 0}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AccountStatus({
  verified,
  hasVerifiedEmail,
  isEmployee,
  isModerator,
  isGold,
  isSuspended,
}: AccountStatusProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Account Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <IconShieldCheck
              className={`size-5 ${
                verified ? "text-green-600" : "text-muted-foreground"
              }`}
            />
            <div>
              <p className="font-medium">Verified Account</p>
              <p className="text-sm text-muted-foreground">
                {verified ? "Yes" : "No"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <IconShieldCheck
              className={`size-5 ${
                hasVerifiedEmail ? "text-green-600" : "text-muted-foreground"
              }`}
            />
            <div>
              <p className="font-medium">Verified Email</p>
              <p className="text-sm text-muted-foreground">
                {hasVerifiedEmail ? "Yes" : "No"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <IconStar
              className={`size-5 ${
                isEmployee ? "text-red-600" : "text-muted-foreground"
              }`}
            />
            <div>
              <p className="font-medium">Reddit Employee</p>
              <p className="text-sm text-muted-foreground">
                {isEmployee ? "Yes" : "No"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <IconShieldCheck
              className={`size-5 ${
                isModerator ? "text-green-600" : "text-muted-foreground"
              }`}
            />
            <div>
              <p className="font-medium">Moderator</p>
              <p className="text-sm text-muted-foreground">
                {isModerator ? "Yes" : "No"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <IconCrown
              className={`size-5 ${
                isGold ? "text-yellow-600" : "text-muted-foreground"
              }`}
            />
            <div>
              <p className="font-medium">Reddit Gold</p>
              <p className="text-sm text-muted-foreground">
                {isGold ? "Yes" : "No"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <IconUserX
              className={`size-5 ${
                isSuspended ? "text-red-600" : "text-muted-foreground"
              }`}
            />
            <div>
              <p className="font-medium">Suspended</p>
              <p className="text-sm text-muted-foreground">
                {isSuspended ? "Yes" : "No"}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ActivityInfo({ oauthScopes, lastApiCall }: ActivityInfoProps) {
  const lastCallDate = lastApiCall ? new Date(lastApiCall) : null;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Activity & Permissions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <IconApi className="size-4" />
            <p className="font-medium">OAuth Scopes</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {oauthScopes && oauthScopes.length > 0 ? (
              oauthScopes.map((scope, index) => (
                <Badge key={index} variant="outline">
                  {scope}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No OAuth scopes</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function DangerZone() {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleRemoveProfile = () => {
    // TODO: Implement profile removal logic
    console.log("Remove profile functionality to be implemented");
    setShowConfirmation(false);
  };

  return (
    <Card className="border-destructive/20">
      <CardHeader>
        <CardTitle className="text-destructive flex items-center gap-2">
          <IconAlertTriangle className="size-5" />
          Danger Zone
        </CardTitle>
        <CardDescription>
          <p className="text-sm text-muted-foreground">
            Once you remove your Reddit profile, all associated data will be
            permanently deleted. This action cannot be undone.
          </p>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {!showConfirmation ? (
            <Button
              variant="destructive"
              onClick={() => setShowConfirmation(true)}
              className="w-full sm:w-auto"
            >
              <IconTrash className="size-4 mr-2" />
              Remove Reddit Profile
            </Button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm font-medium text-destructive">
                Are you sure you want to remove your Reddit profile? This action
                cannot be undone.
              </p>
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  onClick={handleRemoveProfile}
                  className="flex-1 sm:flex-none"
                >
                  Yes, Remove Profile
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmation(false)}
                  className="flex-1 sm:flex-none"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Loading skeleton components
function ProfileHeaderSkeleton() {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Skeleton className="size-20 rounded-full" />
          <div className="flex-1 space-y-3">
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ProfileStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
      {Array.from({ length: 5 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Skeleton className="size-9 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-16" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function AccountStatusSkeleton() {
  return (
    <Card className="mb-6">
      <CardHeader>
        <Skeleton className="h-6 w-32" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="size-5" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-12" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ActivityInfoSkeleton() {
  return (
    <Card className="mb-6">
      <CardHeader>
        <Skeleton className="h-6 w-40" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Skeleton className="size-4" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-16" />
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Skeleton className="size-4" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-4 w-48" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function RedditProfilePage() {
  const { activeRedditAccount, isLoadingRedditAccounts } = useRedditAccounts();

  if (isLoadingRedditAccounts) {
    return (
      <div className="space-y-6 p-6">
        <ProfileHeaderSkeleton />
        <ProfileStatsSkeleton />
        <AccountStatusSkeleton />
        <ActivityInfoSkeleton />
      </div>
    );
  }

  if (!activeRedditAccount) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <IconUser className="size-16 text-muted-foreground mx-auto" />
          <h2 className="text-xl font-semibold">No Reddit Account Connected</h2>
          <p className="text-muted-foreground">
            Connect your Reddit account to view your profile information.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <ProfileHeader
        name={activeRedditAccount.name}
        iconImg={activeRedditAccount.icon_img}
        snoovatarImg={activeRedditAccount.snoovatar_img}
        createdUtc={activeRedditAccount.created_utc}
        isActive={activeRedditAccount.is_active}
      />

      <ProfileStats
        totalKarma={activeRedditAccount.total_karma}
        linkKarma={activeRedditAccount.link_karma}
        commentKarma={activeRedditAccount.comment_karma}
        coins={activeRedditAccount.coins}
        numFriends={activeRedditAccount.num_friends}
      />

      <AccountStatus
        verified={activeRedditAccount.verified}
        hasVerifiedEmail={activeRedditAccount.has_verified_email}
        isEmployee={activeRedditAccount.is_employee}
        isModerator={activeRedditAccount.is_moderator}
        isGold={activeRedditAccount.is_gold}
        isSuspended={activeRedditAccount.is_suspended}
      />

      <ActivityInfo
        oauthScopes={activeRedditAccount.oauth_scopes}
        lastApiCall={activeRedditAccount.last_api_call}
      />

      <DangerZone />
    </div>
  );
}
