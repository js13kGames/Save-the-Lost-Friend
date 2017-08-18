var waterLevelMap = ["xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxeeeeeeeeeexxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "x                             eeeeeeeeee         l                               x",
    "x                      l     s   s     s      l                                  x",
    "x         l          l                                  s      l                 x",
    "x                         s        l                                             x",
    "x                                                                                x",
    "x   l                                                l                           x",
    "x                                                                                x",
    "x                     l                                        l                 x",
    "x          l                                     s                               x",
    "aa    l              l                  @                                       ff",
    "aa                 l               l                                            ff",
    "aa                                                 l              l             ff",
    "aa     l               s                                                        ff",
    "aa                              l                             l                 ff",
    "aa                                                                              ff",
    "x                                          l             s                       x",
    "x              l                                               l                 x",
    "x                               s                                                x",
    "x  l      l                     l                                                x",
    "x                                                                                x",
    "x                                           l                                    x",
    "x                              wwwwwwwwww                             l          x",
    "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxwwwwwwwwwwxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
];

function Island(pos, character) {
    this.pos = pos;
    this.size = new Vector(1, 1);
    this.color = null;
    this.type = null;
}

Island.prototype.draw = function(cx, x, y) {
    cx.save();
    cx.fillStyle = this.color;
    cx.fillRect(x, y, Game.scale, Game.scale);
    cx.restore();
}

Island.prototype.act = function(step, level) {

}

function addDialog(islandType) {
    this.dialog = new Dialog();
    this.dialog.firstMessage = "Welcome to " + islandType + " island.";
    this.dialog.restMessage = "Welcome to " + islandType + " island again.";
}

function Earth(pos, character) {
    Island.call(this, pos, character);
    this.type = "earth";
    this.color = "brown";
    addDialog.call(this, "earth");
}
Earth.prototype = Object.create(Island.prototype);

function Water(pos, character) {
    Island.call(this, pos, character);
    this.type = "water";
    this.color = "green";
    addDialog.call(this, "water");
}
Water.prototype = Object.create(Island.prototype);

function Fire(pos, character) {
    Island.call(this, pos, character);
    this.type = "fire";
    this.color = "red";
    addDialog.call(this, "fire");
}
Fire.prototype = Object.create(Island.prototype);

function Air(pos, character) {
    Island.call(this, pos, character);
    this.type = "air";
    this.color = "white";
    addDialog.call(this, "air");
}
Air.prototype = Object.create(Island.prototype);

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
        cx.beginPath();
        if (this.speed.x > 0) {
            cx.strokeStyle = "white";
            cx.moveTo(x, y);
            cx.lineTo(x - 50, y - 20);
            cx.moveTo(x, y + 10);
            cx.lineTo(x - 50, y + 30);
        } else {
            cx.strokeStyle = "white";
            cx.moveTo(x + 20, y);
            cx.lineTo(x + 50, y - 20);
            cx.moveTo(x + 20, y + 10);
            cx.lineTo(x + 50, y + 30);
        }
        cx.stroke();
    } else {
        cx.fillRect(x, y, 10, 20);
        cx.beginPath();
        if (this.speed.y > 0) {
            cx.strokeStyle = "white";
            cx.moveTo(x, y);
            cx.lineTo(x - 20, y - 50);
            cx.moveTo(x + 10, y);
            cx.lineTo(x + 30, y - 50);
        } else {
            cx.strokeStyle = "white";
            cx.moveTo(x, y + 20);
            cx.lineTo(x - 20, y + 50);
            cx.moveTo(x + 10, y + 20);
            cx.lineTo(x + 30, y + 50);
        }
        cx.stroke();
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
    "l": "log"
};
var waterLevelActorChars = {
    "@": WaterPlayer,
    "s": Shark,
    "w": Water,
    "e": Earth,
    "f": Fire,
    "a": Air
};


var waterLevel = new LevelInfo(LEVEL_TYPE.NONPLATFORMER, waterLevelMap, waterLevelBackgroundChars, waterLevelActorChars);

waterLevel.playerTouched = function(type, actor, level) {
    if ((type == "shark") && (level.status == null)) {
        if (level.player.playerHitTimer == 0) {
            level.player.health -= 10;
            level.player.playerHitTimer = level.player.playerHitTimerMax;
            Game.hud.clearHudObjects();
            Game.hud.addElement({ "type": MessageType.GAME_MESSAGE, "message": "Beware of the Sharks. Shark Attacked. " + level.player.health });
        }
        if (level.player.health <= 0) {
            return "lost"
        }
    }
    if (actor && actor.dialog) {
        actor.dialog.speak();
    }
    if (type == "earth" && level.status == null) {
        return "won";
    }
};

waterLevel.drawBackground = function(backgroundChar, cx, x, y) {
    if (backgroundChar == "wall") {
        cx.save();
        cx.fillStyle = "yellow";
        cx.fillRect(x, y, 20.5, 20);
        cx.restore();
    } else if (backgroundChar == "log") {
        cx.save();
        cx.fillStyle = "brown";
        cx.fillRect(x, y, 20.5, 10);
        cx.restore();
    }
};