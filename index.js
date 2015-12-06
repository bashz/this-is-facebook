var self = require('sdk/self');
var tabs = require("sdk/tabs");
var urls = require("sdk/url");
var faceURL = require("sdk/simple-prefs").prefs.faceUrl;
require("sdk/simple-prefs").on("faceUrl", imageChanged);
var { attach, detach } = require('sdk/content/mod');
var { Style } = require('sdk/stylesheet/style');
var { ToggleButton } = require("sdk/ui/button/toggle");
var facebookTabs = [];

if(!urls.isValidURI(faceURL))
    faceURL = self.data.url("images/default.gif");

var style = Style({
    source: '.fbPhotosPhotoTagboxBase {'
            + 'background-size: 100% 110%;'
            + 'background-position: 20% 70%;'
            + 'background-image: url(' + faceURL + ');'
            + '}'
});

var button = ToggleButton({
    id: "tif",
    label: "This Is Facebook",
    icon: {
        "32": self.data.url("images/icons/icon-tif-32.png"),
        "64": self.data.url("images/icons/icon-tif-64.png")
    },
    onChange: onOff
});

tabs.on('ready', function onOpen(tab) {
    if(isFacebookTab(tab.url)){
        if(button.state(tab).checked){
            attach(style, tab);
        }
        facebookTabs.push(tab);
    }
});

function onOff(state) {
    if (state.checked) {
        for(var i = 0; i < facebookTabs.length; i++){
            attach(style, facebookTabs[i]);
        }
    }
    else {
        for(var i = 0; i < facebookTabs.length; i++){
            detach(style, facebookTabs[i]);
        }
    }
}

function imageChanged() {
    var faceURL = require("sdk/simple-prefs").prefs.faceUrl;
    if(!urls.isValidURI(faceURL))
        faceURL = self.data.url("images/default.gif");
    
    for (var i = 0; i < facebookTabs.length; i++) {
        detach(style, facebookTabs[i]);
    }
    style = Style({
        source: '.fbPhotosPhotoTagboxBase {'
                + 'background-size: 100% 110%;'
                + 'background-position: 20% 70%;'
                + 'background-image: url(' + faceURL + ');'
                + '}'
    });
    for(var i = 0; i < facebookTabs.length; i++){
        if(button.state(facebookTabs[i]).checked){
            attach(style, facebookTabs[i]);
        }
    }
}

function isFacebookTab(uri){
    if(urls.isValidURI(uri)){
        var url = urls.URL(uri);
        var splitedURL = url.hostname.split('.');
        if (splitedURL.slice(splitedURL.length - 2, splitedURL.length).join('.') === 'facebook.com')
            return true;
        else
            return false;
    }else 
        return false;
}
