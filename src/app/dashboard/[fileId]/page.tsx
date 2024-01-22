import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { db } from '@/db';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

import ChatWrapper from '@/components/ChatWrapper';
import PdfRenderer from '@/components/PdfRenderer';

interface PageProps {
  params: {
    fileId: string;
  };
}

export default async function Page(props: PageProps) {
  const { fileId } = props.params;

  const { getUser } = getKindeServerSession();

  const user = await getUser();

  if (!user || !user.id) {
    redirect(`/auth-callback?origin=dashboard/${fileId}`);
  }

  const file = await db.file.findFirst({
    where: {
      id: fileId,
      userId: user.id,
    },
  });

  if (!file) notFound();

  return (
    <div className="flex h-[calc(100vh-5.5rem)] flex-1 flex-col justify-around">
      <div className="mx-w-8xl mx-auto w-full grow lg:flex xl:px-2">
        {/* 左边内容 */}
        <div className="flex-1 xl:flex">
          <div className="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
            <PdfRenderer />
          </div>
        </div>
        {/* 右边内容 */}
        <div className="border-t flex-[0.75] shrink-0 border-gray-200 lg:w-96 lg:border-l lg:border-t-0">
          <ChatWrapper />
        </div>
      </div>
    </div>
  );
}
