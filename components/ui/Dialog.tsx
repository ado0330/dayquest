"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  /** Buttons shown at the bottom of the dialog. */
  actions: ReactNode;
  illustration?: ReactNode;
}

/**
 * Modal dialog built on the native <dialog> element, which provides focus
 * trapping, Escape-to-close and an inert background for free.
 */
export function Dialog({ open, onClose, title, children, actions, illustration }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) {
      try {
        el.showModal();
      } catch {
        el.setAttribute("open", "");
      }
    } else if (!open && el.open) {
      el.close();
    }
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        // Clicking the backdrop (the dialog element itself) closes it.
        if (e.target === ref.current) onClose();
      }}
      className="m-auto w-[min(92vw,30rem)] rounded-[2rem] border-[3px] border-ink bg-paper p-0 text-ink shadow-lift backdrop:bg-ink/45 backdrop:backdrop-blur-[2px] open:animate-pop"
    >
      {open && (
        <div className="flex flex-col items-center gap-4 p-6 text-center sm:p-8">
          {illustration}
          <h2 id={titleId} className="text-2xl font-semibold sm:text-3xl">
            {title}
          </h2>
          <div className="text-lg text-ink-soft">{children}</div>
          <div className="mt-2 flex w-full flex-col-reverse gap-3 sm:flex-row sm:justify-center">{actions}</div>
        </div>
      )}
    </dialog>
  );
}
