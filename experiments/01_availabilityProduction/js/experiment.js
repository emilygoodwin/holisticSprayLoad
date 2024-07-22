const jsPsych = initJsPsych({
    show_progress_bar: true,
    auto_update_progress_bar: false,
    on_finish: function (data) {
        proliferate.submit({"trials": data});
      }
  });


// SET EXPERIMENT LEVEL STARTING VARIABLES
//   Pulls the value of the URL variable `id` but could be set up to 
//   pull others. It also saves a timestamp that serves as a unique identifier in case
//   the same URL variableis used twice. 
var id = jsPsych.data.getURLVariable('id');
var timestamp = Date.now();
var audio_id = get_url_param("participant_id");

// Timeline stores stages of the experiment 
let timeline = [];

// Holds trial variables for the main portion of experiment 
var mainExperimentVariables = generateMainExperimentVariables(); 


// List of all the nouns subjects are trained to recognize 
const nouns = [{noun: "bush", type: "count", verb: "spray", thetaRole:"location"}, {noun: "poison", type: "mass", verb: "spray", thetaRole:"substance"}, {noun: "car", type: "count", verb: "spray", thetaRole:"location"}, {noun: "water", type: "mass", verb: "spray", thetaRole:"substance"}, {noun: "fence", type: "count", verb: "spray", thetaRole:"location"}, {noun: "paint", type: "mass", verb: "spray", thetaRole:"substance"}, {noun: "table", type: "count", verb: "spray", thetaRole:"location"}, {noun: "soap", type: "mass", verb: "spray", thetaRole:"substance"}, {noun: "mushrooms", type: "plural", verb: "stuff", thetaRole:"location"}, {noun: "cheese", type: "mass", verb: "stuff", thetaRole:"substance"}, {noun: "bellpepper", type: "count", verb: "stuff", thetaRole:"location"}, {noun: "rice", type: "mass", verb: "stuff", thetaRole:"substance"}, {noun: "envelope", type: "count", verb: "stuff", thetaRole:"location"}, {noun: "cash", type: "mass", verb: "stuff", thetaRole:"substance"}, {noun: "shoe", type: "count", verb: "stuff", thetaRole:"location"}, {noun: "paper", type: "mass", verb: "stuff", thetaRole:"substance"}, {noun: "plane", type: "count", verb: "load", thetaRole:"location"}, {noun: "fruit", type: "mass", verb: "load", thetaRole:"substance"}, {noun: "wagon", type: "count", verb: "load", thetaRole:"location"}, {noun: "hay", type: "mass", verb: "load", thetaRole:"substance"}, {noun: "truck", type: "count", verb: "load", thetaRole:"location"}, {noun: "wood", type: "mass", verb: "load", thetaRole:"substance"}, {noun: "train", type: "count", verb: "load", thetaRole:"location"}, {noun: "trash", type: "mass", verb: "load", thetaRole:"substance"}, {noun: "pastry", type: "count", verb: "spread", thetaRole:"location"}, {noun: "butter", type: "mass", verb: "spread", thetaRole:"substance"}, {noun: "cupcake", type: "count", verb: "spread", thetaRole:"location"}, {noun: "frosting", type: "mass", verb: "spread", thetaRole:"substance"}, {noun: "hotdog", type: "count", verb: "spread", thetaRole:"location"}, {noun: "ketchup", type: "mass", verb: "spread", thetaRole:"substance"}, {noun: "toast", type: "mass", verb: "spread", thetaRole:"location"}, {noun: "honey", type: "mass", verb: "spread", thetaRole:"substance"}, {noun: "dog", type: "count", verb: "show", thetaRole:"substance"}, {noun: "cat", type: "count", verb: "show", thetaRole:"location"}, {noun: "goose", type: "count", verb: "show", thetaRole:"substance"}, {noun: "turkey", type: "count", verb: "show", thetaRole:"location"}, {noun: "children", type: "plural", verb: "bring", thetaRole:"substance"}, {noun: "parents", type: "plural", verb: "bring", thetaRole:"location"}, {noun: "doctor", type: "count", verb: "bring", thetaRole:"substance"}, {noun: "patient", type: "count", verb: "bring", thetaRole:"location"}, {noun: "wine", type: "mass", verb: "spill", thetaRole:"substance"}, {noun: "gravy", type: "mass", verb: "coat", thetaRole:"substance"}, {noun: "chicken", type: "count", verb: "coat", thetaRole:"location"}, {noun: "shirt", type: "plural", verb: "spill", thetaRole:"location"}];

