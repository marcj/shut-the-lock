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
        this.stepsNeeded = 1;

        $scope.lock = this;
        $scope.player.registerLock(this);
        this.knobRed = window.angular.element($element).children()[1];
        this.knob = window.angular.element($element).children()[2];

        //this.handleDrag = function ($event) {
        //    this.lockInnerStep = Math.floor(this.lastLockInnerStep + $event.gesture.deltaY);
        //    knob.style.transform = 'rotate(' + this.lockInnerStep + 'deg)';
        //    knob.style.webkitTransform = 'rotate(' + this.lockInnerStep + 'deg)';
        //};
    }

    touch() {
        this.runs = false;

        var angle = this.currentAngle;
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

    stop(){
        if (this.lastAnimation) {
            this.lastAnimation.destroy();
        }
        this.runs = false;
    }

    reset(){
        this.knob.style[ionic.CSS.TRANSFORM] = 'rotateZ(0deg)';
    }

    onFailure(){
        this.knobRed.classList.add('visible');

        this.$timeout(() => {
            this.knobRed.classList.remove('visible');
        }, 400);

        this.$timeout(() => {
            this.player.onFailed(this);
        }, 1);
    }

    onSuccess(){
        this.$timeout(() => {
            this.player.onSuccess(this);
        }, 1);
    }

    start(){
        this.nextStep(true);
    }

    //render(){
    //    this.knob.style[ionic.CSS.TRANSFORM] = 'rotate(' + this.currentAngle + 'deg)';
    //    window.requestAnimationFrame(() => this.render());
    //}

    nextStep(firstRun) {
        if (firstRun) {
            this.targetStep = getRandomIntInclusive(9, this.steps - 9);
        } else {
            this.targetStep = getRandomIntInclusive(3, this.steps - 3);
        }
        this.targetPosition = this.targetStep * (360 / this.steps);

        //window.requestAnimationFrame(() => this.render());

        //this.animationStart = Date.now();

        this.currentAngle = this.targetPosition;
        this.knob.style[ionic.CSS.TRANSFORM] = 'rotateZ(' + this.targetPosition + 'deg)';

        var timePerStep = 140;
        var targetDeg = -this.tolerance;
        var timeTotal = this.targetStep * timePerStep;

        if (this.targetStep > this.steps / 2) {
            targetDeg = 360 + this.tolerance;
            timeTotal = (this.steps - this.targetStep) * timePerStep;
        }
        //console.log('-------------- next step', targetDeg, this.step, this.targetPosition);

        this.runs = true;
        this.lastAnimation = collide.animation({
            duration: timeTotal,
            easing: 'linear'
        })
            .on('step', (v) => {

                if (targetDeg < 0) {
                    var buffer = this.targetPosition + Math.abs(targetDeg);
                    v = buffer - (v * buffer);
                    v += targetDeg;
                } else {
                    v = (v * (targetDeg - this.targetPosition));
                    v += this.targetPosition;
                }

                this.currentAngle = v;
                this.knob.style[ionic.CSS.TRANSFORM] = 'rotateZ(' + v + 'deg)';
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