
function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}


var setTrialOrder = function(trial_array) {
    // Replace last four instances of the spray-load verbs with controls: 
    // Ensures that control trials appear after respective critical trials

    trial_array = shuffleArray(trial_array);

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

var assignScenes = function(trial_array){
    // Each verb is shown with four unique scene; each unique scene is shown with 
    // one spray-load and one control verb
    // This Function also assigns one of four experimental conditions to each trial: 
    // LOC/SUB foregrounded, and LOC/SUB informative 

    // This function also assigns the mirroring condition: true (mirrored) or false (not)

    trials = []
    spray_nouns = ["paintfence", "poisonbush", "soaptable", "watercar"]
    spread_nouns = ["honeypastry", "frostingcupcake", "buttertoast", "ketchuphotdog" ]
    load_nouns = ["fruitplane", "haywagon", "trashtrain", "woodtruck" ]
    stuff_nouns = ["cashenvelope", "papershoe", "ricebellpepper", "cheesemushrooms"]
    show_nouns = ["dogcat", "gooseturkey"]
    bring_nouns = ["childrenparents", "doctorpatient"]
    
    var nouns = {}
    // first four nouns are for the spray-load verb, and last four 
    // are for the control verb; each noun pair shown once with either verb
    nouns['spread'] = spread_nouns.concat(shuffleArray(spread_nouns.slice()))
    nouns['spray'] = spray_nouns.concat(shuffleArray(spray_nouns.slice()))
    nouns['load'] = load_nouns.concat(shuffleArray(load_nouns.slice()))
    nouns['stuff'] = stuff_nouns.concat(shuffleArray(stuff_nouns.slice()))
    nouns['show'] = ["dogcat", "gooseturkey"]
    nouns['bring'] = ["childrenparents", "doctorpatient"]

    // Set up the random sample of each condition for each verb 
    var conditions = {};
    const verbs = ["spray", "load", "spread", "stuff", "drench", "stash", "cover", "put", "show", "bring"];

    for (let i = 0; i <= 9; i++) {
      conditions[verbs[i]] = shuffleArray(["loc", "loc", "sub", "sub"]);
    }

    // Set up the random sample of mirroring for each scene 
    mirroring = new Array(36)
    mirroring.fill(1, 0, 18) //mirrored
    mirroring.fill(0, 18, 36) //unmirrored
    mirroring = shuffleArray(mirroring)

    for (let i = 0; i < trial_array.length; i ++ ){

        verb  = trial_array[i]
        verb_class = nounMatchedVerb(verb)
        condition = conditions[verb][0]
        conditions[verb] = conditions[verb].slice(1) 
        mirrored = mirroring[0]
        mirroring = mirroring.slice(1)

        trials[i] = {verb: verb, scene: nouns[verb_class][0], foreCondition: condition, mirroringCondition: mirrored}
        nouns[verb_class] = nouns[verb_class].slice(1)
    }
    return trials
}

var trainMainExperimentVariables = function (){
    //Conditions for the stimuli in the training phase of the experiment
    //In these, no foregrounding 'loc sub' condition
    // let train_mainExp_conds = shuffleArray(['loc', 'sub'])
    mircn1 = Math.floor(Math.random() * 2)
    mircn2 = Math.floor(Math.random() * 2)

    let trls = [
        {verb: "coat", foreCondition: "none", scene: "gravychicken", sentence: "Sally will coat the chicken in gravy.", mirroringCondition: mircn1}, 
        {verb: "spill", foreCondition: "none", scene: "wineshirt", sentence: "Sally will spill wine on the shirts.", mirroringCondition: mircn2}];
    return shuffleArray(trls);
    }

var generateMainExperimentVariables = function () {
    // // Create an array with 32 instances of four spray load verbs 
    // // and four instances of the filler verbs
    critical_verbs = ['spray', 'stuff', 'load', 'spread']
    filler_verbs = ['show', 'bring']
    arr = critical_verbs.concat(critical_verbs, critical_verbs, critical_verbs, critical_verbs, critical_verbs, critical_verbs, critical_verbs)
    arr = arr.concat(filler_verbs, filler_verbs);


    // Populate control-verbs into matched positions, so that no
    // Control verb occurs before a spray-load verb 
    let trial_order = setTrialOrder(arr);
    // Look up a scene (noun pairing, experimental condition) for each trial
    let mainExperimentVariables = assignScenes(trial_order);

    return mainExperimentVariables
}

var preloadableNouns = function (nouns) {
    filepaths = []
    

    for (const noun of nouns){
        filepaths.push(`stimuli/nouns/${noun['verb']}/${noun['thetaRole']}s/${noun['noun']}.png`)
    }
return filepaths
}

var preloadableStims = function (stims) {
    stim_paths = []
    for (const stim of stims){
        verb = stim.verb
        scene = stim.scene
        mirroringCondition = stim.mirroringCondition
        stim_paths.push(`stimuli/finished_stimuli/${verb}/loc_foregrounded/${scene}_${mirroringCondition}.jpg`)
    }
return stim_paths
}

var correctParticipantResponse = function (participant_guess, correct_answer) {
    det = jsPsych.timelineVariable('type')== 'count' ? "a" : ""
    if (participant_guess == correct_answer) {
                var html =  `Great! We called this ${det} <strong>${jsPsych.timelineVariable('noun')}<strong>.<br> <img src = "stimuli/nouns/${jsPsych.timelineVariable('verb')}/${jsPsych.timelineVariable('thetaRole')}s/${jsPsych.timelineVariable('noun')}.png" height = 300> <br><br>`;
            } else {
                var html = `Oops, You said <strong> ${participant_guess}</strong>, <br> and we called this ${det} <strong>${jsPsych.timelineVariable('noun')}</strong>.<br> <img src = "stimuli/nouns/${jsPsych.timelineVariable('verb')}/${jsPsych.timelineVariable('thetaRole')}s/${jsPsych.timelineVariable('noun')}.png" height = 300> <br><br>`;
            }   
    return html;
}