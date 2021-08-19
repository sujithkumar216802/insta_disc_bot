const axios = require('axios').default;

const videoHeader = "\"video_url\":\"";

const videoFooter = "\",";

const displayHeader = "\"display_url\":\"";

const displayFooter = "\",";

const jsonHeader = '<script type="application/ld+json">';

const jsonFooter = "</script>";

const extractor = async (url, callback) => {
    await axios.get(url)
        .then(response => {
            var html = response.data;
            var link = new Set();
            var temp = [];
            var temp2 = [];
            var descriptionString = "";
            var thumbnailUrl = "";
            var accountTagString = "";
            var videoFooterIndex = 0;
            var videoHeaderIndex = 0;
            var displayHeaderIndex = 0;
            var displayFooterIndex = 0;
            var jsonHeaderIndex = 0;
            var jsonFooterIndex = 0;
            var video = false;
            var display = false;
            var json = false;
            var jsonDict = {};
            var linkStartIndex, linkEndIndex;

            for (var i = 0; i < html.length; i++) {
                //VIDEO LINKS
                if (!video) {
                    if (videoHeader[videoHeaderIndex] == html[i])
                        videoHeaderIndex++;
                    else
                        videoHeaderIndex = 0;

                    if (videoHeader.length == videoHeaderIndex) {
                        video = true;
                        linkStartIndex = i + 1;
                    }
                } else {
                    if (videoFooter[videoFooterIndex] == html[i])
                        videoFooterIndex++;
                    else
                        videoFooterIndex = 0;

                    if (videoFooterIndex == videoFooter.length) {
                        linkEndIndex = i - videoFooter.length + 1;
                        temp.push({
                            'url': html.substring(linkStartIndex, linkEndIndex),
                            'type': 2
                        });
                        video = false;
                        videoHeaderIndex = 0;
                        videoFooterIndex = 0;
                    }
                }

                //Display LINKS
                if (!display) {
                    if (displayHeader[displayHeaderIndex] == html[i])
                        displayHeaderIndex++;
                    else
                        displayHeaderIndex = 0;

                    if (displayHeader.length == displayHeaderIndex) {
                        display = true;
                        linkStartIndex = i + 1;
                    }
                } else {
                    if (displayFooter[displayFooterIndex] == html[i])
                        displayFooterIndex++;
                    else
                        displayFooterIndex = 0;

                    if (displayFooterIndex == displayFooter.length) {
                        linkEndIndex = i - displayFooter.length + 1;
                        temp.push({
                            'url': html.substring(linkStartIndex, linkEndIndex),
                            'type': 1
                        });
                        display = false;
                        displayHeaderIndex = 0;
                        displayFooterIndex = 0;
                    }
                }

                //json LINKS
                if (!json) {
                    if (jsonHeader[jsonHeaderIndex] == html[i])
                        jsonHeaderIndex++;
                    else
                        jsonHeaderIndex = 0;

                    if (jsonHeader.length == jsonHeaderIndex) {
                        json = true;
                        linkStartIndex = i + 1;
                    }
                } else {
                    if (jsonFooter[jsonFooterIndex] == html[i])
                        jsonFooterIndex++;
                    else
                        jsonFooterIndex = 0;

                    if (jsonFooterIndex == jsonFooter.length) {
                        linkEndIndex = i - jsonFooter.length + 1;
                        jsonDict = JSON.parse(html.substring(linkStartIndex, linkEndIndex));
                        json = false;
                        jsonHeaderIndex = 0;
                        jsonFooterIndex = 0;
                    }
                }
            }

            thumbnailUrl = temp[0]['url'];
            if (temp.length > 1)
                temp.shift();

            for (var i = temp.length - 1; i >= 0; i--) {
                temp2.push(temp[i]);
                if (temp[i].type == 2) {
                    i--;
                }
            }
            temp2.reverse()

            temp2.forEach(e => link.add({
                'url': e['url'].replace(/\\u0026/g, '&'),
                'type': e['type']
            }));
            thumbnailUrl = thumbnailUrl.replace(/\\u0026/g, '&');

            if (jsonDict['caption'] != null) descriptionString = jsonDict['caption'];
            accountTagString = jsonDict['author']['alternateName'];

            callback({
                'links': Array.from(link),
                'description': descriptionString,
                'thumbnail_url': thumbnailUrl,
                'account_tag': accountTagString
            });
        })
        .catch(err => {
            console.log(err);
        });
}

module.exports = {
    extractor
}
