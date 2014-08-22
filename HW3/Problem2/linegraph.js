/**
 * Created by hen on 2/20/14.
 */
var bbVis, brush, createVis, dataSet, handle, height, margin, svg, svg2, width;

margin = {
	top: 50,
    right: 50,
    bottom: 50,
    left: 125
};

width = 960 - margin.left - margin.right;
height = 600 - margin.bottom - margin.top;

bbVis = {
    x: 100,
    y: 10,
    w: width - 100,
    h: 300
};

dataSet = [];

svg = d3.select("#vis").append("svg").attr({
		width: width + margin.left + margin.right,
        height: height + margin.top + margin.bottom
    }).append("g").attr({
        transform: "translate(" + margin.left + "," + margin.top + ")"
    });
	
var color = d3.scale.category10();

var parseDate = d3.time.format("%Y").parse;

d3.csv("timeline.csv", function(data) {
//convert your csv data and add it to dataSet

	color.domain(d3.keys(data[0]).filter(function(key) { return key !== "Year"; }));
	
	dataSet = color.domain().map(function(name) {	
		return {
			name: name,
			values: data.map(function(d) {
				return {date: parseDate(d.Year), population: +d[name]};
			})
		};
	});
	
	dataSet.map(function(d, i){
		d.values.map(function(e, j){
			while(d.values[0].population == 0){
				d.values.shift()
			}
			while(d.values[d.values.length - 1].population == 0){
				d.values.pop()
			}
		});
	});
		
    return createVis(dataSet);
});

createVis = function(dataSet) {

    var xScale = d3.time.scale()
		.domain([
			d3.min(dataSet, function(d) { return d3.min(d.values, function(e) { return e.date; }); }),
			d3.max(dataSet, function(d) { return d3.max(d.values, function(e) { return e.date; }); })
		])
		.range([0, bbVis.w]); // define the right domain generically
	
	var yScale = d3.scale.linear()
		.domain([
			d3.max(dataSet, function(d) { return d3.max(d.values, function(e) { return e.population; }); }),
			d3.min(dataSet, function(d) { return d3.min(d.values, function(e) { return e.population; }); })
		])
		.range([0, bbVis.h]); // define the right y domain and range -- use bbVis
	
	var line = d3.svg.line()
		.x(function(d) { return xScale(d.date); })
		.y(function(d) { return yScale(d.population); })
		.interpolate("linear");

	var xAxis = d3.svg.axis()
		.scale(xScale)
		.orient("bottom");
	
	var yAxis = d3.svg.axis()
		.scale(yScale)
		.orient("left");
		
	function interpolate(d, j) {
		var x = d.values[j].date;
		var y_0, y_1, x_0, x_1;
		
		for (i=j; i < d.values.length; i--){
			if (d.values[i].population > 0){
				y_0 = d.values[i].population;
				x_0 = d.values[i].date;
				break;
			}
		}		
		for (i=j; i < d.values.length; i++){
			if (d.values[i].population > 0){
				y_1 = d.values[i].population;
				x_1 = d.values[i].date;
				break;
			}
		}
		
		return y_0 + ((y_1 - y_0)*((x - x_0)/(x_1 - x_0)));
	}
	
	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + bbVis.h + ")")
		.call(xAxis)
		.append("text")
        .attr("class", "axis-label")
        .attr("x", bbVis.w)
        .attr("text-anchor", "end")
        .attr("dy", 48)
        .text("Year");

	svg.append("g")
		.attr("class", "y axis")
		.call(yAxis)
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("Population"); //add y axis to svg !
		
	svg.append("g")
		.append("text")
        .attr("class", "chart-title")
		.attr("x", width/2)
        .style("text-anchor", "middle")
		.style("font-size", "25px")
        .attr("dy", -2)
        .text("Line Graph for All Population Estimates.");
		
	dataSet.map(function(d, i){
		svg.selectAll(".dot")
			.data(d.values)
			.enter().append("g")
			.attr("class", "point")
			.append("circle")
			.style("fill", "blue")
			.attr("r", 3.0)
			.attr("cx", function(d) { 
				return xScale(d.date) 
			})
			.attr("cy", function(e, j) { 
				if (e.population == 0){
					e.population =interpolate(d, j);
					d3.select(this).style("fill", "red");
					return yScale(e.population);
				}
				else{
					return yScale(e.population);
				} 
			});
	});
						
	svg.selectAll(".agency")
		.data(dataSet)
		.enter().append("g")
		.attr("class", "agency")
		.append("path")
		.attr("class", "line")
		.attr("fill", "none")
		.attr("d", function(d) { return line(d.values); })
		.style("stroke", function(d, i) { return color(d.name); });
};