const irb = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `<center> <img src = "stimuli/alpslogo.png" height = 200> <p> <font size="4"> \ 
    We invite you to our research study on language production. \
    <br> Your experimenter will ask you to do a linguistic task, such as recording descriptions of images.</p> `,
    prompt: `<br><br><font size = "2"> LEGAL INFORMATION: <br> There are no risks or benefits of any kind involved in this study. \
    You will be paid for your participation at the posted rate. If you have read this form and have decided \
    to participate in this experiment, please understand your participation is voluntary and you have the right to \
    withdraw your consent or discontinue participation at anytime without penalty or loss of benefits to which you \
    are otherwise entitled. You have the right to refuse to do particular tasks. Your individual privacy will be \
    maintained in all published and written data resulting from the study. You may print this form for your records.\
    <br><br>CONTACT INFORMATION: \
    <br>If you have any questions, concerns or complaints about this research study, its procedures, risks and benefits, \
    you should contact the Protocol Director Meghan Sumner at (650)-725-9336. If you are not satisfied with how this study \
    is being conducted, or if you have any concerns, complaints, or general questions about the research or your rights as a \
    participant, please contact the Stanford Institutional Review Board (IRB) to speak to someone independent of the research \
    team at (650)-723-2480 or toll free at 1-866-680-2906. You can also write to the Stanford IRB, Stanford University, 3000 \
    El Camino Real, Five Palo Alto Square, 4th Floor, Palo Alto, CA 94306 USA.<br><br>`,
    
    choices: ['Continue']
};

const instructions_trainNouns = {
    type: jsPsychHtmlButtonResponse,
    stimulus: "This experiment will proceed in three phases. <br> \
    First, you will memorize the names of some objects. <br> \
    Next, you will recall the names. <br> \
    And finally, you will use your knowledge to describe some images.<br> <br> \
    We will now start the word-learning phase: Please memorize the name for the object you see.",
    choices: ["Continue"]
};

const instructions_testNouns = {
    type: jsPsychHtmlButtonResponse,
    stimulus: "Now, you will test your knowledge about the images you just memorized. Please type the name you remember for the object into the box. <br> You will be able to check your answers. Don't worry if you get one or two wrong, or if the spelling is not perfect- your submission will not be rejected if you forget and put in a reasonable guess.",
    choices: ["Continue"]
};

const instructions_MicAllowing = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `This experiment involves recording your voice, so you will need to enable audio recording with your mic.\
    <br> Click "Continue", then follow your browser prompts to allow your mic to record. <br>`,
    choices: ["Continue"]
};

const instructions_trainMainExperiment = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `<img src = "stimuli/nouns/sally.png" height = 200> <br> \
    This is Sally. <br> In this part, you will be describing what Sally will do today. <br> \
    We will give you a verb, and a picture showing some of the objects you just learned: \
    Please look at the image, and then use the "Start Recording" button to record a description of what Sally will do. \
    Please start your sentence by mentioning Sally, use complete sentences, and remember to use the provided verb. <br> \
    You will now see two examples. <br><br> `,
    choices: ["Continue"]
};

const instructions_MainExperiment = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `<img src = "stimuli/nouns/sally.png" height = 200> <br> \
    Nice! You've completed the examples. <br> \
    Now we'll record descriptions for some more images. In this part, you won't get feedback, so just click "Done Recording" \
    to go on and record the next image. <br> <br>\
    Don't worry if you forget what an object is called: just do your best.\ 
    As a reminder, we will give you a verb, and a picture showing some of the objects you just learned: \
    Please look at the image, and then use the "Start Recording" button to record a description of what Sally will do. \
    Please start your sentence by mentioning Sally, use complete sentences, and remember to use the provided verb. <br> `,
    choices: ["Continue"]
};


var intializeMic = {
    type: jsPsychInitializeMicrophone, 
};

var micTest = {
        timeline : [
        {
            type:jsPsychHtmlButtonResponse,
            stimulus: `Now we'll test that your mic is working. `,
            choices: ["Record a test phrase"]
        },
            {type: jsPsychHtmlAudioResponse,
            stimulus: `Please say a test phrase, to make sure your mic is working:`,
            allow_playback: true,
            record_again_button_label: `Record Again`,
            accept_button_label: `Done Testing`,
            recording_duration: 5000,
            done_button_label: `Done Recording`
            },
            ]
    }
