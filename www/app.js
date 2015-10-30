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

        if (window.gamecenter) {
            window.gamecenter.auth(function (user) {
                console.log('gamecenter success', user)
            }, function (e) {
                console.error('gamecenter error', e)
            });
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
        template: '<img src="img/lock.png" /><div class="lock-knob"></div><div class="lock-counter"><table><tr><td>{{lock.stepsNeeded}}</td></tr></table></div>'
    }
});

lockMe.directive("multiPlayerLock", function () {
    return {
        scope: true,
        controller: MultiPlayerLockController,
        template: '<img src="img/lock.png" /><div class="lock-knob"></div><div class="lock-counter"><table><tr><td>{{lock.stepsNeeded}}</td></tr></table></div>'
    }
});