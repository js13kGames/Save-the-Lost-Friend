var Game = {
    scale: 20,
    gamePaused: false,
    tileSize: 20,
    width: 1000,
    height: 420,
    currentLevel: null,
    inInteraction: false,
    nextLevel: null,
    levelKeys: {},
    gemsCollected: {},
    numberOfGemsCollected: 0,
    gemsPlaced: {}
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

var getDirectionalPos = function(pos) {
    var directionalPos = [];
    directionalPos.push(new Vector(pos.x, pos.y - 1)); // N
    directionalPos.push(new Vector(pos.x + 1, pos.y - 1)); // NE
    directionalPos.push(new Vector(pos.x + 1, pos.y)); // E
    directionalPos.push(new Vector(pos.x + 1, pos.y + 1)); // SE
    directionalPos.push(new Vector(pos.x, pos.y + 1)); // S
    directionalPos.push(new Vector(pos.x - 1, pos.y + 1)); // SW
    directionalPos.push(new Vector(pos.x - 1, pos.y)); // W
    directionalPos.push(new Vector(pos.x - 1, pos.y - 1)); // NW
    return directionalPos;
}

var drawArc = function(cx, centX, centY, radius, angStart, angEnd, fill) {
    cx.beginPath();
    cx.arc(centX, centY, radius, angStart, angEnd);
    cx.stroke();
    if (fill) {
        cx.fill();
    }
}

var getRandomElement = function(inVec) {
    return inVec[Math.floor(Math.random() * inVec.length)];
}

var drawTree = function(cx, x, y, hBranches, vBranches, treeColor) {
    var radius = 40;
    var scale = 20;
    var radius = 1 * scale;
    var overLapX = 1 / 8 * scale;
    var overLapY = 1 / 8 * scale;
    var horizBranchNos = hBranches;
    var vertBranchNos = vBranches;
    var trunkWidth = 2.5 * scale;
    var trunkHeight = 7.5 * scale;
    var rectStartX = x;
    var rectStartY = y - trunkHeight;


    // Horizontal branches Top and Bottom
    var angTopStart = Math.PI;
    var angTopEnd = 2 * Math.PI;

    var c1TopY = rectStartY - (radius * 2 * vertBranchNos - radius);
    var c1x;
    var baseX = rectStartX - (radius * horizBranchNos - trunkWidth / 2);
    var distBwTree = 2 * radius;

    var nextHorizTreePosDist = 2 * radius * horizBranchNos + distBwTree;
    var nextVertTreePosDist = 2 * radius * vertBranchNos + distBwTree + trunkHeight;

    var angBotStart = 0; // 0 to 180 degrees
    var angBotEnd = 180 * 2 * Math.PI / 360;
    var c1BotY = c1TopY + 2 * vertBranchNos * radius - overLapY;
    cx.fillStyle = treeColor;

    cx.beginPath();

    for (var i = 0; i < horizBranchNos; i++) {
        c1x = baseX + radius + 2 * i * radius;
        drawArc(cx, c1x, c1TopY, radius, angTopStart, angTopEnd);
        cx.fill();
        drawArc(cx, c1x, c1BotY, radius, angBotStart, angBotEnd);
        cx.fill();
    }

    // Vertical branches left and right
    var angRightStart = 270 * 2 * Math.PI / 360;;
    var angRightEnd = 90 * 2 * Math.PI / 360;;
    var c1RightX = baseX + horizBranchNos * radius * 2 - overLapX;
    var baseY = rectStartY - (radius * 2 * vertBranchNos - 2 * radius);

    for (var i = 0; i < vertBranchNos; i++) {
        c1Y = baseY + 2 * i * radius - overLapX;
        drawArc(cx, c1RightX, c1Y, radius, angRightStart, angRightEnd);
        cx.fill();
        drawArc(cx, baseX, c1Y, radius, angRightEnd, angRightStart); // Reverse the left branch angles
        cx.fill();
    }
    cx.fillRect(rectStartX - (radius * horizBranchNos - trunkWidth / 2), rectStartY - (radius * 2 * vertBranchNos - radius), radius * 2 * horizBranchNos, radius * 2 * vertBranchNos);
    cx.fillStyle = "brown";
    cx.fillRect(rectStartX, rectStartY, trunkWidth, trunkHeight);
    cx.strokeRect(rectStartX - 1, rectStartY, trunkWidth + 2, trunkHeight);
}

var drawCloud = function(cx, x, y, r1, r2, cloudColor) {
    cx.lineWidth = 3;
    cx.lineCap = 'round';
    cx.fillStyle = cloudColor;
    cx.strokeStyle = "#606060";
    var angTopStart = Math.PI;
    var angTopEnd = 2 * Math.PI;
    drawArc(cx, x + r1, y + r1 / 2, r1, angTopStart, angTopEnd, true);
    drawArc(cx, x + 2 * r1 + r2, y + r1 / 2, r2, angTopStart, angTopEnd, true);
    cx.beginPath();
    cx.moveTo(x, y + r1 / 2);
    cx.lineTo(x + 2 * r1 + 2 * r2, y + r1 / 2);
    cx.stroke();
}

function drawTriangle(cx, p1, p2, p3, color, noStroke) {
    cx.fillStyle = color;
    cx.beginPath();
    cx.moveTo(p1.x, p1.y);
    cx.lineTo(p2.x, p2.y);
    cx.lineTo(p3.x, p3.y);
    cx.closePath();
    if (!noStroke)
        cx.stroke();
    cx.fill();
}

function drawDiamond(cx, x, y, color1, color2) {
    var scale = Game.scale;
    cx.fillStyle = color2;
    cx.fillRect(x + scale / 2, y - 3 * scale, 2 * scale, scale);
    cx.strokeRect(x + scale / 2, y - 3 * scale, 2 * scale, scale);
    for (var i = 0; i < 3; i++) {
        var p1 = new Vector(x + i * scale, y - 2 * scale);
        var p2 = new Vector(x + i * scale + scale / 2, y - 3 * scale);
        var p3 = new Vector(x + (i + 1) * scale, y - 2 * scale);
        drawTriangle(cx, p1, p2, p3, color1);
    }
    var color;
    for (var i = 0; i < 6; i++) {
        color = i % 2 == 0 ? color1 : color2
        var p1 = new Vector(x + i * scale - (i * scale / 2), y - 2 * scale);
        var p2 = new Vector(x + i * scale / 2 + scale / 2, y - 2 * scale);
        var p3 = new Vector(x + 1.5 * scale, y);
        drawTriangle(cx, p1, p2, p3, color);
    }
}

function drawEagle(cx, x, y, scale) {
    cx.lineWidth = 2;
    cx.lineCap = 'round';

    //Beak
    cx.fillStyle = "gold";
    cx.beginPath();
    cx.moveTo(x, y - 8 * scale);
    cx.quadraticCurveTo(x - 0.5 * scale, y - 8 * scale - scale / 2, x + 1.5 * scale, y - 9.5 * scale);
    cx.moveTo(x, y - 8 * scale);
    cx.quadraticCurveTo(x, y - 8 * scale - scale / 2, x + 2.5 * scale, y - 8 * scale - scale / 2);
    cx.lineTo(x + 1.5 * scale, y - 9.5 * scale);
    cx.fill();
    cx.stroke();

    //Head
    cx.fillStyle = "#FAFAD2";
    cx.beginPath();
    cx.moveTo(x + 1.5 * scale, y - 9.5 * scale);
    cx.bezierCurveTo(x + 5.5 * scale, y - 15 * scale - scale / 2,
        x + 7.8 * scale, y - 10 * scale - scale / 2,
        x + 7.7 * scale, y - 5 * scale
    );
    cx.moveTo(x + 2.5 * scale, y - 8 * scale - scale / 2);
    cx.bezierCurveTo(x + 4.5 * scale, y - 6 * scale - scale / 2,
        x + 0.5 * scale, y - 5 * scale - scale / 2,
        x + 0.4 * scale, y - 4 * scale
    );
    cx.lineTo(x + 7.7 * scale, y - 5 * scale);
    cx.stroke();
    cx.fill();

    //eyes
    cx.beginPath();
    cx.moveTo(x + 2.4 * scale, y - 9 * scale);
    cx.bezierCurveTo(x + 3.5 * scale, y - 9.5 * scale - scale / 2,
        x + 4 * scale, y - 9.9 * scale - scale / 2,
        x + 5 * scale, y - 9.7 * scale - scale / 2
    );
    cx.bezierCurveTo(x + 5 * scale, y - 9.5 * scale - scale / 2,
        x + 4 * scale, y - 8.9 * scale - scale / 2,
        x + 2.4 * scale, y - 9 * scale
    );
    cx.stroke();

    //Body
    cx.fillStyle = "#DEB887";
    cx.beginPath();
    cx.moveTo(x + 0.4 * scale, y - 4 * scale);
    cx.bezierCurveTo(x - 1.5 * scale, y,
        x + 3.5 * scale, y + 4 * scale,
        x + 5.5 * scale, y + 6 * scale
    );
    cx.lineTo(x + 10 * scale, y + 6 * scale);
    cx.stroke();
    cx.fill()
    drawTriangle(cx, new Vector(x + 0.4 * scale, y - 4 * scale),
        new Vector(x + 5.5 * scale, y + 6 * scale),
        new Vector(x + 7.7 * scale, y - 5 * scale), "#DEB887", true);
    cx.fillStyle = "#DEA857";
    cx.beginPath();
    cx.moveTo(x + 7.7 * scale, y - 5 * scale);
    cx.bezierCurveTo(x + 13 * scale, y - 1 * scale,
        x + 12 * scale, y + 2 * scale,
        x + 12 * scale, y + 6 * scale
    );
    cx.moveTo(x + 7.7 * scale, y - 5 * scale);
    cx.bezierCurveTo(x + 1 * scale, y - 3 * scale,
        x + 5 * scale, y + 2 * scale,
        x + 10 * scale, y + 6 * scale
    );
    cx.lineTo(x + 12 * scale, y + 6 * scale);
    cx.stroke();
    cx.fill();
}


function drawTurtoise(cx, x, y, scale) {
    cx.lineWidth = 2;
    cx.lineCap = 'round';
    cx.fillStyle = "#9ACD32";
    // Head Top
    cx.beginPath()
    cx.moveTo(x + 2 * scale, y - 2.5 * scale);
    cx.bezierCurveTo(x + 2.3 * scale, y - 6 * scale,
        x + 4.5 * scale, y - 6.2 * scale,
        x + 7 * scale, y - 6.5 * scale
    );
    cx.bezierCurveTo(x + 8 * scale, y - 7.2 * scale,
        x + 9.5 * scale, y - 8 * scale,
        x + 10.5 * scale, y - 6.5 * scale
    );
    cx.bezierCurveTo(x + 11.5 * scale, y - 6.5 * scale,
        x + 13 * scale, y - 5 * scale,
        x + 12 * scale, y
    );
    cx.bezierCurveTo(x + 12.5 * scale, y + 0.5 * scale,
        x + 13 * scale, y + 1 * scale,
        x + 15.5 * scale, y + 1.5 * scale
    );
    cx.lineTo(x + 14 * scale, y + 3.5 * scale)
    cx.bezierCurveTo(x + 13 * scale, y + 3 * scale,
        x + 12 * scale, y + 3 * scale,
        x + 9.5 * scale, y + 0.5 * scale
    );
    cx.bezierCurveTo(x + 7 * scale, y + 1 * scale,
        x + 3 * scale, y - 0.5 * scale,
        x + 2.5 * scale, y - 2.5 * scale
    );
    cx.stroke();
    cx.fill();
    //Mouth and nect stroke
    cx.beginPath()
    cx.lineWidth = 5;
    cx.moveTo(x + 2 * scale, y - 2.5 * scale);
    cx.bezierCurveTo(x + 4.5 * scale, y - 5 * scale,
        x + 8 * scale, y,
        x + 10 * scale, y - 2.5 * scale
    );
    cx.stroke();
    cx.beginPath()
    cx.lineWidth = 3;
    cx.moveTo(x + 9.5 * scale, y + 0.5 * scale)
    cx.bezierCurveTo(x + 9.5 * scale, y + 0.5 * scale,
        x + 10.5 * scale, y + 0.3 * scale,
        x + 10.6 * scale, y - 0.5 * scale
    );
    cx.moveTo(x + 9.5 * scale, y - 3 * scale);
    cx.bezierCurveTo(x + 9.5 * scale, y - 3 * scale,
        x + 10 * scale, y - 3 * scale,
        x + 10.2 * scale, y - 2 * scale
    );
    cx.stroke();

    //eyes
    cx.fillStyle = "#CCFFCC";
    cx.beginPath();
    cx.moveTo(x + 8.7 * scale, y - 5 * scale);
    cx.arc(x + 8.7 * scale, y - 5 * scale, 1.5 * scale, 0, 2 * Math.PI);
    cx.fill();
    cx.fillStyle = "#FFFFFF";
    cx.beginPath();
    cx.arc(x + 8.7 * scale, y - 5 * scale, 1.5 * scale - 5, 0, 2 * Math.PI);
    cx.fill();
    cx.fillStyle = "#000000";
    cx.beginPath();
    cx.arc(x + 8.7 * scale, y - 5 * scale, scale - 3, 0, 2 * Math.PI);
    cx.fill();

    //Shell
    cx.fillStyle = "#EEE8AA";
    cx.fillRect(x + 14 * scale, y + 2 * scale, 24 * scale, 3 * scale);
    cx.fillStyle = "#708090";
    cx.beginPath();
    cx.moveTo(x + 26 * scale, y + 3 * scale);
    cx.arc(x + 26 * scale, y + 3 * scale, 12 * scale, Math.PI, 0);
    cx.fill();
    cx.fillStyle = "#70a090";
    cx.beginPath();
    cx.arc(x + 26 * scale, y + 3 * scale, 10 * scale, Math.PI, 0);
    cx.fill();
}

function drawCrabEyes(cx, x, y, scale, xOffset) {
    cx.fillStyle = "#FEEEEE";
    cx.beginPath();
    cx.arc(x + xOffset * scale, y - 7 * scale, 1 * scale, 0, 2 * Math.PI);
    cx.fill();
    cx.stroke();
    cx.fillStyle = "#222222";
    cx.beginPath();
    cx.arc(x + xOffset * scale, y - 7 * scale, 0.2 * scale, 0, 2 * Math.PI);
    cx.fill();
}

function drawCrabClaws(cx, x, y, x1, x2, x3, x4, x5, x6, scale) {
    cx.fillStyle = "#EE3500";
    cx.lineWidth = 4;
    cx.beginPath();
    cx.moveTo(x + x1 * scale, y - 4.2 * scale);
    cx.lineTo(x + x2 * scale, y - 6 * scale);
    cx.lineTo(x + x3 * scale, y - 8.5 * scale);
    cx.lineTo(x + x4 * scale, y - 8.5 * scale);
    cx.lineTo(x + x4 * scale, y - 6.5 * scale);
    cx.lineTo(x + x1 * scale, y - 4.5 * scale);
    cx.closePath();
    cx.stroke();
    cx.fill();
    cx.lineWidth = 3;
    cx.beginPath();
    cx.moveTo(x + x5 * scale, y - 9.8 * scale);
    cx.arc(x + x6 * scale, y - 10.3 * scale, 2 * scale - 5, Math.PI + Math.PI * 1 / 1.7, 0, true);
    cx.fill();
    cx.stroke();
}

function drawCrab(cx, x, y, scale) {
    cx.lineWidth = 2;
    cx.lineCap = 'round';
    cx.fillStyle = "#FF4500"
        // Top
    cx.beginPath();
    cx.moveTo(x + 10 * scale, y - 4.4 * scale);
    cx.arc(x + 10 * scale, y, 8 * scale - 5, Math.PI + Math.PI * 1 / 5, -Math.PI * 1 / 5);
    cx.fill();
    //Bottom
    cx.fillStyle = "#EE3500"
    cx.beginPath();
    cx.moveTo(x + 10 * scale, y - 4.4 * scale);
    cx.arc(x + 10 * scale, y - 6 * scale, 6.5 * scale - 5, Math.PI - Math.PI / 14, Math.PI / 14, true);
    cx.fill();
    // Mouth
    cx.strokeStyle = "#222222"
    cx.lineWidth = 4;
    cx.beginPath();
    cx.moveTo(x + 6 * scale, y - 4.4 * scale);
    cx.bezierCurveTo(x + 6 * scale, y - 4.4 * scale,
        x + 10 * scale, y - 2 * scale,
        x + 14 * scale, y - 4.4 * scale
    );
    cx.stroke();

    //eyes
    drawCrabEyes(cx, x, y, scale, 7);
    drawCrabEyes(cx, x, y, scale, 13);

    // Claws            
    drawCrabClaws(cx, x, y, 4.2, 0, 0.2, 1, 0.4, 0.6, scale);
    drawCrabClaws(cx, x, y, 15.7, 19.9, 20.1, 18.9, 19.6, 19.4, scale);
}

function drawOwlEyes(cx, x, y, xOffset, scale) {
    function drawCircle(x, y, r, color, stroke) {
        cx.fillStyle = color;
        cx.beginPath();
        cx.moveTo(x, y);
        cx.arc(x, y, r, 0, 2 * Math.PI);
        if (stroke) cx.stroke();
        cx.fill();
    }
    drawCircle(x, y + 3 * scale, 4 * scale, "#EEEEEE", true);
    drawCircle(x + scale / 3, y + 2.8 * scale, 2.4 * scale, "#B8860B", true);
    drawCircle(x + scale / 3, y + 2.8 * scale, 1 * scale, "#222222", true);
    drawCircle(x - 0.4 * scale, y + 1.7 * scale, 0.8 * scale, "#EEEEEE", false);
}

function drawOwl(cx, x, y, scale) {
    cx.lineCap = 'round';

    // Body
    cx.fillStyle = "#B8860B"
    cx.strokeStyle = "#B8860B"
    cx.lineWidth = 4;
    cx.beginPath();
    cx.moveTo(x - 3 * scale, y + 6.3 * scale);
    cx.bezierCurveTo(x - 4 * scale, y + 10 * scale,
        x - 5 * scale, y + 12 * scale,
        x + 1 * scale, y + 20 * scale
    );
    cx.moveTo(x + 11 * scale, y + 6.3 * scale);
    cx.bezierCurveTo(x + 12 * scale, y + 10 * scale,
        x + 13 * scale, y + 12 * scale,
        x + 8 * scale, y + 20 * scale
    );
    cx.stroke();
    cx.fill();

    cx.beginPath();
    cx.moveTo(x - 3 * scale, y + 6.3 * scale);
    cx.lineTo(x + 1 * scale, y + 20 * scale);
    cx.lineTo(x + 8 * scale, y + 20 * scale);
    cx.lineTo(x + 11 * scale, y + 6.3 * scale);
    cx.closePath();
    cx.fill();
    cx.stroke();

    cx.strokeStyle = "#222222";
    cx.lineWidth = 10;
    cx.beginPath();
    cx.moveTo(x - 3.5 * scale, y + 6.3 * scale);
    cx.bezierCurveTo(x - 4.5 * scale, y + 10 * scale,
        x - 5 * scale, y + 12 * scale,
        x - 2.8 * scale, y + 15 * scale
    );
    cx.moveTo(x + 11.5 * scale, y + 6.3 * scale);
    cx.bezierCurveTo(x + 12.5 * scale, y + 10 * scale,
        x + 13 * scale, y + 12 * scale,
        x + 11.3 * scale, y + 15 * scale
    );
    cx.stroke();

    cx.strokeStyle = "#222222";
    cx.lineWidth = 8;
    drawOwlEyes(cx, x, y, 0, scale);
    drawOwlEyes(cx, x + 8 * scale, y, 0, scale);
    cx.fillStyle = "#B8860B"
        // Head
    drawTriangle(cx, new Vector(x, y - 2 * scale), new Vector(x + 4 * scale, y), new Vector(x + 8 * scale, y - 2 * scale), "#B8860B", false);
    cx.fillRect(x + 3.5 * scale, y, 1 * scale, 5 * scale);
    // Nose
    cx.lineWidth = 4;
    cx.strokeRect(x + 3.5 * scale, y, 1 * scale, 5 * scale);
    drawTriangle(cx, new Vector(x + 3.5 * scale, y + 5 * scale), new Vector(x + 7 * scale, y + 6 * scale), new Vector(x + 3.5 * scale, y + 7.5 * scale), "#FFD700", false);

}

var reducePlayerHealth = function(damage, level, message) {
    if (level.player.playerHitTimer == 0) {
        level.player.health -= damage;
        level.player.playerHitTimer = level.player.playerHitTimerMax;
        Game.hud.setGameMessage(message);
    }
}