var trainNouns = {
    timeline: [
    {
        type: jsPsychHtmlButtonResponse, 
        stimulus: function(){
            var html =  `<p><font size="10">${jsPsych.timelineVariable('noun')}</font></p> <img src = "stimuli/nouns/${jsPsych.timelineVariable('verb')}/${jsPsych.timelineVariable('thetaRole')}s/${jsPsych.timelineVariable('noun')}.png" height = 300>`;
        return html;
        },
        choices: ["Continue"],
        on_finish: function(data) {
            jsPsych.setProgressBar((data.trial_index) / totalTimelineLength)
        }
    }
        ],
    timeline_variables: nouns,
    randomize_order: true 
    }

var testNouns = {
    timeline: [
    {
        type: jsPsychSurveyText, 
        preamble: function(){
            var html =  `What is the name of this object? <br> <img src = "stimuli/nouns/${jsPsych.timelineVariable('verb')}/${jsPsych.timelineVariable('thetaRole')}s/${jsPsych.timelineVariable('noun')}.png" height = 300><br>`;
        return html;
        },
        questions: [{prompt: '', required : true, name: 'guessNoun'}],
        data:{
            tested_noun : jsPsych.timelineVariable('noun'),
        }
    },
    {
        type: jsPsychHtmlButtonResponse, 
        stimulus: function(){
            participant_guess = jsPsych.data.getLastTrialData().trials[0].response.guessNoun;
            correct_answer = jsPsych.timelineVariable('noun');
            var response = correctParticipantResponse(participant_guess, correct_answer);
            return response;
        },
        choices: ['Continue'],
        on_finish: function(data) {
            jsPsych.setProgressBar((data.trial_index) / totalTimelineLength)
        }
    },
    ],
    timeline_variables: nouns,
    randomize_order: true,
    }



var trainMainExperiment = {
    timeline: [
        {
        type: jsPsychHtmlButtonResponse, 
        stimulus: function(){
            verb = jsPsych.timelineVariable('verb')
            scene = jsPsych.timelineVariable('scene')
            mirroringCondition = jsPsych.timelineVariable('mirroringCondition')
            var html = `<p><font size="5">Please think of a sentence that describes the image, starting with "Sally will..." <br> <br> <img src = "stimuli/finished_stimuli/${verb}/loc_foregrounded/${scene}_${mirroringCondition}.jpg" height = 500> `;
        return html;
    },
        button_html: '<button class="start-recording-btn">%choice%</button>',
        choices: ["I'm Ready To Record"],
    },
    {
        type: jsPsychHtmlAudioResponse, 
        stimulus: function(){
            verb = jsPsych.timelineVariable('verb')
            scene = jsPsych.timelineVariable('scene')
            mirroringCondition = jsPsych.timelineVariable('mirroringCondition')
            var html = `<p><font size="5">Please think of a sentence that describes the image, starting with "Sally will..." <br> <br> <img src = "stimuli/finished_stimuli/${verb}/loc_foregrounded/${scene}_${mirroringCondition}.jpg" height = 500> <br> `;
            return html;
    },
        recording_duration: 50000,
        done_button_label: "Done Recording",
    },
    {
        type: jsPsychHtmlButtonResponse, 
        stimulus: function(){
            verb = jsPsych.timelineVariable('verb')
            scene = jsPsych.timelineVariable('scene')
            mirroringCondition = jsPsych.timelineVariable('mirroringCondition')
            var html = `<p><font size="5"> For example, you could say: <h1 style="color:#288BA8">"${jsPsych.timelineVariable('sentence')}"</h1> Remember to always use full sentences, and mention Sally. <br> <img src = "stimuli/finished_stimuli/${verb}/loc_foregrounded/${scene}_${mirroringCondition}.jpg" height = 500> <br> `;
        return html;
    },
        choices: ['Continue'],
    },
    ],
    on_finish: function(data) {
        jsPsych.setProgressBar((data.trial_index) / totalTimelineLength)
    },
    timeline_variables: trainMainExperimentVariables(),
    data: {
        verb: jsPsych.timelineVariable('verb'),
        scene: jsPsych.timelineVariable('scene'),
        foregrounded: jsPsych.timelineVariable('foreCondition'),
        exampleSent: jsPsych.timelineVariable('sentence'),
        mirroringCondition: jsPsych.timelineVariable('mirroringCondition')
    },
}


