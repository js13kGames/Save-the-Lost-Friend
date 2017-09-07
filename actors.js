function Player(pos) {
    this.pos = pos.plus(new Vector(0, -0.5));
    this.size = new Vector(0.8, 1.5);
    this.speed = new Vector(0, 0);
    this.facingRight = true;
    this.health = 100;
    this.playerHitTimer = 0;
    this.playerHitTimerMax = 100;
    this.skipDialogTimer = 0;
    this.skipDialogTimerMax = 200;


}
Player.prototype.type = "player";

Player.prototype.getHealth = function() {
    return this.health;
}

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
    var obstacle = level.collisionWith(newPos, this.size, "obstacle");
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
    var obstacle = level.collisionWith(newPos, this.size, "obstacle");
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

Player.prototype.move = function(step, level, keys) {
    this.moveX(step, level, keys);
    this.moveY(step, level, keys);
}

// Called for every draw loop from animate.
// Call the moveX & moveY  ( checks collision with static layer.)
// Check for collisions with dynamic layer.
// If yes call playerTouched
// status is lost losing animation.
Player.prototype.act = function(step, level, keys) {
    if (!Game.inInteraction) {
        this.move(step, level, keys);
    }
    // Check for collisions with dynamic layer.
    var collidedObject = level.actorAt(this);
    if (collidedObject)
        level.playerTouched(collidedObject.type, collidedObject);
    if (level.status == "lost") { // Losing animation.
        this.pos.y += step;
        this.size.y -= step;
    }

    var triggerObject = level.collisionWith(this.pos, this.size, "trigger");
    if (triggerObject) {
        level.levelInfo.playerInteract(triggerObject, level);
    } else {
        Game.inGameMessage = false;
    }
    if (keys.fly) {
        this.fly = true;
    }
    if (keys.revokeFly) {
        this.fly = false;
    }
    if (level.player.playerHitTimer > 0) {
        level.player.playerHitTimer--;
    }
    if (level.player.skipDialogTimer > 0) {
        level.player.skipDialogTimer--;
    }
};

Player.prototype.draw = function(cx, x, y) {
    cx.save();
    cx.fillStyle = "gold";
    cx.fillRect(x, y, Game.scale * 3 / 4, Game.scale * 3 / 2);
    cx.fillStyle = "black";
    if (this.facingRight) {
        cx.fillRect(x + Game.scale * 1 / 2, y + Game.scale * 1 / 5, Game.scale * 1 / 7, Game.scale * 1 / 7);
        cx.fillStyle = "black";
        cx.fillRect(x + Game.scale * 1 / 3, y + Game.scale * 1 / 2, Game.scale * 1 / 3, Game.scale * 1 / 10);
    } else {
        cx.fillRect(x, y + Game.scale * 1 / 5, Game.scale * 1 / 7, Game.scale * 1 / 7);
        cx.fillStyle = "black";
        cx.fillRect(x, y + Game.scale * 1 / 2, Game.scale * 1 / 3, Game.scale * 1 / 10);
    }
    cx.restore();
}
var FLY_POWER_MAX = 3;

function PlayerPlatformer(pos) {
    Player.call(this, pos);
    this.onKeyUpEnableDoubleJump = false;
    this.enableDoubleJump = false;
    this.fly = false;
    this.flyPower = FLY_POWER_MAX;
}

PlayerPlatformer.prototype = Object.create(Player.prototype);

function PlayerNonPlatformer(pos) {
    Player.call(this, pos);
    this.facingUp = true;
}

PlayerNonPlatformer.prototype = Object.create(Player.prototype);

PlayerNonPlatformer.prototype.draw = Player.prototype.draw;

PlayerNonPlatformer.prototype.move = function(step, level, keys) {
    this.speed.x = 0;
    this.speed.y = 0;
    var PLAYER_NON_PLATFORM_SPEED = 4;
    if (keys.left) {
        this.speed.x -= PLAYER_NON_PLATFORM_SPEED;
        this.facingRight = false;
    }
    if (keys.right) {
        this.speed.x += PLAYER_NON_PLATFORM_SPEED;
        this.facingRight = true;
    }
    if (keys.up) {
        this.speed.y -= PLAYER_NON_PLATFORM_SPEED;
        this.facingUp = true;
    }
    if (keys.down) {
        this.speed.y += PLAYER_NON_PLATFORM_SPEED;
        this.facingUp = false;
    }

    var motion = new Vector(this.speed.x * step, this.speed.y * step);
    var newPos = this.pos.plus(motion);
    var obstacle = level.collisionWith(newPos, this.size, "obstacle")
    if (obstacle) {
        level.playerTouched(obstacle);
    } else {
        this.pos = newPos;
    }
};

PlayerNonPlatformer.prototype.act = Player.prototype.act;

function Lava(pos, character) {
    this.pos = pos;
    this.size = new Vector(1, 1);
    if (character == "=") { // Horizontal lava
        this.speed = new Vector(2, 0);
    } else if (character == "|") { // Vertical up and down lava
        this.speed = new Vector(0, 2);
    } else if (character == "v") { // Dripping regenerating lava.
        // Regenerating lava.
        this.speed = new Vector(0, 3);
        this.repeatPos = pos;
    }
}

Lava.prototype.type = "lava";

// Called at every step of the animate.
Lava.prototype.act = function(step, level) {
    var newPos = this.pos.plus(this.speed.times(step)); // Calculate newPos
    if (!level.collisionWith(newPos, this.size, "obstacle")) { // If no obstacle set newPos
        this.pos = newPos
    } else if (this.repeatPos) {
        this.pos = this.repeatPos;
    } else {
        this.speed = this.speed.times(-1);
    }
};

Lava.prototype.draw = function(cx, x, y) {
    cx.save();
    cx.fillStyle = "red";
    cx.fillRect(x, y, Game.scale, Game.scale);
    cx.restore();
}

var wobbleSpeed = 8,
    wobbleDist = 0.07;

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
    cx.arc(x, y, Game.scale / 5, 0, 2 * Math.PI);
    cx.fill();
    cx.restore();
}