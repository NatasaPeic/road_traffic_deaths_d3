
// d3 map code goes here


var h = 1300,
    w = 1000;

// standard Mercator projection is used because graph presents 2D map when it is actually 3D object
var projection = d3.geo.mercator()
    .scale(1)
    .translate([0, 0]);

var path = d3.geo.path()
    .projection(projection);

// set-up svg canvas, grabs div tag and appends svg
var svg = d3.select("#svg1").append("svg")
    .attr("height", h)
    .attr("width", w);


//tooltip
var div = d3.select("body")
	    .append("div")
  		.attr("class", "tooltip")
  		.style("opacity", 0);


//data selected for contributing countries from https://raw.githubusercontent.com/NatasaPeic/world.geo.json/master/countries.geo.json
d3.json("../data/countries.geo.json", function(error, data) {

    //d3.csv("../data/data.csv", function(error, csv) {
	d3.csv("../data/data.csv", function(error, json) {


        // assigning a variable world to be able to access features from geo.json
        var world = data.features;

        // iterate over data and its features and match them
        json.forEach(function(d, i) {
            world.forEach(function(e, j) {
                if (d.id === e.id) {
                    e.name = d.name;
                    e.p = d.p;
                }
            });
        });

        // calculate bounds, scale and transform
        var b = path.bounds(data),
            s = .95 / Math.max((b[1][0] - b[0][0]) / w, (b[1][1] - b[0][1]) / h),
            t = [(w - s * (b[1][0] + b[0][0])) / 2, (h - s * (b[1][1] + b[0][1])) / 2];

        projection.scale(s)
            .translate(t);

        // d3 path generator
        svg.selectAll("path")
            .data(world).enter()
            .append("path")
            .style("fill", function(d) { return (d.p===0) ? '#fff' : (d.p>0 && d.p<1000) ? '#33D33F' : (d.p>1000 && d.p<5000) ? '#9DF1A4' :
            (d.p>5000 && d.p<10000) ? '#F9F66F' :
            (d.p>10000 && d.p<50000) ? '#ef8010' : (d.p>50000) ? '#ef1e0f' : '#fff' })

            .style("stroke", "black")
            .style("stroke-width", "1px")
            .attr("d", path)
            .on("mouseover", function(d) {
              	div.transition()
      	   .duration(200)
           .style("opacity", .9)

           div.text(d.name + ": " + d.p )
           .style("left", (d3.event.pageX) + "px")
           .style("top", (d3.event.pageY - 28) + "px")
  	})
      	// fade out tooltip on mouse out
          .on("mouseout", function(d) {
              div.transition()
                 .duration(500)
                 .style("opacity", 0);
          });

    });

});