var mainExperiment = {
    timeline: [
    {
        type: jsPsychHtmlButtonResponse, 
        stimulus: function(){
            verb = jsPsych.timelineVariable('verb')
            scene = jsPsych.timelineVariable('scene')
            foreCondition = jsPsych.timelineVariable('foreCondition')
            mirroringCondition = jsPsych.timelineVariable('mirroringCondition')
            var html = `<img src = "stimuli/finished_stimuli/${verb}/${foreCondition}_foregrounded/${scene}_${mirroringCondition}.jpg" height = 500>`;
        return html;
    },
        choices : ["Ready to record"],
        button_html: '<button class="start-recording-btn">%choice%</button>',
        trial_duration : 50000,
    },
    {
        type: jsPsychHtmlAudioResponse, 
        stimulus: function(){
            verb = jsPsych.timelineVariable('verb')
            scene = jsPsych.timelineVariable('scene')
            foreCondition = jsPsych.timelineVariable('foreCondition')
            mirroringCondition = jsPsych.timelineVariable('mirroringCondition')
            var html = `<img src = "stimuli/finished_stimuli/${verb}/${foreCondition}_foregrounded/${scene}_${mirroringCondition}.jpg" height = 500>`;
        return html;
    },
        recording_duration: 50000,
        done_button_label: "Done Recording",
        on_finish: function(data) {
            jsPsych.setProgressBar((data.trial_index) / totalTimelineLength)
        }
    }
    ],
    timeline_variables: mainExperimentVariables,
    data: {
        verb: jsPsych.timelineVariable('verb'),
        scene: jsPsych.timelineVariable('scene'),
        foregrounded: jsPsych.timelineVariable('foreCondition'),
        mirroringCondition: jsPsych.timelineVariable('mirroringCondition'),
    }
}


const preloadNounTrainingStims = {
    type: jsPsychPreload,
    images: preloadableNouns(nouns), 
    message: "Experiment visuals are loading, please wait... ",
};

const preloadMainExperimentStims = {
    type: jsPsychPreload,
    images: preloadableStims(mainExperimentVariables), 
    message: "Experiment visuals are loading, please wait... ",
};

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
};
const aws_upload = {
    type: jsPsychCallFunction,
    func: function () {
        //add audio ID to the data object 
        jsPsych.data.addProperties({audio_id: audio_id, time: timestamp}); 
        //Upload all data to amazon s3 bucket
        var data = jsPsych.data.get().json();
        lambda_upload(data);
    }
};

const remove_audio_strings = {
    type: jsPsychCallFunction,
    func: function () {
        //Replace html-audio-response trials' responses 
        //(the audio strings) with unique Participant IDs
        // This loop edits the actual JsPsych's data object!!
        // Makes data safe to upload to proliferate
            for (datapoint of jsPsych.data.get()['trials']){
                if (datapoint['trial_type'] == 'html-audio-response'){
                    datapoint['response'] = audio_id;
                }
            };
        }
    }


const thank_you = {
    type: jsPsychHtmlButtonResponse,
    stimulus : `<img src = "stimuli/thankyou.png" height = 300><br>`,
    choices : ["Finish"],
}


// Total number of trials (summing together different experiment stages)
// Used to calculate progress through the experiment 
// Total count of instruction trials + 2x main experiment variables (1x for "i'm ready to record", 1x for "i'm done recording) + nouns (1x for train, 2x for test)... 
totalTimelineLength = 8 + (3*nouns.length) + 2*mainExperimentVariables.length + (3 * trainMainExperimentVariables().length)
totalTimelineLength =  totalTimelineLength-1 //trial counts are 0-indexed 


timeline.push(irb);
timeline.push(instructions_MicAllowing);
timeline.push(intializeMic); 
timeline.push(micTest)
timeline.push(instructions_trainNouns);
timeline.push(preloadNounTrainingStims); 
timeline.push(trainNouns); 
timeline.push(instructions_testNouns);
timeline.push(testNouns);
timeline.push(instructions_trainMainExperiment);
timeline.push(trainMainExperiment);
timeline.push(instructions_MainExperiment)
timeline.push(preloadMainExperimentStims)
timeline.push(mainExperiment);
timeline.push(aws_upload);
timeline.push(remove_audio_strings);
timeline.push(exitSurvey);
timeline.push(thank_you);

jsPsych.run(timeline)
