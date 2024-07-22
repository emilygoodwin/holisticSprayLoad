const jsPsych = initJsPsych({
    show_progress_bar: true,
    auto_update_progress_bar: false,
        on_finish: function (data) {
        proliferate.submit({
            "trials": data.filter({"trial_type": "html-slider-response"}).trials,
            "subject_information": data.filter({"trial_type": "survey"}).trials[0].response,
            "time": data.filter({"trial_type": "survey"}).trials[0].time_elapsed / 1000
        });
      }
  });


// SET EXPERIMENT LEVEL STARTING VARIABLES
//   Pulls the value of the URL variable `id` but could be set up to 
//   pull others. It also saves a timestamp that serves as a unique identifier in case
//   the same URL variableis used twice. 
var id = jsPsych.data.getURLVariable('id');
var timestamp = Date.now();

// Timeline stores stages of the experiment 
let timeline = [];

// Holds trial variables for the main portion of experiment 
var mainExperimentVariables = generateMainExperimentVariables(); 
console.log(mainExperimentVariables)

// List of all the nouns subjects are trained to recognize 
let nouns =  [{noun: "bush", type: "count"}, {noun: "poison", type: "mass"}, {noun: "car", type: "count"}, {noun: "water", type: "mass"}, {noun: "fence", type: "count"}, {noun: "paint", type: "mass"}, {noun: "table", type: "count"}, {noun: "soap", type: "mass"}, {noun: "mushrooms", type: "plural"}, {noun: "cheese", type: "mass"}, {noun: "bellpepper", type: "count"}, {noun: "rice", type: "mass"}, {noun: "envelope", type: "count"}, {noun: "cash", type: "mass"}, {noun: "shoe", type: "count"}, {noun: "paper", type: "mass"}, {noun: "plane", type: "count"}, {noun: "fruit", type: "mass"}, {noun: "wagon", type: "count"}, {noun: "hay", type: "mass"}, {noun: "truck", type: "count"}, {noun: "wood", type: "mass"}, {noun: "train", type: "count"}, {noun: "trash", type: "mass"}, {noun: "pastry", type: "count"}, {noun: "butter", type: "mass"}, {noun: "cupcake", type: "count"}, {noun: "frosting", type: "mass"}, {noun: "hotdog", type: "count"}, {noun: "ketchup", type: "mass"}, {noun: "toast", type: "mass"}, {noun: "honey", type: "mass"}, {noun: "dog", type: "count"}, {noun: "cat", type: "count"}, {noun: "goose", type: "count"}, {noun: "turkey", type: "count"}, {noun: "children", type: "plural"}, {noun: "parents", type: "plural"}, {noun: "doctor", type: "count"}, {noun: "patient", type: "count"}, {noun: "wine", type: "mass"}, {noun: "gravy", type: "mass"}, {noun: "chicken", type: "count"}, {noun: "shirts", type: "plural"}];

const irb = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `<center> <img src = "stimuli/alpslogo.png" height = 200> <p> <font size="4"> 
    We invite you to our research study on language understanding.
    <br> Your experimenter will ask you to answer questions about some images.</p> `,
    prompt: `<br><br><font size = "2"> LEGAL INFORMATION: <br> There are no risks or benefits of any kind involved in this study. 
    You will be paid for your participation at the posted rate. If you have read this form and have decided 
    to participate in this experiment, please understand your participation is voluntary and you have the right to 
    withdraw your consent or discontinue participation at anytime without penalty or loss of benefits to which you 
    are otherwise entitled. You have the right to refuse to do particular tasks. Your individual privacy will be 
    maintained in all published and written data resulting from the study. You may print this form for your records.
    <br><br>CONTACT INFORMATION:
    <br>If you have any questions, concerns or complaints about this research study, its procedures, risks and benefits, 
    you should contact the Protocol Director Meghan Sumner at (650)-725-9336. If you are not satisfied with how this study 
    is being conducted, or if you have any concerns, complaints, or general questions about the research or your rights as a 
    participant, please contact the Stanford Institutional Review Board (IRB) to speak to someone independent of the research 
    team at (650)-723-2480 or toll free at 1-866-680-2906. You can also write to the Stanford IRB, Stanford University, 3000
    El Camino Real, Five Palo Alto Square, 4th Floor, Palo Alto, CA 94306 USA.<br><br>`,
    
    choices: ['Continue'], 
    on_finish: function(data) {
            jsPsych.setProgressBar((data.trial_index) / totalTimelineLength)
        },
};


