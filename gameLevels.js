var LEVEL_TYPE = {
    "PLATFORMER": 0,
    "NONPLATFORMER": 1
};

function LevelInfo(levelType, plan, backgroundChars, actorChars, dialogEnabledSequence) {
    this.type = levelType;
    this.level = plan;
    this.backgroundChars = backgroundChars;
    this.actorChars = actorChars;
    this.dialogEnableSequence = dialogEnabledSequence;
};

LevelInfo.prototype.initializeChain = function(prevLevelInfo, nextLevelInfo) {
    this.nextLevel = nextLevelInfo;
    this.prevLevel = prevLevelInfo;
}