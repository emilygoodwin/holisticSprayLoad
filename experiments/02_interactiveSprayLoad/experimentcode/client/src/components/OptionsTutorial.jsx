import React from "react";
import { usePlayer, usePlayers, useRound, useStage } from "@empirica/core/player/classic/react";
import { RefGameTutorialImage } from "./RefGameTutorialImage";

export function TutorialOptions() {
    const player = usePlayer();
    const round = useRound();
    const players = usePlayers();
    const stage = useStage(); 
  
    function onClick(choice) {
      if(player.get("role") == "guesser" & stage.get("name") == "tutorial-choice") {
        round.set("decision", choice);
        // Guesser selection sets "submit" to "true" for all players, necessary for stage advance https://docs.empirica.ly/overview/lifecycle/customising-when-players-submit-stages
        player.stage.set("submit", true)
      }
    }
    
    const imgOrder = player.get("role") == "guesser" ? round.get("guesserOrder") : round.get("directorOrder")
    
    if (player.get("role") == "director" && stage.get("name") == "tutorial-choice" && !player.stage.get("submit")){
      var instructions = 
      <div>
        Tell your partner what Sally will do today, shown in the picture circled in green. <br></br>
        Please use a full sentence, the verb <strong> {round.get("verb")}</strong>, and remember to mention Sally.
      </div>
    }
    else if (player.get("role") == "director" && (stage.get("name") == "tutorial-result" || player.stage.get("submit"))){
      var instructions = 
      <div>
        To describe this image, you could have said "<strong>{round.get("sentence")}</strong>".
      </div>
    }
    else if (stage.get("name") == "tutorial-choice" && player.get("role") == "guesser"){
      var instructions = 
      <div>
        Imagine your partner says "{round.get("sentence")}". <br></br> Click on the image you think they are describing. 
      </div>
    }
    else if (stage.get("name") == "tutorial-result" && player.get("role") == "guesser"){
      var instructions = 
      <div>
        Imagine your partner said "{round.get("sentence")}". <br></br> You should have clicked on the image highlighted with a green square.
      </div>
    }


    return (

        <div className="justify-center m-5">

          <table>
          <caption>{instructions}</caption>
            <tbody>
              <tr>
              <td><RefGameTutorialImage tag={imgOrder[0]} handleClick={() => onClick(imgOrder[0])}></RefGameTutorialImage></td>
              <td><RefGameTutorialImage tag={imgOrder[1]} handleClick={() => onClick(imgOrder[1])}></RefGameTutorialImage></td>
              <td><RefGameTutorialImage tag={imgOrder[2]} handleClick={() => onClick(imgOrder[2])}></RefGameTutorialImage></td>
              </tr>
            </tbody>
          </table>
        </div>

    );
  }