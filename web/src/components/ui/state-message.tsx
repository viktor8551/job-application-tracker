type StateMessageVariant = "plain" | "card"

type StateMessageProps = {
  message: string
  variant?: StateMessageVariant
}

export function StateMessage({
  message,
  variant = "plain",
}: StateMessageProps) {
  if (variant === "card") {
    return (
      <div className="mt-5 border border-zinc-200 bg-white p-6 text-sm text-zinc-500">
        {message}
      </div>
    )
  }

  return (
    <p className="px-4 py-8 text-center text-sm text-zinc-500">
      {message}
    </p>
  )
}
