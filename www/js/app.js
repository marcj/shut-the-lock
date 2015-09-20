// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var lockMe = angular.module('lock-me', ['ionic'])

    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
    });

lockMe.controller('LockerController', function($scope){
    $scope.lastLockInnerStep = 0;

    $scope.handleDrag = function($event) {
        $scope.lockInnerStep = Math.floor($scope.lastLockInnerStep + ($event.gesture.deltaY / 5));
        console.log($event.gesture.deltaY, $scope.lockInnerStep);
        $scope.lockInnerStepClass = 'lock-inner-rotate-step-' + $scope.lockInnerStep;
    }
});