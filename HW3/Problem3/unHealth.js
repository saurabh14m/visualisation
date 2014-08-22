var bbDetail, bbOverview, dataSet, svg;

var margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
};

var width = 960 - margin.left - margin.right;

var height = 800 - margin.bottom - margin.top;

bbOverview = {
    x: 0,
    y: 10,
    w: width-20,
    h: 50
};

bbDetail = {
    x: 0,
    y: 100,
    w: width-20,
    h: 300
};

dataSet = [];

svg = d3.select("#visUN")
	.append("svg")
	.attr({
		width: width + margin.left + margin.right,
		height: height + margin.top + margin.bottom
	})
	.append("g").attr({
        transform: "translate(" + margin.left + "," + margin.top + ")"
    });
	
svg.append("defs").append("clipPath")
    .attr("id", "clip")
	.append("rect")
    .attr("width", bbDetail.w)
    .attr("height", height);
		
var focus = svg.append("g")
    .attr("class", "focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var context = svg.append("g")
    .attr("class", "context")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var parseDate = d3.time.format("%d-%b-%y").parse;

var convertToInt = function(s) {
    return parseInt(s.replace(/,/g, ""), 10);
};

var xScale = d3.time.scale()
	.range([0, bbOverview.w]);
	
var yScale = d3.scale.linear()
	.range([0, bbOverview.h]);
	
var xScale2 = d3.time.scale()
	.range([0, bbDetail.w]);
	
var yScale2 = d3.scale.linear()
	.range([100, bbDetail.h]);
		
var line = d3.svg.line()
	.x(function(d) { return xScale(d.date); })
	.y(function(d) { return yScale(d.womens_health); })
	.interpolate("linear");
		
var brush = d3.svg.brush()
	.x(xScale)
	.on("brush", brushed);

var xAxis = d3.svg.axis()
	.scale(xScale)
	.orient("bottom");
	
var yAxis = d3.svg.axis()
	.scale(yScale)
	.orient("left");
	
var area = d3.svg.area()
	.interpolate("basis")
	.x(function(d) { return xScale2(d.date); })
	.y0(bbDetail.h)
	.y1(function(d) { return yScale2(d.womens_health); });

var xAxis2 = d3.svg.axis()
	.scale(xScale2)
	.orient("bottom");
	
var yAxis2 = d3.svg.axis()
	.scale(yScale2)
	.orient("left");

d3.csv("unHealth.csv", function(data) {	
	
	dataSet = data.map(function(d) {
		return {
			date: Date.parse(d["Analysis Date"]), 
			womens_health: +convertToInt(d["Women's Health"]) 
		};
	});
	
	xScale.domain([
		d3.min(dataSet, function(d) { return d.date; }),
		d3.max(dataSet, function(d) { return d.date; })
	]);
	
	yScale.domain([
		d3.max(dataSet, function(d) { return d.womens_health; }),
		d3.min(dataSet, function(d) { return d.womens_health; })
	]);
	
	context.selectAll(".dot")
		.data(dataSet)
		.enter().append("g")
		.attr("class", "point")
		.append("circle")
		.style("fill", "blue")
		.attr("r", 3.0)
		.attr("cx", function(d) { 
			return xScale(d.date);
		})
		.attr("cy", function(e) { 
			return yScale(e.womens_health);
		});

	context.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + bbOverview.h + ")")
		.call(xAxis)
		.style("font-size", "10px");

	context.append("g")
		.attr("class", "y axis")
		.call(yAxis)
		.style("font-size", "10px");
		
	context.append("path")
		.datum(dataSet)
		.attr("class", "line")
		.attr("d", line)
		.attr("fill", "none")
		.style("stroke", "blue");
		
	context.append("g")
		.attr("class", "brush")
		.call(brush)
		.selectAll("rect").attr({ 
			height: bbOverview.h, 
			transform: "translate(0, 0)"
		});	

	xScale2.domain([
		d3.min(dataSet, function(d) { return d.date; }),
		d3.max(dataSet, function(d) { return d.date; })
	]);
	
	yScale2.domain([
		d3.max(dataSet, function(d) { return d.womens_health; }),
		d3.min(dataSet, function(d) { return d.womens_health; })
	]);
	
	focus.append("g")
		.attr("class", "y axis")
		.call(yAxis2)
		.style("font-size", "10px");
		
	focus.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + bbDetail.h + ")")
		.call(xAxis2)
		.style("font-size", "10px");
		
	focus.append("path")
		.datum(dataSet)
		.attr("class", "area")
		.attr("fill", "steelblue")
		.attr("d", area);	
		
	var text1 = svg.append("svg:text")
		.attr("x", margin.left)
		.attr("y", 400)
		.attr("text-anchor", "left")
		.style("font", "sans-serif")
		.style("font-size", "20px")
		.style("fill", "steelblue")
		.text("1. February 16, 2012: Sandra Fluke reading a prepared statement for U.S. Congressional testimony.")
		.on("mouseover", function(d) { d3.select(this).style('cursor', 'pointer')})
		.on("click", function(d) { 
			xScale2.domain([new Date('2012-02-03'), new Date('2012-02-23')]);
			focus.select(".area").attr("d", area);
			focus.select(".x.axis").call(xAxis2);
		});
		
	var text2 = svg.append("svg:text")
		.attr("x", margin.left)
		.attr("y", 430)
		.attr("text-anchor", "left")
		.style("font", "sans-serif")
		.style("font-size", "20px")
		.style("fill", "steelblue")
		.text("2. October 3, 2012: First presidential debate (University of Denver).")
		.on("mouseover", function(d) { d3.select(this).style('cursor', 'pointer')})
		.on("click", function(d) { 
			xScale2.domain([new Date('2012-09-29'), new Date('2012-10-13')]);
			focus.select(".area").attr("d", area);
			focus.select(".x.axis").call(xAxis2);
		});
		
	svg.append("g")
		.append("text")
        .attr("class", "chart-title")
		.attr("x", width/2)
        .style("text-anchor", "middle")
		.style("font-size", "25px")
        .attr("dy", -2)
		.text("Social Media Interest in Women's Health.");
});

function focus_date() {
	xScale2.domain(xScale.domain());
	focus.select(".area").attr("d", area);
	focus.select(".x.axis").call(xAxis2);
};

function brushed() {
	xScale2.domain(brush.empty() ? xScale.domain() : brush.extent());
	focus.select(".area").attr("d", area);
	focus.select(".x.axis").call(xAxis2);
};