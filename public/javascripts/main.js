(function() {
	
var startBtn = document.getElementById("startBtn");
var selectTeams = document.getElementById("selectTeams");


var allTeams = [
	{name: 'Minnesota', image: 'minn-lg.png'}, 
	{name: 'Michigan', image: 'mich-lg.png'}, 
	{name: 'Northwestern', image: 'nw-lg.png'},
	{name: 'Wisconsin', image: 'wis-lg.png'}, 
	{name: 'Penn State', image: 'psu-lg.png'},
	{name: 'Nebraska', image: 'neb-lg.png'},
	{name: 'Illinois', image: 'ill-lg-dk.png'}, 
	{name: 'Indiana', image: 'ind-lg.png'}, 
	{name: 'Iowa', image: 'iowa-lg.png'},
	{name: 'Maryland', image: 'md-lg.png'}, 
	{name: 'Michigan State', image: 'msu-lg.png'},
	{name: 'Ohio State', image: 'osu-lg-dk.png'},	
	{name: 'Purdue', image: 'pur-lg-dk.png'},	
	{name: 'Rutgers', image: 'rutu-lg-dk.png'},	
];

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



	_board.setup(teams);
	var gameCounter = 0;
	_board.message('Click "Select Teams" to get started');
	
	startBtn.addEventListener("click", function() {
		console.log(schedule);
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