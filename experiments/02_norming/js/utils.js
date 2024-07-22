
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
    // Each verb is shown with four unique scenes; each unique scene is shown with 
    // one spray-load and one control verb
    // This section also assigns one of two experimental conditions to each trial: 
    // LOC/SUB foregrounded. 
    // Half the trials have a 'mirrored' scene (foregrounded object appears on LEFT)
    // Half have an 'unmirrored': foregrounded on RIGHT, backgrounded on LEFT 
    trials = []
    spray_nouns = ["paintfence", "poisonbush", "soaptable", "watercar"]
    spread_nouns = ["honeypastry", "frostingcupcake", "buttertoast", "ketchuphotdog" ]
    load_nouns = ["fruitplane", "haywagon", "trashtrain", "woodtruck" ]
    stuff_nouns = ["cashenvelope", "papershoe", "ricebellpepper", "cheesemushroom"]
    
    var nouns = {}
    // first four nouns are for the spray-load verb, and last four 
    // are for the control verb; each noun pair shown once with either verb
    nouns['spread'] = spread_nouns.concat(shuffleArray(spread_nouns.slice()))
    nouns['spray'] = spray_nouns.concat(shuffleArray(spray_nouns.slice()))
    nouns['load'] = load_nouns.concat(shuffleArray(load_nouns.slice()))
    nouns['stuff'] = stuff_nouns.concat(shuffleArray(stuff_nouns.slice()))

    // Set up the random sample of each foregrounding condition for each verb 
    var conditions = {};
    const verbs = ["spray", "load", "spread", "stuff", "drench", "stash", "cover", "put"];
    for (let i = 0; i <= 9; i++) {
      conditions[verbs[i]] = shuffleArray(["loc", "loc", "sub", "sub"]);
    }

    // Set up the random sample of mirroring conditions 
    mirroring = new Array(36)
    mirroring.fill(true, 0, 18)
    mirroring.fill(false, 18, 36)
    mirroring = shuffleArray(mirroring)

    // Set up subject conditions 
    var names = names = shuffleArray([{"name":"Michael", "pronoun":"he"}, {"name":"Jacob", "pronoun":"he"}, {"name":"Nicholas", "pronoun":"he"}, {"name":"Andrew", "pronoun":"he"}, {"name":"Joseph", "pronoun":"he"}, {"name":"David", "pronoun":"he"}, {"name":"William", "pronoun":"he"}, {"name":"John", "pronoun":"he"}, {"name":"Emily", "pronoun":"she"}, {"name":"Hannah", "pronoun":"she"}, {"name":"Samantha", "pronoun":"she"}, {"name":"Jessica", "pronoun":"she"}, {"name":"Madison", "pronoun":"she"}, {"name":"Elizabeth", "pronoun":"she"}, {"name":"Alyssa", "pronoun":"she"}, {"name":"Megan", "pronoun":"she"}, {"name":"Michael", "pronoun":"he"}, {"name":"Jacob", "pronoun":"he"}, {"name":"Nicholas", "pronoun":"he"}, {"name":"Andrew", "pronoun":"he"}, {"name":"Joseph", "pronoun":"he"}, {"name":"David", "pronoun":"he"}, {"name":"William", "pronoun":"he"}, {"name":"John", "pronoun":"he"}, {"name":"Emily", "pronoun":"she"}, {"name":"Hannah", "pronoun":"she"}, {"name":"Samantha", "pronoun":"she"}, {"name":"Jessica", "pronoun":"she"}, {"name":"Madison", "pronoun":"she"}, {"name":"Elizabeth", "pronoun":"she"}, {"name":"Alyssa", "pronoun":"she"}, {"name":"Megan", "pronoun":"she"}])

    for (let i = 0; i < trial_array.length; i ++ ){

        verb  = trial_array[i]
        verb_class = nounMatchedVerb(verb)
        condition = conditions[verb][0]
        conditions[verb] = conditions[verb].slice(1) 
        mirrored = mirroring[0]
        mirroring = mirroring.slice(1)

        scene = nouns[verb_class][0]
        locNoun = getLocation(scene)
        adj = getAffectednessAdjective(scene)
        copula = getAffectednessCopula(scene)
        // subj = get_subj(verb)
        subj = names[0]['name']
        pronoun = names[0]['pronoun']
        names = names.slice(1)

        trials[i] = {verb: verb, scene: scene, foreCondition: condition, locNoun: locNoun, affectednessAdjective: adj, copula: copula, mirroringCondition: mirrored, subj: subj, pronoun: pronoun}
        nouns[verb_class] = nouns[verb_class].slice(1)

    }
    console.log(names)
    return trials
}

