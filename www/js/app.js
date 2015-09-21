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

            if (window.gamecenter) {
                window.gamecenter.auth(function(user){
                    console.log('gamecenter success', user)
                }, function(e){
                    console.error('gamecenter error', e)
                });
            }
        });
    });

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

lockMe.controller('SinglePlayerController', function ($scope, $timeout) {
    $scope.level = 1;
});

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

lockMe.controller('LockerController', function ($scope, $timeout) {
    $scope.lastLockInnerStep = 0;

    $scope.step = 2;

    var steps = 24;

    var knob = document.getElementById('lock-knob-items');
    $scope.handleDrag = function ($event) {
        $scope.lockInnerStep = Math.floor($scope.lastLockInnerStep + $event.gesture.deltaY);
        knob.style.transform = 'rotate(' + $scope.lockInnerStep + 'deg)';
        knob.style.webkitTransform = 'rotate(' + $scope.lockInnerStep + 'deg)';
        //console.log($scope.lockInnerStep);
        $scope.step = $scope.lockInnerStep;
        //$scope.lockInnerStepClass = 'lock-inner-rotate-step-' + $scope.lockInnerStep;
    };

    $scope.runs = false;
    $scope.stepsNeeded = $scope.$parent.level;

    $scope.active = false;
    $scope.blocked = false;

    var lastAnimation;
    var tolerance = 7;

    $scope.handleTouch = function ($event) {
        if ($scope.active && $scope.runs) {
            $scope.runs = false;
        } else {
            return;
        }

        if ($scope.succeeded || $scope.failed) {
            return;
        }

        var angle = $scope.currentAngle;
        if (lastAnimation) {
            //lastAnimation.cb = function(){};
            lastAnimation.destroy();
        }
        console.log('touch, computed angle', angle, 'runs=', $scope.runs);

        //353 <-> 367
        //-7 <-> 7
        if (angle > tolerance) {
            angle = 360 - angle;
        }

        if (angle >= -tolerance && angle <= tolerance) {
            $scope.stepsNeeded--;

            console.log('hit!', angle, $scope.stepsNeeded);
            if (0 === $scope.stepsNeeded) {
                //knob.style.transform = 'rotate(' + angle + 'deg)';
                //knob.style.webkitTransform = 'rotate(' + angle + 'deg)';
                $scope.succeeded = true;
                $scope.$parent.level++;

                ion.sound.play("lock" + getRandomIntInclusive(1,2));
                return;
            }

            ion.sound.play("lock_unlock");
            $scope.nextStep();

            if (window.gamecenter) {
                var data = {
                    score: $scope.$parent.level,
                    leaderboardId: "singleplayer"
                };
                window.gamecenter.submitScore(function () {}, function (e) {console.log('cannot submit gamecenter', e);}, data);
            }

        } else {
            $scope.failure();
        }
    };

    $scope.showLeaderboard = function(){
        var data = {
            leaderboardId: "singleplayer"
        };
        window.gamecenter.showLeaderboard(function(){}, function(){}, data);
    };

    ion.sound({
        sounds: [
            {
                name: "lock1"
            },
            {
                name: "lock2"
                //volume: 0.2
            },
            {
                name: "lock_unlock"
                //volume: 0.3,
                //preload: false
            }
        ],
        volume: 1,
        path: "sounds/",
        multiplay: true,
        preload: true
    });

    $scope.start = function() {
        $scope.active = true;
        $scope.nextStep();
    };

    $scope.restart = function () {
        if ($scope.blocked) {
            return;
        }

        console.log('restart');
        $scope.stepsNeeded = $scope.$parent.level;
        $scope.failed = false;
        $scope.succeeded = false;
        $scope.nextStep();
    };

    $scope.failure = function() {
        console.log('failure');
        $scope.failed = true;
        $scope.blocked = true;

        $timeout(function(){
            $scope.blocked = false;
        }, 340);
    };

    $scope.nextStep = function (firstRun) {
        if (firstRun) {
            $scope.targetStep = getRandomIntInclusive(9, steps - 9);
        } else {
            $scope.targetStep = getRandomIntInclusive(3, steps - 3);
        }
        $scope.targetPosition = $scope.targetStep * (360 / steps);

        //$scope.animationStart = Date.now();

        knob.style[ionic.CSS.TRANSFORM] = 'rotate(' + $scope.targetPosition + 'deg)';

        var timePerStep = 150;
        var targetDeg = -tolerance;
        var timeTotal = $scope.targetStep * timePerStep;

        if ($scope.targetStep > steps / 2) {
            targetDeg = 360 + tolerance;
            timeTotal = (steps - $scope.targetStep) * timePerStep;
        }
        console.log('next step', targetDeg, $scope.step, $scope.targetPosition);

        $scope.runs = true;
        lastAnimation = collide.animation({
            duration: timeTotal,
            easing: 'linear'
        })
        .on('step', function(v) {

            if (targetDeg < 0) {
                var buffer = $scope.targetPosition + Math.abs(targetDeg);
                v = buffer - (v * buffer);
                v += targetDeg;
            } else {
                v = (v * (targetDeg - $scope.targetPosition));
                v += $scope.targetPosition;
            }

            $scope.currentAngle = v;
            knob.style[ionic.CSS.TRANSFORM] = 'rotate(' + v + 'deg)';
        })
        .on('complete', function(){
            if (!$scope.runs) return;

            $scope.runs = false;
            console.log('complete');
                $timeout(function() {
                    $scope.failure();
                }, 0);
        });

        //$timeout(function(){
        //    $scope.handleTouch();
        //}, timeTotal + 30);
        lastAnimation.start();
    };
});