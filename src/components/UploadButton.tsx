'use client';

import React, { useState } from 'react';

import { Button } from './ui/button';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';

export default function UploadButton() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog
      open={isOpen}
      onOpenChange={v => {
        if (!v) {
          setIsOpen(v);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(true)}>上传 PDF</Button>
      </DialogTrigger>
      <DialogContent>
        <p>上传 PDF</p>
      </DialogContent>
    </Dialog>
  );
}
