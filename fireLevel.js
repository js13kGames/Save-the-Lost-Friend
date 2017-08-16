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

function FireLava(pos, char) {
    Lava.call(this, pos, char);
}
FireLava.prototype = Object.create(Lava.prototype);

FireLava.prototype.draw = function(cx, x, y) {
    cx.save();
    cx.fillStyle = "red";
    cx.fillRect(x, y, 20.5, 20);
    cx.restore();
}

var fireLevelBackgroundChars = {
    "x": "wall",
    "!": "lava"
};

var fireLevelActorChars = {
    "@": Player,
    "o": Coin,
    "=": FireLava,
    "|": FireLava,
    "v": FireLava
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