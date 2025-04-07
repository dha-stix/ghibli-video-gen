"use client";
export default function Home() {

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => { 
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const image = formData.get("image") as File;
    const description = formData.get("description") as string;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result as string;
      const response = await fetch("/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl: base64Image,
          videoEffect: description,
        }),
      })

      const data = await response.json();
      console.log(data);
    };
    reader.readAsDataURL(image);
  }

  return (
    <div className="flex flex-col w-full h-screen items-center justify-center">
      <h1 className="text-4xl font-bold text-center"> Ghibli Video Creator</h1>
      <p className="text-lg mt-4 text-center">
        Create videos with Ghibli characters
      </p>
      
      <form
        className="mt-8 w-full max-w-2xl flex flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <label htmlFor="image" className="text-lg font-semibold">
          Upload your image
        </label>

        <input
          type="file"
          id="image"
          name="image"
          accept=".png, .jpg, .jpeg"
          className="border border-gray-300 rounded p-2 mb-4"
          required
        />

        <label htmlFor="description" className="text-lg font-semibold">
          Video Description
        </label>

        <textarea
          id="description"
          rows={4}
          name="description"
          className="border border-gray-300 rounded p-2 mb-4"
          placeholder="Describe your video..."
          required
        />
        
        <button
          type="submit"
          className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition duration-200">
        Generate Video
        </button>

       </form>


    </div>
  );
}
