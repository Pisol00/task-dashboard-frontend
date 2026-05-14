export function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold tracking-tight text-primary">{title}</h2>
      <div className="surface-base border-subtle text-muted rounded-2xl border border-dashed p-16 text-center">
        Page under construction
      </div>
    </div>
  )
}
