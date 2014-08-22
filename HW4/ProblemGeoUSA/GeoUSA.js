/**
 * Created by hen on 3/8/14.
 */
var centered;

var margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
};

var width = 950 - margin.left - margin.right;
var height = 600 - margin.bottom - margin.top;

var bbVis = {
    x: 100,
    y: 10,
    w: width - 100,
    h: 300
};

var detailVis = d3.select("#detailVis")
	.append("svg")
	.attr({
		width:350, 
		height:200
	});

var canvas = d3.select("#vis")
	.append("svg").attr({
		width: width + margin.left + margin.right,
		height: height + margin.top + margin.bottom
	});

var svg = canvas.append("g").attr({
    transform: "translate(" + margin.left + "," + margin.top + ")"
});

var projection = d3.geo.albersUsa()
	.translate([width/2, height/2]);
	
var path = d3.geo.path()
	.projection(projection);
	
var g = svg.append("g");
  
function loadStations(completeDataSet) {

    d3.csv("../data/NSRDB_StationsMeta.csv", function(error, data){
				
		data.map(function(d, i){
			
			var latitude = d["NSRDB_LAT (dd)"];
			var longitude =  d["NSRDB_LON(dd)"];
				
			var coordinates = projection([longitude, latitude]);
			
			if(completeDataSet[d.USAF] != undefined){
			
				var sum = completeDataSet[d.USAF].sum;
			
				if(coordinates != null){
				
					var sel = g.append("svg:circle")
						.attr("cx", coordinates[0])
						.attr("cy", coordinates[1])
						.attr("r", sum/10000000)
						.attr("fill", "blue")
						.on("click", function() {
							createDetailVis(completeDataSet[d.USAF].hourly, d.STATION + ", " + d.ST)
						})
						.on("mouseout", function() {
							clearDetailVis();
							d3.select(this).attr("r", sum/10000000);
							d3.select(this).attr("fill", "blue");
						})
						.on("mouseover", function() {
							d3.select(this).attr("r", sum/10000000 * 2);
							d3.select(this).attr("fill", "red")
						})
						.append("svg:title")
						.html("STATION : " + d.STATION + ", " + d.ST + "</br>" + "TOTAL     : " + sum);
				}
			}
			else{
			
				if(coordinates != null){
				
					g.append("svg:circle")
						.attr("cx", coordinates[0])
						.attr("cy", coordinates[1])
						.attr("r", 2.0)
						.attr("fill", "black")
						.on("click", function() {
							createDetailVis(completeDataSet[d.USAF].hourly, d.STATION + ", " + d.ST)
						})
						.on("mouseout", function() {
							clearDetailVis();
							d3.select(this).attr("r", 2.0);
							d3.select(this).attr("fill", "black");
						})
						.on("mouseover", function() {
							d3.select(this).attr("r", 10.0);
							d3.select(this).attr("fill", "black")
						})
						.append("svg:title")
						.html("STATION : " + d.STATION + ", " + d.ST + "</br>" + "TOTAL     : " + sum);
				}
			}
			
			g.append("g")
				.append("text")
				.attr("class", "chart-title")
				.style("text-anchor", "right")
				.style("font-size", "30px")
				.text("U.S. Solar Radiation Data: National Solar Radiation Database.");
		});
	});
};

var clearDetailVis = function(){

	detailVis.selectAll(".chart-title")
		.remove();
	
	detailVis.selectAll(".y.axis")
		.remove();
	
	detailVis.selectAll(".x.axis")
		.remove();
	
	detailVis.selectAll(".bar")
		.data([])
		.exit()
		.remove();
}

var createDetailVis = function(dummy_data, name){
	
	var data = [];
	
	for(var key3 in dummy_data) {
		
		data.push({
			"key" : key3,
			"value" : dummy_data[key3]
		});
	}
	
	var detailVis_width = detailVis[0][0].getAttribute("width") - 80;
	var detailVis_height = detailVis[0][0].getAttribute("height") - 80;

	var xScale = d3.scale.ordinal()
		.domain(data.map(function(d) { return d.key;}))
		.rangeRoundBands([0, detailVis_width]);
	
	var yScale = d3.scale.linear()
		.range([detailVis_height, 0])
		.domain(d3.extent(data, function(d) { return d.value; }));
		
	var xAxis = d3.svg.axis()
		.scale(xScale)
		.orient("bottom");
		
	var yAxis = d3.svg.axis()
		.scale(yScale)
		.orient("right");
		
	detailVis.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + detailVis_height + ")")
		.call(xAxis)
		.selectAll("text")  
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", function(d) {
                return "rotate(-90)" 
			});
		
	detailVis.append("g")
		.attr("class", "y axis")
		.attr("transform", "translate(" + detailVis_width + "," + 0 + ")")
		.call(yAxis);
				
	detailVis.selectAll(".bar")
		.data(data)
		.enter().append("rect")
		.attr("class", "bar")
		.attr("x", function(d) { return xScale(d.key); })
		.attr("width", xScale.rangeBand()-1)
		.attr("y", function(d) { return yScale(d.value); })
		.attr("height", function(d) { return detailVis_height - yScale(d.value); });
		
	detailVis.append("g")
		.append("text")
        .attr("class", "chart-title")
        .style("text-anchor", "left")
		.style("font-size", "10px")
        .attr("dy", 10)
        .text(name);
}

function loadStats() {

    d3.json("../data/reducedMonthStationHour2003_2004.json", function(error,data){
	
        completeDataSet = data;
		
        loadStations(completeDataSet);
    })
}

d3.json("../data/us-named.json", function(error, us) {

    g.append("g")
		.attr("id", "states")
		.selectAll("path")
		.data(topojson.feature(us, us.objects.states).features)
		.enter().append("path")
		.attr("d", path)
		.on("click", zoomToBB);

	g.append("path")
		.datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
		.attr("id", "state-borders")
		.attr("d", path);
		
    loadStats();
});

function zoomToBB(d) {

	var x, y, k;

	if (d && centered !== d) {
		var centroid = path.centroid(d);
		x = centroid[0];
		y = centroid[1];
		k = 4;
		centered = d;
	} 
	else {
		x = width / 2;
		y = height / 2;
		k = 1;
		centered = null;
	}

	svg.selectAll("path")
		.classed("active", centered && function(d) { return d === centered; });

	svg.transition()
		.duration(750)
		.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
		.style("stroke-width", 1.5 / k + "px");
}