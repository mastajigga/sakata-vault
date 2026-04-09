import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h2: ({ className, ...props }) => (
      <h2
        className={`font-display text-2xl font-semibold tracking-tight md:text-3xl ${className ?? ""}`}
        {...props}
      />
    ),
    h3: ({ className, ...props }) => (
      <h3
        className={`font-display text-xl font-semibold tracking-tight ${className ?? ""}`}
        {...props}
      />
    ),
    p: ({ className, ...props }) => (
      <p className={`text-base leading-8 text-[rgba(240,237,229,0.86)] ${className ?? ""}`} {...props} />
    ),
    ul: ({ className, ...props }) => <ul className={`space-y-2 ${className ?? ""}`} {...props} />,
    li: ({ className, ...props }) => <li className={`text-[rgba(240,237,229,0.82)] ${className ?? ""}`} {...props} />,
    blockquote: ({ className, ...props }) => (
      <blockquote className={`text-sm italic text-[rgba(212,221,215,0.82)] ${className ?? ""}`} {...props} />
    ),
    ...components,
  };
}
