/*Todo list */
const addbut = document.getElementById('Add');
const saddbut = document.getElementById('second');
const mylist = document.getElementById('mylist');
const mylist2 = document.getElementById('mylist2');
const te = document.getElementById('task');

// Load tasks from local storage when the page loads
window.addEventListener('load', () => {
  loadTasks(mylist, 'tasks'); // Load tasks for mylist
  loadTasks(mylist2, 'tasks2'); // Load tasks for mylist2
});

addbut.addEventListener('click', () => {
  addTask(te, mylist, 'tasks');
});

saddbut.addEventListener('click', () => {
  addTask(te, mylist2, 'tasks2');
});

function addTask(inputField, taskList, storageKey) {
  const taskText = inputField.value.trim();

  if (taskText !== '') {
    const newdiv = document.createElement('div');
    const newli = document.createElement('li');
    const check = document.createElement('input');
    check.type = 'checkbox';
    newli.textContent = taskText;
    newli.id = taskText;
    check.id = taskText;
    newdiv.appendChild(newli);
    newdiv.appendChild(check);
    newdiv.style.display = 'flex';
    taskList.appendChild(newdiv);

    // Save tasks to local storage
    saveTasks(taskList, storageKey);

    inputField.value = '';
  }
}

function deletebutton(name, mylist, storageKey) {
  const child = document.getElementById(name);
  mylist.removeChild(child.parentElement);

  // Remove task from local storage
  removeFromLocalStorage(storageKey, name);
}

mylist.addEventListener('click', (event) => {
  if (event.target.tagName === 'INPUT') {
    deletebutton(event.target.id, mylist, 'tasks');
  }
});

mylist2.addEventListener('click', (event) => {
  if (event.target.tagName === 'INPUT') {
    deletebutton(event.target.id, mylist2, 'tasks2');
  }
});

// Save tasks to local storage
function saveTasks(taskList, storageKey) {
  const tasks = Array.from(taskList.querySelectorAll('li')).map((li) => li.textContent);
  localStorage.setItem(storageKey, JSON.stringify(tasks));
}

// Load tasks from local storage
function loadTasks(taskList, storageKey) {
  const tasks = JSON.parse(localStorage.getItem(storageKey)) || [];

  for (const taskText of tasks) {
    const newdiv = document.createElement('div');
    const newli = document.createElement('li');
    const check = document.createElement('input');
    check.type = 'checkbox';
    newli.textContent = taskText;
    newli.id = taskText;
    check.id = taskText;
    newdiv.appendChild(newli);
    newdiv.appendChild(check);
    newdiv.style.display = 'flex';
    taskList.appendChild(newdiv);
  }
}

// Remove a task from local storage
function removeFromLocalStorage(storageKey, taskId) {
  const tasks = JSON.parse(localStorage.getItem(storageKey)) || [];
  const updatedTasks = tasks.filter((task) => task !== taskId);
  localStorage.setItem(storageKey, JSON.stringify(updatedTasks));
}



/* Todo List */
/*Pomodoro*/
function sendTimerSettings(worktime, breaktime) {
  chrome.runtime.sendMessage({ worktime, breaktime });
}

const timerDisplay = document.getElementById("timer");
let worktime = 25;
let breaktime = 5;
let timer = new PomodorTimer(worktime, breaktime); // Initialize the timer

const customizeButton = document.createElement("button");
customizeButton.textContent = "Customize";
document.body.appendChild(customizeButton);

const customizeOptions = document.createElement("div");
customizeOptions.style.display = "none";
customizeOptions.innerHTML = `
  <label for="workTime">Work Time (minutes):</label>
  <input type="number" id="workTime" min="1" value="25">
  <br>
  <label for="breakTime">Break Time (minutes):</label>
  <input type="number" id="breakTime" min="1" value="5">
  <button id="applyButton">Apply</button>
`;
document.body.appendChild(customizeOptions);

const workTimeInput = document.getElementById("workTime");
const breakTimeInput = document.getElementById("breakTime");
const applyButton = document.getElementById("applyButton");

customizeButton.addEventListener("click", () => {
  if (customizeOptions.style.display === "none" || customizeOptions.style.display === "") {
      customizeOptions.style.display = "block";
  } else {
      customizeOptions.style.display = "none";
  }
});

applyButton.addEventListener('click', () => {
  const newWorktime = parseInt(workTimeInput.value);
  const newBreaktime = parseInt(breakTimeInput.value);
  if (!isNaN(newWorktime) && !isNaN(newBreaktime)) {
      worktime = newWorktime;
      breaktime = newBreaktime;
      timer = new PomodorTimer(worktime, breaktime); // Create a new timer with customized values
      sendTimerSettings(worktime, breaktime); // Send new timer settings to background.js
      updateTimerDisplay();
      customizeOptions.style.display = "none";
  } else {
      alert("Please enter valid numeric values for work and break times.");
  }
});

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
  this.timer = this.worktime; // Reset the timer to the work time
  clearInterval(this.interval);
  updateTimerDisplay();
};

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
const customize=document.createElement("button");
customize.textContent= "Customize";

document.body.appendChild(start);
document.body.appendChild(stop);
document.body.appendChild(reset);

