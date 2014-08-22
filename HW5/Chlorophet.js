var centered;
var current_state = "NY";
var year = "1980";
var demographic = "Resident Population";
var which_election = "general_election";

var margin = {
    top: 10,
    right: 10,
    bottom: 10,
    left: 10
};

var width = 780 - margin.left - margin.right;
var height = 480 - margin.bottom - margin.top;

var canvas = d3.select("#vis")
	.append("svg").attr({
		width: width + margin.left + margin.right,
		height: height + margin.top + margin.bottom
	});

var svg = canvas.append("g").attr({
    transform: "translate(" + margin.left + "," + margin.top + ")"
});

var projection = d3.geo.albersUsa()
	.scale(900)
	.translate([width/2, height/2]);
	
var path = d3.geo.path()
	.projection(projection);
	
var g = svg.append("g");

var election_data = {};
var indicators_data = {};

var color = d3.scale.linear()
    .domain([0, 100]);

queue()
    .defer(d3.json, "data/clean/us-named.json")
	.defer(d3.json, "data/clean/indicators.json")
    .defer(d3.csv, "data/clean/data.csv", function(d) {
		election_data[d.STCOU] = d;
	})
    .await(draw_chlorophet);

function draw_chlorophet(error, us, indicators) {

	indicators_data = indicators;
	
    g.append("g")
		.attr("id", "counties")
		.selectAll("path")
		.data(topojson.feature(us, us.objects.counties).features)
		.enter().append("path")
		.attr("class", "counties")
		.attr("fill", function(d, i) {
					
			var dem = 0;
			var rep = 0;
			
			try{
				dem = election_data[d.id]["ELE025180D"];
				rep = election_data[d.id]["ELE035180D"];
				
				if(dem > rep){
					color.range(["white", "blue"]);				
					return color(dem)
				}
				else{
					color.range(["white", "red"]);				
					return color(rep)
				}
			}
			catch(e){
		
			}
		})
		.attr("d", path)
		.on("mouseover", clear_draw_treemap)
		.on("click", zoomToBB)
		.append("svg:title")
		.html(function(d) { 
			return "<p>" + election_data[d.id]["Areaname"] + ", " + election_data[d.id]["State"] + "</p>";
		});

	g.append("path")
		.datum(topojson.mesh(us, us.objects.states, function(a, b) {return a !== b; }))
		.attr("id", "state-borders")
		.attr("d", path);
};

$("#radio1").buttonset();

$("#general_election").click(function() {
	which_election = "general_election";	
	recolor_map();
	draw_treemap();
});

$("#democratic_party").click(function() {
	which_election = "democratic_party";	
	recolor_map();
	draw_treemap();
});

