interface CapacityBarProps {
  used: number; // Represents the currently used capacity (e.g., allocation percentage)
  max: number;  // Represents the maximum capacity (e.g., 100%)
}

export default function CapacityBar({ used, max }: CapacityBarProps) {
  // Clamp max to 100 to ensure percentage calculation is relative to 100%
  const clampedMax = Math.min(max, 100);

  // Clamp used to not exceed clampedMax, preventing the bar from overflowing
  const clampedUsed = Math.min(used, clampedMax);

  // Calculate the percentage of used capacity
  const percentage = (clampedUsed / clampedMax) * 100;

  // Determine the color of the bar based on utilization
  // This provides quick visual feedback on capacity status
  const barColorClass =
    percentage > 90
      ? "bg-red-500" // High utilization, potentially over capacity
      : percentage > 70
      ? "bg-orange-500" // Medium-high utilization
      : "bg-blue-500"; // Normal utilization

  return (
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-6 relative overflow-hidden shadow-inner">
      {/* The progress bar itself */}
      <div
        className={`h-full rounded-full transition-all duration-500 ease-in-out ${barColorClass}`}
        style={{ width: `${percentage}%` }}
      ></div>
      {/* Optional: Text label inside the bar for clarity */}
      <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white dark:text-gray-100">
        {`${percentage.toFixed(0)}%`}
      </div>
    </div>
  );
}
