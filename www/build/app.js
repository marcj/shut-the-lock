(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _controllerLockMeController = require('./controller/LockMeController');

var _controllerLockMeController2 = _interopRequireDefault(_controllerLockMeController);

var _controllerSinglePlayerController = require('./controller/SinglePlayerController');

var _controllerSinglePlayerController2 = _interopRequireDefault(_controllerSinglePlayerController);

var _controllerMultiPlayerController = require('./controller/MultiPlayerController');

var _controllerMultiPlayerController2 = _interopRequireDefault(_controllerMultiPlayerController);

var _controllerMultiPlayerHardController = require('./controller/MultiPlayerHardController');

var _controllerMultiPlayerHardController2 = _interopRequireDefault(_controllerMultiPlayerHardController);

var _controllerLockController = require('./controller/LockController');

var _controllerLockController2 = _interopRequireDefault(_controllerLockController);

var _controllerMultiPlayerLockController = require('./controller/MultiPlayerLockController');

var _controllerMultiPlayerLockController2 = _interopRequireDefault(_controllerMultiPlayerLockController);

var _controllerSplashController = require('./controller/SplashController');

var _controllerSplashController2 = _interopRequireDefault(_controllerSplashController);

var lockMe = angular.module('lock-me', ['ionic', 'ngCordova']);

lockMe.controller('SplashController', _controllerSplashController2['default']);
lockMe.controller('LockMeController', _controllerLockMeController2['default']);
lockMe.controller('SinglePlayerController', _controllerSinglePlayerController2['default']);
lockMe.controller('MultiPlayerController', _controllerMultiPlayerController2['default']);
lockMe.controller('MultiPlayerHardController', _controllerMultiPlayerHardController2['default']);
lockMe.controller('LockController', _controllerLockController2['default']);
lockMe.controller('MultiPlayerLockController', _controllerMultiPlayerLockController2['default']);

var run = function run($rootScope, $ionicPlatform, $cordovaStatusbar) {
    $ionicPlatform.ready(function () {

        if (/(android)/i.test(navigator.userAgent)) {
            //admobid = { // for Android
            //    banner: 'ca-app-pub-6869992474017983/9375997553',
            //    interstitial: 'ca-app-pub-6869992474017983/1657046752'
            //};
        } else if (/(ipod|iphone|ipad)/i.test(navigator.userAgent)) {
                var admobid = { // for iOS
                    //banner: 'ca-app-pub-6869992474017983/4806197152',
                    //interstitial: 'ca-app-pub-6869992474017983/7563979554'
                    banner: 'ca-app-pub-9185193917550750/7060893423'
                };
            } else //interstitial: 'ca-app-pub-6869992474017983/7563979554'
                // AdSense-Konto: Publisher-ID: pub-9185193917550750
                //Ad unit ID: ca-app-pub-9185193917550750/7060893423
                {
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
                bgColor: 'black' };
            // color name, or '#RRGGBB'
            // x: integer,		// valid when set position to 0 / POS_XY
            // y: integer,		// valid when set position to 0 / POS_XY
            //isTesting: true, // set to true, to receiving test ad for testing purpose
            // autoShow: true // auto show interstitial ad when loaded, set to false if prepare/show
            window.AdMob.setOptions(defaultOptions);
            document.addEventListener('onAdFailLoad', function (data) {
                alert('error: ' + data.error + ', reason: ' + data.reason + ', adNetwork:' + data.adNetwork + ', adType:' + data.adType + ', adEvent:' + data.adEvent); // adType: 'banner', 'interstitial', etc.
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
                autoShow: true,
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

        if (window.gamecenter) {
            window.gamecenter.auth(function (user) {
                $scope.gamercenterLoggedIn = true;
                console.log('gamecenter success', user);
            }, function (e) {
                console.error('gamecenter error', e);
            });
        }

        $cordovaStatusbar.hide();
    });
};
lockMe.run(run);

lockMe.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $stateProvider.state('splash', {
        url: '/',
        templateUrl: 'templates/splash.html'
    }).state('start', {
        url: '/start',
        templateUrl: 'templates/start.html'
    }).state('singleplayer', {
        url: '/singleplayer',
        templateUrl: 'templates/singleplayer.html'
    }).state('multiplayer', {
        url: '/multiplayer',
        templateUrl: 'templates/multiplayer.html',
        controller: 'MultiPlayerController as player'
    }).state('multiplayer-hard', {
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
        controller: function controller($scope, $element, $attrs) {
            $element.bind('touchstart', onTouchStart);

            function onTouchStart(event) {
                var method = $element.attr('on-touchstart');
                $scope.$event = event;
                $scope.$apply(method);
            }
        }
    };
});

lockMe.directive("lock", function () {
    return {
        scope: true,
        controller: _controllerLockController2['default'],
        template: '<img src="img/lock.png" /><div class="lock-knob-red"></div><div class="lock-knob"></div><div class="lock-arrow"></div><div class="lock-counter"><table><tr><td>{{lock.stepsNeeded}}</td></tr></table></div>'
    };
});

lockMe.directive("multiPlayerLock", function () {
    return {
        scope: true,
        controller: _controllerMultiPlayerLockController2['default'],
        template: '<img src="img/lock.png" /><div class="lock-knob-red"></div><div class="lock-knob"></div><div class="lock-arrow"></div><div class="lock-counter"><table><tr><td>{{lock.stepsNeeded}}</td></tr></table></div>'
    };
});

},{"./controller/LockController":2,"./controller/LockMeController":3,"./controller/MultiPlayerController":4,"./controller/MultiPlayerHardController":5,"./controller/MultiPlayerLockController":6,"./controller/SinglePlayerController":7,"./controller/SplashController":8}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _utils = require('../utils');

var LockController = (function () {
    function LockController($scope, $element, $timeout) {
        var _this = this;

        _classCallCheck(this, LockController);

        this.$timeout = $timeout;
        this.lastLockInnerStep = 0;
        this.player = $scope.player;
        this.steps = 24;
        this.tolerance = 7;
        this.lastAnimation = null;
        this.runs = false;
        //this.stepsNeeded = 1;
        this.currentAngle = 0;
        this.targetStep = 0;
        //this.lastStep = 0; //helper var to determine the needed steps per round

        $scope.$on('$destroy', function () {
            _this.stop();
        });

        $scope.lock = this;
        $scope.player.registerLock(this);
        this.knobRed = window.angular.element($element).children()[1];
        this.knob = window.angular.element($element).children()[2];
        this.arrow = window.angular.element($element).children()[3];

        //this.handleDrag = function ($event) {
        //    this.lockInnerStep = Math.floor(this.lastLockInnerStep + $event.gesture.deltaY);
        //    knob.style.transform = 'rotate(' + this.lockInnerStep + 'deg)';
        //    knob.style.webkitTransform = 'rotate(' + this.lockInnerStep + 'deg)';
        //};
    }

    _createClass(LockController, [{
        key: 'touch',
        value: function touch() {
            this.runs = false;

            var angle = this.targetPosition - this.currentAngle;
            if (this.lastAnimation) {
                this.lastAnimation.destroy();
            }
            //console.log('touch, computed angle', angle, 'runs=', this.runs);

            //353 <-> 367
            //-7 <-> 7
            if (angle > this.tolerance) {
                angle = 360 - angle;
            }

            if (angle >= -this.tolerance && angle <= this.tolerance) {
                this.onSuccess();
            } else {
                this.onFailure();
            }
        }
    }, {
        key: 'stop',
        value: function stop() {
            if (this.lastAnimation) {
                this.lastAnimation.destroy();
            }
            this.runs = false;
        }
    }, {
        key: 'reset',
        value: function reset() {
            this.knob.style[ionic.CSS.TRANSFORM] = 'rotateZ(0deg)';
            this.arrow.style[ionic.CSS.TRANSFORM] = 'rotateZ(0deg)';
            this.currentAngle = 0;
        }
    }, {
        key: 'onFailure',
        value: function onFailure() {
            var _this2 = this;

            this.knobRed.classList.add('visible');

            setTimeout(function () {
                _this2.knobRed.classList.remove('visible');
            }, 400);

            this.player.onFailed(this);
        }
    }, {
        key: 'onSuccess',
        value: function onSuccess() {
            this.player.onSuccess(this);
        }
    }, {
        key: 'start',
        value: function start() {
            this.nextStep(true);
        }

        //render(){
        //    this.knob.style[ionic.CSS.TRANSFORM] = 'rotate(' + this.currentAngle + 'deg)';
        //    window.requestAnimationFrame(() => this.render());
        //}

    }, {
        key: 'nextStep',
        value: function nextStep(bigDiff) {
            var _this3 = this;

            this.direction = this.direction === 'right' ? 'left' : 'right';

            var diff = 6;
            var minDiff = 3;
            if (bigDiff) {
                minDiff = 7;
                diff = 11;
            }

            var currentStep = Math.abs(Math.floor(this.currentAngle / (360 / this.steps)));

            if (this.direction === 'left') {
                this.targetStep = (0, _utils.getRandomIntInclusive)(currentStep - diff, currentStep - minDiff);
            } else {
                this.targetStep = (0, _utils.getRandomIntInclusive)(currentStep + minDiff, currentStep + diff);
            }

            this.targetPosition = this.targetStep * (360 / this.steps);

            this.knob.style[ionic.CSS.TRANSFORM] = 'rotateZ(' + this.targetPosition + 'deg)';

            var timePerStep = 140;
            var stepsNeeded = (this.targetPosition - this.currentAngle) / (360 / this.steps);
            var timeTotal = Math.abs(stepsNeeded * timePerStep);

            //this.lastStep = this.targetStep;

            this.runs = true;
            var lastLoop = new Date();
            var oldFps = 0;
            var debug = document.getElementById('debug');
            var startedAngle = this.currentAngle;

            console.log('currentStep=', currentStep, 'stepsneeded=', stepsNeeded.toFixed(0), ' - time:', timeTotal.toFixed(0), 'stepsNeeded=', stepsNeeded, 'currentAngle', this.currentAngle, 'targetPosition=', this.targetPosition);

            var from = this.currentAngle;
            var to = this.targetPosition;

            if (this.direction === 'left') {
                //from = from - this.tolerance;
                to = to - this.tolerance;
            } else {
                to = to + this.tolerance;
            }
            var anglesNeeded = to - from;

            this.lastAnimation = collide.animation({
                duration: timeTotal,
                easing: 'linear'
            }).on('step', function (v) {
                v = anglesNeeded * v;
                v += startedAngle;

                _this3.currentAngle = v;
                _this3.arrow.style[ionic.CSS.TRANSFORM] = 'rotate(' + _this3.currentAngle + 'deg)';

                //var thisLoop = new Date;
                //var newFps = 1000 / (thisLoop - lastLoop);
                //
                //var filteredValue = oldFps + (newFps - oldFps) / (100 / (thisLoop-lastLoop));
                //
                //lastLoop = thisLoop;
                //oldFps = newFps;
                //debug.innerHTML = filteredValue.toFixed(0) + ' FPS';
            }).on('complete', function () {
                if (!_this3.runs) return;

                _this3.runs = false;
                //console.log('complete');
                _this3.$timeout(function () {
                    _this3.onFailure();
                });
            });

            this.lastAnimation.start();
        }
    }]);

    return LockController;
})();

exports['default'] = LockController;
module.exports = exports['default'];

},{"../utils":9}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var LockMeController = (function () {
    function LockMeController($scope, $state, $timeout, $ionicHistory) {
        _classCallCheck(this, LockMeController);

        $scope.go = function (url) {
            console.log('go back');
            $state.go(url);
        };
        $scope.goBack = function () {
            console.log('go back');
            $ionicHistory.goBack();
        };
        $scope.showLeaderboard = this.showLeaderboard;
        $scope.hasAdMob = !!window.AdMob;

        $timeout(function () {
            if (window.gamecenter) {
                $scope.loginGameCenter = function () {
                    window.gamecenter.auth(function (user) {
                        $scope.gamercenterLoggedIn = true;
                        console.log('gamecenter success', user);
                    }, function (e) {
                        console.error('gamecenter error', e);
                    });
                };
                $scope.loginGameCenter();
            }
        }, 500);
    }

    _createClass(LockMeController, [{
        key: 'showLeaderboard',
        value: function showLeaderboard() {
            var data = {
                leaderboardId: "singleplayer"
            };
            window.gamecenter.showLeaderboard(function () {}, function () {}, data);
        }
    }]);

    return LockMeController;
})();

