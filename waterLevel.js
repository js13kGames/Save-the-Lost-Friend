var rowWidth = 100;
var rowHeight = 100;
var isLandSizePercent = 0.2;
var remSharkPercent = .995; // 1 percent of sharks.
var remLogPercent = .99; // 5 percent of logs
var numberOfTilesInIsland = 100;

waterLevelPlan = createPlan(rowWidth, rowHeight, isLandSizePercent, remSharkPercent, remLogPercent, numberOfTilesInIsland);

function SignBoard(pos, character, type, color) {
    this.pos = pos;
    this.size = new Vector(1, 1);
    this.color = color;
    this.type = type;
    this.hasDialog = true;
    this.isActivated = true;
    addSignPostDialog.call(this, type);
}

SignBoard.prototype.draw = function(cx, x, y) {
    cx.save();
    cx.fillStyle = this.color;
    cx.fillRect(x, y, Game.scale, Game.scale);
    cx.restore();
}

SignBoard.prototype.act = function(step, level) {

}

function addSignPostDialog(islandType) {
    this.dialog = new Dialog();
    this.dialog.messages = {
        "0": {
            "welcomeMessage": "Welcome to " + islandType + " island signboard."
        },
        "currentBatchKey": "0"
    }; // Only welcome msg for the sign post dialog. 
}

function EarthSignBoard(pos, character) {
    SignBoard.call(this, pos, character, "earth", "brown");
}
EarthSignBoard.prototype = Object.create(SignBoard.prototype);

function WaterSignBoard(pos, character) {
    SignBoard.call(this, pos, character, "water", "green");
}
WaterSignBoard.prototype = Object.create(SignBoard.prototype);

function FireSignBoard(pos, character) {
    SignBoard.call(this, pos, character, "fire", "red");
}
FireSignBoard.prototype = Object.create(SignBoard.prototype);

function AirSignBoard(pos, character) {
    SignBoard.call(this, pos, character, "air", "white");
}
AirSignBoard.prototype = Object.create(SignBoard.prototype);

function NPC(pos, character, type, dialogMsg) {
    this.pos = pos;
    this.hasDialog = true;
    this.dialog = new Dialog();
    this.dialog.messages = dialogMsg;
    this.type = type;
    this.drawLast = true;
    waterLevel.npcs.push(this);
}

NPC.prototype.draw = function(cx, x, y) {
    cx.save();
    if (this.type == "eagle") {
        drawEagle(cx, x + Game.scale, y + 3 * Game.scale, Game.scale / 4);
    } else if (this.type == "tortoise") {
        drawTurtoise(cx, x, y + 2 * Game.scale, Game.scale / 5);
    } else if (this.type == "crab") {
        drawCrab(cx, x + 1 * Game.scale, y + 3.5 * Game.scale, Game.scale / 3);
    } else if (this.type = "owl") {
        drawOwl(cx, x + 1.8 * Game.scale, y + 1.3 * Game.scale, Game.scale / 4);
    }
    //cx.fillStyle = "rgba(255, 0, 0, 0.3)";
    //cx.fillRect(x, y, this.size.x * Game.scale, this.size.y * Game.scale);
    cx.restore();
}

NPC.prototype.act = function(step, level) {

}

function Tortoise(pos, character) {
    NPC.call(this, pos, character, "tortoise", tortoiseDialogue);
    this.island = "water";
    this.size = new Vector(8, 4);
}
Tortoise.prototype = Object.create(NPC.prototype);

function Crab(pos, character) {
    NPC.call(this, pos, character, "crab", crabDialogue);
    this.island = "earth";
    this.size = new Vector(8, 4);
}
Crab.prototype = Object.create(NPC.prototype);

function Eagle(pos, character) {
    NPC.call(this, pos, character, "eagle", eagleDialogue);
    this.island = "fire";
    this.size = new Vector(4.5, 5);
}
Eagle.prototype = Object.create(NPC.prototype);

function Owl(pos, character) {
    NPC.call(this, pos, character, "owl", owlDialogue);
    this.island = "air";
    this.size = new Vector(5.5, 7);
}
Owl.prototype = Object.create(NPC.prototype);


function islandStruct(pos, character) {
    this.pos = pos;
    this.size = new Vector(1, 1);
    this.color = "pink";
    this.character = character;
    this.collisionNotRequired = true;
}

islandStruct.prototype.draw = function(cx, x, y) {
    cx.save();
    cx.fillStyle = this.color;
    cx.fillRect(x, y, Game.scale, Game.scale);
    cx.restore();
}

islandStruct.prototype.act = function(step, level) {

}
islandStruct.prototype.type = "islandStruct";


