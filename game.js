var Level = function(levelInfo) {
    var plan = levelInfo.level;
    this.levelInfo = levelInfo;
    this.width = plan[0].length;
    this.height = plan.length;
    this.grid = [];
    this.actors = [];
    var ch;
    for (y = 0; y < this.height; y++) {
        var line = plan[y];
        var gridLine = [];
        for (x = 0; x < this.width; x++) {
            var ch = line[x]; // Get the char.
            var fieldType = null;
            var Actor = actorChars[ch]; // Is it an dynamic item. Get the constructor for same.
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
    if ((type == "lava") && (this.status == null)) {
        this.status = "lost";
        this.finishDelay = 1;
    } else if (type == "coin") { //Filter the coin from actor list as it is picked
        this.actors = this.actors.filter(function(inDivActor) {
            return inDivActor != actor;
        });
        // Check if any coins left.  If no coins left then win condition met
        if (!this.actors.some(function(actor) {
                return actor.type == "coin";
            })) {
            this.status = "won";
            this.finishDelay = 1;
        }
    }

};

var actorChars = {
    "@": Player,
    "o": Coin,
    "=": Lava,
    "|": Lava,
    "v": Lava
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


var FLY_POWER_MAX = 3;

function Player(pos) {
    this.pos = pos.plus(new Vector(0, -0.5));
    this.size = new Vector(0.8, 1.5);
    this.speed = new Vector(0, 0);
    this.onKeyUpEnableDoubleJump = false;
    this.enableDoubleJump = false;
    this.fly = false;
    this.flyPower = FLY_POWER_MAX;
    this.facingRight = true;
}
Player.prototype.type = "player";


var playerXSpeed = 7;
// Set the speed.
//Calculate the motion vector  ( speed * step)
// Calculate the new position. curPos + motionVector.
// Check of static obstacle at new posn.
// If obstacle call the playerTouched func
// Else move to new Pos
Player.prototype.moveX = function(step, level, keys) {
    this.speed.x = 0;
    if (keys.left) {
        this.speed.x -= playerXSpeed;
        this.facingRight = false;
    }
    if (keys.right) {
        this.speed.x += playerXSpeed;
        this.facingRight = true;
    }

    var motion = new Vector(this.speed.x * step, 0);
    var newPos = this.pos.plus(motion);
    var obstacle = level.obstacleAt(newPos, this.size)
    if (obstacle) {
        level.playerTouched(obstacle);
    } else {
        this.pos = newPos;
    }

};

var gravity = 30;
var jumpSpeed = 17;

// Note movex and moveY only test for the background layer.
// Calculate new posn based on force of gravity / Natural force.
// speed, motion and newPos.
// Check if obstacleAt new posn.
// If yes & keys.up & speed  > 0 & then set speed to -jumpSpeed ( reverse direction.)
Player.prototype.moveY = function(step, level, keys) {
    // Calculate new posn based on force of gravity / Natural force.
    this.speed.y += step * gravity;
    var motion = new Vector(0, this.speed.y * step);
    var newPos = this.pos.plus(motion);
    var obstacle = level.obstacleAt(newPos, this.size);
    if (obstacle) {
        level.playerTouched(obstacle);
        if (keys.up && this.speed.y > 0) { // Touched obstacle, Moving down , Up Key pressed -> Move up.
            this.speed.y = -jumpSpeed;
            this.onKeyUpEnableDoubleJump = true; // Set up for double jump.
            this.flyPower = FLY_POWER_MAX; // Recharge the fly power to full.            
        } else // Touched obstacle and no Up key so stop moving
            this.speed.y = 0;
    } else { // no obstacle                    
        if (keys.up == false && this.onKeyUpEnableDoubleJump) { // ignore continuos up kep press.
            this.enableDoubleJump = true;
            if (!this.fly || this.flyPower <= 1) // If fly is there then below shld not happen.
            {
                this.onKeyUpEnableDoubleJump = false;
            }
        }
        if (keys.up && this.enableDoubleJump == true && this.speed.y > -2) {
            this.speed.y = -jumpSpeed;
            this.enableDoubleJump = false;
            this.flyPower -= 1;

        }
        this.pos = newPos; // No obstacle so go to new pos.
        //console.log(this.flyPower);
    }
};

// Called for every draw loop from animate.
// Call the moveX & moveY  ( checks collision with static layer.)
// Check for collisions with dynamic layer.
// If yes call playerTouched
// status is lost losing animation.
Player.prototype.act = function(step, level, keys) {
    this.moveX(step, level, keys);
    this.moveY(step, level, keys);
    // Check for collisions with dynamic layer.
    var collidedObject = level.actorAt(this);
    if (collidedObject)
        level.playerTouched(collidedObject.type, collidedObject);
    if (level.status == "lost") { // Losing animation.
        this.pos.y += step;
        this.size.y -= step;
    }
    if (keys.fly) {
        this.fly = true;
    }
    if (keys.revokeFly) {
        this.fly = false;
    }
};

Player.prototype.draw = function(cx, x, y) {
    cx.save();
    cx.fillStyle = "gold";
    cx.fillRect(x, y, 15, 30);
    cx.fillStyle = "black";
    if (this.facingRight) {
        cx.fillRect(x + 10, y + 4, 3, 3);
        cx.fillStyle = "black";
        cx.fillRect(x + 7, y + 12, 7, 2);
    } else {
        cx.fillRect(x, y + 4, 3, 3);
        cx.fillStyle = "black";
        cx.fillRect(x, y + 12, 7, 2);
    }
    cx.restore();
}

// var Lava = function(posVector, char) {
function Lava(pos, char) {
    this.pos = pos;
    this.size = new Vector(1, 1);
    if (char == "=") { // Horizontal lava
        this.speed = new Vector(2, 0);
    } else if (char == "|") { // Vertical up and down lava
        this.speed = new Vector(0, 2);
    } else if (char == "v") { // Dripping regenerating lava.
        // Regenerating lava.
        this.speed = new Vector(0, 3);
        this.repeatPos = pos;
    }
}

Lava.prototype.type = "lava";

// Called at every step of the animate.
Lava.prototype.act = function(step, level) {
    var newPos = this.pos.plus(this.speed.times(step)); // Calculate newPos
    if (!level.obstacleAt(newPos, this.size)) { // If no obstacle set newPos
        this.pos = newPos
    } else if (this.repeatPos) {
        this.pos = this.repeatPos;
    } else {
        this.speed = this.speed.times(-1);
    }

};

Lava.prototype.draw = function(cx, x, y) {
    cx.save();
    cx.fillStyle = "blue";
    cx.fillRect(x, y, 20.5, 20);
    cx.restore();
}


var wobbleSpeed = 8,
    wobbleDist = 0.07;

var scale = 20;
var tileSize = 20;

function Coin(pos) {
    this.basePos = this.pos = pos.plus(new Vector(0.2, 0.1));
    this.size = new Vector(0.6, 0.6);
    this.wobble = Math.random() * Math.PI * 2;
}

Coin.prototype.type = "coin";

Coin.prototype.act = function(step) {
    this.wobble += step * wobbleSpeed; // Calc wobble
    var wobblePos = Math.sin(this.wobble) * wobbleDist; // Math.sin of wobble times wobbleDist is Wobblepos
    this.pos = this.basePos.plus(new Vector(0, wobblePos)); // calculate pos.
};

Coin.prototype.draw = function(cx, x, y) {
    cx.save();
    cx.fillStyle = "yellow";
    cx.beginPath();
    cx.arc(x, y, scale / 5, 0, 2 * Math.PI);
    cx.fill();
    cx.restore();
}


var arrowCodes = { 37: "left", 38: "up", 39: "right", 70: "fly", 71: "revokeFly" };

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


var runAnimation = function(frameFunc) { // frameFunc  anonymous func.
    var lastTime = null;

    function frame(time) {
        var stop = false;
        if (lastTime != null) {
            var timeStep = Math.min(time - lastTime, 100) / 1000;
            stop = frameFunc(timeStep) == false;
        }
        lastTime = time;
        if (!stop) {
            requestAnimationFrame(frame); // Calls frame with the time in millisecs
        }

    }
    requestAnimationFrame(frame);
};

var arrows = trackKeys(arrowCodes);

// Called from runGame.
// Calls runAnimation function with an anonymous func as parameter
function runLevel(level, Display, andThen) {
    var display = new Display(document.body, level); // Clear display for each level.
    runAnimation(function(step) {
        level.animate(step, arrows);
        display.drawFrame(step);
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