const axios = require('axios').default;

const videoHeader = "\"video_url\":\"";

const videoFooter = "\",";

const displayHeader = "\"display_url\":\"";

const displayFooter = "\",";

const downloader = async (url, callback) => {
    await axios.get(url)
        .then(response => {
            var html = response.data;
            var link = new Set();
            var temp = [];
            var temp2 = [];
            var videoFooterIndex = 0;
            var videoHeaderIndex = 0;
            var displayHeaderIndex = 0;
            var displayFooterIndex = 0;
            var video = false;
            var display = false;
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
            }

            console.log(' temp : ', temp);
            if (temp.length > 1)
                temp.shift();

            for (var i = temp.length - 1; i >= 0; i--) {
                temp2.push(temp[i]['url']);
                if (temp[i].type == 2) {
                    i--;
                }
            }
            temp2.reverse()

            temp2.forEach(e => link.add(e.replace(/\\u0026/g, '&')));
            callback([...link]);
        })
        .catch(err => {
            console.log(err);
        });
}

module.exports = {
    downloader
}
