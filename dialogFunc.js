function Dialog() {
    this.messages = {};
    this.firstMessage = "Hello.";
    this.restMessage = "Hello again";
    this.firstDialog = true;
    this.enterTriggerRegion = false;
}

Dialog.prototype.inTriggerRegion = function() {
    return true;
}

Dialog.prototype.activated = function() {

}
Dialog.prototype.speak = function() {
    if (this.firstDialog) {
        console.log(this.firstMessage);
        this.firstDialog = false;
    } else {
        console.log(this.restMessage);
    }
}