// components/QrTimerProgressBar.tsx
import React, { useEffect, useState } from "react";

const EXPIRY_TIME_MS = 5000;

interface QrTimerProgressBarProps {
    isVisible: boolean;
    refreshKey: number; // A prop that changes when the QR value is refreshed (every 5s)
    expiryTimeMs?: number; // Optional prop to customize expiry time
}

const QrTimerProgressBar: React.FC<QrTimerProgressBarProps> = ({
    isVisible,
    refreshKey,
    expiryTimeMs = EXPIRY_TIME_MS,
}) => {
    // progress is measured as a percentage (0 to 100)
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        if (!isVisible) {
            setProgress(100);
            return;
        }

        // --- Step 1: Reset and Start ---
        // When the QR is refreshed (refreshKey changes), reset the progress and timer.
        setProgress(100);
        const startTime = Date.now();

        // --- Step 2: Set up the Interval Timer (100ms update frequency) ---
        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;

            // Calculate the remaining percentage relative to the 7-second validity window.
            const remainingTimeRatio = 1 - (elapsed / expiryTimeMs);

            const newProgress = Math.max(0, remainingTimeRatio * 100);
            setProgress(newProgress);

            // --- Step 3: Stop at Expiry ---
            if (elapsed >= expiryTimeMs) {
                clearInterval(interval);
            }
        }, 100); // Update every 100ms for a smooth animation

        // Cleanup function to clear the interval on unmount or dependency change
        return () => clearInterval(interval);

    }, [isVisible, refreshKey]); // Crucial dependencies: Recalculate on visibility or new QR key

    if (!isVisible) {
        return null;
    }

    // --- Step 4: Determine Color based on Progress ---
    // Transition points: 50% (3.5s remaining) and 20% (1.4s remaining)
    const barColor =
        progress > 50
            ? "bg-green-500" // Plenty of time left
            : progress > 20
                ? "bg-yellow-500" // Getting low
                : "bg-red-500"; // Critical, almost expired

    return (
        // Add key={refreshKey} to force a complete re-render and reset of the bar element 
        // every time the QR is refreshed. This can sometimes fix visual glitches.
        <div
            key={refreshKey}
            className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden"
        >
            <div
                // Changed the transition class to target only the 'width' property smoothly
                // but keep the color instant. The duration-100 is for the smooth 100ms steps.
                className={`h-full ${barColor} transition-all duration-100 ease-linear`}
                style={{ width: `${progress}%` }}
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
            />
        </div>
    );
};

export default QrTimerProgressBar;