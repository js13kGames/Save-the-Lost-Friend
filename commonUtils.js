var Game = {
    scale: 20,
    gamePaused: false,
    tileSize: 20,
    width: 1000,
    height: 420,
    currentLevel: null,
    inInteraction: false
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

var getRandomElement = function(inVec) {
    return inVec[Math.floor(Math.random() * inVec.length)];
}

var drawTree = function(cx, x, y) {
    var drawArc = function(cx, centX, centY, radius, angStart, angEnd) {
        cx.beginPath();
        cx.arc(centX, centY, radius, angStart, angEnd);
        cx.stroke();
    }

    var radius = 40;
    var scale = 20;
    var radius = 1 * scale;
    var overLapX = 1 / 8 * scale;
    var overLapY = 1 / 8 * scale;
    var horizBranchNos = 3;
    var vertBranchNos = 5;
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
    cx.fillStyle = "green";

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
}