import Image from 'next/image';

export function Logo() {
  return (
    <div className="flex items-center justify-center p-2">
      <Image
        src="/icon.svg"
        alt="Planejei Logo"
        width={100}
        height={25}
        className="h-auto"
      />
    </div>
  );
}
