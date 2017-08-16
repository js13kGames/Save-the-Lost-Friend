var waterLevelMap = ["                                                                                ",
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
    "  x           o                          xxxxx                             o x  ",
    "  x          xxxx       o                                                    x  ",
    "  x  @       x  x                                                xxxxx       x  ",
    "  xxxxxxxxxxxx  xxxxxxxxxxxxxxx   xxxxxxxxxxxxxxxxxxxx     xxxxxxx   xxxxxxxxx  ",
    "                              x   x                  x     x                    ",
    "                              x!!!x                  x!!!!!x                    ",
    "                              x!!!x                  x!!!!!x                    ",
    "                              xxxxx                  xxxxxxx                    ",
    "                                                                                ",
    "                                                                                "
];

var waterLevelBackgroundChars = {
    "x": "wall",
    "!": "water"
};
var waterLevelActorChars = {
    "@": Player,
    "o": Coin,
    "=": Lava,
    "|": Lava,
    "v": Lava
};
var waterLevel = new LevelInfo(LEVEL_TYPE.PLATFORMER, waterLevelMap, waterLevelBackgroundChars, waterLevelActorChars);
waterLevel.drawBackground = function(backgroundChar, cx, x, y) {
    if (backgroundChar == "wall") {
        cx.save();
        cx.fillStyle = "white";
        cx.fillRect(x, y, 20.5, 20);
        cx.restore();
    } else if (backgroundChar == "water") {
        cx.save();
        cx.fillStyle = "blue";
        cx.fillRect(x, y, 20.5, 20);
        cx.restore();
    }
};