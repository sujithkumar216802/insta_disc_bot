const { downloader } = require('../downloader');

module.exports = {
    name: 'download',
    description: 'Download posts from the instagram url',
    execute(message, args) {
        if (args.length == 0) {
            message.channel.send('No arguements(links) provided');
        }

        for (url in args) {
            if (args[url] == "https://www.instagram.com/reel/" ||
                args[url] == "https://www.instagram.com/p/" ||
                args[url] == "https://www.instagram.com/tv/" ||
                (!args[url].startsWith("https://www.instagram.com/tv/") && !args[url].startsWith("https://www.instagram.com/p/") && !args[url].startsWith("https://www.instagram.com/reel/"))||
                args[url].startsWith("https://www.instagram.com/stories")) {
                message.channel.send('link : ' + args[url] + ' will not be considered(not supported)');
                continue;
            }

            downloader(args[url], links => {
                console.log(links);
                message.channel.send(links);
            });
        }
    },
}