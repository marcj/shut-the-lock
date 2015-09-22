export default class SinglePlayerController {
    constructor($scope, $timeout, $state) {
        this.$timeout = $timeout;
        this.$state = $state;
        this.level = 1;
        this.failed = false;
        this.succeeded = false;
        this.blocked = false;
        this.levelDescription = 'Bloody beginner';
    }

    registerLock(lock) {
        this.lock = lock;
    }

    touch($event) {
        if (!this.active) {
            this.start();
            return;
        }

        console.log('touch', this.active, this.lock.runs);

        if (this.lock.runs) {
            this.lock.touch($event);
        }
    }

    back(){
        if (this.lock.runs) {
            this.lock.stop();
        }

        this.$state.go('start');
    }

    onSuccess() {
        this.$timeout(() => {
            this.succeeded = true;
            this.level++;
        }, 1);
    }

    start() {
        this.$timeout(() => {
            this.active = true;
            this.lock.stepsNeeded = this.level;
            this.lock.start();
        }, 1);
    }

    restart() {
        if (this.blocked) {
            return;
        }
        console.log('restart');

        this.$timeout(() => {
            this.failed = false;
            this.succeeded = false;
            this.lock.stepsNeeded = this.level;
            this.lock.nextStep(true);
        }, 1);
    }

    submitScore() {
        if (window.gamecenter) {
            var data = {
                score: this.level,
                leaderboardId: "singleplayer"
            };
            window.gamecenter.submitScore(function () {
            }, function (e) {
                console.log('cannot submit gamecenter', e);
            }, data);
        }
    }

    onFailed() {
        console.log('failure');

        this.$timeout(() => {
            this.failed = true;
            //this.blocked = true;
        }, 1);

        //this.$timeout(() => {
        //    this.blocked = false;
        //}, 340);
    }

    showLeaderboard() {
        var data = {
            leaderboardId: "singleplayer"
        };
        window.gamecenter.showLeaderboard(function () {
        }, function () {
        }, data);
    }
}