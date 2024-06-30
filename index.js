const http = require('http');

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.end(`
    <html>
      <head>
        <title>Your Web View</title>
      </head>
      <body style="margin: 0; padding: 0;">
        <iframe width="100%" height="100%" src="https://axocoder.vercel.app/" frameborder="0" allowfullscreen></iframe>
      </body>
    </html>`);
});

server.listen(3000, () => {
  console.log('Server Online because of Axo Coder ✅!!');
});
const {
  Client,
  CustomStatus,
  WebhookClient,
  Collection,
} = require("discord.js-selfbot-v13");
const config = require("./config.js");
const client = new Client({
  checkUpdate: false,
});
require("@colors/colors");

client.help = new (require("./function"))();

client.on("ready", async () => {
  // ready
  console.log(`>>> ${client.user.displayName} is ready!`.green);
  await client.help.setup();

  // channel or slash
  client.channel = await client.channels
    .fetch(config.channel)
    .catch((e) => null);
  if (!client.channel) {
    return client.help.warn("Inavlid channel.");
  }
  client.send = async function (cmd) {
    client.channel
      .send(cmd)
      .catch((e) => client.help.warn("Failed to send msg to channel"))
      .then(async (e) => {
        client.help.log(`Sent command ${cmd}`);
        await client.help.save("cmds", 1, true);
      });
    return await client.help.wait(2);
  };

  // setup
  console.log("");
  console.log(">>> starting auto bot....".yellow);
  await setup();
});

client.on("messageCreate", require("./events/create"));
client.on("messageUpdate", require("./events/update"));

async function setup() {
  const { channel, send, help } = client;
  if (!channel) return help.warn(">>> No channel found.");

  for (let i = 0; i < Infinity; i++) {
    if (!help.isOkay) continue;

    await send("owo hunt");
    await send("owo battle");
    await send("owo sell all");
    await send("owo inv");

    // daily
    if (Date.now() - client.help.oldDb.daily > 1000 * 60 * 60 * 24) {
      await send("owo daily");
      await client.help.save("daily", Date.now());
    }

    // cf
    if (config.cf.enable) {
      let am = config.cf.amount;
      if (am < client.help.oldDb.cash) {
        await send(`owo cf ${am}`);
        await client.help.save("cash", client.help.oldDb.cash - am);
      }
    }

    console.log("");
    await help.wait(40);
  }
}

client.login(config.token);
