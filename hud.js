var MessageType = { "HEALTHBAR": 0, "GAME_MESSAGE": 1 };

function InGameHUD(parent) {
    var existingHud = document.getElementById("hud");
    if (existingHud) {
        existingHud.parentNode.removeChild(existingHud);
    }
    this.canvas = document.createElement("canvas");
    this.canvas.id = "hud";
    this.canvas.width = Game.width;
    this.canvas.height = Game.height;
    this.canvas.style = "z-index: 2;position:absolute;left:0px;top:0px;";
    this.cx = this.canvas.getContext("2d");
    parent.appendChild(this.canvas);
    this.hudObjects = []; // Holds the HUD elements which need to be drawn.
}

// Add an element to be drawn.
InGameHUD.prototype.addElement = function(elem) {
    this.hudObjects.push(elem);
}

InGameHUD.prototype.drawBar = function(x, y, width, height, value, max) {
    var greenValue = ~~((value / max) * width); // Draw the red scroll bar.
    this.cx.fillStyle = "#ff0000ff";
    this.cx.fillRect(x + greenValue, y, width - greenValue, height);
    this.cx.fillStyle = "#00ff00ff";
    this.cx.fillRect(x, y, greenValue, height); // Draw the green scroll bar.
}

InGameHUD.prototype.drawGameMessage = function(message) {
    var offset = 4;
    this.cx.font = "14pt Georgia";
    var textOffsetX = 5;
    var textOffsetY = 5;
    var textWidth = this.cx.measureText(message).width;
    var textHeight = parseInt(this.cx.font);
    var x = Game.width / 2 - textOffsetX - textWidth / 2,
        y = Game.height - 15 - textOffsetY - textHeight,
        width = 2 * textOffsetX + textWidth,
        height = 2 * textOffsetY + textHeight;
    this.cx.fillStyle = "#ffffff22";
    this.cx.fillRect(x, y, width, height);
    this.cx.fillStyle = "#aaaaaaff";
    this.cx.fillRect(x + offset, y + offset, width - 2 * offset, height - 2 * offset); // Draw the green scroll bar.    
    this.cx.fillStyle = "fuchsia";
    this.cx.fillText(message, x + textOffsetX, y + textOffsetY + textHeight);
}

// Remove an element to be drawn.
InGameHUD.prototype.removeElement = function(elem) {
    this.hudObjects = this.hudObjects.filter(elem);
}

InGameHUD.prototype.clearHudObjects = function() {
    this.hudObjects = [];
}

InGameHUD.prototype.draw = function() {
    this.hudObjects.forEach(function(elem) {
        if (elem.type == MessageType.HEALTHBAR) {
            var value = elem.context[elem.funcToCall]();
            this.drawBar(Game.width - 130, 10, 100, 10, value, elem.maxValue);
        } else if (elem.type == MessageType.GAME_MESSAGE) {
            this.drawGameMessage(elem.message);
        }
    }, this);

}