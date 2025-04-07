'use client';

import { User as UserIcon } from "lucide-react";
import { User } from "../../shared/user";
import Image from 'next/image';

interface Props {
  user: User;
  size?: number;
}

export default function Avatar({ user, size }: Props) {
  const avatarSize = size ?? 32;

  if (user.details?.profileImage === undefined || user.details.profileImage.length === 0) {
    return (
      <div 
        className="bg-background flex items-center justify-center rounded-full w-full h-full"
        style={{ width: avatarSize, height: avatarSize }}
      >
        <UserIcon size={avatarSize / 2} className="text-textSecondary" />
      </div>
    );
  }

  return (
    <Image
      src={user.details?.profileImage}
      alt="Profile"
      width={avatarSize}
      height={avatarSize}
      className="w-full h-full object-cover"
    />
  );
}

