import Image from "next/image";

export default function Logo() {
  return (
    <a className="logo" href="/">
      <div className="hidden md:block full">
        <Image src="/logo/full.png" alt="Logo" width={320} height={40} />
      </div>
      <div className="md:hidden icon">
        <Image src="/logo/icon.png" alt="Logo" width={80} height={45} />
      </div>
    </a>
  );
}
