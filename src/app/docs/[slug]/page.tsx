"use client";

/**
 * PUBLIC mirror of /admin/help/documentation/[slug] used for:
 * 1. PDF pre-generation via Playwright (no admin auth needed)
 * 2. Sharing a doc URL with collaborators / partners
 *
 * Same content as the admin route, same layout — just no auth gate.
 */

import { notFound, useParams } from "next/navigation";
import { getDocBySlug } from "@/lib/admin-docs/registry";
import { DocLayout } from "@/lib/admin-docs/DocLayout";

export default function PublicDocumentPage() {
  const params = useParams();
  const slug =
    typeof params.slug === "string"
      ? params.slug
      : Array.isArray(params.slug)
      ? params.slug[0]
      : "";

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