function Shark(pos, character) {
    this.pos = pos;
    this.size = new Vector(1, 1);
    this.dir = Math.random();
    if (this.dir > 0.5) {
        this.speedX = ~~(Math.max(Math.random(), 0.2) * 28);
        this.speedY = 0;
    } else {
        this.speedX = 0;
        this.speedY = ~~(Math.max(Math.random(), 0.2) * 28);
    }
    this.speed = new Vector(this.speedX, this.speedY);
}

Shark.prototype.type = "shark";

// Called at every step of the animate.
Shark.prototype.act = function(step, level) {
    var newPos = this.pos.plus(this.speed.times(step)); // Calculate newPos
    if (!level.collisionWith(newPos, this.size, "obstacle") && !level.collisionWith(newPos, this.size, "island")) // If no obstacle
    { // If no island struct.
        this.pos = newPos;
    } else {
        this.speed = this.speed.times(-1); // else change direction.
    }
};

Shark.prototype.draw = function(cx, x, y) {
    cx.save();
    cx.fillStyle = "grey";
    if (this.speed.x != 0) {
        cx.fillRect(x, y, 20, 10);
        cx.beginPath();
        cx.strokeStyle = "white";
        if (this.speed.x > 0) {
            cx.moveTo(x, y);
            cx.lineTo(x - 50, y - 20);
            cx.moveTo(x, y + 10);
            cx.lineTo(x - 50, y + 30);
            cx.moveTo(x + 20, y);
            cx.quadraticCurveTo(x + 40, y + 5, x + 20, y + 10);
        } else {
            cx.moveTo(x + 20, y);
            cx.lineTo(x + 50, y - 20);
            cx.moveTo(x + 20, y + 10);
            cx.lineTo(x + 50, y + 30);
            cx.moveTo(x, y);
            cx.quadraticCurveTo(x - 20, y + 5, x, y + 10);
        }
        cx.stroke();
        cx.fill();
    } else {
        cx.fillRect(x, y, 10, 20);
        cx.beginPath();
        cx.strokeStyle = "white";
        if (this.speed.y > 0) {
            cx.moveTo(x, y);
            cx.lineTo(x - 20, y - 50);
            cx.moveTo(x + 10, y);
            cx.lineTo(x + 30, y - 50);
            cx.moveTo(x, y + 20);
            cx.quadraticCurveTo(x + 5, y + 40, x + 10, y + 20);
        } else {
            cx.moveTo(x, y + 20);
            cx.lineTo(x - 20, y + 50);
            cx.moveTo(x + 10, y + 20);
            cx.lineTo(x + 30, y + 50);
            cx.moveTo(x, y);
            cx.quadraticCurveTo(x + 5, y - 20, x + 10, y);
        }
        cx.stroke();
        cx.fill();
    }
    cx.restore();
}


function WaterPlayer(pos) {
    PlayerNonPlatformer.call(this, pos);
    this.health = 100;
}
WaterPlayer.prototype = Object.create(PlayerNonPlatformer.prototype);

var waterLevelBackgroundChars = {
    "x": "wall",
    "l": "log",
    "w": "water",
    "e": "earth",
    "f": "fire",
    "a": "air"
};

var waterLevelActorChars = {
    "@": WaterPlayer,
    "s": Shark,
    "W": WaterSignBoard,
    "E": EarthSignBoard,
    "F": FireSignBoard,
    "A": AirSignBoard,
    "q": islandStruct,
    "B": Tortoise,
    "T": Owl, //owl
    "C": Crab, // Crab
    "U": Eagle // Eagle
};

var waterLevel = new LevelInfo(LEVEL_TYPE.NONPLATFORMER, waterLevelPlan, waterLevelBackgroundChars, waterLevelActorChars);
waterLevel.display = CanvasDisplay;

waterLevel.generateLevel = function() {
    this.level = waterLevelPlan;
}
waterLevel.npcs = [];
npcIslandType = { "earth": "crab", "water": "tortoise", "air": "owl", "fire": "eagle" };
islandLevel = { "earth": earthLevel, "water": riverLevel, "air": airLevel, "fire": fireLevel };

function islandTouch(type) {
    var denyEntryMessage = "You need to collect the key from " + npcIslandType[type] + " to enter the " + type + " island";
    var welcomeMessage = "Welcome to the " + type + " island";
    var gotGemMessage = "You have already collected the gem from " + type + " island";
    if (!Game.levelKeys[type]) {
        Game.hud.setGameMessage(denyEntryMessage);
        return;
    }
    if (Game.gemsCollected[type]) {
        Game.hud.setGameMessage(gotGemMessage);
        return;
    }
    Game.hud.setGameMessage(welcomeMessage);
    Game.nextLevel = islandLevel[type];
    return "won";
}

