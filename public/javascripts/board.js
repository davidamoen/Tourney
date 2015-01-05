var _board = {
		name: 'Promise POC',
		canvas:  document.getElementById("grid"),
		column1: document.getElementById("division1"),
		column2: document.getElementById("division2"),
		message: document.getElementById('message'),
		selectTeams: function(allTeams, teams, champ) {
			var boardObj = this;
			teams.heads = [];
			teams.tails = [];
			return new Promise(function(resolve, reject) {
				var arr = allTeams.slice(0);

				for (i = 0; i < 3; i++) {

					// get the heads team last champion for the first spot if they exist
					var headsIdx = Math.floor(arr.length * Math.random());
					if (i == 0 && champ) {
						champ.isChamp = true;
						headsIdx = boardObj.getChampIndex(champ, arr);
					}

					teams.heads.push(arr.splice(headsIdx, 1)[0]);

					var tailsIdx = Math.floor(arr.length * Math.random());
					teams.tails.push(arr.splice(tailsIdx, 1)[0]);					
				}
				boardObj.initTeams(teams);
				boardObj.drawLogosInitial();
				boardObj.updateRecords();

				resolve(teams);
			});			
		},
		getChampIndex: function(champ, allTeams) {
			for (var key in allTeams) {
				var team = allTeams[key];
				if (team.name == champ.name) {
					return key;
				}
			}
		},
		setup: function(teams){
			this.drawGrid();
		},
		initTeams: function(teams) {
			var boardObj = this;
			for(i = 0; i < teams.heads.length; i++) {
				var headsTeam = teams.heads[i];
				var tailssTeam = teams.tails[i];
				headsTeam.wins = 0;
				headsTeam.losses = 0;
				tailssTeam.wins = 0;
				tailssTeam.losses = 0;	
				headsTeam.isChamp = headsTeam.isChamp ? true : false;
				tailssTeam.isChamp = false;		

				if (!headsTeam.history) {
					boardObj.createHistory(headsTeam);
				}

				if (!tailssTeam.history) {
					boardObj.createHistory(tailssTeam);
				}						
			}

			this.teams = teams;
		},
		createHistory: function(team) {
			team.history = {
				wins: 0,
				losses: 0,
				championshipWins: 0,
				championshipLosses: 0,
				championships: 0,
				divisionChampionships: 0,
				undefeatedSeasons: 0
			};
		},		
		drawGrid: function() {
			var center = this.getCenterPoint();
			var margin = 20;
			this.drawLine({x: center.x, y: margin}, {x:center.x, y:this.canvas.height - margin});

			var vSpace = this.canvas.height/8;
			for (i = 0; i < 7; i++) {
				var yCoord = (i+1) * vSpace;
				this.drawLine({x: margin, y: yCoord}, {x: this.canvas.width - margin, y: yCoord});
			}			
		},
		drawLogosInitial: function() {
			var headsDivision = this.teams.heads;
			var tailsDivision = this.teams.tails;

			context1 = this.column1.getContext("2d");
			context2 = this.column2.getContext("2d");
			context1.clearRect ( 0 , 0 , this.column1.width, this.column1.height );
			context2.clearRect ( 0 , 0 , this.column2.width, this.column2.height );

            context1.font = '18pt Arial Black';
            context1.fillStyle = '#000';
            context1.textAlign = 'center';		
            context2.font = '18pt Arial Black';
            context2.fillStyle = '#000';
            context2.textAlign = 'center';			

			for (i = 0; i < headsDivision.length; i++) {
				var headsTeam = headsDivision[i];
				var tailsTeam = tailsDivision[i];
				var ycoord = (i * 200);
				var xcoord = 50;

				this.drawLogo(
					{name: headsTeam.name, color: headsTeam.color, background: headsTeam.background, image: headsTeam.image}, 
					{x: xcoord, y: ycoord}, this.column1, 'large');

				this.drawLogo(
					{name: tailsTeam.name, color: tailsTeam.color, background: tailsTeam.background, image: tailsTeam.image}, 
					{x: xcoord, y: ycoord}, this.column2, 'large');

	            context1.fillText(headsTeam.name, xcoord+40, ycoord+105);	
	            context2.fillText(tailsTeam.name, xcoord+40, ycoord+105);	

			}
		},
		updateRecords: function() {
			this.updateDivisionRecord(this.teams.heads, this.column1);
			this.updateDivisionRecord(this.teams.tails, this.column2);
		},
		updateDivisionRecord: function(teams, canvas) {
			for (i = 0; i < teams.length; i++) {
				var team = teams[i];
				context = canvas.getContext("2d");
				var yCoord = (i * 200) + 200;
				var	xCoord = 35;

				// cover up previous record
				context.beginPath();
				context.fillStyle = "#006B00";
				// context.fillStyle = "#fff";
				context.fillRect(xCoord-40, yCoord-88, 200, 80);

				// write the current record
				var content = 'Season: ' + team.wins + ' - ' + team.losses;
	            context.font = '11pt Arial Black';
	            context.fillStyle = '#000';
	            context.textAlign = 'align';
	            
	            context.fillText(content, xCoord+55, yCoord-70);		

	            // write history
				var content = 'Overall: ' + (team.history.wins + team.history.championshipWins) + ' - ' + (team.history.losses + team.history.championshipLosses);
	            context.font = '11pt Arial Black';
	            context.fillStyle = '#000';
	            context.textAlign = 'align';
	            
	            context.fillText(content, xCoord+55, yCoord-50);	

				var content = 'Division Champions: ' + team.history.divisionChampionships;
	            context.font = '11pt Arial Black';
	            context.fillStyle = '#000';
	            context.textAlign = 'align';
	            
	            context.fillText(content, xCoord+55, yCoord-30);		   

	            var content = 'Championships: ' + team.history.championships;
	            context.font = '11pt Arial Black';
	            context.fillStyle = '#000';
	            context.textAlign = 'align';
	            
	            context.fillText(content, xCoord+55, yCoord-10);	
			}
		},
		drawLine: function(coord1, coord2) {
			var context = this.canvas.getContext("2d");
			context.beginPath();
			context.moveTo(coord1.x, coord1.y);
			context.lineTo(coord2.x, coord2.y);
			context.strokeStyle = "#fff";
			context.lineWidth = 5;
			context.stroke();
		},
		drawLogo: function(team, coord, canvas, size) {
			var context = canvas.getContext("2d");
			var width = size == 'large' ? 85 : 65;
			var img = new Image();
			img.src = '/images/' + team.image;
			img.onload = function() {
				context.drawImage(img, coord.x, coord.y, width, width);
			}
		},
		removeLogo: function(coord, canvas, size) {
			var context = canvas.getContext("2d");
			var width = 270;
			context.beginPath();
			context.fillStyle = "#006B00";
			context.fillRect(coord.x+2, coord.y, width, 65);
		},
		setupPiecesForGame: function(game) {
			
			for (i = 0; i < 8; i++) {
				var yCoord = 565 - (i * (600/8)) -37;
				var homeCoord = {x: 1, y: yCoord};
				var visitorCoord = {x: 301, y: yCoord};

				this.removeLogo(homeCoord, this.canvas, 'small');
				this.removeLogo(visitorCoord, this.canvas, 'small');
			}

			this.moveGamePiece(game.home, true);
			this.moveGamePiece(game.visitor, false);

		},
		moveGamePiece: function(team, isHome) {
			var xCoord = isHome ? 0 : 301;

			// remove previous logo
			if (team.score > 0) {
				var yRemove = 565 - ((team.score-1) * (600/8)) - 37;
				this.removeLogo({x: xCoord, y: yRemove }, this.canvas, 'small');
			}

			// add the new logo
			var yCoord = 530 - (team.score * (600/8));
			this.drawLogo(team, {x: xCoord + 120, y: yCoord-2 }, this.canvas, 'small');
		},
		getCenterPoint: function() {
			return {
				x: this.canvas.width/2,
				y: this.canvas.height/2
			};
		},
		message: function(msg) {
				context = message.getContext("2d");

				// cover up previous record
				context.beginPath();
				context.fillStyle = "#006B00";
				context.fillRect(0, 0, 1000, 30);

				// write the current record
	            context.font = '20pt Arial Black';
	            context.fillStyle = '#000';
	            context.textAlign = 'center';
	            
	            context.fillText(msg, 500, 25);				
	        },
		teams: {}
};