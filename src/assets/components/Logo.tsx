export default function Logo() {
  return (
    <a className="logo" href="/">
      <div className="hidden md:block full">
        <img src="/logo/full.png" alt="Logo" className="w-full" />
      </div>
      <div className="md:hidden icon">
        <img src="/logo/icon.png" alt="Logo" className="w-full" />
      </div>
    </a>
  );
}