$("#republican_party").click(function() {
	which_election = "republican_party";	
	recolor_map();
	draw_treemap();
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
		x = width/2;
		y = height/2;
		k = 1;
		centered = null;
	}

	svg.selectAll("path")
		.classed("active", centered && function(d) { return d === centered; });

	svg.transition()
		.duration(1000)
		.attr("transform", "translate(" + width/2 + "," + height/2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
		.style("stroke-width", 1.5 / k + "px");
};

$("#slider").slider({ 
				min: 1980, 
				max: 2012,
				step: 4,
				value: 1980,
				stop: function(event, ui) {
					year = String(ui.value);
					recolor_map();		
					draw_treemap();
					
					$(".sidecar").empty().append("Year:" + year);
				}
			});
			
$(".ui-slider-handle").append('<div class="sidecar"></div>');

window.onload = function() {
	$(".sidecar").append("Year:" + year);
};

function recolor_map(){	

	d3.selectAll(".counties").attr("fill", function(d) {
	
		var dem = 0;
		var rep = 0;
		
		var temp_dem = "ELE025" + year.substr(0, 1) + "" + year.substr(2, 3)  + "D"; 
		var temp_rep = "ELE035" + year.substr(0, 1) + "" + year.substr(2, 3)  + "D";
			
		try{
			dem = election_data[d.id][temp_dem];
			rep = election_data[d.id][temp_rep];
			
			if(which_election == "general_election"){
				
				if(dem > rep){
					color.range(["white", "blue"]);				
					return color(dem)
				}
				else{
					color.range(["white", "red"]);				
					return color(rep)
				}
			}
			else if(which_election == "democratic_party"){
				color.range(["white", "blue"]);				
				return color(dem)
			}
			else if(which_election == "republican_party"){
				color.range(["white", "red"]);				
				return color(rep)
			}
		}
		catch(e){
		
		}
	});
};

/********************************************************************************
*																				*
*																				*
*																				*
*********************************************************************************/

var tree_margin = {
	top: 1, 
	right: 1, 
	bottom: 1, 
	left: 1
};
    
var tree_width = 580 - tree_margin.left - tree_margin.right;
var tree_height = 480 - tree_margin.bottom - tree_margin.top;

var color = d3.scale.linear()
    .domain([0, 100])
	.range(["white", "blue"]);
	
var treemap = d3.layout.treemap()
    .size([tree_width, tree_height])
    .sticky(false)
    .value(function(d) { return d.size; });
	
function state_data(json, id, st){

	var data = {};
	
	json.children.map(function(indicator){
		if(indicator.name == id){
			indicator.children.map(function(state){
				if(state.name == st){
					data = state;
				}
			});
		}
	});
	
	return data;
}	

var tree_data;
var election_data = {};	

queue()
    .defer(d3.json, "data/clean/datum.json")
    .await(ready);

function ready(error, json) {
	tree_data = json;
	draw_treemap("NY");
};

function clear_draw_treemap(d) {	
	current_state = election_data[d.id]["State"];		
	draw_treemap();
};

var form2 = d3.select("tr").append("td").append("form")
	.attr("id", "form2");
	
function get_indicator() {
	return indicators_data[demographic][Math.round(year / 10) * 10];
}
	
function draw_treemap() {

	d3.select("#tree_map").remove();
	
	var indicator = get_indicator()		
	var use_data = state_data(tree_data, indicator, current_state);
				
	var div = d3.select("#form2").append("div")
		.attr("id", "tree_map")
		.style("width", (tree_width + tree_margin.left + tree_margin.right) + "px")
		.style("height", (tree_height + tree_margin.top + tree_margin.bottom) + "px");
					
	var node = div.datum(use_data).selectAll(".node")
		.data(treemap.nodes)
		.enter().append("div")
		.attr("class", "node")
		.call(position)
		.style("background", function(d) { 
		
			if(!d.children){
			
				var dem = 0;
				var rep = 0;
				
				var temp_dem = "ELE025" + year.substr(0, 1) + "" + year.substr(2, 3)  + "D"; 
				var temp_rep = "ELE035" + year.substr(0, 1) + "" + year.substr(2, 3)  + "D";
			
				try{					
					dem = election_data[d.STCOU][temp_dem];
					rep = election_data[d.STCOU][temp_rep];
					
					if(which_election == "general_election"){
					
						if(dem > rep){
							color.range(["white", "blue"]);				
							return color(dem)
						}
						else{
							color.range(["white", "red"]);				
							return color(rep)
						}
					}
					else if(which_election == "democratic_party"){
						color.range(["white", "blue"]);				
						return color(dem)
					}
					else if(which_election == "republican_party"){
						color.range(["white", "red"]);				
						return color(rep)
					}
				}
				catch(e){
					console.log("m");
				}
			}
			else{
				return null; 
			}
		})
		.text(function(d) { return d.children ? null : d.name; });

	d3.selectAll("#drop_down").on("change", function change() {
		var value = this.value === "count"
			? function() { return 1; }
			: function(d) { return d.size; };

    node
        .data(treemap.value(value).nodes)
		.transition()
        .duration(1000)
        .call(position);
	});
};

function position() {
	this.style("left", function(d) { return d.x + "px"; })
		.style("top", function(d) { return d.y + "px"; })
		.style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
		.style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });
};

labels = ["Resident Population", "Civilian Labour Force", "Persons 25 Years and Over", "Education Attainment", "Hispanic Population", "Married Family Households", "Median Household Income", "Male Population", "Female Population", "White Population", "African American Population", "Persons Below Poverty Line"];
options = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

d3.select("#form2").append("div")
	.attr("id", "drop_down")
    .append("select")
	.on("change", change)
    .selectAll("option")
    .data(options)
    .enter()
    .append("option")
    .text(function(d) {return labels[d];});
	
function change() {
    demographic = this.options[this.selectedIndex].value;
	draw_treemap();
};