import { Button } from "@/components/ui/button";

export default function Result({ link }: { link: string }) {
	return (
		<div className='flex flex-col w-full h-screen items-center justify-center'>
			<h2 className='text-2xl font-bold text-orange-500 mt-4 text-center'>
				Your video is ready!
			</h2>

			<section className='flex flex-col items-center space-y-5 mt-4'>
				<video
					className='rounded-lg shadow-lg'
					src={link}
					controls
					autoPlay
					loop
					muted
					style={{ width: "100%", maxWidth: "600px" }}
				/>
				<Button
					variant='destructive'
					className='text-orange-500 border-[1px] font-semibold p-4 rounded hover:text-orange-600 transition duration-200 mt-4'
					onClick={() => window.location.reload()}
				>
					Generate another video
				</Button>
			</section>
		</div>
	);
}