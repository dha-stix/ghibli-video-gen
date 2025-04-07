declare module '@eachlabs/aiflow' {
    export class Each {
        constructor(config: { auth: string });
        flow: {
            trigger: (id: string, options: { parameters: Record<string, string>, webhook_url: string }) => Promise<string>;
        };
    }
}