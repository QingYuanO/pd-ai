'use client';

import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

import trpc from '../_trpc/client';

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const origin = searchParams.get('origin');

  const { data, isSuccess, isError, error, fetchStatus } = trpc.authCallback.useQuery(undefined, {
    // retry: true,
    // retryDelay: 500,
  });
  useEffect(() => {
    if (isSuccess && data?.success) {
      router.push(origin ? `/${origin}` : '/dashboard');
    }
  }, [isSuccess, data, router, origin]);

  // Handle error in useEffect
  useEffect(() => {
    if (isError && error.data?.code === 'UNAUTHORIZED') {
      router.push('/sign-in');
    }
  }, [isError, error, router]);

  return (
    <div className="mt-24 flex w-full justify-center">
      <div className="gep-2 flex flex-col items-center">
        <Loader2 className="size-8 animate-spin text-zinc-800" />
        <h3 className="text-xl font-semibold">正在登录帐户</h3>
        <p>自动跳转中...</p>
      </div>
    </div>
  );
}
