(function() {
	
var startBtn = document.getElementById("startBtn");
var selectTeams = document.getElementById("selectTeams");

var allTeams = [];
$.getJSON('/history', function(data) {
	data = JSON.parse(data);
	allTeams = data.teams;
	
});

var teams = {heads: [], tails: [] };
var schedule = [];

function setSchedule() {
	schedule = [
					{home: teams.heads[0], visitor: teams.tails[1]},
					{home: teams.heads[1], visitor: teams.tails[2]},
					{home: teams.heads[2], visitor: teams.tails[0]},
					{home: teams.heads[0], visitor: teams.tails[2]},
					{home: teams.heads[1], visitor: teams.tails[0]},
					{home: teams.heads[2], visitor: teams.tails[1]},
					{home: teams.heads[0], visitor: teams.tails[0]},
					{home: teams.heads[1], visitor: teams.tails[1]},
					{home: teams.heads[2], visitor: teams.tails[2]},
					{home: teams.heads[0], visitor: teams.heads[1]},
					{home: teams.tails[0], visitor: teams.tails[1]},
					{home: teams.heads[1], visitor: teams.heads[2]},
					{home: teams.tails[1], visitor: teams.tails[2]},
					{home: teams.heads[2], visitor: teams.heads[0]},
					{home: teams.tails[2], visitor: teams.tails[0]}
				];
}

	var gameCounter = 0;
	_board.message('Click "Select Teams" to get started');
	_board.setup(teams);
	
	startBtn.addEventListener("click", function() {
		_game.PlayRegularSeasonAsync(schedule, _board).then(function(result) {
			_game.PlayoffsAsync(teams, _board).then(function(result) {
				_game.PlayChampionShip(result.heads, result.tails, _board).then(function(champ) {
					_board.message(champ.name + ' wins the championship!')
				});
			});
		});
	});

	selectTeams.addEventListener("click", function() {
		_board.selectTeams(allTeams, teams).then(function(result) {
			teams = result;
			setSchedule(teams);
			_board.message('Now click "Start Season" to play');
		});
	});	
})();