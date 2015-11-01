import {getRandomIntInclusive} from '../utils';

export default class LockController {
    constructor($scope, $element, $timeout) {
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

        $scope.$on('$destroy', () => {
            this.stop()
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

    touch() {
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

    stop() {
        if (this.lastAnimation) {
            this.lastAnimation.destroy();
        }
        this.runs = false;
    }

    reset() {
        this.knob.style[ionic.CSS.TRANSFORM] = 'rotateZ(0deg)';
        this.arrow.style[ionic.CSS.TRANSFORM] = 'rotateZ(0deg)';
        this.currentAngle = 0;
    }

    onFailure() {
        this.knobRed.classList.add('visible');

        setTimeout(() => {
            this.knobRed.classList.remove('visible');
        }, 400);

        this.$timeout(() => {
            this.player.onFailed(this);
        }, 1);
    }

    onSuccess() {
        this.player.onSuccess(this);
    }

    start() {
        this.nextStep(true);
    }

    //render(){
    //    this.knob.style[ionic.CSS.TRANSFORM] = 'rotate(' + this.currentAngle + 'deg)';
    //    window.requestAnimationFrame(() => this.render());
    //}

    nextStep(bigDiff) {
        this.direction = (this.direction === 'right') ? 'left' : 'right';

        var diff = 6;
        var minDiff = 3;
        if (bigDiff) {
            minDiff = 7;
            diff = 11;
        }

        var currentStep = Math.abs(Math.floor((this.currentAngle) / (360 / this.steps)));

        if (this.direction === 'left') {
            this.targetStep = getRandomIntInclusive(currentStep - diff, currentStep - minDiff);
        } else {
            this.targetStep = getRandomIntInclusive(currentStep + minDiff, currentStep + diff);
        }

        this.targetPosition = this.targetStep * (360 / this.steps);

        this.knob.style[ionic.CSS.TRANSFORM] = 'rotateZ(' + this.targetPosition + 'deg)';

        var timePerStep = 140;
        var stepsNeeded = (this.targetPosition - this.currentAngle) / (360 / this.steps);
        var timeTotal = Math.abs(stepsNeeded * timePerStep);

        //this.lastStep = this.targetStep;

        this.runs = true;
        var lastLoop = new Date;
        var oldFps = 0;
        var debug = document.getElementById('debug');
        var startedAngle = this.currentAngle;

        console.log('currentStep=', currentStep, 'stepsneeded=', stepsNeeded.toFixed(0), ' - time:', timeTotal.toFixed(0), 'stepsNeeded=', stepsNeeded,
            'currentAngle', this.currentAngle, 'targetPosition=', this.targetPosition);

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
            })
            .on('step', (v) => {
                v = anglesNeeded * v;
                v += startedAngle;

                this.currentAngle = v;
                this.arrow.style[ionic.CSS.TRANSFORM] = 'rotate(' + this.currentAngle + 'deg)';

                //var thisLoop = new Date;
                //var newFps = 1000 / (thisLoop - lastLoop);
                //
                //var filteredValue = oldFps + (newFps - oldFps) / (100 / (thisLoop-lastLoop));
                //
                //lastLoop = thisLoop;
                //oldFps = newFps;
                //debug.innerHTML = filteredValue.toFixed(0) + ' FPS';
            })
            .on('complete', () => {
                if (!this.runs) return;

                this.runs = false;
                //console.log('complete');
                this.onFailure();
            });

        this.lastAnimation.start();
    }

}