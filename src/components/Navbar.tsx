import React from 'react';
import Link from 'next/link';
import { getKindeServerSession, LoginLink, RegisterLink } from '@kinde-oss/kinde-auth-nextjs/server';
import { ArrowRight } from 'lucide-react';

import MaxWidthWrap from './MaxWidthWrap';
import { buttonVariants } from './ui/button';
import UserAccountNav from './UserAccountNav';

export default async function Navbar() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  return (
    <nav className="sticky inset-x-0 top-0 z-30 h-14 w-full border-b border-gray-200 bg-white/50 backdrop-blur-lg transition-all">
      <MaxWidthWrap>
        <div className="flex h-14 items-center justify-between border-b border-zinc-200">
          <Link href="/" className="z-40 flex font-semibold">
            PDAI
          </Link>

          {/* TODO add mobile navbar */}

          <div className="hidden items-center space-x-4 sm:flex">
            {!user ? (
              <>
                {/* <Link href="/pricing" className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
                  价格
                </Link> */}
                <LoginLink className={buttonVariants({ variant: 'ghost', size: 'sm' })}>登录</LoginLink>
                <RegisterLink className={buttonVariants({ size: 'sm' })}>
                  开始 <ArrowRight className="ml-1.5 size-5" />
                </RegisterLink>
              </>
            ) : (
              <>
                <Link
                  href="/dashboard"
                  className={buttonVariants({
                    variant: 'ghost',
                    size: 'sm',
                  })}
                >
                  Dashboard
                </Link>
                <UserAccountNav
                  name={!user.given_name || !user.family_name ? 'Your Account' : `${user.given_name} ${user.family_name}`}
                  email={user.email ?? ''}
                  imageUrl={user.picture ?? ''}
                />
              </>
            )}
          </div>
        </div>
      </MaxWidthWrap>
    </nav>
  );
}
