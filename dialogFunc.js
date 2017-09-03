function Dialog() {
    this.messages = {};
    this.enterTriggerRegion = false;
}

Dialog.prototype.inTriggerRegion = function() {
    return true;
}

Dialog.prototype.activated = function() {

}

Dialog.prototype.setNextQuestionBatch = function() {
    var nextBatch = String(Number(this.messages["currentBatchKey"]) + 1);
    if (this.messages[nextBatch]) {
        this.messages["currentBatchKey"] = nextBatch;
    }
}

Dialog.prototype.getNextQuestionBatch = function() {
    return this.messages[this.messages["currentBatchKey"]];
}

Dialog.prototype.lastBatch = function() {
    var totalBatches = Object.keys(this.messages).length - 2;
    return Number(this.messages["currentBatchKey"]) == totalBatches;
}

/* 
Update the question status once player has selected once and answer has been given.
Update batch number ( currentBatchKey) once all the questions have status 1.
Get the answer corresponding a selected question on screen.
*/

/*
var birdDialogue = {
    "0": {
        "welcomeMessage": "Hey you again. Don't you ever give up.",
        "0": {
            "question": "A talking bird. Hmmm. How did you learn to talk.?",
            "answer": "What an outrage?  You wish me dumb?",
            "askedStatus": 0
        }
    },
    "currentBatchKey": "0"
}
*/
/* Different object dialogue. */
var birdDialogue = {
    "0": {
        "welcomeMessage": "Hey you again. Don't you ever give up.",
        "0": {
            "question": "A talking bird. Hmmm. How did you learn to talk.?",
            "answer": "What an outrage?  You wish me dumb?",
            "askedStatus": 0
        },
        "1": {
            "question": "Do you know me?",
            "answer": "Know you?? Now thats a deep question. I do not even know myself.",
            "askedStatus": 0
        },
        "2": {
            "question": " Have you seen me before?",
            "answer": "Yes , this is the third time you are here.",
            "askedStatus": 0
        }
    }, // end of batch 1
    "1": {
        "welcomeMessage": "So I have seen you and do not know you.",
        "0": {
            "question": " Where was I going to?",
            "answer": "My memory is bad. I guess the crab would know.",
            "askedStatus": 0
        }
    }, // end of batch 2
    "2": {
        "welcomeMessage": "Off you go to see the crab.",
        "0": {
            "question": "Where can I find the crab?",
            "answer": "Well search in some other island.",
            "askedStatus": 0
        }
    }, // end of batch 3
    "3": {
        "welcomeMessage": "Find the crab in some other island.",
        "0": {
            "question": "How do I reach him?",
            "answer": "Well make a raft.",
            "askedStatus": 0
        }
    }, // end of batch 3
    "4": {
        "welcomeMessage": "Find the crab using a raft.",
        "0": {
            "question": "How. There is nothing in this barren island.",
            "answer": " Well find the rope, collect the floating logs and whatever else it is you need to make a raft.",
            "askedStatus": 0
        }
    }, // end of batch 5
    //"currentBatchKey": "welcomeMessage"
    "currentBatchKey": "0"
}; // end of bird dialogue.

/*
var crabDialogue = {
    "0": {
        "welcomeMessage": "Hi Sea braving warrior. Did you get my fish? ",
        "0": {
            "question": "Fish?  How am I supposed to know you need fish. ",
            "answer": "You promised me the last time you were here and the time before too.",
            "askedStatus": 0
        },
    },
    "currentBatchKey": "0"
}*/

