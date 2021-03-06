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
    this.type = "player";
}

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

// Note movex and moveY only test for the background layer.
// Calculate new posn based on force of gravity / Natural force.
// speed, motion and newPos.
// Check if obstacleAt new posn.
// If yes & keys.up & speed  > 0 & then set speed to -jumpSpeed ( reverse direction.)
Player.prototype.moveY = function(step, level, keys) {
    // Calculate new posn based on force of gravity / Natural force.
    this.speed.y += step * this.gravity;
    var motion = new Vector(0, this.speed.y * step);
    var newPos = this.pos.plus(motion);
    var obstacle = level.collisionWith(newPos, this.size, "obstacle");
    if (obstacle) {
        level.playerTouched(obstacle);
        if (keys.up && this.speed.y > 0) { // Touched obstacle, Moving down , Up Key pressed -> Move up.
            this.speed.y = -this.jumpSpeed;
            this.onKeyUpEnableDoubleJump = true; // Set up for double jump.
            this.flyPower = this.flyPower; // Recharge the fly power to full.            
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
            this.speed.y = -this.jumpSpeed;
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
Player.prototype.act = function(step, level, keys) {
    if (!Game.inInteraction) {
        this.move(step, level, keys);
    }
    // Check for collisions with dynamic layer.
    var collidedObject = level.actorAt(this);
    if (collidedObject) {
        level.playerTouched(collidedObject.type, collidedObject);
        if (collidedObject.hasDialog) {
            level.levelInfo.playerInteract(collidedObject, level);
        }
    }
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
    if (level.player.playerHitTimer > 0) {
        level.player.playerHitTimer--;
    }
    if (level.player.skipDialogTimer > 0) {
        level.player.skipDialogTimer--;
    }
};

Player.prototype.draw = function(cx, x, y) {
    cx.save();
    if (Game.currentLevel.player.playerHitTimer > 0)
        cx.fillStyle = "rgba(200, 0, 0, 0.7)";
    else
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
    this.gravity = 30;
    this.gravityConst = 30;
    this.jumpSpeed = 17;
}

PlayerPlatformer.prototype = Object.create(Player.prototype);

function PlayerNonPlatformer(pos) {
    Player.call(this, pos);
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
    if (keys.up)
        this.speed.y -= PLAYER_NON_PLATFORM_SPEED;

    if (keys.down)
        this.speed.y += PLAYER_NON_PLATFORM_SPEED;

    var motion = new Vector(this.speed.x * step, this.speed.y * step);
    var newPos = this.pos.plus(motion);
    this.checkCollision(newPos, level);
}

PlayerNonPlatformer.prototype.checkCollision = function(newPos, level) {
    var obstacle = level.collisionWith(newPos, this.size, "obstacle")
    if (obstacle) {
        level.playerTouched(obstacle);
    } else {
        this.pos = newPos;
    }
}

PlayerNonPlatformer.prototype.act = Player.prototype.act;

function Berry(pos) {
    this.pos = pos;
    this.size = new Vector(1, 1);
}

Berry.prototype.type = "berry";

Berry.prototype.act = function(step) {};

Berry.prototype.draw = function(cx, x, y) {
    cx.save();
    cx.fillStyle = "#DC143C";
    drawArc(cx, x, y, Game.scale / 2, 0, 2 * Math.PI, true);
    cx.restore();
}

function Gem(pos, type, color1, color2, winMessage) {
    this.pos = pos;
    this.type = type;
    this.size = new Vector(2, 2);
    this.color1 = color1;
    this.color2 = color2;
    this.winMessage = "You have succeeded in getting the " + winMessage;
    this.drawLast = true;
};

Gem.prototype.act = function(step, level) {}

Gem.prototype.draw = function(cx, x, y) {
    cx.save();
    drawDiamond(cx, x, y + 2.5 * Game.scale, this.color1, this.color2);
    cx.restore();
}