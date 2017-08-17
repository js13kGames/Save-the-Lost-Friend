var waterLevelMap = ["xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "x                                                l                               x",
    "x                                                                                x",
    "x         l          l                                  s      l                 x",
    "x                         s        l                                             x",
    "x                                                                                x",
    "x   l                                                l                           x",
    "x                                                                                x",
    "x                     l                                        l                 x",
    "x          l                                     s                               x",
    "x     l              l                  @                                        x",
    "x                  l               l                                             x",
    "x                                                  l              l              x",
    "x      l               s                                                         x",
    "x                               l                             l                  x",
    "x                                                                                x",
    "x                                          l             s                       x",
    "x              l                                               l                 x",
    "x                               s                                                x",
    "x  l      l                     l                                                x",
    "x                                                                                x",
    "x                                           l                                    x",
    "x                                                                     l          x",
    "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
];

function Shark(pos, char) {
    this.pos = pos;
    this.size = new Vector(1, 1);
    this.dir = Math.random();
    if (this.dir > 0.5) {
        this.speedX = ~~(Math.max(Math.random(), 0.2) * 6);
        this.speedY = 0;
    } else {
        this.speedX = 0;
        this.speedY = ~~(Math.max(Math.random(), 0.2) * 6);
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

var waterLevelBackgroundChars = {
    "x": "wall",
    "l": "log"
};
var waterLevelActorChars = {
    "@": PlayerNonPlatform,
    "s": Shark
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