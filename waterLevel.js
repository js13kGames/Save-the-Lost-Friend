var waterLevelMap = ["xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxeeeeeeeeeexxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "x                             eeeeEeeeee         l                               x",
    "x                      l     s   s     s      l                                  x",
    "x         l          l                                  s      l                 x",
    "x                         s        l                                             x",
    "x                                                                                x",
    "x   l                                                l                           x",
    "x                                                                                x",
    "x                     l                                        l                 x",
    "x          l                                     s                               x",
    "aa    l              l                  @                                       ff",
    "aa                 l               l                       B                    ff",
    "aa                                                 l              l             Ff",
    "aA     l               s                                                        ff",
    "aa                              l                             l                 ff",
    "aa                                                                              ff",
    "x                                          l             s                       x",
    "x              l                                               l                 x",
    "x                               s                                                x",
    "x  l      l                     l                                                x",
    "x                                                                                x",
    "x                                           l                                    x",
    "x                              wwwwWwwwww                             l          x",
    "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxwwwwwwwwwwxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
];


function SignBoard(pos, character, type, color) {
    this.pos = pos;
    this.size = new Vector(1, 1);
    this.color = color;
    this.type = type;
    this.hasDialog = true;
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

function Bird(pos, character) {
    this.pos = pos;
    this.size = new Vector(1, 1);
    this.color = "cream";
    this.hasDialog = true;
    this.dialog = new Dialog();
    this.dialog.messages = birdDialogue;
}

Bird.prototype.draw = function(cx, x, y) {
    cx.save();
    cx.fillStyle = this.color;
    cx.fillRect(x, y, Game.scale, Game.scale);
    cx.restore();
}

Bird.prototype.act = function(step, level) {

}

Bird.prototype.type = "bird";

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
    if (!level.obstacleAt(newPos, this.size)) { // If no obstacle set newPos
        this.pos = newPos
    } else {
        this.speed = this.speed.times(-1);
    }
};

Shark.prototype.draw = function(cx, x, y) {
    cx.save();
    cx.fillStyle = "grey";
    if (this.speed.x != 0) {
        cx.fillRect(x, y, 20, 10);
        if (this.speed.x > 0) {
            cx.beginPath();
            cx.strokeStyle = "white";
            cx.moveTo(x, y);
            cx.lineTo(x - 50, y - 20);
            cx.moveTo(x, y + 10);
            cx.lineTo(x - 50, y + 30);
            cx.moveTo(x + 20, y);
            cx.quadraticCurveTo(x + 40, y + 5, x + 20, y + 10);
            cx.stroke();
            cx.fill();
        } else {
            cx.beginPath();
            cx.strokeStyle = "white";
            cx.moveTo(x + 20, y);
            cx.lineTo(x + 50, y - 20);
            cx.moveTo(x + 20, y + 10);
            cx.lineTo(x + 50, y + 30);
            cx.moveTo(x, y);
            cx.quadraticCurveTo(x - 20, y + 5, x, y + 10);
            cx.stroke();
            cx.fill();
        }

    } else {
        cx.fillRect(x, y, 10, 20);
        if (this.speed.y > 0) {
            cx.beginPath();
            cx.strokeStyle = "white";
            cx.moveTo(x, y);
            cx.lineTo(x - 20, y - 50);
            cx.moveTo(x + 10, y);
            cx.lineTo(x + 30, y - 50);
            cx.moveTo(x, y + 20);
            cx.quadraticCurveTo(x + 5, y + 40, x + 10, y + 20);
            cx.stroke();
            cx.fill();
        } else {
            cx.strokeStyle = "white";
            cx.moveTo(x, y + 20);
            cx.lineTo(x - 20, y + 50);
            cx.moveTo(x + 10, y + 20);
            cx.lineTo(x + 30, y + 50);
            cx.moveTo(x, y);
            cx.quadraticCurveTo(x + 5, y - 20, x + 10, y);
            cx.stroke();
            cx.fill();
        }
    }
    cx.restore();
}


function WaterPlayer(pos) {
    PlayerNonPlatformer.call(this, pos);
    this.health = 50;
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
    "B": Bird
};


var waterLevel = new LevelInfo(LEVEL_TYPE.NONPLATFORMER, waterLevelMap, waterLevelBackgroundChars, waterLevelActorChars);

waterLevel.playerTouched = function(type, actor, level) {
    if ((type == "shark") && (level.status == null)) {
        if (level.player.playerHitTimer == 0) {
            level.player.health -= 10;
            level.player.playerHitTimer = level.player.playerHitTimerMax;
            Game.hud.setGameMessage("Beware of the Sharks. Shark Attacked. " + level.player.health);
        }
        if (level.player.health <= 0) {
            return "lost"
        }
    }
    if (actor && actor.dialog) {
        //actor.dialog.speak();
    }
    if (type == "earth" && level.status == null) {
        return "won";
    }
};

waterLevel.playerInteract = function(triggerObject, level) {
    var dialogObject = triggerObject.dialog.getNextQuestionBatch();
    Game.numberOfQuestions = Object.keys(dialogObject).length - 1;

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