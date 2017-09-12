function generateEarthBasicLevel(width, height) {
    var startX = 0;
    var startY = ~~(height * 2 / 3);
    var level = [];
    for (var y = 0; y < height; y++) {
        var columns = [];
        for (var x = 0; x < width; x++) {
            if (y > startY) {
                columns.push("x");
            } else {
                columns.push(" ");
            }
        }
        level.push(columns);
    }
    level[startY - 1][1] = "@";
    return level;
}

var earthLevelConstants = {
    "earthBirdMaxWidth": 11,
    "earthBirdMinHeight": 5
}

function generateEarthLevelWithObstacles(level) {
    var width = level[0].length;
    var height = level.length;
    var startX = 0;
    var startY = ~~(height * 2 / 3);

    var initialOffset = 5,
        flatRegion = 8,
        troughMinDeapth = 4,
        troughMinSize = 10;
    var isFlat = true;
    startX = startX + initialOffset;
    var actorList = { "0": "FIREBIRD", "1": "VOLCANO" };
    while (startX < width - 10) {
        var enemySelect = actorList[String(~~(Math.random() * Object.keys(actorList).length))];
        var droppingEnemyHolderSize = 5;
        if (enemySelect == "FIREBIRD" && isFlat == true) {
            var earthBirdHeight = ~~(earthLevelConstants.earthBirdMinHeight + 6 * Math.random());
            level[startY - earthBirdHeight][startX + ~~(earthLevelConstants.earthBirdMaxWidth / 2)] = "f";
            startX = startX + earthLevelConstants.earthBirdMaxWidth;
            isFlat = false;
        } else if (enemySelect == "VOLCANO" && isFlat == true) {
            var volcanoSize = getRandomElement([13, 17, 21]);
            var volcanoDeapth = Math.floor(volcanoSize / 4);
            var volcanoHeight = volcanoDeapth;
            var margin = volcanoDeapth + volcanoHeight - 1;
            for (var y = startY - volcanoHeight + 1; y < (startY + volcanoDeapth); y++) {
                for (var x = startX; x < startX + volcanoSize; x++) {
                    if (x > startX + margin && x < startX + (volcanoSize - margin)) {
                        level[y][x] = "!";
                        if (y == startY - volcanoHeight + 1) {
                            level[y - 2][x] = "v";
                        }
                    }
                    if (x == startX + margin || x == startX + (volcanoSize - margin))
                        level[y][x] = "n";

                }
                margin = margin - 1;
            }
            startX = startX + volcanoSize;
            isFlat = false;
        } else if (isFlat == false) {
            startX += flatRegion;
            isFlat = true;
        }
    }
    level[startY - 2][width - 3] = "g";
    return level;
}

var earthLevelMap = generateEarthLevelWithObstacles(generateEarthBasicLevel(200, 50));

function EarthBolt(pos, character) {
    this.pos = pos;
    this.size = new Vector(0.5, 1);
    this.speed = new Vector(0, 20);
}

EarthBolt.prototype.type = "earthBolt";

EarthBolt.prototype.act = function(step, level) {
    var newPos = this.pos.plus(this.speed.times(step));
    var actor = this;
    if (!level.collisionWith(newPos, this.size, "obstacle")) { // If no obstacle set newPos
        this.pos = newPos
    } else {
        level.actors = level.actors.filter(function(inDivActor) {
            return inDivActor != actor;
        });
    }
};

EarthBolt.prototype.draw = function(cx, x, y) {
    cx.save();
    cx.fillStyle = "yellow";
    cx.fillRect(x, y, this.size.x * Game.scale, this.size.y * Game.scale + 4);
    cx.fillStyle = "red";
    cx.fillRect(x + 2, y + 2, this.size.x * Game.scale - 4, this.size.y * Game.scale - 4);
    cx.restore();
}

function EarthBird(pos, character) {
    this.pos = pos;
    this.size = new Vector(3, 1);
    this.speed = Math.random() > 0.5 ? new Vector(2, 0) : new Vector(-2, 0);
    this.origSpeed = new Vector(2, 0);
    this.maxLeft = this.pos.x - ~~(earthLevelConstants.earthBirdMaxWidth / 2);
    this.maxRight = this.pos.x + ~~(earthLevelConstants.earthBirdMaxWidth / 2);

}

EarthBird.prototype.type = "earthBird";

EarthBird.prototype.act = function(step, level) {
    var newPos = this.pos.plus(this.speed.times(step));
    if (newPos.x > this.maxRight)
        this.speed.x = -1 * this.origSpeed.x;
    else if (newPos.x < this.maxLeft)
        this.speed.x = this.origSpeed.x;
    this.pos = newPos;
    if (~~(newPos.x) % 3 == 0)
        level.actors.push(new EarthBolt(this.pos.plus(new Vector(0, 1)), "b"));

};

