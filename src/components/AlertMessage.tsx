import { CircleAlert, CircleCheck, Info, X } from "lucide-react"

type AlertType = "error" | "success" | "info"

interface AlertMessageProps {
  type?: AlertType
  message: string
  onClose?: () => void
}

const config: Record<AlertType, { bg: string; border: string; text: string; icon: typeof CircleAlert }> = {
  error: {
    bg: "bg-red-500/20",
    border: "border-red-500/50",
    text: "text-red-200",
    icon: CircleAlert,
  },
  success: {
    bg: "bg-green-500/20",
    border: "border-green-500/50",
    text: "text-green-200",
    icon: CircleCheck,
  },
  info: {
    bg: "bg-blue-500/20",
    border: "border-blue-500/50",
    text: "text-blue-200",
    icon: Info,
  },
}

export default function AlertMessage({ type = "error", message, onClose }: AlertMessageProps) {
  if (!message) return null

  const { bg, border, text, icon: Icon } = config[type]

  return (
    <div className={`flex items-center gap-2 px-4 py-3 rounded-md border ${bg} ${border} ${text}`}>
      <Icon size={18} className="shrink-0" />
      <span className="text-sm flex-1">{message}</span>
      {onClose && (
        <button type="button" onClick={onClose} className="hover:opacity-70 transition">
          <X size={16} />
        </button>
      )}
    </div>
  )
}
