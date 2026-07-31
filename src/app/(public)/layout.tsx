import { SiteNavbar } from "@/components/site-navbar";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <SiteNavbar />
      <div className="flex-1">{children}</div>
    </div>
  );
}
