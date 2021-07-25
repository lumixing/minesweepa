require("dotenv").config();
const { Client, Collection } = require("discord.js");
const { readdirSync } = require("fs");

const prefix = "-";

// initialize bot
const bot = new Client({
	fetchAllMembers: true,
	presence: {
		status: "online",
		activity: {
			name: `minesweepa | ${prefix}help`,
			type: "PLAYING"
		}
	}
});

bot.commands = new Collection();
bot.aliases = new Collection();

bot.games = {};

// search commands folder
const commandFiles = readdirSync("./commands").filter((file) => file.endsWith(".js"));

// foreach file in commands folder, initialize command and aliases if any
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	bot.commands.set(command.meta.name, command);

	if (command.meta.aliases.length) {
		command.meta.aliases.forEach((alias) => {
			bot.aliases.set(alias, command);
		});
	}
}

bot.once("ready", () => {
	console.log(`${bot.user.tag} is ready`);
});

bot.on("message", (msg) => {
	// if doesnt start with prefix or is a bot, dont respond
	if (!msg.content.startsWith(prefix) || msg.author.bot) {
		return;
	}

	// if isnt a server text channel, dont respond
	if (msg.channel.type !== "text") {
		return;
	}

	const args = msg.content.slice(prefix.length).trim().split(/ +/);
	const cmd = args.shift().toLowerCase();

	// if command doesnt exist, dont respond
	if (!bot.commands.has(cmd) && !bot.aliases.has(cmd)) {
		return;
	}

	try {
		const command = bot.commands.get(cmd) || bot.aliases.get(cmd);

		// if commands needs arguements and user didnt provide any, give error
		if (command.meta.argsRequired && !args.length) {
			msg.reply("this command need arguements");
			return;
		}

		// if all these checks pass, run the command
		command.run(msg, args);
	}
	catch (err) {
		error(msg, "an error occured, check the console");
		console.log(err);
	}
});

bot.login(process.env.TOKEN);