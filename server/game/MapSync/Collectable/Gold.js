function Gold(id, x, y) {
    this.uid = id;
    this.x = x;
    this.y = y;

    this.isAvailable = true;
    this.type = 'Gold';
}

module.exports = Gold;