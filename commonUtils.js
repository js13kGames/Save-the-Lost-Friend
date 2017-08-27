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