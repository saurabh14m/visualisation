/**
 * Created by hen on 3/8/14.
 */

var margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
};

var width = 960 - margin.left - margin.right;
var height = 600 - margin.bottom - margin.top;

var bbVis = {
    x: 100,
    y: 10,
    w: width - 100,
    h: 300
};

var dataSet = {};

var svg = d3.select("#vis")
	.append("svg")
	.attr({
		width: width + margin.left + margin.right,
		height: height + margin.top + margin.bottom
	}).append("g")
	.attr({
        transform: "translate(" + margin.left + "," + margin.top + ")"
    });

var projection = d3.geo.mercator()
    .scale((width + 1) / 2 / Math.PI)
    .translate([width / 2, height / 2])
    .precision(.1);

var path = d3.geo.path()
    .projection(projection);
	
var g = svg.append("g");

var color = d3.scale.category20();

var initVis = function(error, indicators, world){

	g.append("g")
		.attr("class", "country")
		.selectAll("path")
        .data(world.features)
		.enter()
		.append("path")
        .attr("d", path)
		.attr("fill",function(d,i){return color(i);});
}

//very cool queue function to make multiple calls.
queue()
    .defer(d3.csv,"../data/worldBank_indicators.csv")
    .defer(d3.json,"../data/world_data.json")
    //.defer(d3.json,"../data/WorldBankCountries.json")
    .await(initVis);

d3.select(self.frameElement).style("height", height + "px");