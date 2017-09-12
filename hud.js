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
        this.cx.fillStyle = "#DC143C";
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
    if (!Game.inInteraction) {
        this.clearScreen();
    }
    this.cx.fillStyle = "rgb(238, 238, 170)";
    this.cx.fillRect(0, Game.height, Game.width, 40);
    if (this.healthBar) {
        var value = this.healthBar.context[this.healthBar.funcToCall]();
        this.drawBar(Game.width - 130, Game.height + 25, 100, 10, value, this.healthBar.maxValue, "Health");
    }
    if (this.playerProgressBar) {
        var value = this.playerProgressBar.context[this.playerProgressBar.funcToCall]();
        this.drawBar(80, Game.height + 25, 200, 10, value, this.playerProgressBar.maxValue, "Progress");
    }
    if (this.gameMessage) {
        this.drawGameMessage(this.gameMessage);
    }
    this.cx.fillText("Press P for Help", Game.width - 135, Game.height + 17);
}

InGameHUD.prototype.drawMenuScreen = function() {
    this.draw();
    this.cx.save();

    var midX = this.width / 2,
        midY = this.height / 2,
        menuWidth = 600,
        menuHeight = 400;

    var getTextSize = function(cx, message) {
        var textWidth = cx.measureText(message).width;
        var textHeight = parseInt(cx.font);
        return { "message": message, "width": textWidth, "height": textHeight };
    }

    var drawMenuText = function(cx, message, x, y, noStroke) {
        cx.fillText(text.message, x, y);
        if (!noStroke) cx.strokeText(text.message, x, y);
    }

    this.cx.fillStyle = "rgb(238, 238, 170)";
    this.cx.fillRect(midX - menuWidth / 2, midY - menuHeight / 2, menuWidth, menuHeight);

    this.cx.font = "32pt Georgia";
    this.cx.fillStyle = "red";
    this.cx.strokeStyle = "black";
    var text = getTextSize(this.cx, "Save the Lost Friend");
    drawMenuText(this.cx, text.message, midX - text.width / 2, midY - menuHeight / 2.7 - text.height / 2);

    if (Game.GameOver) {
        this.cx.font = "14pt Georgia";
        var text = getTextSize(this.cx, "You have Won.");
        drawMenuText(this.cx, text.message, midX - text.width / 2, midY - 4 * text.height / 2, true);
        var text = getTextSize(this.cx, "You have rescued your friend and others trapped in the portal");
        drawMenuText(this.cx, text.message, midX - text.width / 2, midY - 1 * text.height / 2, true);
        return;
    }

    this.cx.font = "10pt Georgia";
    text = getTextSize(this.cx, "Talk to the 4 guardians and get the keys to the 4 islands. Get the gems from the 4 islands.");
    drawMenuText(this.cx, text.message, midX - text.width / 2, midY - menuHeight / 3 + 2 * text.height, true);
    text = getTextSize(this.cx, "Place the gems in the circular portal in central island to rescue your lost friend");
    drawMenuText(this.cx, text.message, midX - text.width / 2, midY - menuHeight / 3 + 4 * text.height, true);

    drawTurtoise(this.cx, midX - 50, midY, 5);
    drawCrab(this.cx, midX - menuWidth / 2 + 10, midY + 30, 5);
    drawEagle(this.cx, midX - menuWidth / 2 + 150, midY, 5);
    drawOwl(this.cx, midX + 200, midY - 50, 4);

    this.cx.fillStyle = "#DC143C";
    this.cx.font = "12pt Georgia";
    text = getTextSize(this.cx, "Controls")
    drawMenuText(this.cx, text.message, midX - text.width / 2, midY + menuHeight / 5, true);
    text = getTextSize(this.cx, "Arrow keys for movement, Up arrow to fly and double jump.");
    drawMenuText(this.cx, text.message, midX - text.width / 2, midY + menuHeight / 5 + 2 * text.height, true);
    text = getTextSize(this.cx, "Enter key to proceed in dialog, Esc key to exit dialog.");
    drawMenuText(this.cx, text.message, midX - text.width / 2, midY + menuHeight / 5 + 4 * text.height, true);

    text = getTextSize(this.cx, "Press P to play");
    this.cx.fillStyle = "#7FFFD4";
    this.cx.fillRect(midX - text.width / 2, midY + menuHeight / 2 - 2.2 * text.height, text.width, 1.5 * text.height);
    this.cx.fillStyle = "#DC143C";
    this.cx.fillText(text.message, midX - text.width / 2, midY + menuHeight / 2 - text.height);
    this.cx.restore();
}