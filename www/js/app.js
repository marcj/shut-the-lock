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

            gamecenter.auth(function(user){console.log('gamecenter success', user)}, function(e){console.log('gamecenter error', e)});
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

    function getAngle(el) {
        var st = window.getComputedStyle(el, null);
        var tr = st.getPropertyValue("-webkit-transform") ||
            st.getPropertyValue("-moz-transform") ||
            st.getPropertyValue("-ms-transform") ||
            st.getPropertyValue("-o-transform") ||
            st.getPropertyValue("transform") ||
            null;

        if (!tr || tr === 'none') {
            return false;
        }

        var values = tr.split('(')[1];
        values = values.split(')')[0];
        values = values.split(',');
        var a = values[0];
        var b = values[1];
        var c = values[2];
        var d = values[3];

        var scale = Math.sqrt(a * a + b * b);

        return Math.round(Math.atan2(b, a) * (180 / Math.PI));
    }

    $scope.runs = false;
    $scope.stepsNeeded = $scope.$parent.level;

    $scope.active = true;
    var tolerance = 7;
    var lastFailureTimeout;

    $scope.handleTouch = function ($event) {
        if ($scope.failed || !$scope.active) {
            return;
        }

        console.log('touch');
        $timeout.cancel(lastFailureTimeout);

        if (!$scope.runs) {
            console.log('handle start');
            $scope.nextStep(true);
            $scope.runs = true;
        } else {
            var angle = getAngle(knob);

            console.log('computed angle', angle);

            if (angle >= -tolerance && angle <= tolerance) {
                $scope.stepsNeeded--;


                if (0 === $scope.stepsNeeded) {
                    $scope.runs = false;
                    knob.style.transform = 'rotate(' + angle + 'deg)';
                    knob.style.webkitTransform = 'rotate(' + angle + 'deg)';
                    $scope.succeeded = true;
                    $scope.$parent.level++;

                    ion.sound.play("lock" + getRandomIntInclusive(1,2));
                    return;
                }

                ion.sound.play("lock_unlock");
                $scope.nextStep();

                setTimeout(function() {
                    var data = {
                        score: $scope.$parent.level,
                        leaderboardId: "board1"
                    };
                    gamecenter.submitScore(function () {
                    }, function () {
                    }, data);
                });

            } else {
                knob.style.transform = 'rotate(' + angle + 'deg)';
                knob.style.webkitTransform = 'rotate(' + angle + 'deg)';
                $scope.failure();
            }
        }
    };

    $scope.showLeaderboard = function(){
        var data = {
            leaderboardId: "board1"
        };
        gamecenter.showLeaderboard(function(){}, function(){}, data);
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

    $scope.lastStep = 0;
    $scope.restart = function () {
        console.log('restart');
        $scope.active = true;
        $scope.stepsNeeded = $scope.$parent.level;
        $scope.failed = false;
        $scope.runs = true;
        $scope.succeeded = false;
        $scope.nextStep();
    };

    $scope.failure = function() {
        $scope.runs = false;
        $scope.failed = true;
        $scope.active = false;

        $timeout(function(){
            $scope.active = true;
        }, 100);
    };


    $scope.nextStep = function (firstRun) {
        if (firstRun) {
            $scope.targetStep = getRandomIntInclusive(9, steps - 9);
        } else {
            $scope.targetStep = getRandomIntInclusive(3, steps - 3);
        }
        $scope.targetPosition = $scope.targetStep * (360 / steps);

        console.log('next step', $scope.step, $scope.targetPosition);

        knob.style.webkitTransitionDuration = '0s';
        knob.style.transitionDuration = '0s';

        knob.style.transform = 'rotate(' + $scope.targetPosition + 'deg)';
        knob.style.webkitTransform = 'rotate(' + $scope.targetPosition + 'deg)';

        console.log('go random', knob.style.transform);
        $timeout(function () {
            var timePerStep = 0.15;

            var targetDeg = -tolerance;

            var timeTotal = $scope.targetStep * timePerStep;

            if ($scope.targetStep > steps / 2) {
                targetDeg = 360 + tolerance;
                timeTotal = (steps - $scope.targetStep) * timePerStep;
            }

            lastFailureTimeout = $timeout(function () {
                $scope.failure();
            }, timeTotal * 1000);

            knob.style.webkitTransitionDuration = timeTotal + 's';
            knob.style.transitionDuration = timeTotal + 's';

            knob.style.transform = 'rotate(' + targetDeg + 'deg)';
            knob.style.webkitTransform = 'rotate(' + targetDeg + 'deg)';
            console.log('go back', knob.style.transform, timeTotal);
        }, 50);
    };
});