var MessageType = { "HEALTHBAR": 0, "GAME_MESSAGE": 1 };

function InGameHUD(parent) {
    this.canvas = document.createElement("canvas");
    this.canvas.id = "hud";
    this.canvas.width = Game.width;
    this.canvas.height = Game.height + 40;
    this.canvas.style = "z-index:2;padding:0;margin:auto;display:block;width:" + this.canvas.width + "px;height:" + this.canvas.height + "px;position:absolute;top:0;bottom:0;left:0;right:0;";
    this.cx = this.canvas.getContext("2d");
    parent.appendChild(this.canvas);
    this.healthBar = null;
    this.gameMessage = null;
    this.maxGameMessageSize = 0;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.cx.fillStyle = "rgb(238, 238, 170)";
    this.questionIndex = 0;
}

InGameHUD.prototype.setHealthBar = function(context, funcToCall, maxValue) {
    this.healthBar = { "context": context, "funcToCall": funcToCall, maxValue: maxValue };
};

InGameHUD.prototype.setPlayerProgress = function(context, funcToCall, maxValue) {
    this.playerProgressBar = { "context": context, "funcToCall": funcToCall, maxValue: maxValue };
};

InGameHUD.prototype.setGameMessage = function(message, noTimeOut) {
    this.gameMessage = message;
    if (!noTimeOut) {
        setTimeout(function() {
            Game.hud.gameMessage = null;
        }, 2000);
    }
}


InGameHUD.prototype.drawBar = function(x, y, width, height, value, max, message) {
    this.cx.save();
    if (value > max) value = max;
    var greenValue = ~~((value / max) * width); // Draw the red scroll bar.
    this.cx.fillStyle = "red";
    this.cx.fillRect(x + greenValue, y, width - greenValue, height);
    this.cx.fillStyle = "green";
    this.cx.fillRect(x, y, greenValue, height); // Draw the green scroll bar.
    this.cx.restore();
    this.cx.fillStyle = "grey";
    this.cx.font = "14pt Georgia";
    var textWidth = this.cx.measureText(message).width;
    this.cx.fillText(message, x - textWidth - 5, y + 10);
}

InGameHUD.prototype.drawGameMessage = function(message, lineNum, highLight) {
    this.cx.save();
    var offset = 4;
    this.cx.font = "14pt Georgia";
    var textOffsetX = 5;
    var textOffsetY = 5;
    var yOffset = lineNum ? lineNum : 0;
    var textWidth = this.cx.measureText(message).width;
    this.maxGameMessageSize = ~~Math.max(textWidth, this.maxGameMessageSize);
    var actualTextWidth = textWidth;
    textWidth = this.maxGameMessageSize;
    var textHeight = parseInt(this.cx.font);
    var x = Game.width / 2 - textOffsetX - textWidth / 2,
        y = this.height - 15 - textOffsetY - textHeight - yOffset * (15 + textOffsetY + textHeight),
        width = 2 * textOffsetX + textWidth,
        height = 2 * textOffsetY + textHeight;
    var textX = Game.width / 2 - actualTextWidth / 2;
    this.cx.fillStyle = "rgba(255, 255, 255, 0.5)";
    this.cx.fillRect(x, y, width, height);
    this.cx.fillStyle = "rgba(170, 170, 170, 0.9)";
    this.cx.fillRect(x + offset, y + offset, width - 2 * offset, height - 2 * offset); // Draw the green scroll bar.    
    if (highLight) {
        this.cx.fillStyle = "fuchsia";
    } else {
        this.cx.fillStyle = "black";
    }
    this.cx.fillText(message, textX, y + textOffsetY + textHeight);
    this.cx.restore();
}

InGameHUD.prototype.drawQuestions = function(dialogObject) {
    this.clearScreen();
    if (Game.currentQuestionNo < 0)
        Game.currentQuestionNo = Game.numberOfQuestions - 1;
    if (Game.currentQuestionNo >= Game.numberOfQuestions)
        Game.currentQuestionNo = 0;

    for (var i = 0; i < Game.numberOfQuestions; i++) {
        if (Game.currentQuestionNo > Game.numberOfQuestions) break;
        if (i == Game.currentQuestionNo) {
            this.drawGameMessage(dialogObject["" + i].question, Game.numberOfQuestions - i, true);
        } else {
            this.drawGameMessage(dialogObject["" + i].question, Game.numberOfQuestions - i, false);
        }
    }
}

InGameHUD.prototype.clearScreen = function() {
    this.cx.clearRect(0, 0, this.canvas.width, this.canvas.height);
}

InGameHUD.prototype.clear = function() {
    this.canvas.parentNode.removeChild(this.canvas);
};

// Remove an element to be drawn.
InGameHUD.prototype.draw = function() {
    this.cx.fillStyle = "rgb(238, 238, 170)";
    this.cx.fillRect(0, Game.height, Game.width, 40);
    if (this.healthBar) {
        var value = this.healthBar.context[this.healthBar.funcToCall]();
        this.drawBar(Game.width - 130, Game.height + 20, 100, 10, value, this.healthBar.maxValue, "Health");
    }
    if (this.playerProgressBar) {
        var value = this.playerProgressBar.context[this.playerProgressBar.funcToCall]();
        this.drawBar(100, Game.height + 20, 200, 10, value, this.playerProgressBar.maxValue, "Progress");
    }
    if (this.gameMessage) {
        this.drawGameMessage(this.gameMessage);
    }

}