var images = document.getElementsByTagName("img");
var porgImageSrc = chrome.extension.getURL("imgs/porg-" + index + ".jpg");

for (var i = 0; i < images.length; i++) {
    var auxWidth = images[i].width;
    images[i].src = porgImageSrc;
    images[i].srcset = porgImageSrc;
    images[i].width = auxWidth;
}

