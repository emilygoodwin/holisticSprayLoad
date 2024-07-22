import { verb_arr, spray_scenes, spread_scenes, load_scenes, stuff_scenes, show_scenes, bring_scenes, distractor_noun_inventory, example_trials, train_nouns, recall_nouns} from './verbs.js'
var _ = require('underscore');
function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}


var tutorialTrials = function (){
    //Conditions for the stimuli in the training phase of the experiment
    //In these, no foregrounding 'loc sub' condition
    // let train_mainExp_conds = shuffleArray(['loc', 'sub'])
    
    var mirrCoat = Math.floor(Math.random() * 2)
    var mirrSpill = Math.floor(Math.random() * 2)
    
    var foreCoat = Math.floor(Math.random() * 2) == 1 ? 'sub' : 'loc'
    var foreSpill = Math.floor(Math.random() * 2) == 1 ? 'sub' : 'loc'
    
    var infCoat = Math.floor(Math.random() * 2) == 1 ? 'sub' : 'loc'
    var infSpill = Math.floor(Math.random() * 2) == 1 ? 'sub' : 'loc'

    var sceneCoat = {"location": "chicken", "substance": "gravy"}
    var sceneSpill = {"location": "shirt", "substance": "wine"}
    
    var coatTargetImage = "gravychicken_" + foreCoat + "_" + mirrCoat 
    var spillTargetImage = "wineshirt_" + foreSpill + "_" + mirrSpill 


    var competitorsCoat = getCompetitorScene('coat', sceneCoat, infCoat)
    var competitorsSpill = getCompetitorScene('spill', sceneSpill, infSpill)

    var competitorCoat0 = competitorsCoat[0]
    var competitorCoat1 = competitorsCoat[1]
    var competitorCoat0Image = competitorCoat0['substance'] + competitorCoat0['location'] + "_" + foreCoat + "_" + mirrCoat
    var competitorCoat1Image = competitorCoat1['substance'] + competitorCoat1['location'] + "_" + foreCoat + "_" + mirrCoat

    var competitorSpill0 = competitorsSpill[0]
    var competitorSpill1 = competitorsSpill[1]
    var competitorSpill0Image = competitorSpill0['substance'] + competitorSpill0['location'] + "_" + foreSpill + "_" + mirrSpill
    var competitorSpill1Image = competitorSpill1['substance'] + competitorSpill1['location'] + "_" + foreSpill + "_" + mirrSpill

    let trls = [
        {
            phase: "example", 
            verb: "coat", 

            target_loc: 'chicken', 
            target_sub: 'gravy', 
            distractor_locs: [competitorCoat0['location'], competitorCoat1['location']],
            distractor_subs: [competitorCoat0['substance'], competitorCoat1['substance']],

            foreCondition: foreCoat,
            informativityCondition: infCoat,
            mirroringCondition: mirrCoat, 

            distractor0: competitorCoat0,
            distractor1: competitorCoat1,
            target_image: coatTargetImage,
            images: competitorCoat0Image + "," + competitorCoat1Image+ "," + coatTargetImage,
            sentence: "Sally will coat the chicken in gravy", 
        }, 
        {
            phase: "example", 
            verb: "spill", 

            target_loc: "shirt", 
            target_sub: "wine",
            distractor_locs: [competitorSpill0['location'], competitorSpill1['location']],
            distractor_subs: [competitorSpill0['substance'], competitorSpill1['substance']],
            
            foreCondition: foreSpill,
            informativityCondition: infSpill,
            mirroringCondition: mirrSpill, 
            
            distractor0: competitorSpill0, 
            distractor1: competitorSpill1, 
            target_image: spillTargetImage,
            
            images: competitorSpill0Image + "," + competitorSpill1Image + "," + spillTargetImage,
            sentence: "Sally will spill wine on the shirts", 
        }
        ];
    return shuffleArray(trls);
    }

