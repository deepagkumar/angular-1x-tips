/*
* Interceptor for HTTP requests.
* Every http request is intercepted to add the token in header
* If the token is expired then make another http call to get the refreshed token
* If there is any error in fetching the refresh token, then cancel the current request and log a message
*
* Dependencies: angular-1.x, angular-base64, angular-jwt
*/
angular.module("myApp").factory('httpRequestInterceptor', ['$localStorage', 'jwtHelper', '$base64', '$q', '$injector', function ($localStorage, jwtHelper, $base64, $q, $injector) {
    
	function addAuthTokensToHeader(config){		
		if ($localStorage.userSessionToken != undefined) {
			var base64encoded = $localStorage.userSessionToken;
			var decodedToken = $base64.decode(base64encoded);
			//If JWT token expired then refresh the token
			if(jwtHelper.isTokenExpired(decodedToken)){
				config = refreshToken(config);
			}
			config.headers['Authorization'] = 'Bearer ' + $localStorage.token;
		}		
		return config;
	}
	
	function refreshToken(config){
		if(config && config.data && config.data.ignoreInterceptorCall){
			//IMPORTANT: This check will avoid cyclic http calls.
			return config;
		}else{
			//Hack to avoid cyclic http calls. Add a property ignoreInterceptorCall
			var $http = $injector.get('$http');
			var postSessionData = { "data": "NA", "ignoreInterceptorCall":true };
			$http.post("<myurl>/token/refresh", postSessionData).then(
				function success(data) {
					$localStorage.token = data.result;					
				},
			function error(response) {
				console.log("Error in refreshToken");
				console.log(response);
				config = cancelCurrentRequest(config, "Error in Refreshing Token. Please Retry your action.");
			});
			return config;
		}		        
	}
	
	function cancelCurrentRequest(config, message){
		var canceler = $q.defer();
		config.timeout = canceler.promise;
		if (true) {
			// Canceling request
			canceler.resolve();
		}
		console.log(message);
		return config;
	}
	
	return {
		//Register the method to add token to header
        request: function (config) {            
			config = addAuthTokensToHeader(config);
			
            return config;
        }
    };
}]).config(function ($httpProvider) {
	console.log("Registering httpRequestInterceptor for home.html");
    $httpProvider.interceptors.push('httpRequestInterceptor');
});