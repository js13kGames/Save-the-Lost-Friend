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
            "answer": "My memory is bad. I guess the wise Turtle would know.",
            "askedStatus": 0
        }
    }, // end of batch 2
    "2": {
        "welcomeMessage": "Off you to see the wise turtle.",
        "0": {
            "question": "Where can I find the turtle?",
            "answer": "Well search in some other island.",
            "askedStatus": 0
        }
    }, // end of batch 3
    "3": {
        "welcomeMessage": "Find the wise turtle in some other island.",
        "0": {
            "question": "How do I reach him?",
            "answer": "Well make a raft.",
            "askedStatus": 0
        }
    }, // end of batch 3
    "4": {
        "welcomeMessage": "Find the turtle using a raft.",
        "0": {
            "question": "How. There is nothing in this barren island.",
            "answer": " Well find the rope, collect the floating logs and whatever else it is you need to make a raft.",
            "askedStatus": 0
        }
    }, // end of batch 5
    //"currentBatchKey": "welcomeMessage"
    "currentBatchKey": "0"
}; // end of bird dialogue.