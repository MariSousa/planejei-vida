import Image from 'next/image';

export function Logo() {
  return (
    <div className="flex items-center justify-center">
      <Image
        src="/icon.svg"
        alt="Planejei Logo"
        width={128}
        height={32}
        className="h-auto"
      />
    </div>
  );
}
