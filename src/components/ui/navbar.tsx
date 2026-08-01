import type { ComponentProps } from "react";

function join(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function NavbarRoot({ className, children, ...props }: ComponentProps<"nav">) {
  return (
    <nav
      className={join(
        "sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md",
        className,
      )}
      {...props}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
        {children}
      </div>
    </nav>
  );
}

function NavbarBrand({ className, ...props }: ComponentProps<"div">) {
  return <div className={join("flex items-center gap-2 font-semibold", className)} {...props} />;
}

function NavbarContent({ className, ...props }: ComponentProps<"div">) {
  return <div className={join("flex items-center gap-4", className)} {...props} />;
}

function NavbarItem({ className, ...props }: ComponentProps<"div">) {
  return <div className={join("flex items-center", className)} {...props} />;
}

export const Navbar = Object.assign(NavbarRoot, {
  Brand: NavbarBrand,
  Content: NavbarContent,
  Item: NavbarItem,
});
