import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import dotenv from 'dotenv';
import formData from "form-data";
import Mailgun from "mailgun.js";

dotenv.config();

const USER_AGENT = "mailgun-mcp-server/1.0";

const mailgun = new Mailgun(formData);

const mg = mailgun.client({
    username: "api",
    key: process.env.MAILGUN_API_KEY! // Mailgun API key, this will be there so safe to use ! operator,
});

// Create server instance
const server = new McpServer({
    name: "mailgun-mcp-server",
    version: "1.0.0",
});

// Define EmailData schema
const EmailData = z.object({
    from: z.string().email(),
    to: z.string().email(),
    subject: z.string(),
    text: z.string().optional(),
    html: z.string().optional(),
    template: z.string().optional(),
});

async function sendEmail(data: z.infer<typeof EmailData>) {
    try {
        const response = await mg.messages.create(process.env.MAILGUN_SENDING_DOMAIN!, {
            from: data.from,
            to: [data.to],
            subject: data.subject,
            text: data.text || "",
            html: data.html || "",
        });

        return response;
    } catch (error) {
        throw new Error(`Failed to send email: ${error}`);
    }
}

server.tool(
    "send-email",
    "Send an email using Mailgun",
    {
        email: EmailData,
    },
    async ({ email }) => {
        try {
            const resp = await sendEmail(email);

            return {
                content: [
                    {
                        type: "text",
                        text: "Email sent successfully",
                    },
                ],
            };
        } catch (error) {
            return {
                content: [
                    {
                        type: "text",
                        text: "Failed to send email using mailgun",
                    },
                ],
            };
        }

    }
)

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Mailgun MCP Server running on stdio");
}

main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});