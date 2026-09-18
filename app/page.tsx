import Image from "next/image";
import Link from "next/link";

function PandayoLogo() {
  return (
    <div className="flex items-center gap-3">
      <svg
        width="44"
        height="44"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Pandayo Coffee logo"
      >
        <path
          d="M11 38V10C11 7.79 12.79 6 15 6H25C32.18 6 37 10.03 37 16.5C37 22.97 32.18 27 25 27H19V38C19 40.21 17.21 42 15 42C12.79 42 11 40.21 11 38Z"
          fill="#F97316"
          stroke="#111111"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        <circle cx="25" cy="16.5" r="5" fill="#111111" />
      </svg>

      <span className="text-[21px] font-extrabold tracking-[-0.03em] text-black sm:text-[28px]">
        Pandayo Coffee
      </span>
    </div>
  );
}

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#fffdf9] text-[#111111]">
      {/* NAVBAR */}
      <header className="mx-auto max-w-[1500px] px-5 pt-5 sm:px-10 sm:pt-7">
        <nav className="flex items-center justify-between border-b border-black/10 pb-5">
          <Link href="/" aria-label="Pandayo Coffee home">
            <PandayoLogo />
          </Link>

          <div className="hidden items-center gap-10 text-[20px] font-medium text-black/75 md:flex">
            <a
              href="#menu"
              className="transition-colors duration-200 hover:text-[#f97316]"
            >
              Menu
            </a>

            <a
              href="#about"
              className="transition-colors duration-200 hover:text-[#f97316]"
            >
              About
            </a>

            <a
              href="#locations"
              className="transition-colors duration-200 hover:text-[#f97316]"
            >
              Locations
            </a>
          </div>

          <Link
            href="/login"
            className="rounded-xl bg-[#111111] px-4 py-3 text-[16px] font-bold text-[#f97316] transition-all duration-200 hover:bg-[#2a2a2a] sm:px-7 sm:py-4 sm:text-[18px]"
          >
            Login
          </Link>
        </nav>
      </header>

      {/* HERO */}
      <section
        id="about"
        className="mx-auto grid max-w-[1500px] gap-8 px-5 py-10 sm:px-10 sm:py-12 lg:grid-cols-[1fr_1.08fr] lg:items-center lg:gap-14 lg:py-12"
      >
        {/* LEFT */}
        <div className="pt-2 lg:pt-8">
          <div className="mb-7 h-1.5 w-[75px] rounded-full bg-[#f97316]" />

          <h1 className="max-w-[700px] text-[42px] font-extrabold leading-[1.02] tracking-[-0.045em] sm:text-[64px] lg:text-[72px]">
            Crafted coffee,
            <br />
            <span className="text-[#f97316]">made for your day</span>
          </h1>

          <p className="mt-6 max-w-[700px] text-[18px] leading-[1.55] text-black/55 sm:mt-8 sm:text-[22px] sm:leading-[1.65]">
            Pandayo Coffee — freshly roasted, locally sourced, and made with
            care. Visit us in Caloocan - Pandayo Coffee - Main Branch
          </p>
        </div>

        {/* RIGHT - ACTUAL IMAGE */}
        <div className="relative overflow-hidden rounded-[28px]">
          <Image
            src="/pandayo-hero-coffee.png"
            alt="Pandayo Coffee cup with latte art"
            width={707}
            height={334}
            sizes="(max-width: 1024px) 100vw, 52vw"
            priority
            className="h-[250px] w-full object-cover sm:h-[334px]"
          />
        </div>
      </section>

      {/* OPENING HOURS */}
      <section className="mx-auto max-w-[1500px] px-5 pb-10 sm:px-10 sm:pb-12">
        <div
          id="locations"
          className="flex min-h-[116px] flex-col items-center justify-center gap-4 rounded-[28px] bg-[#fbf7f0] p-5 sm:flex-row sm:gap-7 sm:p-0"
        >
          {/* CLOCK ICON */}
          <div className="flex h-14 w-14 items-center justify-center rounded-full border-[3px] border-[#f97316] text-[#f97316]">
            <svg
              width="27"
              height="27"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M12 7V12L15 14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* DIVIDER */}
          <div className="hidden h-12 w-px bg-black/15 sm:block" />

          {/* TEXT */}
          <div className="text-center sm:text-left">
            <a
              href="https://www.google.com/maps/search/?api=1&query=Villa%20CCO%20Covered%20Court%20Area%20D%20Brgy%20178%20Camarin%20Rd%20Caloocan%201400%20Metro%20Manila"
              target="_blank"
              rel="noreferrer"
              className="block max-w-[290px] text-[16px] font-bold leading-6 text-black transition-colors hover:text-[#f97316] sm:max-w-[600px] sm:text-[18px]"
            >
              Villa CCO Covered Court Area D Brgy, 178 Camarin Rd,
              Caloocan, 1400 Metro Manila
            </a>

            <p className="mt-1 text-[15px] text-black/50 sm:text-[17px]">
              Open daily, 7am – 9pm
            </p>
          </div>
        </div>
      </section>

      {/* INVISIBLE ANCHOR */}
      <section id="menu" className="sr-only">
        Menu
      </section>
    </main>
  );
}