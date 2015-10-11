function Gold(id, x, y) {
    this.id = id;
    this.x = x;
    this.y = y;

    this.available = true;
    this.type = 'Gold';
}

module.exports = Gold;