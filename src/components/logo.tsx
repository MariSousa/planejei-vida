import Image from 'next/image';

export function Logo() {
  return (
    <div className="flex items-center gap-2 text-lg font-semibold text-primary">
      <Image
        src="/icon.svg"
        alt="Planejei Logo"
        width={32}
        height={32}
        className="rounded-md"
      />
      <span className="font-headline">Planejei</span>
    </div>
  );
}
