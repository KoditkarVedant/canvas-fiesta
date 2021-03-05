const FoodHelper = {
    getRandomPosition: function (canvas) {
        let x = Math.floor(
            Math.random() * (canvas.width - DEFAULT_BODY_PART_WIDTH * 2) +
                DEFAULT_BODY_PART_WIDTH
        );
        x -= x % DEFAULT_BODY_PART_WIDTH;

        let y = Math.floor(
            Math.random() * (canvas.width - DEFAULT_BODY_PART_HEIGHT * 2) +
                DEFAULT_BODY_PART_HEIGHT
        );
        y -= y % DEFAULT_BODY_PART_HEIGHT;

        return { x, y };
    },

    createAFood: function (canvas, snake) {
        let pos = FoodHelper.getRandomPosition(canvas);

        while (
            snake.body.some((part) => part.x === pos.x && part.y === pos.y)
        ) {
            pos = FoodHelper.getRandomPosition(canvas);
        }

        return new Food(
            pos.x,
            pos.y,
            DEFAULT_BODY_PART_WIDTH,
            DEFAULT_BODY_PART_HEIGHT
        );
    },
};