const instructions = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `<center> <img src = "stimuli/alpslogo.png" height = 200> <br> We will tell you about some things people did yesterday, and ask you what you think happened to the objects involved. <br><br> `,
    choices: ["Continue"]
};


var mainExperiment = {
    timeline: [
    {
        type: jsPsychHtmlSliderResponseNoStart, 
        stimulus: function(){
            verb = jsPsych.timelineVariable('verb')
            scene = jsPsych.timelineVariable('scene')
            foreCondition = jsPsych.timelineVariable('foreCondition')
            locNoun = jsPsych.timelineVariable('locNoun')
            adj = jsPsych.timelineVariable('affectednessAdjective')
            copula = jsPsych.timelineVariable('copula')
            mirroringCondition = (jsPsych.timelineVariable('mirroringCondition')/1)
            subj = jsPsych.timelineVariable('subj')
            pronoun = jsPsych.timelineVariable('pronoun')
            inflected_verb = inflect_verb(verb)

            var html = `Yesterday, ${subj} said ${pronoun} <b>${inflected_verb}</b> something, and ${pronoun} used these objects: <br> <img src = "stimuli/finished_stimuli/${verb}/${foreCondition}_foregrounded/${scene}_${mirroringCondition}.jpg" height = 480> <br> How <b>${adj}</b> ${copula} the ${locNoun} when ${pronoun} was done?`;

        return html;
    },
        labels : [`Not at all`, `Completely`],
        
        require_movement: true,
    },
    ],
    timeline_variables: mainExperimentVariables,
    on_finish: function(data) {
            jsPsych.setProgressBar((data.trial_index) / totalTimelineLength)
        },
    data: {
        verb: jsPsych.timelineVariable('verb'),
        scene: jsPsych.timelineVariable('scene'),
        foregrounded: jsPsych.timelineVariable('foreCondition'),
        mirroringCondition: jsPsych.timelineVariable('mirroringCondition')
    }
}



var exitSurvey = {
  type: jsPsychSurvey,
  pages: [
    [
      {
        type: 'html',
        prompt: `<center> <img src = "stimuli/alpslogo.png" height = 200> <br> Thank you for completing the experiment! These questions are optional. <br> When you are done, press "Finish" at the bottom of the screen. <br> `,
      },
      {
        type: 'text',
        prompt: "What is your native language?", 
        name: 'nativeLanguage', 
        required: false
      }, 
      {
        type: 'multi-choice',
        prompt: "Did you read the instructions and do you think you did the task correctly?", 
        name: 'followedInstructions', 
        options: ['No', 'Yes', 'I was confused'], 
        required: false
      }, 
      {
        type: 'text',
        prompt: "Were there any problems or bugs in the experiment?", 
        name: 'problems', 
        required: false
      },
      {
        type: 'text',
        prompt: "What do you think is a fair price for the work you did?", 
        name: 'fairPrice', 
        required: false
      }, 
      {
        type: 'multi-choice',
        prompt: "Did you enjoy the experiment?", 
        name: 'enjoy', 
        options: ['Worse than the average experiment', 'An average experiment', 'Better than average experiment'], 
        required: false
      },
      {
        type: 'text',
        prompt: "Do you have any additional comments about this experiment?", 
        name: 'additionalComments', 
        required: false
      }, 
    ]
  ],
  on_finish: function(data) {
            jsPsych.setProgressBar((data.trial_index) / totalTimelineLength)
        },
};

var totalTimelineLength = mainExperimentVariables.length 

timeline.push(irb);
timeline.push(instructions);
timeline.push(mainExperiment);
timeline.push(exitSurvey);

jsPsych.run(timeline)
