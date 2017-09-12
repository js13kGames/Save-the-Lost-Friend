var Level = function(levelInfo) {
    levelInfo.generateLevel();
    var plan = levelInfo.level;
    this.levelInfo = levelInfo;
    this.width = plan[0].length;
    this.height = plan.length;
    this.grid = [];
    this.actors = [];
    this.islandGrid = [];

    var ch;
    Game.currentLevel = this;
    for (y = 0; y < this.height; y++) {
        var line = [];
        for (x = 0; x < this.width; x++) {
            line.push(null);
        }
    }

    for (y = 0; y < this.height; y++) {
        var line = plan[y];
        var gridLine = [];
        var islandLine = [];
        for (x = 0; x < this.width; x++) {
            var ch = line[x]; // Get the char.
            var fieldType = null;
            var islandFieldType = null;
            var Actor = levelInfo.actorChars[ch]; // Is it an dynamic item. Get the constructor for same.            
            if (Actor) {
                this.actors.push(new Actor(new Vector(x, y), ch)); // Instantate the actor. Needs the vector,ch
                if (levelInfo.islandChars && levelInfo.islandChars[ch]) {
                    islandFieldType = levelInfo.actorChars[ch];
                }
            } else {
                fieldType = levelInfo.backgroundChars[ch];
            }
            gridLine.push(fieldType);
            islandLine.push(islandFieldType);
        }
        this.grid.push(gridLine); // Push the field type.
        this.islandGrid.push(islandLine);
    }
    this.player = this.actors.filter(function(actor) { // Get the player instance separately.
        return actor.type == "player";
    })[0];
    this.status = this.finishDelay = null;
};

// Returns true if game is finished.
Level.prototype.isFinished = function() {
    return ((this.status != null) && (this.finishDelay < 0));
};

// Check if there is any object in the static layer at the given bounding box of pos and size.
Level.prototype.collisionWith = function(pos, size, type) {
    var xStart = Math.floor(pos.x);
    var xEnd = Math.ceil(pos.x + size.x);
    var yStart = Math.floor(pos.y);
    var yEnd = Math.ceil(pos.y + size.y);
    var grid;
    if (type == "obstacle") {
        // Check if beyond boundaries
        if (xStart < 0 || xEnd > this.width || yStart < 0) return "wall";
        else if (yEnd > this.height) return "lava";
        grid = this.grid;
    } else if (type == "island") grid = this.islandGrid;

    //  Is there any obstacle overlapping the players bounding box.
    for (var y = yStart; y < yEnd; y++) {
        for (var x = xStart; x < xEnd; x++) {
            var fieldType = grid[y][x];
            if (fieldType) {
                return fieldType
            }
        }
    }

}

// Collision with any other dynamic object.
Level.prototype.actorAt = function(actor) {
    var other;
    for (var i = 0; i < this.actors.length; i++) {
        other = this.actors[i];
        // Check if the current actor falls within the bounding box of the other.
        if (other != actor && actor.pos.x + actor.size.x > other.pos.x &&
            actor.pos.x < other.pos.x + other.size.x &&
            actor.pos.y + actor.size.y > other.pos.y &&
            actor.pos.y < other.pos.y + other.size.y && !other.collisionNotRequired
        ) {
            return other;
        }
    }
}

// Get the minimal step size. Call the actor.act for each of the dynamic objects.
Level.prototype.animate = function(step, keys) {
    var maxStep = 0.05;
    if (this.status != null) { // Keep reducing the finishDelay
        this.finishDelay = this.finishDelay - step;
    }
    while (step > 0) {
        var thisStep = Math.min(step, maxStep);
        this.actors.forEach(function(actor) {
            actor.act(thisStep, this, keys);
        }, this);
        step -= thisStep; // Reduce the step by step size taken.
    }
};

Level.prototype.playerTouched = function(type, actor) {
    var levelStatus = this.levelInfo.playerTouched(type, actor, this);
    if (levelStatus == "lost" || levelStatus == "won") {
        this.status = levelStatus;
        this.finishDelay = 2;
    }
};