var setTrialOrder = function(arr) {
    // Replace last four instances of the spray-load verbs with controls: 
    // Ensures that control trials appear after respective critical trials
    let trial_array = _.shuffle(JSON.parse(JSON.stringify(arr)))

    while (trial_array.filter((word) => word == "spray").length > 4) {
        trial_array[trial_array.lastIndexOf("spray")] = "drench";
    }
    while (trial_array.filter((word) => word == "load").length > 4) {
        trial_array[trial_array.lastIndexOf("load")] = "stash";
    }
    while (trial_array.filter((word) => word == "spread").length > 4) {
        trial_array[trial_array.lastIndexOf("spread")] = "cover";
    }
    while (trial_array.filter((word) => word == "stuff").length > 4) {
        trial_array[trial_array.lastIndexOf("stuff")] = "put";
    }
    return trial_array;
}

var nounMatchedVerb = function(verb) {
    if (verb == 'spray' || verb == 'drench'){
        return 'spray';
    }
    if (verb == 'spread' || verb == 'cover'){
        return 'spread';
    }
    if (verb == 'stuff' || verb == 'put'){
        return 'stuff';
    }
    if (verb == 'load' || verb == 'stash'){
        return 'load'; 
    }
    else {
        return verb
    }

}

var getCompetitorScene = function(verb, scene, informativityCondition){ 
    // Look up 2 competitors for scene, that have either a different loc or sub noun 
    
    if (informativityCondition == 'loc'){
        let distractor_options = distractor_noun_inventory[verb]['locations'].filter((word) => word != scene['location'])
        distractor_opts_shuffled = _.shuffle(distractor_options)
        let selected = distractor_opts_shuffled.slice(0, 2);

        var distractors = [{substance: scene['substance'], location: selected[0]}, {substance: scene['substance'], location: selected[1]}]
    }
    else {
        let distractor_options = distractor_noun_inventory[verb]['substances'].filter((word) => word != scene['substance'])
        distractor_opts_shuffled = _.shuffle(distractor_options)
        let selected = distractor_opts_shuffled.slice(0, 2);

        var distractors = [{substance: selected[0], location: scene['location']}, {substance: selected[1], location: scene['location']}]
    }

    return(distractors)
}

