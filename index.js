const fs = require('fs');
const Discord = require('discord.js');
const utils = require('./utils');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

// client.on('interaction', async interaction => {
// 	if (!interaction.isCommand()) return;
// 	if (interaction.commandName === 'ping') {
// 		await interaction.reply('Pong!');
// 	}
// });

client.on('message', async message => {
	if (!message.content.startsWith(utils.PREFIX) || message.author.bot) return;

	const args = message.content.slice(utils.PREFIX.length).trim().split(/ +/);
	console.log(args)
	const commandName = args.shift().toLowerCase();

	if (!client.commands.has(commandName)) return;

	try {
		client.commands.get(commandName).execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});

client.login(utils.TOKEN);