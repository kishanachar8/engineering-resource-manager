interface CapacityBarProps {
  used: number
  max: number
}

export default function CapacityBar({ used, max }: CapacityBarProps) {
  // Clamp max to 100
  const clampedMax = Math.min(max, 100)

  // Clamp used to not exceed clampedMax
  const clampedUsed = Math.min(used, clampedMax)

  const percentage = (clampedUsed / clampedMax) * 100

  return (
    <div className="w-full bg-gray-200 rounded-full h-4">
      <div
        className="bg-green-500 h-4 rounded-full transition-all duration-300 ease-in-out"
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
}