EarthBird.prototype.draw = function(cx, x, y) {
    cx.save();
    cx.fillStyle = "red";
    cx.fillRect(x, y, this.size.x * Game.scale, this.size.y * Game.scale);
    cx.fillStyle = "yellow";
    cx.fillRect(x + 4, y + 4, this.size.x * Game.scale - 8, this.size.y * Game.scale - 8);
    cx.restore();
}

function VolcanoLava(pos, character) {
    this.pos = pos;
    this.origPos = pos;
    this.size = new Vector(1, 1);
    this.getSpeed();
    this.gravity = 0.005;
    this.gravity = 30;
}

VolcanoLava.prototype.getSpeed = function() {
    var speedX = Math.random() > 0.5 ? ~~(Math.random() * 10) : -1 * ~~(Math.random() * 10);
    var speedY = -15 + -1 * ~~(Math.random() * 10);
    this.speed = new Vector(speedX, speedY);
}

VolcanoLava.prototype.type = "volcanoLava";

VolcanoLava.prototype.act = function(step, level) {
    this.speed.y += step * this.gravity;
    var motion = new Vector(this.speed.x * step, this.speed.y * step);
    var newPos = this.pos.plus(motion);
    var actor = this;
    if (!level.collisionWith(newPos, this.size, "obstacle")) { // If no obstacle set newPos
        this.pos = newPos
    } else {
        this.pos = this.origPos;
        this.getSpeed();
    }
};

VolcanoLava.prototype.draw = function(cx, x, y) {
    cx.save();
    cx.fillStyle = "yellow";
    cx.fillRect(x, y, this.size.x * Game.scale, this.size.y * Game.scale);
    cx.fillStyle = "red";
    cx.fillRect(x + 2, y + 2, this.size.x * Game.scale - 4, this.size.y * Game.scale - 4);
    cx.restore();
}

function EarthPlayer(pos) {
    PlayerPlatformer.call(this, pos);
    this.drawLast = true;
    this.health = 100;
    this.flyPower = 0;
}
EarthPlayer.prototype = Object.create(PlayerPlatformer.prototype);

function EarthStoneGem(pos) {
    Gem.call(this, pos, "EarthStoneGem", "#DEB887", "#DE8857", "earth gem.");
}

EarthStoneGem.prototype = Object.create(Gem.prototype);

var earthLevelBackgroundChars = {
    "x": "wall",
    "!": "lava",
    "n": "volcanoWall"
};

var earthLevelActorChars = {
    "@": EarthPlayer,
    "v": VolcanoLava,
    "f": EarthBird,
    "b": EarthBolt,
    "t": Tree,
    "g": EarthStoneGem
};

var earthLevel = new LevelInfo(LEVEL_TYPE.PLATFORMER, earthLevelMap, earthLevelBackgroundChars, earthLevelActorChars);
earthLevel.display = CanvasDisplay;
earthLevel.platformerType = "horizontal";

earthLevel.generateLevel = function() {
    this.level = generateEarthLevelWithObstacles(generateEarthBasicLevel(200, 50));
}

earthLevel.drawBackground = function(backgroundChar, cx, x, y) {
    if (backgroundChar == "wall") {
        cx.fillStyle = "rgba(170, 170, 50, 255)";
        cx.fillRect(x, y, Game.scale + 1, Game.scale + 1);
    } else if (backgroundChar == "lava") {
        cx.fillStyle = "red";
        cx.fillRect(x, y, Game.scale + 1, Game.scale + 1);
    } else if (backgroundChar == "volcanoWall") {
        cx.fillStyle = "brown";
        cx.fillRect(x, y, Game.scale + 1, Game.scale + 1);
    }
};

earthLevel.playerTouched = function(type, actor, level) {
    if (type == "lava" && level.status == null) {
        Game.hud.setGameMessage("Lava killed you.");
        return "lost";
    } else if (type == "earthBolt") {
        reducePlayerHealth(50, level, "Beware of the Earth Bolt.");
    } else if (type == "volcanoLava") {
        reducePlayerHealth(50, level, "Beware of the Volcanic Lava.");
    } else if (type == "EarthStoneGem" && level.status == null) {
        level.actors = level.actors.filter(function(inDivActor) {
            return inDivActor != actor;
        });
        Game.level = waterLevel;
        Game.numberOfGemsCollected++;
        Game.gemsCollected["earth"] = true;
        Game.hud.setGameMessage(actor.winMessage);
        return "won";
    }

    if (level.player.health <= 0 && level.status == null) {
        return "lost"
    }

}