exports['default'] = LockMeController;
module.exports = exports['default'];

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var MultiPlayerController = (function () {
    function MultiPlayerController($scope, $timeout, $state) {
        _classCallCheck(this, MultiPlayerController);

        this.$timeout = $timeout;
        this.$state = $state;
        this.locks = [];
        this.hard = false;
        this.keysMax = 8;

        this.reset();
    }

    _createClass(MultiPlayerController, [{
        key: 'reset',
        value: function reset() {
            this.keysOpen = this.keysMax / 2;
            this.activeGame = false;

            this.ready = { 1: false, 2: false };
            this.lives = { 1: 4, 2: 4 };
            this.playerWon = false;

            if (this.player1) {
                this.player1.reset();
            }
            if (this.player2) {
                this.player2.reset();
            }
        }
    }, {
        key: 'registerLock',
        value: function registerLock(lock) {
            this.locks.push(lock);
            lock.stepsNeeded = '';

            if (this.locks.length === 2) {
                this.setupLocks();
            }
        }
    }, {
        key: 'restart',
        value: function restart() {
            this.reset();
            this.updateNeededSteps();
        }
    }, {
        key: 'setupLocks',
        value: function setupLocks() {
            this.player2 = this.locks[0];
            this.player1 = this.locks[1];

            this.updateNeededSteps();
        }
    }, {
        key: 'updateNeededSteps',
        value: function updateNeededSteps() {
            this.player1.stepsNeeded = this.keysMax - this.keysOpen;
            this.player2.stepsNeeded = this.keysOpen;
        }
    }, {
        key: 'isKeyOpen',
        value: function isKeyOpen(key) {
            return key <= this.keysOpen;
        }
    }, {
        key: 'setActiveKeys',
        value: function setActiveKeys(keys) {
            if (this.activeGame) return;

            this.keysOpen = keys;
            this.setupLocks();
        }
    }, {
        key: 'isReady',
        value: function isReady(player) {
            return this.ready[player];
        }
    }, {
        key: 'setReady',
        value: function setReady(player, ready) {
            this.ready[player] = ready;

            if (this.ready[1] && this.ready[2]) {
                this.startGame();
            }
        }
    }, {
        key: 'startGame',
        value: function startGame() {
            this.activeGame = true;

            //this.startCountdown();
            this.startLocks();
        }
    }, {
        key: 'getPlayerNumber',
        value: function getPlayerNumber(lock) {
            if (lock === this.player2) {
                return 2;
            }

            return 1;
        }
    }, {
        key: 'touch',
        value: function touch(player, $event) {
            if (!this.activeGame || this.countDown) {
                return;
            }

            if (1 === player) {
                this.player1.touch($event);
            } else {
                this.player2.touch($event);
            }
        }
    }, {
        key: 'getLives',
        value: function getLives(player) {
            return this.lives[player];
        }
    }, {
        key: 'finished',
        value: function finished(playerWon) {
            this.player1.stop();
            this.player2.stop();
            this.activeGame = false;

            this.playerWon = playerWon;
        }
    }, {
        key: 'onFailed',
        value: function onFailed(lock) {
            var player = this.getPlayerNumber(lock);

            if (this.hard) {
                this.lives[player]--;
                if (this.lives[player] <= 0) {
                    this.finished(player === 1 ? 2 : 1);
                } else {
                    lock.nextStep(true);
                }
            } else {
                lock.nextStep(true);
            }
        }
    }, {
        key: 'onSuccess',
        value: function onSuccess(lock) {
            var player = this.getPlayerNumber(lock);

            if (1 === player) {
                this.keysOpen++;
            } else if (2 === player) {
                this.keysOpen--;
            }

            this.updateNeededSteps();

            if (this.keysOpen === 0) {
                return this.finished(2);
            }
            if (this.keysOpen === this.keysMax) {
                return this.finished(1);
            }

            lock.nextStep();
        }
    }, {
        key: 'startCountdown',
        value: function startCountdown() {
            var _this = this;

            this.countDown = true;
            this.countDownNumber = 3;

            this.$timeout(function () {
                _this.countDownNumber--;
            }, 1000);

            this.$timeout(function () {
                _this.countDownNumber--;
            }, 2000);

            this.$timeout(function () {
                _this.countDown = false;
                _this.startLocks();
            }, 3000);
        }
    }, {
        key: 'startLocks',
        value: function startLocks() {
            this.player1.start(true);
            this.player2.start(true);
        }
    }]);

    return MultiPlayerController;
})();