Level.prototype.getPlayerProgress = function() {
    if (this.levelInfo.platformerType == "horizontal")
        return ~~(this.player.pos.x);
    else if (this.levelInfo.platformerType == "vertical")
        return ~~(this.height - this.player.pos.y);
}

var keyCodes = {
    37: "left",
    38: "up",
    39: "right",
    40: "down",
    70: "fly",
    71: "revokeFly",
    80: "pause",
    27: "skip",
    13: "enter"
};

// Create the key handler func & register for the keydown and keyup.
var trackKeys = function(codes) {
    var pressed = {};
    var keyReleased = {};

    function handler(event) {
        if (codes.hasOwnProperty(event.keyCode)) {
            var down = event.type == "keydown";
            var up = event.type == "keyup";
            pressed[codes[event.keyCode]] = down;
            keyReleased[codes[event.keyCode]] = up;
            event.preventDefault();
        }
    }
    addEventListener("keydown", handler);
    addEventListener("keyup", handler);
    return { "down": pressed, "up": keyReleased };
}

var pauseIsDown = false;

// Toggle the gamePaused variable whenever p key is pressed and released.
function pauseKeyHandler() {
    if (keys.pause) {
        pauseIsDown = true;
    }
    if (pauseIsDown && !keys.pause) {
        Game.gamePaused = !Game.gamePaused;
        pauseIsDown = false;
        Game.hud.clearScreen();
    }
}

var runAnimation = function(frameFunc) { // frameFunc  anonymous func.
    var lastTime = null;

    function frame(time) {
        pauseKeyHandler();
        var stop = false;
        if (lastTime != null) {
            var timeStep = Math.min(time - lastTime, 100) / 1000;
            if (!Game.gamePaused) {
                stop = frameFunc(timeStep) == false;
            } else {
                Game.inInteraction = false;
                Game.hud.drawMenuScreen();
            }
            if (Game.GameFirstStart || Game.GameOver) {
                Game.gamePaused = true;
                Game.GameFirstStart = false;
            }
        }
        lastTime = time;
        if (!stop) {
            requestAnimationFrame(frame); // Calls frame with the time in millisecs
        }

    }
    requestAnimationFrame(frame);
};

var keyUpDown = trackKeys(keyCodes);
var keys = keyUpDown["down"];
var keyPressed = keyUpDown["up"];

var resetKeyPressed = function() {
    keyPressed.up = false;
    keyPressed.down = false;
    keyPressed.enter = false;
}

// Called from runGame.
// Calls runAnimation function with an anonymous func as parameter
function runLevel(level, Display, andThen) {
    var display = new Display(document.body, level); // Clear display for each level.       
    var hud = new InGameHUD(document.body);
    hud.setHealthBar(level.player, "getHealth", 100);
    if (level.levelInfo.type == LEVEL_TYPE.PLATFORMER) {
        if (level.levelInfo.platformerType == "horizontal")
            hud.setPlayerProgress(level, "getPlayerProgress", level.width);
        else if (level.levelInfo.platformerType == "vertical")
            hud.setPlayerProgress(level, "getPlayerProgress", level.height);
    }
    Game.hud = hud;
    runAnimation(function(step) {
        level.animate(step, keys);
        display.drawFrame(step);
        hud.draw();
        if (level.isFinished()) {
            display.clear();
            hud.clear();
            if (andThen) {
                andThen(level.status);
            }
            return false;
        }
    });
}

// runGame starting point of game. 
// Starts with level 0.
// Recursive
// if lost re-call same level else recursively call next level till final level

function runGame(startingLevel) {
    function startLevel(levelinfo) {
        Game.inInteraction = false;
        Game.nextLevel = null;
        runLevel(new Level(levelinfo), startingLevel.display, function(status) {
            if (status == "lost")
                startLevel(levelinfo);
            else if (Game.nextLevel)
                startLevel(Game.nextLevel);
            else {
                console.log("You win!");
                startLevel(startingLevel);
            }
        });
    }
    startLevel(startingLevel);

}