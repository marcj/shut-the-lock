import {getRandomIntInclusive} from '../utils';

export default class LockController {
    constructor($scope, $timeout) {
        $scope.player.registerLock(this);

        this.lastLockInnerStep = 0;
        this.player = $scope.player;
        this.steps = 24;
        this.tolerance = 7;
        this.lastAnimation = null;
        this.runs = false;
        this.stepsNeeded = 1;
        this.succeeded = false;

        this.knob = document.getElementById('lock-knob-items');

        //this.handleDrag = function ($event) {
        //    this.lockInnerStep = Math.floor(this.lastLockInnerStep + $event.gesture.deltaY);
        //    knob.style.transform = 'rotate(' + this.lockInnerStep + 'deg)';
        //    knob.style.webkitTransform = 'rotate(' + this.lockInnerStep + 'deg)';
        //};

        ion.sound({
            sounds: [
                {
                    name: "lock2"
                },
                {
                    name: "lock3"
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

    }

    touch($event) {
        this.runs = false;

        var angle = this.currentAngle;
        if (this.lastAnimation) {
            this.lastAnimation.destroy();
        }
        console.log('touch, computed angle', angle, 'runs=', this.runs);

        //353 <-> 367
        //-7 <-> 7
        if (angle > this.tolerance) {
            angle = 360 - angle;
        }

        if (angle >= -this.tolerance && angle <= this.tolerance) {
            this.stepsNeeded--;

            console.log('hit!', angle, this.stepsNeeded);
            if (0 === this.stepsNeeded) {
                //knob.style.transform = 'rotate(' + angle + 'deg)';
                //knob.style.webkitTransform = 'rotate(' + angle + 'deg)';
                this.succeeded = true;
                this.player.onSuccess();

                ion.sound.play("lock_unlock");
                return;
            }

            ion.sound.play("lock" + getRandomIntInclusive(2, 3));
            this.nextStep();
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

    onFailure(){
        this.player.onFailed();
    }

    onSuccess(){
        this.player.onSuccess();
    }

    start(){
        this.nextStep(true);
    }

    nextStep(firstRun) {
        if (firstRun) {
            this.targetStep = getRandomIntInclusive(9, this.steps - 9);
        } else {
            this.targetStep = getRandomIntInclusive(3, this.steps - 3);
        }
        this.targetPosition = this.targetStep * (360 / this.steps);

        //this.animationStart = Date.now();

        this.knob.style[ionic.CSS.TRANSFORM] = 'rotate(' + this.targetPosition + 'deg)';

        var timePerStep = 150;
        var targetDeg = -this.tolerance;
        var timeTotal = this.targetStep * timePerStep;

        if (this.targetStep > this.steps / 2) {
            targetDeg = 360 + this.tolerance;
            timeTotal = (this.steps - this.targetStep) * timePerStep;
        }
        console.log('next step', targetDeg, this.step, this.targetPosition);

        this.runs = true;
        var self = this;
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
                this.knob.style[ionic.CSS.TRANSFORM] = 'rotate(' + v + 'deg)';
            })
            .on('complete', () => {
                if (!this.runs) return;

                this.runs = false;
                console.log('complete');
                this.onFailure();
            });

        //$timeout(function(){
        //    this.handleTouch();
        //}, timeTotal + 30);
        this.lastAnimation.start();
    }

}