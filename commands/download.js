const { extractor } = require('../extractor');

module.exports = {
    name: 'download',
    description: 'Download posts from the instagram url',
    execute(message, args) {
        if (args.length == 0) {
            message.channel.send('No arguements(links) provided');
        }

        for (url of args) {
            if (url == "https://www.instagram.com/reel/" ||
                url == "https://www.instagram.com/p/" ||
                url == "https://www.instagram.com/tv/" ||
                (!url.startsWith("https://www.instagram.com/tv/") && !url.startsWith("https://www.instagram.com/p/") && !url.startsWith("https://www.instagram.com/reel/")) ||
                url.startsWith("https://www.instagram.com/stories")) {
                message.channel.send('link : ' + url + ' will not be considered(not supported)');
                continue;
            }

            extractor(url, values => {
                console.log(values);

                links = values['links'];

                var index = 0;

                for (link of links) {
                    index++;
                    if (link['type'] == 1) {
                        const photoEmbed = {
                            color: 0x0000ff,
                            title: index + '/' + links.length,
                            url: link['url'],
                            author: {
                                name: values['account_tag'],
                            },
                            thumbnail: {
                                url: values['thumbnail_url']
                            },
                            description: values['description'],
                            image: {
                                url: link['url'],
                            },
                            timestamp: new Date(),
                            footer: {
                                text: 'instabot',
                            },
                        };
                        message.channel.send({ embed: photoEmbed });
                    }
                    else {
                        console.log('\n\n\n\n\n\n link : ' + link['url']);
                        const videoEmbed = {
                            color: 0x0000ff,
                            title: index + '/' + links.length,
                            url: link['url'],
                            author: {
                                name: values['account_tag'],
                            },
                            thumbnail: {
                                url: values['thumbnail_url']
                            },
                            description: values['description'],
                            video: {
                                url: link['url']
                            },
                            timestamp: new Date(),
                            footer: {
                                text: 'instabot',
                            },
                        };
                        message.channel.send({
                            embed: videoEmbed
                        }).catch(console.error);
                    }
                }
            });
        }
    },
}