const Discord = require('discord.js');
const client = new Discord.Client();
const utils = require('./utils');
const {downloader} = require('./downloader');

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interaction', async interaction => {
	if (!interaction.isCommand()) return;
	if (interaction.commandName === 'ping') {
		await interaction.reply('Pong!');
	}
});

client.on('message', async message => {
	if (message.content === '!ping') {
        downloader('https://www.instagram.com/p/CPJfuEAJMrE/', function(links) {
            message.channel.send(links);
        });
	}
});

client.login(utils.TOKEN);