var assignScenes = function(trial_array){
    // Each verb is shown with four unique scene; each unique scene is shown with 
    // one spray-load and one control verb
    // This Function also assigns one of four experimental conditions to each trial: 
    // LOC/SUB foregrounded, and LOC/SUB informative 

    // This function also assigns the mirroring condition: true (mirrored) or false (not)

    let trials = []
    

    // Shuffle the set of scenes for each critical-control verb pair, store them in a dict
    // first four nouns are for the spray-load verb, and last four 
    // are for the control verb; each noun pair shown once with either verb
    let scenes = {}
    scenes['spread'] = shuffleArray(spread_scenes.slice()).concat(shuffleArray(spread_scenes.slice()))
    scenes['spray'] = shuffleArray(spray_scenes.slice()).concat(shuffleArray(spray_scenes.slice()))
    scenes['load'] = shuffleArray(load_scenes.slice()).concat(shuffleArray(load_scenes.slice()))
    scenes['stuff'] = shuffleArray(stuff_scenes.slice()).concat(shuffleArray(stuff_scenes.slice()))
    scenes['show'] = shuffleArray(show_scenes.slice())
    scenes['bring'] = shuffleArray(bring_scenes.slice())

    // Set up the random sample of each condition for each verb 
    let conditions = {};
    let verbs = ["spray", "load", "spread", "stuff", "drench", "stash", "cover", "put", "show", "bring"];
    for (let i = 0; i <= 9; i++) {
        // conditions[verbs[i]] = {foregroundConditions: shuffleArray(["loc", "loc", "sub", "sub"]), informativityConditions: shuffleArray(["loc", "loc", "sub", "sub"])}
        conditions[verbs[i]] = shuffleArray([{"foregrounding": "loc", "informativity": "sub"}, {"foregrounding": "loc", "informativity": "loc"}, {"foregrounding": "sub", "informativity": "sub"}, {"foregrounding": "sub", "informativity": "loc"}])
    }

    // Set up the random sample of mirroring for each scene 
    let mirroring = new Array(36)
    mirroring.fill(1, 0, 18) //mirrored
    mirroring.fill(0, 18, 36) //unmirrored
    mirroring = shuffleArray(mirroring)

    // Iterate through each trial, sample an appropriate scene; 
    // Sample also a foregrounding, informativity, and mirroring condition; 
    // Sample also distractor scenes 
    for (let i = 0; i < trial_array.length; i ++ ){

        let verb  = trial_array[i]
        let verb_class = nounMatchedVerb(verb)
        let trialid = i 

        let experimentPhase = 'choice' // the main part of the experiment; as opposed to 'training' or 'practice' 

        //pickout foregrounding condition and informativity conditions 
        let foreCondition = conditions[verb][0]['foregrounding']
        let informativityCondition = conditions[verb][0]['informativity']
        conditions[verb] = conditions[verb].slice(1)

        let mirrored = mirroring[0]
        mirroring = mirroring.slice(1)


        let target = scenes[verb_class][0]
        let target_loc = target['location']
        let target_sub = target['substance']
        let target_image = target_sub + target_loc + "_" + foreCondition + "_" + mirrored
        
        // Get distractor scenes 
        let distractors = getCompetitorScene(verb, target, informativityCondition)
        let distractor0 = distractors[0]
        let distractor1 = distractors[1]

        let distractor0_loc = distractor0['location'] 
        let distractor1_loc = distractor1['location'] 
        let distractor0_sub = distractor0['substance'] 
        let distractor1_sub = distractor1['substance'] 
        
        let distractor0_image = distractor0_sub +  distractor0_loc + "_" + foreCondition 
        let distractor1_image = distractor1_sub +  distractor1_loc + "_" + foreCondition 

        
        let images = distractor0_image + "_" + mirrored+ ',' + distractor1_image + "_" + mirrored +',' +target_image 
        let trial = {
            trialid:trialid, 
            phase: experimentPhase, 
            verb: verb, 

            target_loc: target_loc, 
            target_sub: target_sub, 
            distractor_locs: [distractor0_loc, distractor1_loc],
            distractor_subs: [distractor0_sub, distractor1_sub],
            
            foreCondition: foreCondition, 
            informativityCondition: informativityCondition, 
            mirroringCondition: mirrored, 
            
            distractor0: distractor0, 
            distractor1: distractor1, 
            target_image: target_image, 
            images: images
        }
        
        trials.push(trial)

        scenes[verb_class] = scenes[verb_class].slice(1)
    }

    return trials
}


var generateMainExperimentVariables = function () {
    experiment_timeline = []
    
    
    // Trials that train participants on each noun 
    _.shuffle(train_nouns).forEach(function(trial, i){
        trial['phase'] = 'train'
        trial['trialid'] = i
        experiment_timeline.push(trial)
    });

    // Trials that test participants on each noun 
    // _.shuffle(recall_nouns).forEach(function(trial, i){
    //     trial['phase'] = 'recall'
    //     trial['trialid'] = i
    //     experiment_timeline.push(trial)
    // });
    let tutorialStims = tutorialTrials()
    _.shuffle(tutorialStims).forEach(function(trial, i){
        trial['phase'] = 'tutorial'
        trial['trialid'] = i 
        experiment_timeline.push(trial)
    })
    
    // // Now for the main experiment trials 
    // // Import an array with 32 instances of four spray load verbs 
    // // and four instances of the filler verbs
    
    // Replace half of the verbs in verb_arr with control verbs. 
    // Populate control-verbs into positions with their matched verbs, so that no
    // Control verb occurs before a spray-load verb 
    let trial_order = setTrialOrder(verb_arr);
    // Look up a scene (noun pairing, experimental condition) for each trial
    let mainExperimentVariables = assignScenes(trial_order);

    // mainExperimentVariables  = mainExperimentVariables.slice(0, 5)
    
    experiment_timeline.push(...mainExperimentVariables)
    
    return experiment_timeline
}

export{shuffleArray, setTrialOrder, nounMatchedVerb, assignScenes, generateMainExperimentVariables}