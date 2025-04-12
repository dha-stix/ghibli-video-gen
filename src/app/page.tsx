"use client";
import { useState } from "react";
import Result from "./(components)/Result";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import GeneratingLoader from "./(components)/GeneratingLoader";

export default function Home() {
	const [generatingImage, setGeneratingImage] = useState(false);
	const [generatingVideo, setGeneratingVideo] = useState(false);
	const [triggerId, setTriggerId] = useState<string | null>(
		null
	);
	const [videoLink, setVideoLink] = useState<string | null>(
		null
	);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setGeneratingImage(true);
		const formData = new FormData(e.currentTarget);
		const image = formData.get("image") as File;
		const description = formData.get("description") as string;

		const base64Image = await new Promise<string>((resolve, reject) => {
			const reader = new FileReader();
			reader.onloadend = () => resolve(reader.result as string);
			reader.onerror = reject;
			reader.readAsDataURL(image);
		});

		const response = await fetch("/api", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				imageUrl: base64Image,
				videoEffect: description,
			}),
		});
		const data = await response.json();
		if (!data.trigger_id) return alert("Error: No trigger id found");
		setTriggerId(data.trigger_id);
		setGeneratingImage(false);
		setGeneratingVideo(true);
		await new Promise((resolve) => setTimeout(resolve, 150_000));
		await fetchVideo(data.trigger_id);
	};

	const fetchVideo = async (trigger_id: string) => {
		if (!triggerId && !trigger_id) return;
		const response = await fetch(`/api?triggerId=${trigger_id}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		const data = await response.json();
		setVideoLink(data.url);
		setGeneratingVideo(false);
	};

	if (videoLink && triggerId) {
		<Result link={videoLink} />;
	}

	return (
		<div className='flex flex-col w-full h-screen items-center justify-center'>
			{!videoLink && !generatingVideo && (
				<div  className='flex flex-col w-full h-screen items-center justify-center'>
					<h1 className='text-4xl font-bold text-center'>
						{" "}
						Ghibli Video Creator
					</h1>
					<p className='text-lg mt-4 text-center'>
						Create videos with Ghibli characters
					</p>

					<form
						className='mt-8 w-full max-w-2xl flex flex-col gap-4'
						onSubmit={handleSubmit}
					>
						<label htmlFor='image' className='text-lg font-semibold'>
							Upload your image
						</label>

						<Input
							size={400}
							type='file'
							id='image'
							name='image'
							accept='.png, .jpg, .jpeg'
							className='border border-gray-300 rounded  mb-4'
							required
						/>

						<label htmlFor='description' className='text-lg font-semibold'>
							Video Description
						</label>

						<Textarea
							id='description'
							rows={4}
							name='description'
							className='border border-gray-300 rounded p-2 mb-4'
							placeholder='Video of me smiling'
							required
						/>

						<Button
							size="lg"
							variant="secondary"
							type='submit'
							disabled={generatingImage || generatingVideo}
							className='bg-orange-500 text-lg text-white font-semibold p-4 rounded hover:bg-ogrange-600 transition duration-200 border-none'
						>
							{generatingImage
								? "Generating Ghibli Image..."
								: "Generate Video"}
						</Button>
					</form>
				</div>
			)}
			{videoLink && <Result link={videoLink} />}
			{generatingVideo && <GeneratingLoader />}
		</div>
	);
}