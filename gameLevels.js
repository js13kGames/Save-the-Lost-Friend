var LEVEL_TYPE = {
    "PLATFORMER": 0,
    "NONPLATFORMER": 1
};

function LevelInfo(levelType, plan, backgroundChars, actorChars) {
    this.type = levelType;
    this.level = plan;
    this.backgroundChars = backgroundChars;
    this.actorChars = actorChars;
    this.display = CanvasDisplay;
};

LevelInfo.prototype.initializeChain = function(prevLevelInfo, nextLevelInfo) {
    this.nextLevel = nextLevelInfo;
    this.prevLevel = prevLevelInfo;
}