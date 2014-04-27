	/**
	Floctory's test task script

	@author Leon Vinogradov
*/

var floctory = {
	'config': {
		metrics: ['offers', 'shares', 'landings', 'leads', 'purchases', 'friends'],
		minCampaigns: 2,
		maxCampaigns: 8,
		margin: {
			top: 120,
			right: 10,
			bottom: 10,
			left: 10
		},
		width: 500,
		height: 500
	},

	'init': function() {
		var self = this;

		d3.json('data.json', function(error, data) {
			self.color = d3.scale.category10();

			self.x = d3.scale.ordinal()
				.domain(self.config.metrics)
				.rangePoints([0, self.config.width - self.config.margin.left - self.config.margin.right]);

			self.y = d3.scale.linear()
				.range([self.config.height - self.config.margin.top - self.config.margin.bottom, 0]),

			self.yAxis = d3.svg.axis()
				.scale(self.x);

			self.stack = d3.layout.stack()
				.values(function(d) { return d.values; });

			self.chart = d3.select('#compare-chart')
				.append('svg')
					.attr('width', self.config.width)
					.attr('height', self.config.height)
				.append('g')
					.attr('transform', 'rotate(90,' + self.config.width / 2 + ',' + self.config.height / 2 + ')');

			self.chartArea = self.chart.append('g')
				.attr('transform', 'translate(' + self.config.margin.left + ',' + self.config.margin.top + ')');
			self.chartYAxis = self.chart.append('g')
				.attr('transform', 'translate(' + self.config.margin.left + ',' + self.config.margin.top + ')')
				.attr('class', 'axis');

			self.area = d3.svg.area()
				.x(function(d) { return self.x(d.x); })
				.y0(function(d) { return self.y(d.y0); })
				.y1(function(d) { return self.y(d.y0 + d.y); });

			// make campaign list
			var listItem = d3.select('#campaign-list')
				.selectAll('li')
					.data(data)
				.enter().append('li').append('label');

			listItem.append('input').attr('type', 'checkbox');
			listItem.append('span').text(function(d) { return d.title; });

			listItem.on('change', function() {
				self.selectCampaign();
			});
		});
	},

	'selectCampaign': function() {
		var self = this,
			selectedCampaigns = d3.selectAll('#campaign-list input:checked'),
			selectedCampaignsLength = selectedCampaigns[0].length;

		// clear graph and exit if not enough campaigns selected
		if (selectedCampaignsLength < this.config.minCampaigns) {
			this.clearGraph();
			return;
		}

		this.drawGraph(selectedCampaigns.data());

		// disable checkboxes and exit if too many campaigns selected
		if (selectedCampaignsLength >= this.config.maxCampaigns) {
			d3.selectAll('#campaign-list input:not(:checked)').attr('disabled', true);
			return;
		}

		// enable all checkboxes
		d3.selectAll('#campaign-list input')
			.attr('disabled', null);
	},

	'drawGraph': function (data) {
		var self = this,
			campaigns,
			chartItem,
			metricSums = d3.map({'offers': 0, 'shares': 0, 'landings': 0, 'leads': 0, 'purchases': 0, 'friends': 0});

		// calculate metric sums for selected campaigns
		data.forEach(function(campaign) {
			metricSums.forEach(function(name, value) {
				metricSums.set(name, value + campaign.metrics[name]);
			});
		});

		// prepare data for build graph
		campaigns = self.stack(data.map(function(campaign) {
			var metric,
				values = [];

			for (metric in campaign.metrics) {
				values.push({
					x: metric,
					y: (campaign.metrics[metric] / metricSums.get(metric))
				})
			}

			return {
				id: campaign.id,
				title: campaign.title,
				values: values
			};
		}));

		// clear previously created svg paths
		self.clearGraph();

		// bind campaign data and SVG paths
		chartItem = self.chartArea.selectAll('path').data(campaigns, function(d) { return d.id; });

		// draw main chart
		chartItem.enter()
			.append('path')
				.attr('d', function (d) { return self.area(d.values); })
				.style('fill', function(d) { return self.color(d.id); })
			.append("svg:title")
				.text(function(d) { return d.title; });

		// set metric sums as axis labels
		self.yAxis.tickFormat(function (d) {
			return d + ': ' + metricSums.get(d);
		});

		// draw axis
		self.chartYAxis
			.call(self.yAxis)
			.selectAll('text')
				.attr('y', -5)
				.attr('x', 10)
				.attr('transform', 'rotate(-90)')
				.style('text-anchor', 'start');
	},

	'clearGraph': function() {
		this.chartArea.selectAll('path').remove();
		this.chartYAxis.selectAll('path, g').remove();
	}
}

floctory.init();