function Dialog() {
    this.messages = {};
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

var gaurdianCreatures = {
    "crab": {
        "island": "earth",
        "direction": "north"
    },
    "tortoise": {
        "island": "water",
        "direction": "south"
    },
    "eagle": {
        "island": "fire",
        "direction": "east"
    },
    "owl": {
        "island": "air",
        "direction": "west"
    }
};

var initNPCDialog = function(creatureName) {
    var commonDialogue = {
        "0": {
            "welcomeMessage": "Glad to see you have not yet given up on your quest to rescue your lost friend.",
            "0": {
                "question": "Do you know me? I have lost all memory and do not remember.",
                "answer": "You are the brave adventurer, who is risking his life to save his lost friend.",
                "askedStatus": 0
            },
            "1": {
                "question": " Do you know what happened to my lost friend?",
                "answer": "Yes, a portal opened and many people including your friend disappeared through it.",
                "askedStatus": 0
            }
        }, // end of batch 0
        "1": {
            "welcomeMessage": "You need to rescue your lost friend and all the lost people of this world.",
            "0": {
                "question": "Who are you.?",
                "answer": "I am the gaurdian of the " + gaurdianCreatures[creatureName].island + " island.",
                "askedStatus": 0
            },
            "1": {
                "question": "What do I need to do to rescue my friend?",
                "answer": "Retrieve the " + gaurdianCreatures[creatureName].island + " gem from the " + gaurdianCreatures[creatureName].island + " island.",
                "askedStatus": 0
            },
            "2": {
                "question": " How do I get the gem?",
                "answer": "Take the key from me to enter the island in the  " + gaurdianCreatures[creatureName].direction + " to get the gem.",
                "askedStatus": 0
            },
            "3": {
                "question": "Where should I go next?",
                "answer": "Go to the " + gaurdianCreatures[creatureName].island + " island in the " + gaurdianCreatures[creatureName].direction + " to get the gem.",
                "askedStatus": 0
            }
        },
        "2": { // when he has key but no gem and gem not returned to central island.
            "welcomeMessage": "Go to the " + gaurdianCreatures[creatureName].island + " island in the " + gaurdianCreatures[creatureName].direction + " to get the gem."
        },
        "3": { // Got gem but not all.
            "welcomeMessage": "Great! you got the " + gaurdianCreatures[creatureName].island + " island gem. Get gems from other islands."
        },
        "4": { // Got all gems. Yet to return them to central island.
            "welcomeMessage": "Save your friend by placing the gems in central island and opening the portal."
        },
        "currentBatchKey": "0"
    };

    var dialogue = {
        "0": commonDialogue["0"],
        "1": commonDialogue["1"],
        "2": commonDialogue["2"],
        "3": commonDialogue["3"],
        "4": commonDialogue["4"],
        "currentBatchKey": "0"
    };
    return dialogue;
}

var crabDialogue = initNPCDialog("crab");
var tortoiseDialogue = initNPCDialog("tortoise");
var eagleDialogue = initNPCDialog("eagle");
var owlDialogue = initNPCDialog("owl");