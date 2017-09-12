var rowWidth = 100;
var rowHeight = 100;
var isLandSizePercent = 0.2;
var remSharkPercent = .995; // 1 percent of sharks.
var remLogPercent = .99; // 5 percent of logs
var numberOfTilesInIsland = 100;

waterLevelPlan = createPlan(rowWidth, rowHeight, isLandSizePercent, remSharkPercent, remLogPercent, numberOfTilesInIsland);

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


function Island(pos, type, color) {
    this.pos = pos;
    this.size = new Vector(1, 1);
    this.color = color;
    this.type = type;
}

Island.prototype.draw = function(cx, x, y) {
    cx.save();
    cx.fillStyle = this.color;
    cx.fillRect(x, y, Game.scale + 1, Game.scale + 1);
    cx.restore();
}

Island.prototype.act = function(step, level) {

}

function EarthIsland(pos) {
    Island.call(this, pos, "earth", "brown");
}
EarthIsland.prototype = Object.create(Island.prototype);

function WaterIsland(pos) {
    Island.call(this, pos, "water", "green");
}
WaterIsland.prototype = Object.create(Island.prototype);

function FireIsland(pos) {
    Island.call(this, pos, "fire", "red");
}
FireIsland.prototype = Object.create(Island.prototype);

function AirIsland(pos) {
    Island.call(this, pos, "air", "grey");
}
AirIsland.prototype = Object.create(Island.prototype);

function IsLandStruct(pos) {
    Island.call(this, pos, "isLandStruct", "#F4A460");
    this.collisionNotRequired = true;
}
IsLandStruct.prototype = Object.create(Island.prototype);

function Portal(pos) {
    this.pos = pos;
    this.drawLast = true;
    this.size = new Vector(8, 8);
    this.type = "portal";
}

Portal.prototype.drawPortalArc = function(cx, x, y, startAngle, endAngle, color) {
    cx.fillStyle = color;
    cx.beginPath();
    cx.moveTo(x + 4 * Game.scale, y + 4 * Game.scale);
    cx.arc(x + 4 * Game.scale, y + 4 * Game.scale, 4 * Game.scale, startAngle, endAngle);
    cx.fill();
}
Portal.prototype.draw = function(cx, x, y) {
    cx.save();
    cx.fillStyle = "#2F4F4F";
    this.drawPortalArc(cx, x, y, 0, Math.PI / 2, "green");
    this.drawPortalArc(cx, x, y, Math.PI / 2, Math.PI, "brown");
    this.drawPortalArc(cx, x, y, Math.PI, 1.5 * Math.PI, "grey");
    this.drawPortalArc(cx, x, y, 1.5 * Math.PI, 2 * Math.PI, "red");

    if (Game.gemsPlaced["water"]) {
        drawDiamond(cx, x + 4.5 * Game.scale, y + 7 * Game.scale, "#7777FE", "#2222FE");
    }
    if (Game.gemsPlaced["earth"]) {
        drawDiamond(cx, x + 0.5 * Game.scale, y + 7 * Game.scale, "#DEB887", "#DE8857");
    }
    if (Game.gemsPlaced["air"]) {
        drawDiamond(cx, x + 0.5 * Game.scale, y + 3 * Game.scale, "#DCDCDC", "#ECECEC");
    }
    if (Game.gemsPlaced["fire"]) {
        drawDiamond(cx, x + 4.5 * Game.scale, y + 3 * Game.scale, "#FE7777", "#FE2222");
    }
    cx.restore();
}

Portal.prototype.act = function() {};

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
    this.drawLast = true;
}
WaterPlayer.prototype = Object.create(PlayerNonPlatformer.prototype);

var waterLevelBackgroundChars = {
    "x": "wall",
    "l": "log"
};

var waterLevelActorChars = {
    "@": WaterPlayer,
    "s": Shark,
    "W": WaterIsland,
    "E": EarthIsland,
    "F": FireIsland,
    "A": AirIsland,
    "q": IsLandStruct,
    "P": Portal,
    "B": Tortoise,
    "T": Owl,
    "C": Crab,
    "U": Eagle
};

var waterLevel = new LevelInfo(LEVEL_TYPE.NONPLATFORMER, waterLevelPlan, waterLevelBackgroundChars, waterLevelActorChars);

waterLevel.generateLevel = function() {
    this.level = waterLevelPlan;
}
waterLevel.npcs = [];
npcIslandType = { "earth": "crab", "water": "tortoise", "air": "owl", "fire": "eagle" };
islandLevel = { "earth": earthLevel, "water": riverLevel, "air": airLevel, "fire": fireLevel };
waterLevel.islandChars = {
    "q": "0",
    "E": "1",
    "W": "2",
    "F": "3",
    "A": "4"
};

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

function placeGem(type, gemsPlaced) {
    if (Game.gemsCollected[type] && !Game.gemsPlaced[type]) {
        Game.gemsPlaced[type] = true;
        Game.numberOfGemsPlaced++;
        return " " + type + " ";
    }
    return "";
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
    if (level.status == null && type == "portal") {
        var gemsType = "";
        gemsType += placeGem("water");
        gemsType += placeGem("earth");
        gemsType += placeGem("air");
        gemsType += placeGem("fire");
        if (gemsType != "") {
            Game.hud.setGameMessage(gemsType + " gem placed in the portal");
        }
        if (Game.numberOfGemsPlaced == 4) {
            Game.GameOver = true;
            return "won";
        }
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

    if (Game.numberOfQuestions == 0) {
        Game.hud.clearScreen();
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
        "log": "brown"
    }
    cx.save();
    cx.fillStyle = tileColor[backgroundChar];
    if (backgroundChar == "log") {
        cx.fillStyle = "white";
        cx.fillRect(x - 4, y + Game.scale - 1, Game.scale + 8, 4);
        drawTriangle(cx, new Vector(x, y + Game.scale), new Vector(x + 0.5 * Game.scale, y), new Vector(x + Game.scale, y + Game.scale), "brown");
    } else {
        cx.fillRect(x, y, Game.scale + 1, Game.scale + 1);
        cx.restore();
    }
};