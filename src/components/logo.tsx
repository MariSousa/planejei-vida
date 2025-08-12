'use client';

import Image from 'next/image';

export function Logo() {
  return (
    <div className="flex items-center justify-center gap-2 p-2 h-[58px]">
      <Image
        src="/planejei--icone.png"
        alt="Logo do Planejei"
        width={32}
        height={32}
        className="h-8 w-8"
      />
      <h1 className="text-2xl font-bold text-primary">Planejei</h1>
    </div>
  );
}
