import React from "react";
import { useHMSActions } from "@100mslive/react-sdk";
import { usePlayer } from "@empirica/core/player/classic/react";

const base =
  "inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-empirica-500";


export function AudioRoom({
  userName,
  roomCode,
  setInAudioRoom, 
  className = "",
  forceJoin = false, 
  buttonText = "Join",
}) {
  const player = usePlayer();
  const hmsActions = useHMSActions();
  const handleSubmit = async (e) => {
    // use room code to fetch auth token
    const authToken = await hmsActions.getAuthTokenByRoomCode({ roomCode })
    try {
      player.stage.set("joinedRoom", true)
      await hmsActions.join({ userName, authToken });
      setInAudioRoom(true);
    } catch (e) {
      console.error('Error joining room:', e)
    }
  };

  if (forceJoin) {
    handleSubmit();
    return null
  } else {
    return (
      <button className={`${base} ${className}`} onClick = {handleSubmit}>
        { buttonText }
      </button>
    );
  }
}  