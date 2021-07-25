require("dotenv").config();
const { Client, Collection } = require("discord.js");
const { readdirSync } = require("fs");

const prefix = "-";

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

const commandFiles = readdirSync("./commands").filter((file) => file.endsWith(".js"));

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
	if (!msg.content.startsWith(prefix) || msg.author.bot) {
		return;
	}

	if (msg.channel.type !== "text") {
		return;
	}

	const args = msg.content.slice(prefix.length).trim().split(/ +/);
	const cmd = args.shift().toLowerCase();

	if (!bot.commands.has(cmd) && !bot.aliases.has(cmd)) {
		return;
	}

	try {
		const command = bot.commands.get(cmd) || bot.aliases.get(cmd);

		const isOwner = msg.author.id === "235072703306924032";
		const isServerOwner = msg.author.id === msg.guild.ownerID;
		const isServerStaff = msg.member.roles.cache.find((role) => role.name === "Staff");

		if (command.meta.category === "dev" && !isOwner) {
			return;
		}

		if (command.meta.category === "moderation" && !isServerOwner && !isServerStaff) {
			return;
		}

		if (command.meta.argsRequired && !args.length) {
			msg.reply("this command need arguements");
			return;
		}

		command.run(msg, args);
	}
	catch (err) {
		error(msg, "an error occured, check the console");
		console.log(err);
	}
});

bot.login(process.env.TOKEN);