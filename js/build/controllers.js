angular.module('app.controllers', [])


// Controller for global app
.controller('MainCtrl', function($scope, Menu, API, Config) {

    $scope.client = Config.client;

    $scope.leftButtons = [
        {
            type: 'button-icon button-clear',
            content: '<i class="icon ion-navicon"></i>',
            tap: function(e) {
                $scope.sideMenuController.toggleLeft();
            }
        }
    ];

    $scope.menu = Menu.state();

    $scope.toggle = function() {
        $scope.sideMenuController.toggleLeft();
    };

    $scope.logout = function() {
        $scope.toggle();
        API.logout();
    };

})

// Controller for landing page to handle persistent login
.controller('LandingCtrl', function($scope, $state, Header, Menu, API) {

    //alert(localStorage['auth']);
    if (localStorage['auth'] == 'true') {
        $scope.leftButtons = Header.button('ion-ios7-arrow-back', 'landing', 'Cancel');
        $scope.user = {};
        $scope.user.id = localStorage['id'];

        data = JSON.parse(localStorage['data']);
        Menu.show();
        API.auth = true;
        API.user = data.TheUser;
        API.audios = data.MP3s;
        API.videos = data.Videos;
        API.messages = data.Posts;
        API.intro = data.Resources.message;
        API.resources = data.Resources.Links;
        localStorage['id'] = $scope.user.id;
        localStorage['password'] = $scope.user.password;
        localStorage['auth'] = 'true';
        localStorage['data'] = JSON.stringify(data);
        $state.go('welcome');
    }
})

// Controller for login
.controller('LoginCtrl', function($scope, $state, Header, Menu, API) {

    if (API.auth) {
        $state.go('resources');
    }

    $scope.leftButtons = Header.button('ion-ios7-arrow-back', 'landing', 'Cancel');
    $scope.user = {};
    $scope.user.id = localStorage['id'];
	alert($scope.user.id);
	alert($scope.user.password);
	
    $scope.submit = function() {

        API.login($scope.user)
            .success(function(data) {
                if (typeof data.status != 'undefined' && data.status.error) {
                    $scope.message = data.status.message;
                } else {
                    Menu.show();
                    API.auth = true;
                    API.user = data.TheUser;
                    API.audios = data.MP3s;
                    API.videos = data.Videos;
                    API.messages = data.Posts;
                    API.intro = data.Resources.message;
                    API.resources = data.Resources.Links;
                    localStorage['id'] = $scope.user.id;
                    localStorage['password'] = $scope.user.password;
                    localStorage['auth'] = 'true';
                    localStorage['data'] = JSON.stringify(data);
                    $state.go('welcome');
                }
            })
            .error(function(data) {
                $scope.message = 'Unauthorized';
            });

    };

})

// Controller for welcome page
.controller('WelcomeCtrl', function($scope, API) {

    $scope.intro = API.intro;

})

// Controller for resources
.controller('ResourceCtrl', function($scope, API) {

    $scope.resources = API.resources;

})

// Controller for resources
.controller('PublicCtrl', function($scope, API, Header) {

    $scope.leftButtons = Header.button('ion-ios7-arrow-back', 'landing', 'Back');

    API.publicMessage()
        .success(function(data) {
            $scope.url = data.message;
        });

})

// Controller for video resource
.controller('VideosIndexCtrl', function($scope, API) {

    $scope.videos = API.videos;

})

// Controller for single video
.controller('VideosSingleCtrl', function($scope, $stateParams, Header, API, Find) {

    $scope.leftButtons = Header.button('ion-ios7-arrow-back', 'videos-index', 'Back');
    $scope.video = Find.ById(API.videos, $stateParams.id);

})

// Controller for audio resource
.controller('AudiosIndexCtrl', function($scope, API) {

    $scope.audios = API.audios;

})

