import type { ComponentProps } from "react";

function join(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function NavbarRoot({ className, ...props }: ComponentProps<"nav">) {
  return (
    <nav
      className={join(
        "flex items-center justify-between gap-4 border-b border-gray-200 px-6 py-4 dark:border-gray-800",
        className,
      )}
      {...props}
    />
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
