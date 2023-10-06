const addbut = document.getElementById('Add');
addbut.addEventListener('click', ()=>{
   const newone = document.createElement('li');
   const te = document.getElementById('task');
   newone.innerText =  te.value.trim();
   te.innerText = '';
   const myt = document.getElementById('mylist');
   myt.appendChild(newone);
});
/*Pomodoro*/
const timerDisplay = document.getElementById("timer");

function PomodorTimer(worktime, breaktime) {
    this.worktime = worktime * 60;
    this.breaktime = breaktime * 60;
    this.timer = 0;
    this.interval = null;
}

PomodorTimer.prototype.startWork = function () {
    if (this.timer === 0) {
        this.timer = this.worktime;
    }
    clearInterval(this.interval);
    this.interval = setInterval(() => {
        this.timer--;
        if (this.timer === 0) {
            clearInterval(this.interval);
            this.startBreak();
        }
        updateTimerDisplay();
    }, 1000);
};

PomodorTimer.prototype.startBreak = function () {
    if (this.timer === 0) {
        this.timer = this.breaktime;
    }
    clearInterval(this.interval);
    this.interval = setInterval(() => {
        this.timer--;
        if (this.timer === 0) {
            clearInterval(this.interval);
            this.startWork();
        }
        updateTimerDisplay();
    }, 1000);
};

PomodorTimer.prototype.stop = function () {
    clearInterval(this.interval);
};

PomodorTimer.prototype.reset = function () {
    clearInterval(this.interval);
    this.timer = 0;
    updateTimerDisplay();
};

const timer = new PomodorTimer(25, 5);

function updateTimerDisplay() {
    const minutes = Math.floor(timer.timer / 60);
    const seconds = timer.timer % 60;
    timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

const start = document.createElement("button");
start.textContent = "Start";
start.addEventListener("click", () => {
    timer.startWork();
});

const stop = document.createElement("button");
stop.textContent = "Stop";
stop.addEventListener("click", () => {
    timer.stop();
});

const reset = document.createElement("button");
reset.textContent = "Reset";
reset.addEventListener("click", () => {
    timer.reset();
});

document.body.appendChild(start);
document.body.appendChild(stop);
document.body.appendChild(reset);
