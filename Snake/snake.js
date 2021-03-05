function Snake() {
    this.body = [
        new Body(100, 100, DEFAULT_BODY_PART_WIDTH, DEFAULT_BODY_PART_HEIGHT),
    ];
    this.stomach = [];

    this.isDead = function () {
        const set = new Set();
        for (const part of this.body) {
            if (set.has(part.toString())) {
                return true;
            }

            set.add(part.toString());
        }

        return false;
    };

    this.head = function () {
        return this.body[0];
    };

    this.tail = function () {
        return this.body[this.body.length - 1];
    };

    this.update = function (direction, canvas, food) {
        this.eatFood(food);
        const newTail = this.move(direction, canvas);
        this.processFood(newTail);
    };

    this.move = function (direction, canvas) {
        const head = this.head();
        let newHead = {
            ...head,
            x: head.x + direction.x * head.w,
            y: head.y + direction.y * head.h,
        };

        if (newHead.x < 0) {
            newHead.x = canvas.width - DEFAULT_BODY_PART_WIDTH;
        } else if (newHead.x >= canvas.width) {
            newHead.x = 0;
        }

        if (newHead.y < 0) {
            newHead.y = canvas.height - DEFAULT_BODY_PART_HEIGHT;
        } else if (newHead.y >= canvas.height) {
            newHead.y = 0;
        }

        let oldBody = undefined;
        let newBody = newHead;
        for (const part of this.body) {
            oldBody = { ...part };
            part.update(newBody);
            newBody = oldBody;
        }

        return newBody;
    };

    this.eatFood = function (food) {
        if (this.head().x == food.x && this.head().y == food.y) {
            this.stomach.push({ ...food });
            food.ate();
        }
    };

    this.processFood = function (newTail) {
        if (this.stomach.length === 0) {
            return;
        }

        if (newTail.match(this.stomach[0].x, this.stomach[0].y)) {
            console.log("processed");
            const processedFood = this.stomach.shift();
            const part = new Body(
                processedFood.x,
                processedFood.y,
                DEFAULT_BODY_PART_WIDTH,
                DEFAULT_BODY_PART_HEIGHT
            );

            this.body.push(part);
        }
    };

    this.draw = function (context) {
        for (const part of this.body) {
            context.beginPath();
            context.fillStyle = "black";
            context.rect(part.x, part.y, part.w, part.h);
            context.fill();
            context.closePath();
        }
    };
}

function Body(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    this.update = function (body) {
        this.x = body.x;
        this.y = body.y;
        this.w = body.w;
        this.h = body.h;
    };

    this.match = function (x, y) {
        return this.x === x && this.y === y;
    };

    this.toString = function () {
        return JSON.stringify({ x: this.x, y: this.y });
    };
}
