var fireLevelMap = ["                                                                                ",
    "                                                                                ",
    "                                                                                ",
    "                                                                                ",
    "                                                                                ",
    "                                                                                ",
    "                                                                  xxx           ",
    "                                                   xx      xx    xx!xx          ",
    "                                    o o      xx                  x!!!x          ",
    "                                                                 xx!xx          ",
    "                                   xxxxx                          xvx           ",
    "                                                                            xx  ",
    "  xx                                      o o                                x  ",
    "  x                     o                                                    x  ",
    "  x                                      xxxxx                             o x  ",
    "  x          xxxx       o                                                    x  ",
    "  x  @       x  x       =                  |                     xxxxx       x  ",
    "  xxxxxxxxxxxx  xxxxxxxxxxxxxxx   xxxxxxxxxxxxxxxxxxxx     xxxxxxx   xxxxxxxxx  ",
    "                              x   x                  x     x                    ",
    "                              x!!!x                  x!!!!!x                    ",
    "                              x!!!x                  x!!!!!x                    ",
    "                              xxxxx                  xxxxxxx                    ",
    "                                                                                ",
    "                                                                                "
];

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


var fireLevel = new LevelInfo(LEVEL_TYPE.PLATFORMER, fireLevelMap, fireLevelBackgroundChars, fireLevelActorChars);

fireLevel.drawBackground = function(backgroundChar, cx, x, y) {
    if (backgroundChar == "wall") {
        cx.save();
        cx.fillStyle = "white";
        cx.fillRect(x, y, 20.5, 20);
        cx.restore();
    } else if (backgroundChar == "lava") {
        cx.save();
        cx.fillStyle = "red";
        cx.fillRect(x, y, 20, 20);
        cx.restore();
    }
};

fireLevel.playerTouched = function(type, actor, level) {
    if (type == "lava" && level.status == null) {
        Game.hud.addElement({ "type": MessageType.GAME_MESSAGE, "message": "Lava killed you." });
        return "lost";
    } else if (type == "coin") { //Filter the coin from actor list as it is picked
        level.actors = level.actors.filter(function(inDivActor) {
            return inDivActor != actor;
        });
        // Check if any coins left.  If no coins left then win condition met
        if (!level.actors.some(function(actor) {
                return actor.type == "coin";
            })) {
            Game.hud.clearHudObjects();
            Game.hud.addElement({ "type": MessageType.GAME_MESSAGE, "message": "You Won!" });
            return "won";
        }
    }

}