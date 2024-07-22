import React from "react";
import { usePlayer, useRound, useStage } from "@empirica/core/player/classic/react";

const base =
  "inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-empirica-500";
const prim =
  "border-gray-300 shadow-sm text-gray-700 bg-white hover:bg-gray-50";
const sec =
  "border-transparent shadow-sm text-white bg-empirica-600 hover:bg-empirica-700";

export function RefGameButton({
  children,
  tag = "",
  handleClick = null,
  className = "",
  primary = false,
  type = "button",
  autoFocus = false,
}) {
  const player = usePlayer();
  const stage = useStage();
  const round = useRound();

  // select buttons are highlighted for the director at the 'choice' stage, and for both players at the 'result' stage
  const highlightButton = (player.get("role") == "director" || stage.get("name") == "result") &
  (round.get("target") == tag | (stage.get("name") == "result" & round.get("decision") == tag )) 
  
  const borderWidth = highlightButton ? "5px" : "0px"

  const borderColor = stage.get("name") == "choice" ? "black" : round.get("target") == tag ? "green" : "red"

  return (
    <div style = {{border: "solid " + `${borderWidth}` + " " + `${borderColor}`, padding: '2px'}}>
    <button
      type={type}
      onClick={handleClick}
      className={`${base} ${primary ? prim : sec} ${className}`}
      autoFocus={autoFocus}
    >
      {children}
    </button>
    </div>
  );
}
