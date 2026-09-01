import { applyPageHref } from "@/lib/copy";

type Props = {
  href?: string;
  children: React.ReactNode;
  className?: string;
};

export function StampButton({
  href = applyPageHref,
  children,
  className = "",
}: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center rounded-none border-0 bg-yellow px-6 py-3 font-cond text-[13px] font-black uppercase tracking-[0.14em] text-green no-underline shadow-none transition-[transform,background-color] duration-150 hover:translate-x-0.5 hover:translate-y-0.5 ${className}`}
    >
      {children}
    </a>
  );
}
