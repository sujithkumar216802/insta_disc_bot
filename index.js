const Discord = require('discord.js');
const client = new Discord.Client();
const utils = require('./utils')

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interaction', async interaction => {
	if (!interaction.isCommand()) return;
	if (interaction.commandName === 'ping') {
		await interaction.reply('Pong!');
	}
});

client.on('message', message => {
	if (message.content === '!ping') {
		message.channel.send('Pong.');
	}
});

client.login(utils.TOKEN);