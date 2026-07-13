export function JsonLd({ data }: { data: unknown | null }) {
  if (!data) return null;
  return (
    <script
      type="application/ld+json"
      // schema.org payloads are server-built from our own data
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
