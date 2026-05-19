export default function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:inline-flex focus:h-10 focus:items-center focus:rounded-full focus:bg-brand-600 focus:px-4 focus:text-sm focus:font-medium focus:text-white focus:shadow-lg"
    >
      Skip to main content
    </a>
  );
}