var getLocation = function(scene){
  if (scene == 'buttertoast'){
    loc = 'toast'
    sub = 'butter'
  }
  if (scene == 'gravychicken'){
    loc = 'chicken'
    sub = 'gravy'
  }
  if (scene == 'childrenparents'){
    loc = 'parents'
    sub = 'children'
  }
  if (scene == 'doctorpatient'){
    loc = 'doctor'
    sub = 'patient'
  }
  if (scene == 'dogcat'){
    loc = 'dog'
    sub = 'cat'
  }
  if (scene == 'frostingcupcake'){
    loc = 'cupcake'
    sub = 'frosting'
  }
  if (scene == 'fruitplane'){
    loc = 'plane'
    sub = 'fruit'
  }
  if (scene == 'gooseturkey'){
    loc = 'goose'
    sub = 'turkey'
  }
  if (scene == 'haywagon'){
    loc = 'wagon'
    sub = 'hay'
  }
  if (scene == 'honeypastry'){
    loc = 'pastry'
    sub = 'honey'
  }
  if (scene == 'ketchuphotdog'){
    loc = 'hot dog'
    sub = 'ketchup'
  }
  if (scene == 'paintfence'){
    loc = 'fence'
    sub = 'paint'
  }
  if (scene == 'papershoe'){
    loc ='shoe'
    sub ='paper'
  }
  if (scene == 'poisonbush'){
    loc = 'bush'
    sub = 'poison'
  }
  if (scene == 'ricebellpepper'){
    loc ='bell pepper'
    sub ='rice'
  }
  if (scene == 'soaptable'){
    loc = 'table'
    sub = 'soap'
  }
  if (scene == 'trashtrain'){
    loc = 'train'
    sub = 'trash'
  }
  if (scene == 'watercar'){
    loc = 'car'
    sub = 'water'
  }
  if (scene == 'wineshirt'){
    loc = 'shirt'
    sub = 'wine'
  }
  if (scene == 'cheesemushroom'){
    loc = 'mushrooms'
    sub = 'cheese'
  }
  if (scene == 'cashenvelope'){
    loc = 'envelope'
    sub = 'cash'
  }
  if (scene == 'woodtruck'){
    loc = 'truck'
    sub = 'wood'
  }
  return loc;
}
var getAffectednessAdjective = function(scene){
  if (scene == 'buttertoast'){
    return "covered"
  }
  if (scene == 'frostingcupcake'){
    return "covered"
  }
  if (scene == 'fruitplane'){
    return "full"
  }
  if (scene == 'haywagon'){
    return "full"
  }
  if (scene == 'honeypastry'){
    return "covered"
  }
  if (scene == 'ketchuphotdog'){
    return "covered"
  }
  if (scene == 'paintfence'){
    return "covered"
  }
  if (scene == 'papershoe'){
    return "full"
  }
  if (scene == 'poisonbush'){
    return "covered"
  }
  if (scene == 'ricebellpepper'){
    return "full"
  }
  if (scene == 'soaptable'){
    return "covered"
  }
  if (scene == 'trashtrain'){
    return "full"
  }
  if (scene == 'watercar'){
    return "covered"
  }
  if (scene == 'cheesemushroom'){
    return "full"
  }
  if (scene == 'cashenvelope'){
    return "full"
  }
  if (scene == 'woodtruck'){
    return "full"
  }
}
var getAffectednessCopula = function(scene){
  if (scene == 'buttertoast'){
    return "was"
  }
  if (scene == 'frostingcupcake'){
    return "was"
  }
  if (scene == 'fruitplane'){
    return "was"
  }
  if (scene == 'haywagon'){
    return "was"
  }
  if (scene == 'honeypastry'){
    return "was"
  }
  if (scene == 'ketchuphotdog'){
    return "was"
  }
  if (scene == 'paintfence'){
    return "was"
  }
  if (scene == 'papershoe'){
    return "was"
  }
  if (scene == 'poisonbush'){
    return "was"
  }
  if (scene == 'ricebellpepper'){
    return "was"
  }
  if (scene == 'soaptable'){
    return "was"
  }
  if (scene == 'trashtrain'){
    return "was"
  }
  if (scene == 'watercar'){
    return "was"
  }
  if (scene == 'cheesemushroom'){
    return "were"
  }
  if (scene == 'cashenvelope'){
    return "was"
  }
  if (scene == 'woodtruck'){
    return "was"
  }
}


var generateMainExperimentVariables = function () {
    // // Create an array with 32 instances of four spray load verbs 
    // // and four instances of the filler verbs
    critical_verbs = ['spray', 'stuff', 'load', 'spread']
    arr = critical_verbs.concat(critical_verbs, critical_verbs, critical_verbs, critical_verbs, critical_verbs, critical_verbs, critical_verbs)

    // Replace spray-load verbs with control-verbs such that no
    // Control verb occurs before a spray-load verb: 
    let trial_order = setTrialOrder(arr);

    // Look up a scene (noun pairing, mirroring and foregrounding conditions) for each trial
    let mainExperimentVariables = assignScenes(trial_order);

    return mainExperimentVariables
}

// var get_subj = function(verb){
//   subj = ""
//   if (verb == 'spread' || verb == 'cover'){
//     subj = 'a chef'
//   }
//   if (verb == 'stuff' || verb == 'put'){
//     subj = 'a parent'
//   }
//   if (verb == 'spray' || verb == 'drench'){
//     subj = 'a grandparent'
//   }
//   if (verb == 'load' || verb == 'stash'){
//     subj = 'a worker'
//   }
//   return subj
// }

var inflect_verb = function(verb){
  if (verb == 'spread'){
    inf_verb = 'spread'
  }
  if (verb == 'stuff'){
    inf_verb = 'stuffed'
  }
  if (verb == 'spray'){
    inf_verb = 'sprayed'
  }
  if (verb == 'load'){
    inf_verb = 'loaded'
  }
  if (verb == 'cover'){
    inf_verb = 'covered'
  }
  if (verb == 'put'){
    inf_verb = 'put'
  }
  if (verb == 'drench'){
    inf_verb = 'drenched'
  }
  if (verb == 'stash'){
    inf_verb = 'stashed'
  }

  return inf_verb
}
