import React, { useState, useEffect } from "react";

import "./App.scss";

import Button from "./Common/Button/Button";

function App() {
  const [bells, setBells] = useState([
    { time: 60 },
    { time: 30 },
    { time: 20 },
    { time: 15 },
    { time: 10 },
    { time: 5 },
  ]);
  const [requestedPermission, setRequestedPermission] = useState(false);
  const [secondsSinceStart, setSecondsSinceStart] = useState(0);
  const [meetingIsRunning, setMeetingIsRunning] = useState(false);

  useEffect(() => {
    if (!requestedPermission) {
      setRequestedPermission(true);
      Notification.requestPermission();
    }
  }, [requestedPermission]);

  function ringBell(time) {
    // Let's check if the browser supports notifications
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    }

    // Let's check whether notification permissions have already been granted
    else if (Notification.permission === "granted") {
      // If it's okay let's create a notification
      new Notification(`Meeting runtime: ${getFormattedTime(time)}`);
    } else {
      console.log("We don't have permissions to create notifications");
    }
  }

  function onFormSubmit(e) {
    e.preventDefault();
  }

  function stopMeeting() {
    window.location.reload();
  }

  function startMeeting() {
    setMeetingIsRunning(true);
    setInterval(() => {
      setSecondsSinceStart((secondsSinceStart) => secondsSinceStart + 1);
    }, 1000);

    let realBells = JSON.parse(JSON.stringify(bells));
    for (let i = 0; i < 20; i++) {
      realBells.push(realBells[realBells.length - 1]);
    }

    realBells.forEach((bell, i) => {
      const previousDelay = realBells.slice(0, i).reduce((sum, currentBell) => {
        return sum + currentBell.time * 60;
      }, 0);
      const bellDelay = previousDelay + bell.time * 60;
      bell.realTime = bellDelay;

      setTimeout(() => ringBell(bell.realTime), bellDelay * 1000);
    });
  }

  function updateBell(e, index) {
    setBells([
      ...bells.slice(0, index),
      { ...bells[index], time: e.target.value },
      ...bells.slice(index + 1),
    ]);
  }

  function displayBells() {
    return bells.map((bell, i) => (
      <div className="input-group" key={i}>
        <label>Bell {i + 1} after (minutes):</label>
        <input value={bell.time} onChange={(e) => updateBell(e, i)} />
      </div>
    ));
  }

  function getFormattedTime(seconds) {
    let label = "";
    seconds = Math.floor(seconds);
    if (seconds < 60) {
      label = `${seconds} second${seconds > 10 ? "s" : ""}`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      label = `${minutes} minute${minutes > 10 ? "s" : ""}`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds - hours * 3600) / 60);
      label = `${hours} hour${hours > 10 ? "s" : ""} ${minutes} minute${
        minutes > 10 ? "s" : ""
      }`;
    }
    return label;
  }

  function displayMeetingRuntime() {
    let label = "";
    if (!meetingIsRunning) {
      label = "No meeting is running";
    } else {
      label = `Meeting runtime: ${getFormattedTime(secondsSinceStart)}`;
    }

    return <p className="meeting-runtime">{label}</p>;
  }

  return (
    <div className="App">
      <form onSubmit={onFormSubmit}>
        {displayMeetingRuntime()}
        <div className="input-list">{displayBells()}</div>
        {meetingIsRunning ? (
          <Button type="secondary" label="Stop meeting" onClick={stopMeeting} />
        ) : (
          <Button type="primary" label="Start meeting" onClick={startMeeting} />
        )}
      </form>
    </div>
  );
}

export default App;
