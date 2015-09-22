import LockMeController from './controller/LockMeController'
import SinglePlayerController from './controller/SinglePlayerController'
import LockController from './controller/LockController'
import SplashController from './controller/SplashController'

var lockMe = angular.module('lock-me', ['ionic']);

lockMe.controller('SplashController', SplashController);
lockMe.controller('LockMeController', LockMeController);
lockMe.controller('SinglePlayerController', SinglePlayerController);
lockMe.controller('LockController', LockController);

var run = function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }

        if (window.gamecenter) {
            window.gamecenter.auth(function (user) {
                console.log('gamecenter success', user)
            }, function (e) {
                console.error('gamecenter error', e)
            });
        }

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
        });

    //$locationProvider.html5Mode(true).hashPrefix('!');
    $urlRouterProvider.otherwise('/');
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