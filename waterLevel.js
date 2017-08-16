var waterLevelMap = ["xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "x                                                l                               x",
    "x                                                                                x",
    "x         l          l                                         l                 x",
    "x                                  l                                             x",
    "x                                                                                x",
    "x   l                                                l                           x",
    "x                                                                                x",
    "x                     l                                        l                 x",
    "x          l                                                                     x",
    "x     l        @      l                                                          x",
    "x                  l               l                                             x",
    "x                                                  l              l              x",
    "x      l                                                                         x",
    "x                               l                             l                  x",
    "x                                                                                x",
    "x                                          l                                     x",
    "x              l                                               l                 x",
    "x                                                                                x",
    "x  l      l                     l                                                x",
    "x                                                                                x",
    "x                                           l                                    x",
    "x                                                                     l          x",
    "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
];

var waterLevelBackgroundChars = {
    "x": "wall",
    "l": "log"
};
var waterLevelActorChars = {
    "@": PlayerNonPlatform
};
var waterLevel = new LevelInfo(LEVEL_TYPE.NONPLATFORMER, waterLevelMap, waterLevelBackgroundChars, waterLevelActorChars);
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