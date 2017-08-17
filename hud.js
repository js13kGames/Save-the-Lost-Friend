function InGameHUD(parent) {
    this.canvas = document.createElement("canvas");
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

// Remove an element to be drawn.
InGameHUD.prototype.removeElement = function(elem) {
    this.hudObjects = this.hudObjects.filter(elem);
}

InGameHUD.prototype.draw = function() {
    this.cx.fillStyle = "#00000002";
    this.cx.fillRect(this.canvas.width - 150, 20, 120, 30);

}