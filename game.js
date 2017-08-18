var Game = {
    scale: 20,
    gamePaused: false,
    tileSize: 20,
    width: 1000,
    height: 450
};

var Level = function(levelInfo) {
    var plan = levelInfo.level;
    this.levelInfo = levelInfo;
    this.width = plan[0].length;
    this.height = plan.length;
    this.grid = [];
    this.actors = [];
    this.dialogActors = [];
    var ch;
    for (y = 0; y < this.height; y++) {
        var line = plan[y];
        var gridLine = [];
        for (x = 0; x < this.width; x++) {
            var ch = line[x]; // Get the char.
            var fieldType = null;
            var Actor = levelInfo.actorChars[ch]; // Is it an dynamic item. Get the constructor for same.            
            if (Actor)
                this.actors.push(new Actor(new Vector(x, y), ch)); // Instantate the actor. Needs the vector,ch
            else {
                fieldType = levelInfo.backgroundChars[ch];
            }

            gridLine.push(fieldType);

        }
        this.grid.push(gridLine); // Push the field type.
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
Level.prototype.obstacleAt = function(pos, size) {
    var xStart = Math.floor(pos.x);
    var xEnd = Math.ceil(pos.x + size.x);
    var yStart = Math.floor(pos.y);
    var yEnd = Math.ceil(pos.y + size.y);

    // Check if beyond boundaries
    if (xStart < 0 || xEnd > this.width || yStart < 0) {
        return "wall";
    } else if (yEnd > this.height) {
        return "lava";
    }

    //  Is there any obstacle overlapping the players bounding box.
    for (var y = yStart; y < yEnd; y++) {
        for (var x = xStart; x < xEnd; x++) {
            var fieldType = this.grid[y][x];
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
            actor.pos.y < other.pos.y + other.size.y
        ) {
            return other;
        }
    }
}

var maxStep = 0.05;
// Get the minimal step size. Call the actor.act for each of the dynamic objects.
Level.prototype.animate = function(step, keys) {
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

var Vector = function(x, y) {
    this.x = x;
    this.y = y;
}

Vector.prototype.plus = function(Vec1) {
    return new Vector(this.x + Vec1.x, this.y + Vec1.y);
};

Vector.prototype.times = function(scaleNos) {
    return new Vector(scaleNos * this.x, scaleNos * this.y);
};

var keyCodes = { 37: "left", 38: "up", 39: "right", 40: "down", 70: "fly", 71: "revokeFly", 80: "pause" };

// Create the key handler func & register for the keydown and keyup.
var trackKeys = function(codes) {
    var pressed = {};
    //var pressed = Object.create(null);

    function handler(event) {
        // console.log(event.keyCode);
        if (codes.hasOwnProperty(event.keyCode)) {
            var down = event.type == "keydown";
            pressed[codes[event.keyCode]] = down;
            event.preventDefault();
        }
    }
    addEventListener("keydown", handler);
    addEventListener("keyup", handler);
    return pressed;
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
            }
        }
        lastTime = time;
        if (!stop) {
            requestAnimationFrame(frame); // Calls frame with the time in millisecs
        }

    }
    requestAnimationFrame(frame);
};

var keys = trackKeys(keyCodes);

// Called from runGame.
// Calls runAnimation function with an anonymous func as parameter
function runLevel(level, Display, andThen) {
    var display = new Display(document.body, level); // Clear display for each level.   
    var hud = new InGameHUD(document.body);
    hud.addElement({ "type": MessageType.HEALTHBAR, "context": level.player, "funcToCall": "getHealth", maxValue: 100 });
    Game.hud = hud;
    runAnimation(function(step) {
        level.animate(step, keys);
        display.drawFrame(step);
        hud.draw();
        if (level.isFinished()) {
            display.clear();
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

function runGame(startingLevel, Display) {
    function startLevel(levelinfo) {
        runLevel(new Level(levelinfo), Display, function(status) {
            if (status == "lost")
                startLevel(levelinfo);
            else if (levelinfo.nextLevel)
                startLevel(levelinfo.nextLevel);
            else {
                console.log("You win!");
                startLevel(startingLevel);
            }
        });
    }
    startLevel(startingLevel);

}