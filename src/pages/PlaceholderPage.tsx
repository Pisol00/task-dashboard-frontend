export function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500">
        Page under construction
      </div>
    </div>
  )
}
