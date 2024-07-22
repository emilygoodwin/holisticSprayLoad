import { EmpiricaClassic } from "@empirica/core/player/classic";
import { EmpiricaContext } from "@empirica/core/player/classic/react";
import { EmpiricaMenu, EmpiricaParticipant } from "@empirica/core/player/react";
import React from "react";
import { Game } from "./Game";
import { ExitSurvey } from "./intro-exit/ExitSurvey";
import { Introduction } from "./intro-exit/Introduction";
import { MicTest } from "./intro-exit/MicTest";
import { MyPlayerCreate } from "./PlayerCreate.jsx";
import { ConsentForm } from "./ConsentForm.jsx";
import { useState } from "react";

export default function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const playerKey = urlParams.get("participantKey") || "";
  
  const [inAudioRoom, setInAudioRoom] = useState(false);

  const { protocol, host } = window.location;
  const url = `${protocol}//${host}/query`;

  function introSteps({ game, player }) {
    return [Introduction, MicTest];
  }

  function exitSteps({ game, player }) {
    return [ExitSurvey];
  }

  return (
    <EmpiricaParticipant url={url} ns={playerKey} modeFunc={EmpiricaClassic}>
      <div className="h-screen relative">
        <EmpiricaMenu position="bottom-left" />
        <div className="h-full overflow-auto">
          <EmpiricaContext introSteps={introSteps} exitSteps={exitSteps} consent = {ConsentForm} playerCreate = {MyPlayerCreate}>
            <Game inAudioRoom = {inAudioRoom} setInAudioRoom = {setInAudioRoom} />
          </EmpiricaContext>
        </div>
      </div>
    </EmpiricaParticipant>
  );
}
