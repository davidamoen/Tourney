(function() {
	
var startBtn = document.getElementById("startBtn");
var selectTeams = document.getElementById("selectTeams");

var history = {};
var allTeams = [];
var currentChamp = null;

$.getJSON('/history', function(data) {
	for(var key in data) {
		if (key == 'teams') break;
		data = JSON.parse(key);
	}

	history = data;
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

		var season = {regularSeason: [], championship: []};

		_game.PlayRegularSeasonAsync(schedule, _board, season).then(function(result) {
			_game.PlayoffsAsync(teams, _board).then(function(result) {
				_game.PlayChampionShip(result.heads, result.tails, _board).then(function(champ) {
					_board.message(champ.name + ' wins the championship!')
					champ.history.championships++;
					currentChamp = champ;
					_board.updateRecords();

					$.ajax({
						type: "POST",
						url: "/saveHistory",
						data: JSON.stringify(history),
						success: function(data) {
							console.log(data);
						},
					});

				});
			});
		});
	});

	selectTeams.addEventListener("click", function() {
		_board.selectTeams(allTeams, teams, currentChamp).then(function(result) {
			teams = result;
			setSchedule(teams);
			_board.message('Now click "Start Season" to play');
		});
	});	
})();