"use client";

import { notFound, useParams } from "next/navigation";
import { getDocBySlug } from "@/lib/admin-docs/registry";
import { DocLayout } from "@/lib/admin-docs/DocLayout";

export default function DocumentPage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : Array.isArray(params.slug) ? params.slug[0] : "";

  const doc = getDocBySlug(slug);
  if (!doc) {
    notFound();
  }

  const { Content, ...meta } = doc;

  return (
    <DocLayout meta={meta}>
      <Content />
    </DocLayout>
  );
}
