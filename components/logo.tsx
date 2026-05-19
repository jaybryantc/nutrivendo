import Image from "next/image";
import Link from "next/link";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center ${className}`}
      aria-label="NutriVendo home"
    >
      <Image
        src="/nutrivendo-logo.jpeg"
        alt=""
        width={300}
        height={200}
        priority
        className="h-15 w-auto"
      />
    </Link>
  );
}