// Controller for single audio
.controller('AudiosSingleCtrl', function($scope, $stateParams, Header, API, Find, $q, $http, FileService, $window, $timeout, $ionicLoading) {
	
    $scope.leftButtons = Header.button('ion-ios7-arrow-back', 'audios-index', 'Back');
    $scope.audio = Find.ById(API.audios, $stateParams.id);
    var url = $scope.audio.url; 
	console.log(url);
    var rootPath;

    var filename = url.substring(url.lastIndexOf('/')+1);
	//alert(localStorage[filename+'pause']);
	if(localStorage[filename+'pause'] != undefined){
       //angular.element(documqent.querySelector('audio')).scope().mediaPlayer.seek(localStorage[filename+'pause']);
	   console.log("got");
    }
    var destDirectory;

    /*window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
            rootPath = fileSystem.root.toURL();
            fileSystem.root.getDirectory("ProAllianceAudios", {create: true}, function(dirEntry){ destDirectory = dirEntry; });
        }, getFSFail);
*/
    $scope.audioPlaylist = [
        {
          src: url,
          type: 'audio/mp3'
        }
    ];

	$scope.$watch('mediaPlayer.currentTime', function() {
		alert("changed");
	});
    $scope.btnText = null;


    $scope.playpause = function(mediaPlayer){
		console.log(mediaPlayer.currentTime);
		console.log(mediaPlayer.duration);
        if(mediaPlayer.network == undefined && $scope.downloadBtnLable != 1){
            return;
        }
        
        if(mediaPlayer.playing){
            localStorage[filename+'pause'] = mediaPlayer.currentTime;
            mediaPlayer.playPause();
        }
        else{
            localStorage.removeItem(filename+'pause');
            mediaPlayer.playPause();
        }
    }
	
	
    $scope.backPlay = function(mediaPlayer){
		if(mediaPlayer.currentTime - 30 < 0) {
			mediaPlayer.seek(0);
		}else{
			mediaPlayer.seek(mediaPlayer.currentTime - 30);
		}
    }
	
	$scope.forwardPlay = function(mediaPlayer){
		if(mediaPlayer.currentTime + 30 > mediaPlayer.duration) {
			mediaPlayer.seek(mediaPlayer.duration);
		}else{
			mediaPlayer.seek(mediaPlayer.currentTime + 30);
		}
    }

    function checkIfFileExists(filename) {

        //$scope.btnText = $http.get('http://httpbin.org/delay/3');

        $scope.btnText = FileService.check(filename).then(function (suc) {
            console.log(suc);
            if(suc == "yes"){
                $timeout(function(){
                    $scope.downloadBtnLable = 1;
                    $scope.audiourl =  rootPath + "/ProAllianceAudios/"+filename;
                });
            }
            else{
                $timeout(function(){
                    $scope.downloadBtnLable = 2;
                    $scope.audiourl = url;
                });
            }
        }, function (error) {
            console.log(error);
        });
    }

    checkIfFileExists(filename);

    function getFSFail(evt) {
        console.log(evt.target.error.code);
    }

    $scope.download = function(url){
        if($scope.downloadBtnLable == 2){
            $scope.percentage = "Downloading...0%";
            $scope.downloadBtnLable = 3;
            console.log('downloadFile');
            /*window.requestFileSystem(
                LocalFileSystem.PERSISTENT,
                0,
                onRequestFileSystemSuccess,
                fail
            );*/
        }
        else if($scope.downloadBtnLable == 1){
            $scope.downloadBtnLable = 2;
            /*window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFSWin, getFSFail);*/
        }
    }

    function onFSWin(entry){
        entry.root.getFile("ProAllianceAudios/"+ filename, null, success, function(){ console.log('fail'); $scope.$apply(function(){ $scope.downloadBtnLable = 2; }); });
    }

    function success(entry){
        entry.remove(function(){ localStorage.removeItem(filename+'local'); console.log('file removed'); }, function(){ console.log('file remove error'); });
    }
    
    function onRequestFileSystemSuccess(fileSystem) {
        console.log('onRequestFileSystemSuccess');
        fileSystem.root.getDirectory("ProAllianceTemp", {create: true}, gotTempDir);
    }

    function gotTempDir(dirEntry){
        dirEntry.getFile(filename, null, tempDirSuccess, tempDirSuccess);
    }

    function tempDirSuccess(fileSystem){
        /*window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(entry){
            entry.root.getFile(
                'dummy.html',
                {create: true, exclusive: false},
                onGetFileSuccess,
                fail
            );

        }, getFSFail);
		*/
    }

    function onGetFileSuccess(fileEntry) {
        console.log('onGetFileSuccess!');
        var path = fileEntry.toURL().replace('dummy.html', '');
        var fileTransfer = new FileTransfer();
        fileEntry.remove();
        var prevperc = 0;
        fileTransfer.download(
            $scope.audio.url,
            path + "ProAllianceTemp/" + filename,
            function(file) {
                console.log('download complete: ' + file.toURI());
                file.moveTo(destDirectory, filename, function(){ localStorage[filename+'local'] = 'yes'; $scope.downloadBtnLable = 1; $scope.$apply(); }, function(){ alert('error'); });
            },
            function(error) {
                console.log('download error source ' + error.source);
                console.log('download error target ' + error.target);
                console.log('upload error code: ' + error.code);
                $scope.downloadBtnLable = 2;
            }
        );

        fileTransfer.onprogress = function(progressEvent) {
            if (progressEvent.lengthComputable) {
                var perc = Math.floor(progressEvent.loaded / progressEvent.total / 2 * 100);
                if(prevperc != perc){
                    prevperc = perc;
                    $scope.$apply(function(){ $scope.percentage = "Downloading..."+perc+"%"; });
                }
            }
        };
    }

    function fail(evt) {
        console.log(evt.target.error.code);
    }

})

// Controller for messages
.controller('MessagesIndexCtrl', function($scope, Header, API) {

    if (API.user.allowBlog) {
        $scope.rightButtons = Header.button('ion-ios7-compose-outline', 'messages-create');
    }

    $scope.messages = API.messages;

})

.controller('AudioController', function ($scope, $log) {
  //$scope.browser = navigator.userAgent;
  $scope.audioPlaylist = [
    {
      src: 'http://demos.w3avenue.com/html5-unleashed-tips-tricks-and-techniques/demo-audio.ogg',
      type: 'audio/ogg'
    }
  ];
})

// Controller for message compose
.controller('MessagesCreateCtrl', function($scope, $http, Header, API) {

    $scope.leftButtons = Header.button('ion-ios7-arrow-back', 'messages-index', 'Cancel');
    $scope.post = {};
    $scope.post.UserID = API.user.id;

    $scope.send = function() {

        API.post($scope.post)
            .success(function(data) {
                if (typeof data.status != 'undefined' && data.status.error) {
                    $scope.message = data.status.message;
                } else {
                    $scope.message = data.status.message;
                    API.messages = data.Posts;
                    $scope.post.Message = '';
                }
            })
            .error(function(data) {
                $scope.message = 'An error occurred.';
            });

    };

});