
"use client";

import type { ReactNode, MouseEvent } from "react";

type ProtectedMediaProps = {
  children: ReactNode;
  className?: string;
};

export default function ProtectedMedia({
  children,
  className,
}: ProtectedMediaProps) {
  const preventMediaAction = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div
      className={className}
      onContextMenu={preventMediaAction}
      onDragStart={preventMediaAction}
    >
      {children}
    </div>
  );
}
