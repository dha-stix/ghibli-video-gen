"use client";
import { Loader2 } from "lucide-react";
import { useEffect, useState, useRef } from "react";

export default function GeneratingLoader() {
	const [timeLeft, setTimeLeft] = useState<number>(150); 
	const timerRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		if (timeLeft > 0) {
			timerRef.current = setInterval(() => {
				setTimeLeft((prev) => {
					if (prev <= 1) {
						clearInterval(timerRef.current!);
						return 0;
					}
					return prev - 1;
				});
			}, 1000);
		}

		// Cleanup on unmount or if timeLeft becomes 0
		return () => {
			if (timerRef.current) clearInterval(timerRef.current);
		};
	}, [timeLeft]);

	const formatTime = (seconds: number) => {
		const min = Math.floor(seconds / 60)
			.toString()
			.padStart(2, "0");
		const sec = (seconds % 60).toString().padStart(2, "0");
		return `${min}:${sec}`;
	};

	return (
		<>
			{timeLeft > 0 && (
				<div className='flex flex-col w-full h-screen items-center justify-center'>
					<Loader2 className='animate-spin text-orange-400' size={40} />
					<h2 className='text-xl font-bold text-orange-500 mt-4 text-center'>
						Your video will be ready in:
					</h2>

					<p className='text-3xl mt-2 text-center font-bold'>
						{formatTime(timeLeft)}
					</p>
				</div>
			)}
		</>
	);
}