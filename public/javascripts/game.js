var _game = {

	waitTime: 100,
	scheduleIdx: 0,

	PlayRegularSeasonAsync: function(schedule, board) {
		var gameObj = this;
		gameObj.scheduleIdx = 0;

		for (key in schedule) {
			var game = schedule[key];
			game.home.wins = 0;
			game.visitor.wins = 0;
			game.home.losses = 0;
			game.visitor.losses = 0;

			game.home.championshipWins = 0;
			game.visitor.championshipWins = 0;
			game.home.championshipLosses = 0;
			game.visitor.championshipLosses = 0;	

			if (!game.home.history) {
				gameObj.CreateHistory(game.home);
			}

			if (!game.visitor.history) {
				gameObj.CreateHistory(game.visitor);
			}			
		}

		board.updateRecords();

		return new Promise(function(resolve, reject) {
			gameObj.PlayGames(schedule, board, function() {
				resolve(true);
			});	
		});
	},
	CreateHistory: function(team) {
		team.history = {
			wins: 0,
			losses: 0,
			championships: 0,
			divisionChampionships: 0,
			undefeatedSeasons: 0,
			winlessSeasons: 0
		};
	},
	PlayChampionShip: function(headsChamp, tailsChamp, board) {
		var gameObj = this;
		gameObj.scheduleIdx = 0;

		var schedule = [
			{home: headsChamp, visitor: tailsChamp},
			{home: tailsChamp, visitor: headsChamp},
			{home: headsChamp, visitor: tailsChamp},
			{home: tailsChamp, visitor: headsChamp},
			{home: headsChamp, visitor: tailsChamp}
		];

		return new Promise(function(resolve, reject) {
			gameObj.PlayChampionshipGames(schedule, board, function() {
				resolve(headsChamp.championshipWins > tailsChamp.championshipWins ? headsChamp : tailsChamp);
			});
		});
	},
	PlayoffsAsync: function(teams, board) {
		var gameObj = this;
		return new Promise(function(resolve, reject) {
			gameObj.GetDivisionChamp(teams.heads, board).then(function(headsChamp) {
				board.message('Heads Champion: ' + headsChamp.name);

				gameObj.GetDivisionChamp(teams.tails, board).then(function(tailsChamp) {
					board.message('Heads Champion: ' + headsChamp.name + ', Tails Champion: ' + tailsChamp.name);

					// return the two champions
					resolve({heads: headsChamp, tails: tailsChamp});
				});
			});
		});

	},
	GetDivisionChamp: function(division, board) {
		var gameObj = this;	
		return new Promise(function(resolve, reject) {

			// get the champs
			var champs = gameObj.getDivisionChamps(division);

			if (champs.length == 1) {
				resolve(champs[0]);
			}
			else if (champs.length == 2) {
				resolve(gameObj.PlayTwoTeamPlayoff(champs[0], champs[1], board));
			}
			else {
				resolve(gameObj.PlayThreeTeamPlayoff(division, board));
			}
		});
	},
	PlayTwoTeamPlayoff: function(team1, team2, board) {
		var gameObj = this;
		var game = { home: team1, visitor: team2 };
		board.message('Playoff Game: ' + game.home.name + ' vs ' + game.visitor.name);
		
		return new Promise(function(resolve, reject) {
			resolve(gameObj.PlayGameAsync(game, board));
		});
	},
	PlayThreeTeamPlayoff: function(division, board) {
		var gameObj = this;
		gameObj.scheduleIdx = 0;

		var schedule = [
			{home: division[0], visitor: division[1]},
			{home: division[1], visitor: division[2]},
			{home: division[2], visitor: division[0]}
		];

		return new Promise(function(resolve, reject) {
			gameObj.PlayGames(schedule, board, function() {
				var champs = gameObj.getDivisionChamps(division);
				if (champs.length == 1) {
					resolve(champs[0]);
				}
				else {
					resolve(gameObj.PlayThreeTeamPlayoff(division, board));
				}
			});

		});
	},
	PlayGames: function(schedule, board, callback) {
		var gameObj = this;
		var game = schedule[gameObj.scheduleIdx];

		board.message('Game # ' + (gameObj.scheduleIdx+1) +': ' + game.home.name + ' vs ' + game.visitor.name);
 
		gameObj.PlayGameAsync(game, board).then(function(result) {
			gameObj.scheduleIdx++;
			if (schedule.length == gameObj.scheduleIdx) {
				callback();
			}
			else {
				gameObj.PlayGames(schedule, board, callback);
			}
		});
	},
	PlayChampionshipGames: function(schedule, board, callback) {
		var gameObj = this;
		var game = schedule[gameObj.scheduleIdx];
		var winsForChampionShip = Math.ceil(schedule.length/2);
		console.log(winsForChampionShip + ' wins needed');

		board.message('Championship Game # ' + (gameObj.scheduleIdx+1) +': ' + game.home.name + ' ('+ game.home.championshipWins + ' wins) vs ' + game.visitor.name + ' (' + game.visitor.championshipWins + ' wins)');
 
		gameObj.PlayChampionshipGameAsync(game, board).then(function(result) {
			gameObj.scheduleIdx++;
			if (result.championshipWins >= winsForChampionShip) {
				callback();
			}
			else {
				gameObj.PlayChampionshipGames(schedule, board, callback);
			}
		});
	},	
	PlayGameAsync: function(game, board) {
		var gameObj = this;
		return new Promise(function(resolve, reject) {
			try {
				game.home.score = 0;
				game.visitor.score = 0;
				board.setupPiecesForGame(game);
				var winner = null;

				gameObj.StartFlipping(game, board, function() {
					if (game.home.score == 7) {
						game.home.wins++;
						game.visitor.losses++;
						winner = game.home;
					}
					else {
						game.home.losses++;
						game.visitor.wins++;
						winner = game.visitor;
					}

					board.updateRecords();
					console.log(winner);
					resolve(winner);
				});
			}
			catch(err) {
				reject(err);
			}
		});
	},
	PlayChampionshipGameAsync: function(game, board) {
		var gameObj = this;
		return new Promise(function(resolve, reject) {
			try {
				game.home.score = 0;
				game.visitor.score = 0;
				board.setupPiecesForGame(game);
				var winner = null;

				gameObj.StartFlipping(game, board, function() {
					if (game.home.score == 7) {
						game.home.championshipWins++;
						game.visitor.championshipLosses++;
						winner = game.home;
					}
					else {
						game.home.championshipLosses++;
						game.visitor.championshipWins++;
						winner = game.visitor;
					}

					board.updateRecords();
					resolve(winner);
				});
			}
			catch(err) {
				reject(err);
			}
		});
	},	
	StartFlipping: function(game, board, callback) {
		var gameObj = this;
		gameObj.NextFlipAsync(game, board).then(function(result){
			if (game.home.score == 7 || game.visitor.score == 7) {
				setTimeout(function() {
					callback();	
				}, gameObj.waitTime*5);
			}
			else {
				gameObj.StartFlipping(game, board, callback);
			}
		});		
	},
	NextFlipAsync: function(game, board) {
		var gameObj = this;
		return new Promise(function(resolve, reject) {
			try {
				gameObj.FlipCoinAsync(game, board).then(function(result) {
					if (result == 'heads') {
						game.home.score++;
						board.moveGamePiece(game.home, true);
					}
					else {
						game.visitor.score++;
						board.moveGamePiece(game.visitor, false);
					}
					resolve(result);
				});
			}
			catch(err) {
				reject(err);
			}
		});		
	},
	getDivisionChamps: function(division) {
		var maxWins = this.getMaxWins(division);
		var champs = [];
		for (var i = 0; i < division.length; i++) {
			var team = division[i];
			if (team.wins == maxWins) {
				champs.push(team);
			}
		};
		return champs;
	},
	getMaxWins: function(division) {
		var maxWins = 0;
		for (m = 0; m < division.length; m++) {
			var team = division[m];
			if (team.wins > maxWins) maxWins = team.wins;
		}
		return maxWins;
	},
	FlipCoinAsync: function() {
		var gameObj = this;
		return new Promise(function(resolve, reject) {
			try {
				var result = Math.random() > .5 ? 'heads' : 'tails';
				setTimeout(function() {
					resolve(result);	
				}, gameObj.waitTime);
			}	 
			catch(err) {
				reject(err);
			}
		});
	},	
}