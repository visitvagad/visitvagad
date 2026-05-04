const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center py-24 space-y-6">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-t-primary rounded-full animate-spin"></div>
      </div>
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary animate-pulse">
        Unveiling Heritage...
      </p>
    </div>
  )
}

export default Loader