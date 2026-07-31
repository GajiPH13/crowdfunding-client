import { ToastQueue } from "@heroui/react";
import type { ReactNode } from "react";

// HeroUI's default toast queue serializes updates through
// document.startViewTransition + flushSync, which never actually flushes in
// this app (Next 16 dev, Turbopack) — toasts got queued but never rendered.
// Bypassing wrapUpdate fixes it.
export const toastQueue = new ToastQueue({ wrapUpdate: (fn) => fn() });

type ToastVariant = "default" | "success" | "danger" | "warning" | "accent";

interface ToastOptions {
  description?: ReactNode;
  timeout?: number;
}

function addToast(title: ReactNode, variant: ToastVariant, options?: ToastOptions) {
  return toastQueue.add(
    { title, description: options?.description, variant },
    { timeout: options?.timeout },
  );
}

export const toast = {
  success: (title: ReactNode, options?: ToastOptions) => addToast(title, "success", options),
  danger: (title: ReactNode, options?: ToastOptions) => addToast(title, "danger", options),
  warning: (title: ReactNode, options?: ToastOptions) => addToast(title, "warning", options),
  info: (title: ReactNode, options?: ToastOptions) => addToast(title, "accent", options),
};
