import {getRandomIntInclusive} from '../utils';

export default class LockController {
    constructor($scope, $timeout) {

        this.$timeout = $timeout;
        this.lastLockInnerStep = 0;
        this.player = $scope.player;
        this.steps = 24;
        this.tolerance = 7;
        this.lastAnimation = null;
        this.runs = false;
        this.stepsNeeded = 1;
        this.succeeded = false;

        $scope.player.registerLock(this);
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

        //
        //
        //
        //var test = document.getElementById('test');
        ////var renderer = new PIXI.WebGLRenderer(300, 300);
        //var renderer = PIXI.autoDetectRenderer(400, 300, {transparent: true}, true);
        //
        //// The renderer will create a canvas element for you that you can then insert into the DOM.
        //test.appendChild(renderer.view);
        //
        //// You need to create a root container that will hold the scene you want to draw.
        ////var stage = new PIXI.Container();
        //var stage = new PIXI.Stage(0x66FF99);
        //
        //// This creates a texture from a 'bunny.png' image.
        //var bunnyTexture = PIXI.Texture.fromImage('img/lock-knob.png');
        //var bunny = new PIXI.Sprite(bunnyTexture);
        //
        //// Setup the position and scale of the bunny
        //bunny.position.x = 150;
        //bunny.position.y = 150;
        //
        //bunny.scale.x = 0.5;
        //bunny.scale.y = 0.5;
        //
        //bunny.anchor.x = 0.5;
        //bunny.anchor.y = 0.5;
        //
        //// Add the bunny to the scene we are building.
        //stage.addChild(bunny);
        //
        //var self = this;
        //var animate = () => {
        //    //console.log(this);
        //    //if (!this.currentAngle) {
        //    //    return false;
        //    //}
        //
        //    // start the timer for the next animation loop
        //    requestAnimationFrame(animate);
        //
        //    // each frame we spin the bunny around a bit
        //
        //    //bunny.rotation = self.currentAngle * 0.0174532925;
        //    bunny.rotation += 0.04
        //
        //    // this is the main render call that makes pixi draw your container and its children.
        //    renderer.render(stage);
        //};
        //
        //animate();
    }

    touch() {
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
        console.log('-------------- next step', targetDeg, this.step, this.targetPosition);

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
                this.knob.style[ionic.CSS.TRANSFORM] = 'rotateZ(' + v + 'deg)';
            })
            .on('complete', () => {
                if (!this.runs) return;

                this.runs = false;
                console.log('complete');
                this.onFailure();
            });

        //this.$timeout(() => {
        //    this.touch();
        //}, timeTotal);
        this.lastAnimation.start();
    }

}