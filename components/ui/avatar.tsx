import * as AvatarPrimitive from '@rn-primitives/avatar';
import * as React from 'react';

import { cn } from '~/lib/utils';

const AvatarPrimitiveRoot = AvatarPrimitive.Root;
const AvatarPrimitiveImage = AvatarPrimitive.Image;
const AvatarPrimitiveFallback = AvatarPrimitive.Fallback;

type AvatarProps = React.ComponentPropsWithoutRef<typeof AvatarPrimitiveRoot> & { className?: string };
type AvatarImageProps = React.ComponentPropsWithoutRef<typeof AvatarPrimitiveImage> & { className?: string };
type AvatarFallbackProps = React.ComponentPropsWithoutRef<typeof AvatarPrimitiveFallback> & { className?: string };

const Avatar = React.forwardRef<React.ElementRef<typeof AvatarPrimitiveRoot>, AvatarProps>(
  ({ className, ...props }, ref) => (
    <AvatarPrimitiveRoot
      ref={ref}
      className={cn('relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full', className)}
      {...props}
    />
  )
);
Avatar.displayName = AvatarPrimitiveRoot.displayName;

const AvatarImage = React.forwardRef<React.ElementRef<typeof AvatarPrimitiveImage>, AvatarImageProps>(
  ({ className, ...props }, ref) => (
    <AvatarPrimitiveImage ref={ref} className={cn('aspect-square h-full w-full', className)} {...props} />
  )
);
AvatarImage.displayName = AvatarPrimitiveImage.displayName;

const AvatarFallback = React.forwardRef<React.ElementRef<typeof AvatarPrimitiveFallback>, AvatarFallbackProps>(
  ({ className, ...props }, ref) => (
    <AvatarPrimitiveFallback
      ref={ref}
      className={cn('flex h-full w-full items-center justify-center rounded-full bg-muted', className)}
      {...props}
    />
  )
);
AvatarFallback.displayName = AvatarPrimitiveFallback.displayName;

export { Avatar, AvatarFallback, AvatarImage };
