export default class SinglePlayerController {
    constructor($scope, $timeout, $state) {
        this.$timeout = $timeout;
        this.$state = $state;
        this.failed = false;
        this.succeeded = false;
        this.blocked = false;

        this.levelDescriptions = [
            'Bloody beginner', //0-9
            'Enganged amateur',//10-19
            'Advanced player',//20-29
            'Addicted', //30-39
            'Engaged addicted', //40-49
            'Crazy player', //50-59
            'Better go out', //60-69
            'It is getting serious', //70-79
            'Ok, interesting', //80-89
            'Are you serious?', //90-99
        ];

        this.setLevel(window.localStorage['singleplayerLevel'] || 1);
    }

    setLevel(level){
        this.level = level;

        this.levelDescription = '';

        for (let k in this.levelDescriptions) {
            var start = k*10;
            var end = start + 9;

            if (this.level >= start && this.level <= end) {
                this.levelDescription = this.levelDescriptions[k];
                break;
            }
        }

        if (!this.levelDescription) {
            this.levelDescription = 'Crazy dog!';
        }
    }


    registerLock(lock) {
        this.lock = lock;
        this.lock.stepsNeeded = this.level;
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
            window.localStorage['singleplayerLevel'] = this.level;
            this.setLevel(this.level);
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