var crabDialogue = {
    "0": {
        "welcomeMessage": "Hi Sea braving warrior. Did you get my fish? ",
        "0": {
            "question": "Fish?  How am I supposed to know you need fish. ",
            "answer": "You promised me the last time you were here and the time before too.",
            "askedStatus": 0
        },
    }, // end of batch 1
    "1": {
        "welcomeMessage": "How can you forget my fish?",
        "0": {
            "question": " Sorry Iam lost. I do not remember anything. Do you know what I was doing last time.",
            "answer": "You were going to rescue your lost friend.",
            "askedStatus": 0
        }
    }, // end of batch 2
    "2": {
        "welcomeMessage": "So you have lost your memory.",
        "0": {
            "question": "How do I find my lost friend?",
            "answer": "You could ask the blind eagle. Since he flies around places he will know better.",
            "askedStatus": 0
        }
    }, // end of batch 3
    "3": {
        "welcomeMessage": "My advice is to find the blind eagle in some other island.",
        "0": {
            "question": "How do I reach him?",
            "answer": "He is a reclusive fellow but once he senses you have met me he will appear.",
            "askedStatus": 0
        }
    }, // end of batch 4
    "4": {
        "welcomeMessage": "Find the eagle using your raft in some other island."
    }, // end of batch 5
    //"currentBatchKey": "welcomeMessage"
    "currentBatchKey": "0"
}; // end of bird dialogue.

var eagleDialogue = {
    "0": {
        "welcomeMessage": "I smell someone. Ok I also sense he has met my friend the crab. Halt what do you want?",
        "0": {
            "question": "Iam searching for my lost friend. Can you help me ",
            "answer": "Why it was only some time back when some one was searching for his lost friend.? Smells familiar.",
            "askedStatus": 0
        },
    }, // end of batch 1
    "1": {
        "welcomeMessage": "I remember you were here to rescue your friend.",
        "0": {
            "question": " I have lost my memory. Do you remember anything at all about me?.",
            "answer": "Yes you are from the other side of the time curtain. You came looking for your friend who also came from there.",
            "askedStatus": 0
        }
    }, // end of batch 2
    "2": {
        "welcomeMessage": "You were searching for your friend.",
        "0": {
            "question": "How do I find my lost friend?",
            "answer": "Your friend must have been taken over by the strange plague which is affecting this world",
            "askedStatus": 0
        }
    }, // end of batch 3
    "3": {
        "welcomeMessage": "The plague has converted quite a few of our people into skeletal zombies.",
        "0": {
            "question": "How do I save him?",
            "answer": "The wise owl should be of some help here.",
            "askedStatus": 0
        }
    }, // end of batch 4
    "4": {
        "welcomeMessage": "The wise owl should show you some path to save your lost friend",
        "0": {
            "question": "How do find the wise owl?",
            "answer": "The wise owl will be in one of the other islands.",
            "askedStatus": 0
        }

    }, // end of batch 5
    "5": {
        "welcomeMessage": "Find the wise owl in some other island."

    }, // end of batch 6
    //"currentBatchKey": "welcomeMessage"
    "currentBatchKey": "0"
}; // end of eagle dialogue.

var owlDialogue = {
    "0": {
        "welcomeMessage": "Hey foreigner, so you failed on your quest but survived still.",
        "0": {
            "question": "What quest? ",
            "answer": "The quest to bring our people from being zombies and of course save your friend.",
            "askedStatus": 0
        },
        "1": {
            "question": "Why do call me foreigner? ",
            "answer": "This is because you are not from here.",
            "askedStatus": 0
        },
        "2": {
            "question": "Why do think I failed? ",
            "answer": "Since if your survived then the zombies would be human again.",
            "askedStatus": 0
        },
        "3": {
            "question": "Why do doubt my survival? ",
            "answer": "I sense the quest to be a difficult and life threatening one.",
            "askedStatus": 0
        },

    }, // end of batch 1
    "1": {
        "welcomeMessage": "From my questions I sense you lost your memory.",
        "0": {
            "question": "What do I do?.",
            "answer": "Go find the earth island in the north.",
            "askedStatus": 0
        }
    }, // end of batch 2
    "2": {
        "welcomeMessage": "Find the earth island.",
        "0": {
            "question": "What do I do once I get there?",
            "answer": "Once you get there talk to the Earth island guardian.",
            "askedStatus": 0
        }
    }, // end of batch 3
    "3": {
        "welcomeMessage": "Go to the earth island and speak to the earth spirit."
    },
    "currentBatchKey": "0"
}; // end of bird dialogue.