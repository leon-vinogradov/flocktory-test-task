/**
	Floctory's test task scripts

	@author Leon Vinogradov
*/

var data1 = [{"id":1,"title":"Little Inc","metrics":{"offers":665,"shares":20,"landings":1124,"leads":1102,"purchases":88,"friends":74}},{"id":2,"title":"Marvin LLC","metrics":{"offers":2,"shares":0,"landings":2,"leads":2,"purchases":0,"friends":0}},{"id":3,"title":"Hodkiewicz, Jacobson and O'Conner","metrics":{"offers":834,"shares":8,"landings":759,"leads":683,"purchases":41,"friends":35}},{"id":4,"title":"Harber, Fahey and Berge","metrics":{"offers":233,"shares":5,"landings":352,"leads":348,"purchases":31,"friends":25}},{"id":5,"title":"Flatley and Sons","metrics":{"offers":791,"shares":32,"landings":759,"leads":713,"purchases":50,"friends":41}},{"id":6,"title":"Mann-Klocko","metrics":{"offers":86,"shares":3,"landings":132,"leads":124,"purchases":9,"friends":8}},{"id":7,"title":"Murray, Spencer and Zulauf","metrics":{"offers":677,"shares":27,"landings":1036,"leads":932,"purchases":65,"friends":53}},{"id":8,"title":"Schaden, Schmeler and Rice","metrics":{"offers":266,"shares":3,"landings":335,"leads":328,"purchases":16,"friends":14}}]

// var x = d3.scale.linear()
// 	.domain([0, d3.max(data, function(d) {return d.metrics.offers})])
// 	.range([0, 420]);

// d3.select(".chart")
// 	.selectAll("div")
// 		.data(data)
// 	.enter().append("div")
// 		.style("width", function(d) { return x(d.metrics.offers) + "px"; })
// 		.text(function(d) { return d.title; });

function buildCampaignList(data) {
	d3.select("#campaign-list")
		.selectAll("li")
			.data(data)
		.enter().append("li")
			.text(function(d) { return d.title; });
}

d3.json('https://gist.githubusercontent.com/heydiplo/b1296495b5db998f0b4d/raw/afb3efee16797b5fed44966370d0750eb1fe9e46/data.json', function(error, data) { console.log(arguments); });