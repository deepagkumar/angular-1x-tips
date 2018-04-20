/*
* Config to Address IE refresh issue
*/
angular.module("myApp").config(function ($httpProvider) {
	
	//Initialize headers if not present
	if (!$httpProvider.defaults.headers.get) {
        $httpProvider.defaults.headers.get = {};
    }
    //disable IE ajax request caching
    $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Thu, 01 Jan 1970 01:00:00 GMT';
    $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
});