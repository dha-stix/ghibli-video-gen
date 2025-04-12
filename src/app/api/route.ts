import { NextRequest, NextResponse } from "next/server";

//👇🏻 -- Used within the GET route --
const cleanUrl = (url: string): string => {
	if (typeof url === "string") {
		return url.replace(/^"|"$/g, "");
	}
	return url;
};

//👇🏻 -- Create Each AI workflow --
export async function POST(req: NextRequest) {
	const { imageUrl, videoEffect } = await req.json();

	const options = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"X-API-KEY": process.env.EACH_AUTH_ID!,
		},
		body: JSON.stringify({
			parameters: {
				imageUrl: imageUrl,
				videoEffect: videoEffect,
			},
			webhook_url: "",
		}),
	};

	try {
		const response = await fetch(
			`https://flows.eachlabs.ai/api/v1/${process.env
				.EACH_WORKFLOW_ID!}/trigger`,
			options
		);
		const data = await response.json();
		return NextResponse.json(data, { status: 200 });
	} catch (err) {
		console.error(err);
		return NextResponse.json(
			{ err, status: "500", err_message: "Unable to trigger workflow" },
			{ status: 500 }
		);
	} finally {
		console.log("Trigger ID retrieval completed");
	}
}

//👇🏻 -- Retrieve the workflow result --
export async function GET(req: NextRequest) {
	const triggerId = req.nextUrl.searchParams.get("triggerId");

	const getOptions = {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			"X-API-KEY": process.env.EACH_AUTH_ID!,
		},
	};

	try {
		const response = await fetch(
			`https://flows.eachlabs.ai/api/v1/${process.env
				.EACH_WORKFLOW_ID!}/executions/${triggerId}`,
			getOptions
		);
		const data = await response.json();
		const url = cleanUrl(data.step_results[1].output);
		console.log({ url });
		return NextResponse.json({ url }, { status: 200 });
	} catch (err) {
		console.error(err);
		return NextResponse.json(
			{ err, status: "500", err_message: "Unable to get workflow" },
			{ status: 500 }
		);
	} finally {
		console.log("Request completed");
	}
}