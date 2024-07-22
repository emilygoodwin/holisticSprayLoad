import React from "react";
import { usePlayer, usePlayers, useRound, useStage } from "@empirica/core/player/classic/react";
import { RefGameImage } from "../components/RefGameImage";

export function Options() {
    const player = usePlayer();
    const round = useRound();
    const players = usePlayers();
    const stage = useStage(); 
  
    function onClick(choice) {
      if(player.get("role") == "guesser" & stage.get("name") == "choice") {
        round.set("decision", choice);
        // Guesser selection sets "submit" to "true" for all players, necessary for stage advance https://docs.empirica.ly/overview/lifecycle/customising-when-players-submit-stages
        players.map(p => p.stage.set("submit", true))
        // hmsActions.leave();
      }
    }
    // const directorPrompt =`Please make a sentence with the verb ${round.get("verb")}`
    const imgOrder = player.get("role") == "guesser" ? round.get("guesserOrder") : round.get("directorOrder")
    // const prompt = player.get("role") == "director" ? directorPrompt : ''
    
    return (
  
        <><div className="flex justify-center m-5">

        <table>
        <caption>{stage.get("name") == "result" ? null : 
        player.get("role") == "director" ? <p> Make a sentence with the verb <strong> {round.get("verb")} </strong>, to tell your partner what Sally will do: </p>: 
        <p> Please select the picture that shows what Sally will do today, based on your partner's description. </p>
        }</caption>
        
          <tbody>
            <tr>  
              <td><RefGameImage tag={imgOrder[0]} handleClick={() => onClick(imgOrder[0])}></RefGameImage></td>
              <td><RefGameImage tag={imgOrder[1]} handleClick={() => onClick(imgOrder[1])}></RefGameImage></td>
              <td><RefGameImage tag={imgOrder[2]} handleClick={() => onClick(imgOrder[2])}></RefGameImage></td>
            </tr>
            <tr><td><img src={'../../img/sally.png'} width="100" /></td></tr>
            
          </tbody>
          
        </table>
      </div>
      </>

    );
  }
