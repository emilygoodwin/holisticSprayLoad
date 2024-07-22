import { ClassicListenersCollector } from "@empirica/core/admin/classic";
import axios from 'axios';
import _ from 'underscore';
import { info } from "@empirica/core/console";
import { generateMainExperimentVariables } from "./stims.js";
const fs = require("fs");

export const Empirica = new ClassicListenersCollector();

function build100MsApiInstance(game) {
  const treatment = game.get("treatment")
  const { managementToken, templateID } = treatment;  
  console.log('management:', managementToken)
  console.log('templateID:', templateID)
  info(`management: ${managementToken}`)
  info(`templateID: ${templateID}`)

  const axiosInstance = axios.create({
    baseURL: 'https://api.100ms.live/v2/',
    headers: {
      'Authorization': 'Bearer ' + managementToken,
      'Content-Type': 'application/json',
    },
  });

  return {axiosInstance, templateID}
}


Empirica.on("batch", "status", (ctx, { batch, status }) => {

  if (status === "running") {
    batch.games.forEach((game, i) => {

      const {axiosInstance, templateID} = build100MsApiInstance(game)
      const createRoomCode = async () => {
        try {
          const getRoom = await axiosInstance.post('rooms', {
            name: game.id,
            description: 'audio call room',
            template_id: templateID,
            region: 'us',
            recording_info: {
              enabled: true
            },  
          });
          
          const roomId = getRoom.data.id;
          const getCode = await axiosInstance.post(`room-codes/room/${roomId}`);
          const roomCodeList = getCode.data.data
          const roomCode = roomCodeList.find(({role}) => role == "speaker").code // Get room code for the speaker role

          game.set("roomCode", roomCode)
          game.set("roomID", roomId)
          info(`roomid ${roomId} assigned to game ${game.id}`)

        } catch (error) {
          console.error('Error creating room and getting guest code:', error);
          throw error;
        }
      }
    
      createRoomCode();

      // console.log('All rooms created, and all roomCodes set!')
      info("Finished create room code call")
    });
  }
});

Empirica.onGameStart(({ game }) => {

  game.set("timestamps", [])


  const roleList = _.shuffle(['director','guesser'])
  game.players.forEach((player, i) => {
		player.set("role", roleList[i]);
  });

  game.players.forEach((player) => {
    let roomCode = game.get("roomCode")
    player.set("roomCode",roomCode);

    // console.log(`Assigned room code ${roomCode} to player ${player.id}`)
    info(`Assigned room code ${roomCode} to player ${player.id}`)
  });

  // since player names are getting dropped, save them also to the game object
  let PlayerIDList = game.players.map(a => a.id);
  // console.log(PlayerIDList)
  game.set("playerIDList", PlayerIDList)

  console.log(`Game ${game.id} initialized, all players are assigned roomCodes...`)
  info(`Game ${game.id} initialized, all players are assigned roomCodes...`)


  let stims = generateMainExperimentVariables()
  // console.log("stims:", stims)

  let roundCounter = 1;

  stims.map(function(stim) {

    if (stim.phase == 'train') {
      if (stim.trialid == 0) {
        roundCounter = 0
        const instructRound = game.addRound({
          name: `Round ${roundCounter}`,
          instructions: 'train'
        });
        instructRound.addStage({ name: "instructions", duration: 10000 })
      }
      const round = game.addRound({
        name: `Round ${roundCounter}`,
        label: stim.label,
        nounType: stim.type,
        instructions: null
      });
      round.addStage({ name: "train", duration: 10000 });
      roundCounter++; 
    }


    if (stim.phase == 'recall') {
      if (stim.trialid == 0) {
        const instructRound = game.addRound({
          name: `Round ${roundCounter}`,
          instructions: 'recall'
        });
        instructRound.addStage({ name: "instructions", duration: 10000 })
      }
      const round = game.addRound({
        name: `Round ${roundCounter}`,
        label: stim.label,
        nounType: stim.type, // count noun or not; used to say "yes, we called this lemonade/a table"
        instructions: null
      });
      round.addStage({ name: "recall", duration: 10000 });
      roundCounter++; 
    }
    if (stim.phase == 'tutorial') {
      if (stim.trialid == 0) {
        const instructRound = game.addRound({
          name: `Round ${roundCounter}`,
          instructions: 'tutorial'
        });
        instructRound.addStage({ name: "instructions", duration: 10000 })
      }
      const round = game.addRound({
        name: `Round ${roundCounter}`,
        verb: stim.verb,
        target: stim.target_image,
        distractor0: stim.distractor0,
        distractor1: stim.distractor1, 
        images: stim.images.split(","),
        target_loc: stim.target_loc, 
        target_sub: stim.target_sub, 
        distractor_subs: stim.distractor_subs, 
        distractor_locs: stim.distractor_locs, 
        foreCondition: stim.foreCondition, 
        informativityCondition: stim.informativityCondition, 
        mirroringCondition: stim.mirroringCondition, 
        sentence: stim.sentence,
        guesserOrder: _.shuffle(stim.images.split(",")),
        directorOrder: _.shuffle(stim.images.split(",")),
        instructions: null
      });
      round.addStage({ name: "tutorial-choice", duration: 10000 });
      round.addStage({ name: "tutorial-result", duration: 10000 });
      roundCounter++;
    }
    if (stim.phase == 'choice') {
      if (stim.trialid == 0) {
        const instructRound = game.addRound({
          name: `Round ${roundCounter}`,
          instructions: 'choice'
        });
        instructRound.addStage({ name: "instructions", duration: 10000 })
        
        const joinRound = game.addRound({
          name: `Round ${roundCounter}`
        });
        joinRound.addStage({ name: "joinroom", duration: 10000 });
      }
      const round = game.addRound({
        name: `Round ${roundCounter}`,
        verb: stim.verb,
        target: stim.target_image,
        distractor0: stim.distractor0, 
        distractor1: stim.distractor1,
        images: stim.images.split(","),
        target_loc: stim.target_loc,
        target_sub: stim.target_sub, 
        distractor_subs: stim.distractor_subs, 
        distractor_locs: stim.distractor_locs, 
        foreCondition: stim.foreCondition, 
        informativityCondition: stim.informativityCondition, 
        mirroringCondition: stim.mirroringCondition,
        guesserOrder: _.shuffle(stim.images.split(",")),
        directorOrder: _.shuffle(stim.images.split(",")),
        instructions: null
      });
      round.addStage({ name: "choice", duration: 10000 });
      round.addStage({ name: "result", duration: 10000 });
      roundCounter++;
    }
  })
});
Empirica.onRoundStart(({ round }) => {
  // console.log(round.get("name"))
  info(`game: ${round.currentGame.id} is in round ${round.get("name")}`)
  const cur_date = new Date();
  const old_timestamps = round.currentGame.get("timestamps")
  old_timestamps.push(cur_date)
  round.currentGame.set("timestamps", old_timestamps)  
});

Empirica.onStageStart(({ stage }) => {});

Empirica.onStageEnded(({ stage }) => {});

Empirica.onRoundEnded(({ round }) => {});

Empirica.onGameEnded(({ game }) => {});