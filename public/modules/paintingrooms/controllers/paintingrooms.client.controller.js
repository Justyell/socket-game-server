'use strict';

// Paintingrooms controller
angular.module('paintingrooms').controller('PaintingroomsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Paintingrooms','Socket','$timeout',
	function($scope, $stateParams, $location, Authentication, Paintingrooms, Socket,$timeout) {
		
		$scope.authentication = Authentication;
		$scope.messages = [];
		$scope.getTalks = [];
		var yourRect = {
			x: 0,
			y: 0,
		};
		var friendRect = {
			x: 0,
			y: 0
		};
		//$scope.msg = "";
		// Create new Paintingroom
		$scope.create = function() {
			// Create new Paintingroom object
			var paintingroom = new Paintingrooms ({
				name: this.name
			});

			// Redirect after save
			paintingroom.$save(function(response) {
				$location.path('paintingrooms/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Paintingroom
		$scope.remove = function(paintingroom) {
			if ( paintingroom ) { 
				paintingroom.$remove();

				for (var i in $scope.paintingrooms) {
					if ($scope.paintingrooms [i] === paintingroom) {
						$scope.paintingrooms.splice(i, 1);
					}
				}
			} else {
				$scope.paintingroom.$remove(function() {
					$location.path('paintingrooms');
				});
			}
		};

		// Update existing Paintingroom
		$scope.update = function() {
			var paintingroom = $scope.paintingroom;

			paintingroom.$update(function() {
				$location.path('paintingrooms/' + paintingroom._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Paintingrooms
		$scope.find = function() {
			$scope.paintingrooms = Paintingrooms.query();
		};

		// Find existing Paintingroom
		$scope.findOne = function() {
			$scope.paintingroom = Paintingrooms.get({ 
				paintingroomId: $stateParams.paintingroomId
			});
		};
			
		//var socket = new Socket();	
		var user = {
				username: $scope.authentication.user
			};

		
		Socket.emit('chatMessage',user);
		
		Socket.on('chatMessage',function(message){
			//console.log(message);
			$scope.messages.push({msg:message.message});
			console.log(message);
		});
		
		Socket.on('getTalks',function(data){
			//console.log(data);
			$scope.getTalks.push({
				user:data.name,
				msg: data.talkmsg
			});
		});
		
		$scope.sendMsg = function(){
			console.log($scope.msg);
			Socket.emit('msgSend',$scope.msg);
			$scope.msg = "";
			document.getElementById('talkboard').scrollTop = document.getElementById('talkboard').scrollHeight;
		};
		
		$scope.enterSendMsg = function(e){
			
			if(e.keyCode == 13){
				$scope.sendMsg();
			}
			document.getElementById('talkboard').scrollTop = document.getElementById('talkboard').scrollHeight;
		}
		
		
		$scope.$on('$destroy',function(){
			Socket.cancelTimeout();
			Socket.removeListener('getTalks');
			//Socket.removeListener('msgSend');
		});
		
		Socket.on('friendRect',function(data){
			var canvas = document.getElementById("painting");
			var ctx =  canvas.getContext('2d');
			ctx.fillStyle="black";
			ctx.fillRect(data.x,data.y,60,3); 
			friendRect.x = data.x;
			friendRect.y = data.y;
		});
		
		Socket.on('friendRectMove',function(data){
			var canvas = document.getElementById("painting");
			var ctx =  canvas.getContext('2d');
			ctx.fillStyle="black";
			ctx.clearRect(friendRect.x,friendRect.y,60,3);
			ctx.fillRect(data.x,data.y,60,3);
			friendRect.x = data.x;
			friendRect.y = data.y;
		});
		
		$scope.showblock = function(){
			var canvas = document.getElementById("painting");
			var ctx =  canvas.getContext('2d');
			ctx.fillStyle="black";
			ctx.fillRect(50,140,60,3); 
			yourRect.x = 50;
			yourRect.y = 140;
			Socket.emit('startRect',yourRect);
		};
		
		$scope.rectMove = function(e){
			//console.log("listen!!");
			var canvas = document.getElementById("painting");
			var ctx =  canvas.getContext('2d');
			var keyCode = window.event?e.keyCode:e.which
			console.log(keyCode);
			if(keyCode == 97){
				ctx.clearRect(yourRect.x,yourRect.y,60,3);
				ctx.fillRect(yourRect.x-2,yourRect.y,60,3);
				yourRect.x = yourRect.x-2;
				yourRect.y = yourRect.y;
			}
			if(keyCode == 100){
				ctx.clearRect(yourRect.x,yourRect.y,60,3);
				ctx.fillRect(yourRect.x+2,yourRect.y,60,3);
				yourRect.x = yourRect.x+2;
				yourRect.y = yourRect.y;
			}
			Socket.emit('rectMove',yourRect);
		}
		
	}
	

	
]);