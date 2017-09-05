function generateLevel(width, height) {
    var startX = 0;
    var startY = ~~(height * 2 / 3);
    var level = [];
    for (var y = 0; y < height; y++) {
        var columns = [];
        for (var x = 0; x < width; x++) {
            if (y > startY) {
                columns.push("x");
            } else if (x % 10 == 0 && y == startY - 4) {
                columns.push("o");
            } else {
                columns.push(" ");
            }
        }
        level.push(columns);
    }
    level[startY - 1][1] = "@";
    return level;
}

var testLevel = generateLevel(200, 22);

var fireLevelBackgroundChars = {
    "x": "wall",
    "!": "lava"
};

var fireLevelActorChars = {
    "@": PlayerPlatformer,
    "o": Coin,
    "=": Lava,
    "|": Lava,
    "v": Lava
};


//var fireLevel = new LevelInfo(LEVEL_TYPE.PLATFORMER, fireLevelMap, fireLevelBackgroundChars, fireLevelActorChars);
var fireLevel = new LevelInfo(LEVEL_TYPE.PLATFORMER, testLevel, fireLevelBackgroundChars, fireLevelActorChars);

fireLevel.drawBackground = function(backgroundChar, cx, x, y) {
    if (backgroundChar == "wall") {
        cx.fillStyle = "white";
        cx.fillRect(x, y, 20.5, 20);
    } else if (backgroundChar == "lava") {
        cx.fillStyle = "red";
        cx.fillRect(x, y, 20, 20);
    }
};

fireLevel.playerTouched = function(type, actor, level) {
    if (type == "lava" && level.status == null) {
        Game.hud.setGameMessage("Lava killed you.");
        return "lost";
    } else if (type == "coin") { //Filter the coin from actor list as it is picked
        level.actors = level.actors.filter(function(inDivActor) {
            return inDivActor != actor;
        });
        // Check if any coins left.  If no coins left then win condition met
        if (!level.actors.some(function(actor) {
                return actor.type == "coin";
            })) {
            Game.hud.setGameMessage("You Won!");
            return "won";
        }
    }

}