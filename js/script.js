/* Author: Sindre Sorhus

*/

// add abiltity to set Tipsy gravity in element data attribute
$.fn.tipsy.elementOptions = function(elem, options) {
	options.gravity = $(elem).data('tipsy-gravity') || options.gravity;
    return options;
};

$(function() {

	// get my repositories from GitHub
	var $githubProjects = $('#github-projects');
	$.getJSON('https://api.github.com/users/sindresorhus/repos?callback=?', function(response) {
		var data = response.data,
			output = [];
		for ( var i = 0, len = data.length; i < len; i++ ) {
			var item = data[i],
				dateCreated = new Date( Date.parse( item.created_at ) ),
				dateUpdated = new Date( Date.parse( item.updated_at ) ),
				relativeCreated = relativeTime( dateCreated ),
				relativeUpdated = relativeTime( dateUpdated );
			output.push('<li class="tip" data-tipsy-gravity="e" title="Created ' + relativeCreated + '<br />Updated ' + relativeUpdated + '"><h4><a href="' + item.html_url + '">' + item.name + '</a></h4>');
			output.push('<p>' + item.description + '</p></li>');
		}
		$githubProjects.html( output.join('') ).find('.tip').tipsy({
			gravity: 'e',
			offset: 4,
			html: true
		});
	}).error(function() {
		$githubProjects.html('<li>Couldn\'t load GitHub repositories.</li>');
	});
	
	// get my activities from GitHub, using Google Feed proxy, since it's orginally an atom feed
	var $githubActivities = $('#github-activities'),
		feed = 'http://github.com/sindresorhus.atom',
		url = 'https://ajax.googleapis.com/ajax/services/feed/load?num=8&output=json&v=1.0&q=' + encodeURIComponent( feed )
		// only use the key when live
		url += window.location.hostname === 'sindresorhus.com' ? '&key='+key : '',
		url += '&callback=?';
	$.getJSON(url, function(response) {
		var data = response.responseData.feed.entries,
			output = [];
		for ( var i = 0, len = data.length; i < len; i++ ) {
			var item = data[i],
				date = new Date( Date.parse( item.publishedDate ) ),
				relative = relativeTime( date ),
				title = item.title.replace('sindresorhus ', '');
			output.push('<li class="tip" data-tipsy2-gravity="e" title="' + relative + '"><h5><a href="' + item.link + '">' + title + '</a></h5>' + item.contentSnippet + '</li>');
		}
		$githubActivities.html( output.join('') ).find('.tip').tipsy({
			gravity: 'e',
			offset: 4
		});
	}).error(function() {
		$githubActivities.html('<li>Could not load GitHub activities.</li>');
	});
	
	// get my latest tweets
	var $twitterActivities = $('#twitter-activities');
	$.getJSON('https://api.twitter.com/1/statuses/user_timeline.json?screen_name=sindresorhus&count=10&trim_user=true&callback=?', function(response) {
		var data = response,
			output = [];
		for ( var i = 0, len = data.length; i < len; i++ ) {
			var item = data[i],
				date = new Date( Date.parse( item.created_at ) ),
				relative = relativeTime( date );
			output.push('<li class="tip" data-tipsy2-gravity="w" title="' + relative + '">' + linkifyTweet(item.text) + '</li>');
		}
		$twitterActivities.html( output.join('') ).find('.tip').tipsy({
			gravity: 'w',
			offset: 4
		});
		
	}).error(function() {
		$twitterActivities.html('<li>Couldn\'t load tweets.</li>');
	});
	
	/* tipsy overrides eachothers gravity if live is on, and elementOptions is overriden.
	$('.tip').tipsy({
		gravity: 'w',
		//live: true,
		html: true,
		offset: 4
	});
	*/

});