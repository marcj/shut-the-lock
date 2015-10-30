import LockMeController from './controller/LockMeController'
import SinglePlayerController from './controller/SinglePlayerController'
import MultiPlayerController from './controller/MultiPlayerController'
import MultiPlayerHardController from './controller/MultiPlayerHardController'
import LockController from './controller/LockController'
import MultiPlayerLockController from './controller/MultiPlayerLockController'
import SplashController from './controller/SplashController'

var lockMe = angular.module('lock-me', ['ionic', 'ngCordova']);

lockMe.controller('SplashController', SplashController);
lockMe.controller('LockMeController', LockMeController);
lockMe.controller('SinglePlayerController', SinglePlayerController);
lockMe.controller('MultiPlayerController', MultiPlayerController);
lockMe.controller('MultiPlayerHardController', MultiPlayerHardController);
lockMe.controller('LockController', LockController);
lockMe.controller('MultiPlayerLockController', MultiPlayerLockController);

var run = function ($ionicPlatform, $cordovaStatusbar) {
    $ionicPlatform.ready(function () {

        if (/(android)/i.test(navigator.userAgent)) {
            //admobid = { // for Android
            //    banner: 'ca-app-pub-6869992474017983/9375997553',
            //    interstitial: 'ca-app-pub-6869992474017983/1657046752'
            //};
        } else if (/(ipod|iphone|ipad)/i.test(navigator.userAgent)) {
            admobid = { // for iOS
                //banner: 'ca-app-pub-6869992474017983/4806197152',
                //interstitial: 'ca-app-pub-6869992474017983/7563979554'
                banner: 'ca-app-pub-9185193917550750/7060893423',
                //interstitial: 'ca-app-pub-6869992474017983/7563979554'
                // AdSense-Konto: Publisher-ID: pub-9185193917550750
                //Ad unit ID: ca-app-pub-9185193917550750/7060893423
            };
        } else {
            //admobid = { // for Windows Phone
            //    banner: 'ca-app-pub-6869992474017983/8878394753',
            //    interstitial: 'ca-app-pub-6869992474017983/1355127956'
            //};
        }

        if (window.AdMob) {
            var defaultOptions = {
                // adSize: 'SMART_BANNER',
                // width: integer, // valid when set adSize 'CUSTOM'
                // height: integer, // valid when set adSize 'CUSTOM'
                position: AdMob.AD_POSITION.BOTTOM_CENTER,
                // offsetTopBar: false, // avoid overlapped by status bar, for iOS7+
                bgColor: 'black', // color name, or '#RRGGBB'
                // x: integer,		// valid when set position to 0 / POS_XY
                // y: integer,		// valid when set position to 0 / POS_XY
                isTesting: true, // set to true, to receiving test ad for testing purpose
                // autoShow: true // auto show interstitial ad when loaded, set to false if prepare/show
            };
            window.AdMob.setOptions(defaultOptions);
            document.addEventListener('onAdFailLoad', function(data){
                alert('error: ' + data.error +
                    ', reason: ' + data.reason +
                    ', adNetwork:' + data.adNetwork +
                    ', adType:' + data.adType +
                    ', adEvent:' + data.adEvent); // adType: 'banner', 'interstitial', etc.
            });

            /**
             *position
             <option value='1'>Top Left</option>
             <option value='2'>Top Center</option>
             <option value='3'>Top Right</option>
             <option value='4'>Left</option>
             <option value='5'>Center</option>
             <option value='6'>Right</option>
             <option value='7'>Bottom Left</option>
             <option value='8' selected>Bottom Center</option>
             <option value='9'>Bottom Right</option>

             adSize
             <option value='SMART_BANNER'>SMART_BANNER</option>
             <option value='BANNER'>BANNER</option>
             <option value='MEDIUM_RECTANGLE'>MEDIUM_RECTANGLE</option>
             <option value='FULL_BANNER'>FULL_BANNER</option>
             <option value='LEADERBOARD'>LEADERBOARD</option>
             <option value='SKYSCRAPER'>SKYSCRAPER</option>

             */
            window.AdMob.createBanner({
                adId: admobid.banner,
                //overlap: true,
                //offsetTopBar: true,
                autoShow : true,
                adSize: 'SMART_BANNER',
                position: 8
            });

            window.AdMob.showBanner(8);
        }

        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }

        $cordovaStatusbar.hide();
    });
};
lockMe.run(run);

lockMe.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $stateProvider
        .state('splash', {
            url: '/',
            templateUrl: 'templates/splash.html'
        })
        .state('start', {
            url: '/start',
            templateUrl: 'templates/start.html'
        })
        .state('singleplayer', {
            url: '/singleplayer',
            templateUrl: 'templates/singleplayer.html'
        })
        .state('multiplayer', {
            url: '/multiplayer',
            templateUrl: 'templates/multiplayer.html',
            controller: 'MultiPlayerController as player'
        })
        .state('multiplayer-hard', {
            url: '/multiplayer-hard',
            templateUrl: 'templates/multiplayer.html',
            controller: 'MultiPlayerHardController as player'
        });

    //$locationProvider.html5Mode(true).hashPrefix('!');
    $urlRouterProvider.otherwise('/start');
});


function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//lockMe.controller('SinglePlayerController', function ($scope, $timeout) {
//    $scope.level = 1;
//});

lockMe.directive("onTouchstart", function () {
    return {
        controller: function ($scope, $element, $attrs) {
            $element.bind('touchstart', onTouchStart);

            function onTouchStart(event) {
                var method = $element.attr('on-touchstart');
                $scope.$event = event;
                $scope.$apply(method);
            }
        }
    }
});

lockMe.directive("lock", function () {
    return {
        scope: true,
        controller: LockController,
        template: '<img src="img/lock.png" /><div class="lock-knob-red"></div><div class="lock-knob"></div><div class="lock-counter"><table><tr><td>{{lock.stepsNeeded}}</td></tr></table></div>'
    }
});

lockMe.directive("multiPlayerLock", function () {
    return {
        scope: true,
        controller: MultiPlayerLockController,
        template: '<img src="img/lock.png" /><div class="lock-knob-red"></div><div class="lock-knob"></div><div class="lock-counter"><table><tr><td>{{lock.stepsNeeded}}</td></tr></table></div>'
    }
});