exports['default'] = MultiPlayerController;
module.exports = exports['default'];

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _MultiPlayerController2 = require('./MultiPlayerController');

var _MultiPlayerController3 = _interopRequireDefault(_MultiPlayerController2);

var MultiPlayerHardController = (function (_MultiPlayerController) {
    _inherits(MultiPlayerHardController, _MultiPlayerController);

    function MultiPlayerHardController($scope, $timeout, $state) {
        _classCallCheck(this, MultiPlayerHardController);

        _get(Object.getPrototypeOf(MultiPlayerHardController.prototype), 'constructor', this).call(this, $scope, $timeout, $state);
        this.hard = true;
    }

    return MultiPlayerHardController;
})(_MultiPlayerController3['default']);

exports['default'] = MultiPlayerHardController;
module.exports = exports['default'];

},{"./MultiPlayerController":4}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _utils = require('../utils');

var _LockController2 = require('./LockController');

var _LockController3 = _interopRequireDefault(_LockController2);

var MultiPlayerLockController = (function (_LockController) {
    _inherits(MultiPlayerLockController, _LockController);

    function MultiPlayerLockController($scope, $element, $timeout) {
        _classCallCheck(this, MultiPlayerLockController);

        _get(Object.getPrototypeOf(MultiPlayerLockController.prototype), 'constructor', this).call(this, $scope, $element, $timeout);
    }

    return MultiPlayerLockController;
})(_LockController3['default']);

