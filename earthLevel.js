function generateEarthLevelWithObstacles(level) {
    var width = level[0].length;
    var height = level.length;
    var startX = 0;
    var startY = ~~(height * 2 / 3);

    var isFlat = false;
    startX = 5;
    while (startX < width - 20) {
        if (isFlat == true) {
            level[startY - 1][startX + 2] = "C";
            startX = startX + 5;
            isFlat = false;
        } else if (isFlat == false) {
            startX += 12 + ~~(Math.random() * 7);
            isFlat = true;
        }
    }
    level[startY - 2][width - 3] = "g";
    return level;
}

var earthLevelMap = generateEarthLevelWithObstacles(generateFireBasicLevel(200, 50));

function Cactus(pos, character) {
    this.size = new Vector(3, (2 + ~~(Math.random() * 8)));
    this.pos = pos;
    this.pos.y -= (this.size.y - 2);
    this.type = "cactus";
}

Cactus.prototype.act = function(step, level) {}

Cactus.prototype.draw = function(cx, x, y) {
    cx.save();
    cx.fillStyle = "green";
    cx.fillRect(x, y, Game.scale - 6, this.size.y * 2 / 3 * Game.scale);
    cx.fillRect(x, y + this.size.y * 2 / 3 * Game.scale, Game.scale, 12);
    cx.fillRect(x + Game.scale, y, Game.scale - 6, this.size.y * Game.scale);
    cx.fillRect(x + Game.scale, y + this.size.y * 1 / 3 * Game.scale, 1.7 * Game.scale, 12);
    cx.fillRect(x + 2 * Game.scale, y, Game.scale - 6, this.size.y * 1 / 3 * Game.scale);
    cx.restore();
}

function EarthPlayer(pos) {
    PlayerPlatformer.call(this, pos);
    this.drawLast = true;
    this.health = 100;
    this.jumpSpeed = 20;
    this.flyPower = 0;
}
EarthPlayer.prototype = Object.create(PlayerPlatformer.prototype);
EarthPlayer.prototype.moveX = function(step, level, keys) {
    this.speed.x = 9;
    var motion = new Vector(this.speed.x * step, 0);
    var newPos = this.pos.plus(motion);
    this.pos = newPos;
}

function EarthStoneGem(pos) {
    Gem.call(this, pos, "EarthStoneGem", "#DEB887", "#DE8857", "earth gem.");
}

EarthStoneGem.prototype = Object.create(Gem.prototype);

var earthLevelBackgroundChars = {
    "x": "wall",
    "!": "lava"
};

var earthLevelActorChars = {
    "@": EarthPlayer,
    "C": Cactus,
    "g": EarthStoneGem
};

var earthLevel = new LevelInfo(LEVEL_TYPE.PLATFORMER, earthLevelMap, earthLevelBackgroundChars, earthLevelActorChars);
earthLevel.platformerType = "horizontal";

earthLevel.generateLevel = function() {
    this.level = generateEarthLevelWithObstacles(generateFireBasicLevel(200, 50));
}

earthLevel.drawBackground = function(backgroundChar, cx, x, y) {
    if (backgroundChar == "wall") {
        cx.fillStyle = "rgba(170, 170, 50, 255)";
        cx.fillRect(x, y, Game.scale + 1, Game.scale + 1);
    }
};

earthLevel.playerTouched = function(type, actor, level) {
    if (type == "cactus") {
        reducePlayerHealth(20, level, "Beware of the cactus.");
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