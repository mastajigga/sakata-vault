import { ReactNode } from "react";

export type DocCategory =
  | "feature"
  | "roadmap"
  | "architecture"
  | "strategy"
  | "operational";

export interface DocMeta {
  slug: string;
  title: string;
  subtitle: string;
  category: DocCategory;
  /** Numerical ordering inside the category */
  order: number;
  /** Approximate read time in minutes */
  readTime: number;
  /** Last update date in ISO format (YYYY-MM-DD) */
  updatedAt: string;
  /** Tags for filtering / classification */
  tags: string[];
  /** Author or maintainer */
  author?: string;
  /** Short summary shown on hub cards */
  summary: string;
}

export interface DocEntry extends DocMeta {
  /** Lazily loaded content component */
  Content: () => ReactNode;
}
