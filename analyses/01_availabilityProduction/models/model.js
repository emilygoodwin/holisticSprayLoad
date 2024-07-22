/*
This code is based on Neil Rathi's model
of the ditransitive English alternation.
*/

// Can run from terminal with 'webppl model.js'; 
// In this case, R will not be passing any prior, cost
// values etc so we need to set some defaults 
var terminal = (typeof dataFromR == 'undefined')


// Target state: state speaker intended to communicate
// For our experiment, this is one of 3 possible images 

var target = "spray Paint Wall"

var backgroundCondition  = (terminal == true) ?  "Sub" : dataFromR[0].backgroundingCondition
var informativeCondition = (terminal == true) ?  "Sub" : dataFromR[0].informativeCondition


// We are modelling the production choice after "Subj will spray", 
// and assuming the speaker can only name items in the scene: 
// If location-informative, 3 locations and 1 substance are available
// If substance-informative, 3 substances and 1 location
var utterances   = (informativeCondition == "Loc") ?  ["Paint", "Car", "Tree", "Wall"] :  ["Paint", "Water", "Soap", "Wall"]
var backgrounded = (backgroundCondition== "Loc") ? "Wall" : "Paint"


// The set of possible states listener can consider 
// With 3 images for each trial, there are 3 states
var states = (informativeCondition == "Loc") ? ["spray Paint Car", "spray Paint Tree", "spray Paint Wall"] : ["spray Paint Wall", "spray Water Wall", "spray Soap Wall"]

// Cost of backgrounded NP 
var useCost = true
var backgroundCost = (terminal == true) ?  ".3" : dataFromR[0].backgroundedCost

  
// set speaker optimality (usually written alpha)
var speakerOptimality = (terminal == true) ?  "1" : dataFromR[0].speakerOptimality


// Our simulations never involve a pragmatic speaker with prior over utterances,
// but if you want to turn that on can set usePriors to true.
// utterancePrior is the weight for the upweighted form 
// uterancePriorDown is the weight for the downweighted form 
var usePriors = (terminal == true) ? false : false
var utterancePrior = (terminal == true) ?  ".5" : dataFromR[0].utterancePrior
var utterancePriorDownWeighted = (terminal == true) ?  ".1" : dataFromR[0].utterancePriorDown 

// console.log("Settings...")
// console.log("Running from terminal with defaults? ", terminal)

console.log("backgroundCondition: ", backgroundCondition)
console.log("informativeCondition: ", informativeCondition)
// console.log("utterances: ", utterances)
// console.log("states: ", states)
// console.log("backgrounded: ", backgrounded)

// console.log("backgroundCost: ", backgroundCost)
// console.log("speakerOptimality: ", speakerOptimality, "\n")


// prior over world states
var statePrior = function() {
  var worldState = uniformDraw(states)
  return worldState
}

var cost = function(utt){
  // assigns cost to an utterance
  useCost ? (utt == backgrounded ? backgroundCost : 0): 0
}

var prior = function(utt){
  // utterance prior 
  usePriors ? (utt == "Paint" ? utterancePrior : utterancePriorDownWeighted) : 1
}

// meaning function: returns T if utterance is true of worldState
var meaning = function(utterance, worldState){
  _.includes(worldState, utterance)
}


// literal listener
//Describes the distribution of world states, conditioned 
//on utterance being found true 

//Here it makes sense to use CONDITION, since you want the marginal distribution of states, conditioned on that utterance being true 
//Docs say : "Condition: Conditions the marginal distribution on an arbitrary proposition."

var literalListener = function(utterance){
  Infer({model: function(){
    var worldState = statePrior();
    var uttTruthVal = meaning(utterance, worldState);
    condition(uttTruthVal == true)
    return worldState
  }})
}

// pragmatic speaker
// Describes the distribution of utterances, with their probability proportionate 

//  Here it makes sense to use factor
//  Docs: "Factor(score) Adds score to the log probability of the current execution."
//  Describes the distribution over utterances, weighting utterances by their expected utility-cost 
var speaker = function(obj) {
  Infer({model: function(){
    var utterance = uniformDraw(utterances)
    factor(speakerOptimality * (literalListener(utterance).score(obj) - cost(utterance)))
    return utterance
  }})
}
var getLiteralListener= function(obj, utt1, utt2){
  var utt1score = Math.exp(literalListener(utt1).score(obj))
  var utt2score = Math.exp(literalListener(utt1).score(obj))

  return utt1score
}

var getProbs = function(obj, utt1, utt2) {
  // console.log("Calculating utt1score...")
  var speakerUtt1score = Math.exp(speaker(obj).score(utt1)) 
  // console.log("Calculating utt2score...")
  var speakerUtt2score = Math.exp(speaker(obj).score(utt2)) 

  var a = usePriors ? speakerUtt1score * prior(utt1) : speakerUtt1score
  var b = usePriors ? speakerUtt2score * prior(utt2) : speakerUtt2score

  var literalListenerUtt1Score = getLiteralListener(obj, utt1, utt2)

  if (terminal) {
    console.table([{'target':obj, 'backgrounded':backgrounded, 
      'usepriors':usePriors, 
      'useCost': useCost, 
      'utt1': utt1, 
      'utt2': utt2}, {'utt1':a/(a+b), 'utt2':b/(a+b), 
      'L0(r = paint|u = paint)':literalListenerUtt1Score, 
      'L0(r = paint|u = wall)':getLiteralListener(obj, utt2, utt1) }]);
  }
  console.log("a:", a)
  console.log("b:", b)
  return [literalListenerUtt1Score, a/(a+b)]
}

var utt1 = 'Paint'
var utt2 = 'Wall'
getProbs(target, utt1, utt2)




