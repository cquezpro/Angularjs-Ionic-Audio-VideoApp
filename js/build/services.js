angular.module('app.services', [])

// Main service to hold config variables
.service('Config', function() {

    this.client   = 'Proalliance';
    this.platform = 'android'; // ios7 or android
    this.url      = 'http://www.proalliance.net/api/default.aspx';
    this.key      = '123';

})

// Main service to store all data
.service('API', function($http, $state, Menu, Config) {

    this.login = function(user) {
        return $http.get(Config.url + '?apikey=' + Config.key + '&method=login&UserName=' + user.id + '&Password=' + user.password);
    };

    this.publicMessage = function() {
        return $http.get(Config.url + '?apikey=' + Config.key + '&method=publicmessage');
    };

    this.logout = function() {
        Menu.hide();
        localStorage.removeItem('password');
        localStorage.removeItem('auth');
        this.auth = false;
        this.user = {};
        this.audios = {};
        this.videos = {};
        this.messages = {};
        this.resources = {};
        $state.go('landing');
    };

    this.post = function(postData) {
        return $http({
            method: 'POST',
            url: Config.url + '?apikey=' + Config.key + '&method=addpost',
            headers: {'Content-Type' : 'application/x-www-form-urlencoded'},
            data: $.param(postData)
        });
    };

    this.auth = false;
    this.user = {};
    this.audios = {};
    this.videos = {};
    this.messages = {};
    this.resources = {};

})

// Service to control the side menu
.factory('Menu', function() {

    var showMenu = {
        state: false
    };

    return {

        state: function() {
            return showMenu;
        },

        hide: function() {
            showMenu.state = false;
        },

        show: function() {
            showMenu.state = true;
        }

    };

})

// Service to control the header
.factory('Header', function($state, Config) {

    return {

        button: function(icon, destination, text) {
            text = typeof text !== 'undefined' ? text : '';
            var button = [
                {
                    content: '<i class="icon ' + icon + '"></i> ' + text,
                    type: 'button-icon button-clear',
                    tap: function(e) {
                        $state.go(destination);
                    }
                }
            ];
            return button;
        }

    };

})

.factory('phonegapReady', function() {
    return function (fn) {
        var queue = [];
        var impl = function () {
        queue.push(Array.prototype.slice.call(arguments));
    };
              
    document.addEventListener('deviceready', function () {
        queue.forEach(function (args) {
            fn.apply(this, args);
        });
        impl = fn;
    }, false);
              
    return function () {
        return impl.apply(this, arguments);
        };
    };
})

.filter("localremote", function (FileService) {
    return function (items, type) {
        if (type == 'remote') {
            return items;
        } else {
            var filtered = [];
            angular.forEach(items, function(item) {
                var url = item.url;
                var filename = url.substring(url.lastIndexOf('/')+1);
                if(localStorage[filename+'local'] != undefined){
                    filtered.push(item);
                }
            });
            return filtered;
        }
    }
})

.factory("FileService", function ($rootScope, $q, $window, $timeout) {


    return {
        check: function (filename) {

            var deferred = $q.defer();
            /*window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
                console.log(fileSystem.root.name);
                fileSystem.root.getDirectory("ProAllianceAudios", {create: true}, gotDir);
            }, getFSFail); //of requestFileSystem*/

            function gotDir(dirEntry) {
                dirEntry.getFile(filename, null, fileExists, fileDoesNotExist);
                destDirectory = dirEntry;
            }
            function fileExists(fileEntry){
                console.log("File " + fileEntry.fullPath + " exists!");
                $timeout(function(){
                    $rootScope.$apply(function () {
                        deferred.resolve("yes");
                    });
                });
            }
            function fileDoesNotExist(){
                console.log("file does not exist");
                $timeout(function(){
                    $rootScope.$apply(function () {
                        deferred.resolve("no");
                    });
                });
            }
            function getFSFail(evt) {
                console.log(evt.target.error.code);
                $rootScope.$apply(function () {
                    deferred.reject(evt.target.error.code);
                });
            }

            return deferred.promise;
        }
    };
})

// Service to help search arrays
.service('Find', function() {

    this.ById = function(arr, id) {
        for (var d = 0, len = arr.length; d < len; d += 1) {
            if (arr[d].id === parseInt(id)) {
                return arr[d];
            }
        }
    };

    this.BySrc = function(source) {
        var regex = / src=\"([^"]*)\"/;
        return regex.exec(source)[1];
    };

});