waterLevel.playerTouched = function(type, actor, level) {
    if ((type == "shark") && (level.status == null) && (!Game.inInteraction)) {
        if (level.player.playerHitTimer == 0) {
            level.player.health -= 10;
            level.player.playerHitTimer = level.player.playerHitTimerMax;
            Game.hud.setGameMessage("Beware of the Sharks. Shark Attacked. " + level.player.health);
        }
        if (level.player.health <= 0) {
            return "lost"
        }
    }
    if (level.status == null && islandLevel[type]) {
        return islandTouch(type, null);
    }
};

waterLevel.playerInteract = function(triggerObject, level) {
    var dialogObject = triggerObject.dialog.getNextQuestionBatch();

    if (triggerObject.dialog.messages.currentBatchKey == "2") {
        if (!Game.gemsCollected[triggerObject.island]) {
            Game.levelKeys[triggerObject.island] = true;
            Game.inInteraction = false;
            level.player.skipDialogTimer = 4 * level.player.skipDialogTimerMax;
            Game.hud.setGameMessage(dialogObject.welcomeMessage, false);
            return;
        }
    }
    if (triggerObject.dialog.messages.currentBatchKey == "3") {
        if (Game.numberOfGemsCollected != 4) {
            Game.inInteraction = false;
            level.player.skipDialogTimer = 4 * level.player.skipDialogTimerMax;
            Game.hud.setGameMessage(dialogObject.welcomeMessage, false);
            return;
        }
    }
    Game.numberOfQuestions = Object.keys(dialogObject).length - 1;
    var unAnsweredQ = 0;
    for (var i = 0; i < Game.numberOfQuestions; i++) {
        if (dialogObject["" + i].askedStatus == 0) {
            unAnsweredQ++;
        }
    }
    if (unAnsweredQ == 0 && !triggerObject.dialog.lastBatch()) {
        triggerObject.dialog.setNextQuestionBatch();
        dialogObject = triggerObject.dialog.getNextQuestionBatch();
        Game.currentQuestionNo = 0;
        Game.numberOfQuestions = Object.keys(dialogObject).length - 1;
        Game.nextQuestionReady = true;
    }
    // Update all NPC current batch to 1 if any one is 1.
    if (triggerObject.dialog.messages.currentBatchKey == "1" && !Game.currentBatchKey) {
        waterLevel.npcs.forEach(function(npc) {
            npc.dialog.messages.currentBatchKey = "1";
        });
        Game.currentBatchKey = true;
    }

    if (Game.numberOfQuestions == 0 && !Game.inGameMessage) {
        Game.hud.clearScreen();
        Game.inGameMessage = true;
        Game.hud.setGameMessage(dialogObject.welcomeMessage);
    } else if (!Game.inInteraction && Game.numberOfQuestions != 0 &&
        level.player.skipDialogTimer <= 0) {
        Game.inInteraction = true;
        Game.currentQuestionNo = 0;
        Game.hud.clearScreen();
        Game.hud.setGameMessage(dialogObject.welcomeMessage, true);
        Game.inQuestion = false;
        Game.nextQuestionReady = false;
    }

    if (keys.skip) {
        Game.hud.clearScreen();
        Game.hud.setGameMessage("", true);
        Game.inInteraction = false;
        level.player.skipDialogTimer = level.player.skipDialogTimerMax;
    }
    if (dialogObject && Game.numberOfQuestions != 0) {
        if (keyPressed.up && Game.inQuestion) {
            Game.currentQuestionNo--;
            Game.hud.drawQuestions(dialogObject);
            resetKeyPressed();
        }
        if (keyPressed.down && Game.inQuestion) {
            Game.currentQuestionNo++;
            Game.hud.drawQuestions(dialogObject);
            resetKeyPressed();
        }
        if (keyPressed.enter) {
            if (Game.inQuestion) {
                Game.hud.clearScreen();
                Game.hud.setGameMessage(dialogObject[Game.currentQuestionNo].answer, true);
                dialogObject[Game.currentQuestionNo].askedStatus = 1;
                Game.inQuestion = false;
            } else {
                Game.inQuestion = true;
                Game.hud.setGameMessage("", true);
                Game.hud.clearScreen();
                if (!Game.nextQuestionReady) {
                    Game.hud.drawQuestions(dialogObject);
                }
            }
            if (Game.nextQuestionReady) {
                Game.nextQuestionReady = false;
                Game.inInteraction = false;
            }
            resetKeyPressed();
        }
    }
};

waterLevel.drawBackground = function(backgroundChar, cx, x, y) {
    var tileColor = {
        "wall": "yellow",
        "log": "brown",
        "water": "#44bb22",
        "fire": "orange",
        "air": "grey",
        "earth": "#aa5522"
    }
    cx.save();
    cx.fillStyle = tileColor[backgroundChar];
    cx.fillRect(x, y, Game.scale, Game.scale);
    cx.restore();
};