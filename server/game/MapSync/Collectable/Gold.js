function Gold(id, x, y) {
    this.uid = id;
    this.x = x;
    this.y = y;

    this.isAvailable = true;
    this.type = 'Gold';
    this.scoreValue = 10;
}

module.exports = Gold;