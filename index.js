import users from "./users.js";
import { sleep } from "./utils.js";
import WhatsappWeb from "whatsapp-web.js";

const sendMessage = async (client) => {
    console.log("Sending messages opening whatsappp .....");
    try {
        for (const user of users) {
            if (!user || !user.phoneNo || !user.name) continue;
            const phone = parseInt("91" + user.phoneNo);
            const name = user.name.toUpperCase().trim();

            // If you want you can remove the name and just send the message
            const message =
                "Hello *" +
                name +
                "*,\n\n " +
                `This is a test message. \n\n- This is a bullet point \n\n _This is italics_ \n\n *This is bold*` +
                " ";

            console.log("Sending message to :: ", phone);
            try {
                await client.sendMessage(`${phone}@c.us`, message);
                console.log(`Message sent to ${phone}`);
            } catch (error) {
                console.log(
                    `ERR [${phone}] :: `,
                    error.message,
                    "\n --------------------------------------------- \n"
                );
            }
            console.log("Sleeping for 1 second");
            await sleep(1);
        }
    } catch (error) {
        console.log("Error sending message:", error.message);
        throw error;
    } finally {
        console.log("All messages sent. Closing WhatsApp client.");
        // Close the WhatsApp client after sending all messages
        // You can remove this line if you want to keep the client open
        await client.destroy();
    }
};

const InitializeWhatsappClient = async () => {
    try {
        const client = new WhatsappWeb.Client({
            authStrategy: new WhatsappWeb.LocalAuth(),
            puppeteer: {
                headless: false,
            },
            webVersion: "2.2409.2",
            webVersionCache: {
                type: "remote",
                remotePath:
                    "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2409.2.html",
            },
        });

        client.on("qr", (qr) => {
            console.log("Login Expired, please login again!");
        });

        client.on("ready", async () => {
            console.log("Starting sending message ....");
            await sendMessage(client);
        });

        await client.initialize();
    } catch (error) {
        console.log("Error initializing Whatsapp client:", error.message);
        throw error;
    }
};

InitializeWhatsappClient();
