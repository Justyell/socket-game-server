'use strict';

//Paintingrooms service used to communicate Paintingrooms REST endpoints
angular.module('paintingrooms').factory('Paintingrooms', ['$resource',
	function($resource) {
		return $resource('paintingrooms/:paintingroomId', { paintingroomId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);


angular.module('paintingrooms').factory('Socket', ['$location','$timeout','Authentication',function($location,$timeout,Authentication){
	
	var st = io();
	return{
		on : function(eventName,callback){
				if(st){
					st.on(eventName,function(data){
						$timeout(function(){
							callback(data);
						});
					});
				}
			},
		emit : function(eventName,data){
				st.emit(eventName,data);
			},
			
		removeListener : function(eventName){
			st.removeListener(eventName);
		},
		
		disconnect: function(){
			st.disconnect();
		},
		
		cancelTimeout: function(){
			$timeout.cancel();
		}
	}
}]);

