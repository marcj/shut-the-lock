export default class MultiPlayerController {
    constructor($scope, $timeout, $state) {
        this.$timeout = $timeout;
        this.$state = $state;
        this.locks = [];
        this.hard = false;
        this.keysMax = 8;

        this.reset();
    }

    reset() {
        this.keysOpen = this.keysMax/2;
        this.activeGame = false;

        this.ready = {1: false, 2: false};
        this.lives = {1: 4, 2: 4};
        this.playerWon = false;

        if (this.player1) {
            this.player1.reset();
        }
        if (this.player2) {
            this.player2.reset();
        }
    }

    registerLock(lock) {
        this.locks.push(lock);
        lock.stepsNeeded = '';

        if (this.locks.length === 2) {
            this.setupLocks();
        }
    }

    restart() {
        this.reset();
        this.updateNeededSteps();
    }

    setupLocks() {
        this.player2 = this.locks[0];
        this.player1 = this.locks[1];

        this.updateNeededSteps();
    }

    updateNeededSteps(){
        this.player1.stepsNeeded = this.keysMax - this.keysOpen;
        this.player2.stepsNeeded = this.keysOpen;
    }

    isKeyOpen(key) {
        return key <= this.keysOpen;
    }

    setActiveKeys(keys) {
        if (this.activeGame) return;

        this.keysOpen = keys;
        this.setupLocks();
    }

    isReady(player) {
        return this.ready[player];
    }

    setReady(player, ready) {
        this.ready[player] = ready;

        if (this.ready[1] && this.ready[2]) {
            this.startGame();
        }
    }

    startGame() {
        this.activeGame = true;

        //this.startCountdown();
        this.startLocks();
    }

    getPlayerNumber(lock) {
        if (lock === this.player2) {
            return 2;
        }

        return 1;
    }

    touch(player, $event) {
        if (!this.activeGame || this.countDown) {
            return;
        }

        if (1 === player) {
            this.player1.touch($event);
        } else {
            this.player2.touch($event);
        }
    }

    getLives(player) {
        return this.lives[player];
    }

    finished(playerWon) {
        this.player1.stop();
        this.player2.stop();
        this.activeGame = false;

        this.playerWon = playerWon;
    }

    onFailed(lock) {
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

    onSuccess(lock) {
        var player = this.getPlayerNumber(lock);

        if (1 === player){
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

    startCountdown() {
        this.countDown = true;
        this.countDownNumber = 3;

        this.$timeout(() => {
            this.countDownNumber--;
        }, 1000);

        this.$timeout(() => {
            this.countDownNumber--;
        }, 2000);

        this.$timeout(() => {
            this.countDown = false;
            this.startLocks();
        }, 3000);
    }

    startLocks() {
        this.player1.start(true);
        this.player2.start(true);
    }

}