game.newLoopFromConstructor('game', function () {

	var map = {
		width: 50,
		height: 50,
		source: [
			'',
			'',
			'',
			'0               0-     00                     ',
			'0         0  000   |  00     00-              ',
			'0  P   |  0  00000000000  00000000        0000',
			'000000000000000000WWWWWWWWWWWWWWWWWW0000000000',
			'000000000000000000WWWWWWWWWWWWWWWWWW0000000000',
			'0000000000000000000000000000000000000000000000',
			
		]
	};

	var plStartPosition = false;

	var walls = [];
	var cells = [];
	var water = [];

	OOP.forArr(map.source, function (string, Y) {
		OOP.forArr(string, function (symbol, X) {
			if (!symbol || symbol == ' ') return;


			if (symbol == 'P') {
				plStartPosition == point(map.width * X, map.height * Y);
			} else if (symbol == 'W') {
					water.push(game.newRectObject({
						w: map.width, h: map.height,
						x: map.width*X, y: map.height*Y,
						fillColor: '#084379',
						alpha: 0.5
					}));
				} else if (symbol == '|') {
						cells.push(game.newRectObject({
							w: map.width/2, h: map.height,
							x: map.width*X, y: map.height*Y,
							fillColor: '#FFF953',
							userData: {
								active: true
							}
						}));
					} else if (symbol == '-') {
							cells.push(game.newRectObject({
								w: map.width, h: map.height/2,
								x: map.width*X, y: map.height*Y,
								fillColor: '#FFF953',
								userData: {
									active: true
								}
							}));
						} else if (symbol == '0') {
								walls.push(game.newRectObject({
									w: map.width, h: map.height,
									x: map.width*X, y: map.height*Y,
									fillColor: '#B64141'
								}));
							}


		});
	});

	var player = game.newCircleObject({
		radius: 20,
		fillColor: '#FF0000',
		position: plStartPosition ? plStartPosition : point(0, 0)
	});

	player.gr = 0.5;
	player.speed = point(0, 0);

	this.update = function () {
		game.clear();

		player.draw();

		player.speed.y += player.gr;

		if (key.isDown('RIGHT'))
			player.speed.x = 2;
		else if (key.isDown('LEFT'))
			player.speed.x = -2;
		else
			player.speed.x = 0;

		OOP.drawArr(walls, function (wall) {
			if (wall.isInCameraStatic()) {
				if (wall.isStaticIntersect(player)) {

					if (player.x + player.w > wall.x + wall.w/4 && player.x < wall.x + wall.w - wall.w/4) {
						if (player.speed.y > 0 && player.y + player.h < wall.y + wall.h/2) {	
							if (key.isDown('UP'))
								player.speed.y = -10;
							else{
								player.y = wall.y - player.h;
								player.speed.y *= -0.3;
								if (player.speed.y > -0.3)
									player.speed.y = 0;
							}		
						} else if (player.speed.y < 0 && player.y > wall.y + wall.h/2) {
							player.y = wall.y + wall.h;
							player.speed.y *= -0.1;
						}
					}

					if (player.y + player.h > wall.y + wall.h/4 && player.y < wall.y + wall.h - wall.h/4) {
						if (player.speed.x > 0 && player.x + player.w/2 < wall.x + wall.w/2) {
							player.x = wall.x - player.w;
							player.speed.x = 0;
						}

						if (player.speed.x < 0 && player.x > wall.x + wall.w/2) {
							player.x = wall.w + wall.x;
							player.speed.x = 0;
						}
					}

				}
			}
		});

		OOP.drawArr(cells, function (cell) {
				if (cell.active) {
					if (cell.isStaticIntersect(player)) {
						cell.active = false;
						cell.fillColor = '#9A9A9A';
						score++;
					}
				}
		});

		var onWater = false;

		OOP.drawArr(water, function(waterObj) {
			if (onWater) return;
			if (waterObj.isStaticIntersect(player) && player.y + player.h/2 > waterObj.y) {
				player.speed.y -= 0.9;
				onWater = true;
			}
		});

		if (player.speed.y) {
			player.y += player.speed.y;
		}

		if (player.speed.x) {
			player.x += player.speed.x;
		}

		brush.drawTextS({
			text: 'Score: ' + score,
			size: 30,
			color: '#FFFFFF',
			strokeColor: '#002C5D',
			strokeWidth: 1,
			x: 10, y: 10,
			style: 'bold'
		});

		camera.follow(player, 50);
	};
});
