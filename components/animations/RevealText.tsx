import type { CSSProperties, ReactNode } from "react";

type Props = {
  as?: "h1" | "h2" | "h3" | "p" | "div";
  lines: ReactNode[];
  className?: string;
  /** ms before the first line starts */
  delay?: number;
  id?: string;
};

/** Line-by-line mask reveal. Text is real, crawlable markup; the motion is CSS-only. */
export function RevealText({ as: Tag = "h2", lines, className, delay = 0, id }: Props) {
  return (
    <Tag id={id} data-reveal="mask" className={className} style={{ "--d": `${delay}ms` } as CSSProperties}>
      {lines.map((line, i) => (
        <span className="line" key={i}>
          <span style={{ "--i": i } as CSSProperties}>{line}</span>
        </span>
      ))}
    </Tag>
  );
}
