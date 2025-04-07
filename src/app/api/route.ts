import { NextRequest, NextResponse } from "next/server";
// import Each from '@eachlabs/aiflow';
import { Each } from '@eachlabs/aiflow';

const each = new Each ({
    auth: process.env.EACH_AUTH_ID!,
});
    
export async function POST(req: NextRequest) {
    const { imageUrl, videoEffect } = await req.json();
    // const flows = await each.flow.list();
    // console.log({ imageUrl, videoEffect, flows });

    const triggerId = await each.flow.trigger(process.env.EACH_WORKFLOW_ID as string, {
        parameters: { "imageUrl": imageUrl, "videoEffect": videoEffect },
        webhook_url: ""

    });

    console.log({id: triggerId})

    return NextResponse.json(
		{ message: "Fetch complete" },
		{ status: 200 }
	);

}