/*Music player*/

document.addEventListener('DOMContentLoaded', function () {
  const playButton = document.getElementById('Addplay');
  const listDiv = document.getElementById('list');
  const played = document.getElementById('song');
  const alternateNameInput = document.getElementById('alternateName');
  
  // Initialize playlists from storage
  chrome.storage.local.get(['playlists'], function (result) {
    const playlists = result.playlists || [];
    renderPlaylists(playlists);
  });

  function renderPlaylists(playlists) {
    listDiv.innerHTML = ''; // Clear the existing list

    for (const playlist of playlists) {
      const containerDiv = document.createElement('div');
      containerDiv.className = 'playlist-item';

      const anchor = document.createElement('a');
      anchor.textContent = playlist.alternateName;
      anchor.href = playlist.playlistUrl;
      anchor.target = '_blank';

      containerDiv.appendChild(anchor);

      const playButton = document.createElement('button');
      playButton.textContent = 'Play';
      playButton.addEventListener('click', () => {
        const newTab = window.open(playlist.playlistUrl, 'noreferrer');
      });
      containerDiv.appendChild(playButton);

      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.addEventListener('click', () => {
        // Remove the playlist from storage and re-render the list
        const updatedPlaylists = playlists.filter(p => p.playlistUrl !== playlist.playlistUrl);
        chrome.storage.local.set({ playlists: updatedPlaylists }, function () {
          renderPlaylists(updatedPlaylists);
        });
      });
      containerDiv.appendChild(deleteButton);

      listDiv.appendChild(containerDiv);
    }
  }

  playButton.addEventListener('click', () => {
    const playlistUrl = played.value.trim();
    const alternateName = alternateNameInput.value.trim();
    const playlistRegex = /^https?:\/\/(www\.)?youtube\.com\/playlist\?list=[A-Za-z0-9_-]+$/;

    if (playlistRegex.test(playlistUrl) && alternateName !== '') {
      const autoplayPlaylistUrl = `${playlistUrl}&autoplay=1`;

      // Retrieve existing playlists from storage
      chrome.storage.local.get(['playlists'], function (result) {
        const playlists = result.playlists || [];
        const newPlaylist = { playlistUrl: autoplayPlaylistUrl, alternateName };

        // Add the new playlist and save it to storage
        playlists.push(newPlaylist);
        chrome.storage.local.set({ playlists }, function () {
          renderPlaylists(playlists); // Re-render the playlist list
        });

        // Clear input fields
        played.value = '';
        alternateNameInput.value = '';
      });
    } else if (!playlistRegex.test(playlistUrl)) {
      alert('Please enter a valid YouTube playlist URL.');
    } else if (alternateName === '') {
      alert('Please provide an alternate name.');
    }
  });
});


/*Pomodoro*/
/*blocking of navigation to unwanted sights*/
// List of blocked hostnames (e.g., Facebook and Twitter)
/*chrome.webNavigation.onCommitted.addListener(function(details) {
    if (details.url.startsWith('https://www.youtube.com/')) {
        alert("yipekayeee mf");
        chrome.tabs.update(details.tabId, {url: "https://mail.google.com/mail/u/0/#inbox"});
}
});
let tabb;
function getg(details){
    tabb = details.tabId;
}
*/

function block(details){
    if (details.url.startsWith('https://www.youtube.com/')) {
        alert("yipekayeee mf");
        chrome.tabs.update(details.tabId, {url: "test.html"});
    }
    if (details.url.startsWith('https://www.facebook.com/')) {
        alert("yipekayeee mf");
        chrome.tabs.update(details.tabId, {url: "test.html"});
    }
    if (details.url.startsWith('https://www.instagram.com/')) {
        alert("yipekayeee mf");
        chrome.tabs.update(details.tabId, {url: "test.html"});
    }
    if (details.url.startsWith('https://www.twitter.com/')) {
        alert("yipekayeee mf");
        chrome.tabs.update(details.tabId, {url: "test.html"});
    }
    if (details.url.startsWith('https://www.netflix.com/')) {
        alert("yipekayeee mf");
        chrome.tabs.update(details.tabId, {url: "test.html"});
    }
}

chrome.webNavigation.onCommitted.addListener(block);
/*blocking of navigation to unwanted sights*/
/*motivation quotes */
const generateHTML = () => {
    return `
    <div class="container">
  <div class="quote-box">
    <p id="quote">"Quote goes here..."</p>
    <small id="author">- Author</small>
  </div>
  <button id="btn">New Quote</button>
</div>
     `;
};
const adquote = document.getElementById('formotivation');
const newElement = document.createElement("div");
newElement.innerHTML  = generateHTML();
adquote.appendChild(newElement);
const api = "https://api.quotable.io/random";

const quote = document.getElementById("quote");
const author = document.getElementById("author");
const btn = document.getElementById("btn");

btn.addEventListener("click", getQuote);

function getQuote() {
  fetch(api)
    .then((res) => res.json())
    .then((data) => {
      quote.innerHTML = `"${data.content}"`;
      author.innerHTML = `- ${data.author}`;
    });
}
/*motivation quotes */