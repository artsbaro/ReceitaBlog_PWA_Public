
var blogService = require('./blogService.js');
var testPushService = require('./testPushService.js');
var serviceWorker = require('./swRegister.js');
var localization = require('./localization.js');
var notificationService = require('./notificationService.js');

//window events
let defferedPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    defferedPrompt = e;
    $('#install-container').show();
});

window.addEventListener('appinstalled', (evt) => {
    console.log('app foi adicionada na home screen! Yuhuu!');
});


if ('BackgroundFetchManager' in self) {
    console.log('this browser supports Background Fetch!');
}

window.pageEvents = {
    loadBlogPost: function (link) {
        console.log('loadBlogPost');
        blogService.loadBlogPost(link);
    },
    loadMoreBlogPosts: function () {
        blogService.loadMoreBlogPosts();
    },
    tryAddHomeScreen: function () {
        defferedPrompt.prompt();
        defferedPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome == 'accepted') {
                console.log('Usuário aceitou o A2HS prompt');
                $('#install-container').hide();
            }
            defferedPrompt = null;
        });
    },
    setBackgroundFetch: function (link) {
        navigator.serviceWorker.ready.then(async (swReg) => {

            //receive confirmation message 
            navigator.serviceWorker.addEventListener('message', event => {
                $('.download-response').html('msg : ' + event.data.msg + ' url: ' + event.data.url);
                console.log(event.data.msg, event.data.url);
            });

            var date = new Date();
            var timestamp = date.getTime();
            const bgFetch = await swReg.backgroundFetch.fetch(link,
                ['/Home/Post/?link=' + link]
                , {
                    downloadTotal: 2 * 1024 * 1024,
                    title: 'download post',
                    icons: [{
                        sizes: '72x72',
                        src: 'images/icons/icon-72x72.png',
                        type: 'image/png',
                    }]
                });

            bgFetch.addEventListener('progress', () => {
                if (!bgFetch.downloadTotal) return;

                const percent = Math.round(bgFetch.downloaded / bgFetch.downloadTotal * 100);
                console.log('Download progress: ' + percent + '%');
                console.log('Download status: ' + bgFetch.result);

                $('.download-start').hide();
                $('#status-download').show();
                $('#status-download > .progress > .progress-bar').css('width', percent + '%');

                if (bgFetch.result === 'success') {

                    $('#status-download > .text-success').show();
                }
            });
        });
    },
    requestPushPermission: function () {
        serviceWorker.requestPushPermission();
    },
    getGeolocation: function () {
        localization.getGeolocation();
    },
    vibrate: function () {
        function vibrate() {
            if ("vibrate" in navigator) {
                // vibration API supported
                navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;
                navigator.vibrate([1000]);
            }
        }
    },
    addRecipe: function () {

        notificationService.checkPushEnabled()
            .then(function (enabled) {

                console.log('notificações habilitadas: ' + enabled);

                let blogPost = {
                    title: document.getElementById('title').value,
                    shortDescription: document.getElementById('description').value,
                    ingredients: document.getElementById('ingredients').value,
                    preparationMode: document.getElementById('preparationMode').value,
                    image: document.getElementById('uploadPreview').src,
                    sendNotification: enabled
                };

                var blogPostRecipeUrl = '/recipe/';

                return fetch(blogPostRecipeUrl, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(blogPost)
                }).then(async () => {
                    document.getElementById('title').value = '';
                    document.getElementById('description').value = '';
                    document.getElementById('ingredients').value = '';
                    document.getElementById('preparationMode').value = '';
                    document.getElementById('uploadPreview').src = '';

                    await blogService.loadLatestBlogPosts();

                }).catch(error => console.error('Unable to add item.', error));

            });
    }
};
blogService.loadLatestBlogPosts();