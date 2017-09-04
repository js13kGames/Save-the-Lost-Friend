function flipHorizontally(context, around) {
    context.translate(around, 0);
    context.scale(-1, 1);
    context.translate(-around, 0);
}

function CanvasDisplay(parent, level) {
    this.canvas = document.createElement("canvas");
    this.canvas.id = "gameScreen";
    this.canvas.width = Math.min(Game.width, level.width * Game.scale);
    this.canvas.height = Math.min(Game.height, level.height * Game.scale);
    this.canvas.style = "z-index: 1;position:absolute;left:0px;top:0px;";
    parent.appendChild(this.canvas);
    this.cx = this.canvas.getContext("2d");

    this.level = level;
    this.animationTime = 0;
    this.flipPlayer = false;

    this.viewport = {
        left: 0,
        top: 0,
        width: this.canvas.width / Game.scale,
        height: this.canvas.height / Game.scale
    };

    this.drawFrame(0);
}

CanvasDisplay.prototype.clear = function() {
    this.canvas.parentNode.removeChild(this.canvas);
};

CanvasDisplay.prototype.drawFrame = function(step) {
    this.animationTime += step;

    this.updateViewport();
    this.clearDisplay();
    this.drawBackground();
    this.drawActors();
};

CanvasDisplay.prototype.updateViewport = function() {
    var view = this.viewport,
        marginX = view.width / 3,
        marginY = view.height / 3;
    var player = this.level.player;
    var center = player.pos.plus(player.size.times(0.5));

    if (center.x < view.left + marginX)
        view.left = Math.max(center.x - marginX, 0);
    else if (center.x > view.left + view.width - marginX)
        view.left = Math.min(center.x + marginX - view.width,
            this.level.width - view.width);
    if (center.y < view.top + marginY)
        view.top = Math.max(center.y - marginY, 0);
    else if (center.y > view.top + view.height - marginY)
        view.top = Math.min(center.y + marginY - view.height,
            this.level.height - view.height);
};

CanvasDisplay.prototype.clearDisplay = function() {
    if (this.level.status == "won")
        this.cx.fillStyle = "rgb(68, 191, 255)";
    else if (this.level.status == "lost")
        this.cx.fillStyle = "rgb(44, 136, 214)";
    else
        this.cx.fillStyle = "rgb(52, 166, 251)";
    this.cx.fillRect(0, 0,
        this.canvas.width, this.canvas.height);
};

CanvasDisplay.prototype.drawBackground = function() {
    var view = this.viewport;
    var xStart = Math.floor(view.left);
    var xEnd = Math.ceil(view.left + view.width);
    var yStart = Math.floor(view.top);
    var yEnd = Math.ceil(view.top + view.height);

    for (var y = yStart; y < yEnd; y++) {
        for (var x = xStart; x < xEnd; x++) {
            var tile = this.level.grid[y][x];
            if (tile == null) continue;
            var screenX = (x - view.left) * Game.scale;
            var screenY = (y - view.top) * Game.scale;
            this.level.levelInfo.drawBackground(tile, this.cx, screenX, screenY);
        }
    }
};

/*
CanvasDisplay.prototype.drawActors = function() {
    this.level.actors.forEach(function(actor) {
        var width = actor.size.x * Game.scale;
        var height = actor.size.y * Game.scale;
        var x = (actor.pos.x - this.viewport.left) * Game.scale;
        var y = (actor.pos.y - this.viewport.top) * Game.scale;
        if (actor.type != "player")
            actor.draw(this.cx, x, y);
    }, this);
    var x = (this.level.player.pos.x - this.viewport.left) * Game.scale;
    var y = (this.level.player.pos.y - this.viewport.top) * Game.scale;
    this.level.player.draw(this.cx, x, y);
};
*/

CanvasDisplay.prototype.drawActors = function() {
    this.level.actors.sort(function(actor1, actor2) {
        return (actor1.pos.y < actor2.pos.y);
    });

    this.level.actors.forEach(function(actor) {
        var width = actor.size.x * Game.scale;
        var height = actor.size.y * Game.scale;
        var x = (actor.pos.x - this.viewport.left) * Game.scale;
        var y = (actor.pos.y - this.viewport.top) * Game.scale;
        // if (actor.type != "player")
        actor.draw(this.cx, x, y);
    }, this);
}