exports['default'] = MultiPlayerLockController;
module.exports = exports['default'];

},{"../utils":9,"./LockController":2}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _utils = require('../utils');

var SinglePlayerController = (function () {
    function SinglePlayerController($scope, $timeout, $state) {
        _classCallCheck(this, SinglePlayerController);

        this.$timeout = $timeout;
        this.$state = $state;
        this.failed = false;
        this.succeeded = false;
        this.blocked = false;

        this.levelDescriptions = ['Bloody beginner', //0-9
        'Enganged amateur', //10-19
        'Advanced player', //20-29
        'Addicted', //30-39
        'Engaged addicted', //40-49
        'Crazy player', //50-59
        'Better go out', //60-69
        'It is getting serious', //70-79
        'Ok, interesting', //80-89
        'Are you serious?', //90-99
        'Crazy god?'];

        //90-99
        ion.sound({
            sounds: [{
                name: "lock2"
            }, {
                name: "lock3"
                //volume: 0.2
            }, {
                name: "lock_unlock"
                //volume: 0.3,
                //preload: false
            }],
            volume: 1,
            path: "sounds/",
            multiplay: true,
            preload: true
        });

        this.setLevel(window.localStorage['singleplayerLevel'] || 1);
    }

    _createClass(SinglePlayerController, [{
        key: 'setLevel',
        value: function setLevel(level) {
            this.level = level;

            this.levelDescription = '';

            for (var k in this.levelDescriptions) {
                var start = k * 10;
                var end = start + 9;

                if (this.level >= start && this.level <= end) {
                    this.levelDescription = this.levelDescriptions[k];
                    break;
                }
            }

            if (!this.levelDescription) {
                this.levelDescription = 'OMFG!';
            }

            this.submitScore();
        }
    }, {
        key: 'registerLock',
        value: function registerLock(lock) {
            //console.log('lock registered', lock);
            this.lock = lock;
            this.lock.stepsNeeded = this.level;
        }
    }, {
        key: 'touch',
        value: function touch($event) {
            //console.log('player::touch', this.active);

            if (!this.active) {
                this.start();
                return;
            }

            //console.log('touch', this.active, this.lock.runs);

            if (this.lock.runs) {
                this.lock.touch($event);
            }
        }
    }, {
        key: 'back',
        value: function back() {
            if (this.lock.runs) {
                this.lock.stop();
            }

            this.$state.go('start');
        }
    }, {
        key: 'onSuccess',
        value: function onSuccess() {
            this.lock.stepsNeeded--;
            if (0 === this.lock.stepsNeeded) {
                ion.sound.play("lock_unlock");

                this.succeeded = true;
                this.level++;
                window.localStorage['singleplayerLevel'] = this.level;
                this.setLevel(this.level);
            } else {
                ion.sound.play("lock" + (0, _utils.getRandomIntInclusive)(2, 3));
                this.lock.nextStep();
            }
        }
    }, {
        key: 'start',
        value: function start() {
            var _this = this;

            this.$timeout(function () {
                _this.active = true;
                _this.lock.stepsNeeded = _this.level;
                _this.lock.start();
            }, 1);
        }
    }, {
        key: 'restart',
        value: function restart() {
            var _this2 = this;

            if (this.blocked) {
                return;
            }
            //console.log('restart');

            this.$timeout(function () {
                _this2.failed = false;
                _this2.succeeded = false;
                _this2.lock.stepsNeeded = _this2.level;
                _this2.lock.nextStep(true);
            }, 1);
        }
    }, {
        key: 'submitScore',
        value: function submitScore() {
            if (window.gamecenter) {
                var data = {
                    score: this.level,
                    leaderboardId: "singleplayer"
                };
                window.gamecenter.submitScore(function () {}, function (e) {
                    console.log('cannot submit gamecenter', e);
                }, data);
            }
        }
    }, {
        key: 'onFailed',
        value: function onFailed() {
            var _this3 = this;

            //console.log('failure');

            this.$timeout(function () {
                _this3.failed = true;
                _this3.blocked = true;
            }, 1);

            this.$timeout(function () {
                _this3.blocked = false;
            }, 340);
        }
    }]);

    return SinglePlayerController;
})();

exports['default'] = SinglePlayerController;
module.exports = exports['default'];

},{"../utils":9}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var SplashController = function SplashController($state, $timeout) {
    _classCallCheck(this, SplashController);

    $timeout(function () {
        $state.go('start');
    }, 1000);
};

exports['default'] = SplashController;
module.exports = exports['default'];

},{}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getRandomIntInclusive = getRandomIntInclusive;

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

},{}]},{},[1]);
