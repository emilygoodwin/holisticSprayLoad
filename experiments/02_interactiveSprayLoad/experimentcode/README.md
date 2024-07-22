# spoken-prod
a React component (+ extras) for creating audio calls in Empirica with 100ms.

## how it works
1. when a batch with _n_ games is created, we make _n_ API calls to 100ms, creating unique audio rooms for each game
2. on game initialization, players are assigned their game room code
3. in a stage with an `AudioRoom`, players join their 100ms room (either manually or automatically with `forceJoin`)
4. upon exiting the stage, they leave the room; they can rejoin in future stages

steps 1-2 need to be coded into `callbacks.js`, steps 3-4 need to be written into your stages (see `stages/Choice.jsx` for an example).

## 100ms setup
after creating an account, you need to
1. create an audio room template (Create Template > Audio Room)
2. in `callbacks.js`, make sure the 100ms settings are correct for your experiment. pay special attention to the `name`, `region`, and `recording_info` attributes (more information [here](https://www.100ms.live/docs/server-side/v2/api-reference/Rooms/create-via-api))
3. while creating the Empirica batch, replace the `templateId` and `managementToken` factors with your respective codes. to find the `managementToken` in 100ms, go to Developer > Management Token (this code resets every 24 hours)

## important parts
* `components/AudioRoom.jsx` is _the_ component. it joins a 100ms room given a userName and a roomCode.
* most of the work, though, is done in `callbacks.js`. here, we create (1) create 100ms rooms upon batch initialization, (2) assign `roomCodes` to games, and (3) assign `roomCodes` to players.
* `stages/Choice.jsx` has an MWE. note critically that upon submitting the form, we also call `hmsActions.leave()` which leaves the room. you can remove this if you'd like to keep participants in the room the entire time.

## dependencies:
* empirica
* 100ms
* axios (to make API calls)

questions? email rathi at stanford dot edu :)