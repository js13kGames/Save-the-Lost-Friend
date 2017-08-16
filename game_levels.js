var LEVEL_TYPE = {
    "PLATFORMER": 0,
    "NONPLATFORMER": 1
};


function LevelInfo(levelType, plan, backgroundChars) {
    this.type = levelType;
    this.level = plan;
    this.backgroundChars = backgroundChars;
};

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
    "  x  @       x  x                                                xxxxx       x  ",
    "  xxxxxxxxxxxx  xxxxxxxxxxxxxxx   xxxxxxxxxxxxxxxxxxxx     xxxxxxx   xxxxxxxxx  ",
    "                              x   x                  x     x                    ",
    "                              x!!!x                  x!!!!!x                    ",
    "                              x!!!x                  x!!!!!x                    ",
    "                              xxxxx                  xxxxxxx                    ",
    "                                                                                ",
    "                                                                                "
];

var waterLevel = {};
var fireLevel = {};
var waterLevelBackgroundChars = {
    "x": "wall",
    "!": "lava"
};

var fireLevelBackgroundChars = {
    "x": "wall",
    "!": "lava"
};

var waterLevel = new LevelInfo(LEVEL_TYPE.PLATFORMER, waterLevelMap, waterLevelBackgroundChars);
var fireLevel = new LevelInfo(LEVEL_TYPE.PLATFORMER, fireLevelMap, fireLevelBackgroundChars);

LevelInfo.prototype.initializeChain = function(prevLevelInfo, nextLevelInfo) {
    this.nextLevel = nextLevelInfo;
    this.prevLevel = prevLevelInfo;
}

waterLevel.drawBackground = function(backgroundChar, cx, x, y) {
    if (backgroundChar == "wall") {
        cx.save();
        cx.fillStyle = "white";
        cx.fillRect(x, y, 20.5, 20);
        cx.restore();
    } else if (backgroundChar == "lava") {
        cx.save();
        cx.fillStyle = "blue";
        cx.fillRect(x, y, 20.5, 20);
        cx.restore();
    }
};

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

waterLevel.initializeChain(null, fireLevel);
fireLevel.initializeChain(waterLevel, null);