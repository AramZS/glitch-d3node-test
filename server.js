// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
var fs = require("fs");
const app = express();
if (typeof fetch !== "function") {
  global.fetch = require("node-fetch-polyfill");
}

const D3Node = require("d3-node");

// const d3Actual = require("d3");
const csv = require("d3-fetch").csv;

//if (typeof d3Actual.time !== "function") {
  // d3Actual.time = require("d3-time");
//}


//if (typeof d3Actual.time.format !== "function") {
  // d3Actual.time.format = require("d3-time-format");
//}
// 
const d3Actual = Object.assign({},
  require('d3'),
  // require('d3-time'),
  // require('d3-time-format'),
  require('d3-fetch'),
  // require('d3')
);

// our default array of dreams
const dreams = [
  "Find and count some sheep",
  "Climb a really tall mountain",
  "Wash the dishes"
];

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", async (request, response) => {
  var file = fs.readFileSync("./views/index.html").toString();
  const styles = `
.bar rect {
  fill: steelblue;
}
.bar text {
  fill: #fff;
  font: 10px sans-serif;
}`;

  const options = {
    selector: "#chart",
    container: file,
    styles: styles
    // d3Module: d3Actual
  };
  const d3n = new D3Node(options);
  const d3 = d3n.d3;
  // d3.select(d3n.document.querySelector("#chart"));
  // set the dimensions and margins of the graph
  var margin = { top: 10, right: 30, bottom: 30, left: 60 },
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3
    .select(d3n.document.querySelector("#chart"))
    // .append("svg")
    // .attr("width", width + margin.left + margin.right)
    // .attr("height", height + margin.top + margin.bottom)
    .attr("data-started", true);
  // .append("g")
  // .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var data = d3.range(1000).map(d3.randomBates(10));

  var formatCount = d3.format(",.0f");

  var margin = { top: 10, right: 30, bottom: 30, left: 30 };
  var width = 960 - margin.left - margin.right;
  var height = 500 - margin.top - margin.bottom;

  var x = d3.scaleLinear().rangeRound([0, width]);

  var bins = d3
    .histogram()
    .domain(x.domain())
    .thresholds(x.ticks(20))(data);

  var y = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(bins, function(d) {
        return d.length;
      })
    ])
    .range([height, 0]);

  const svgWidth = width + margin.left + margin.right;
  const svgHeight = height + margin.top + margin.bottom;

  var svg = d3n
    .createSVG(svgWidth, svgHeight)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var bar = svg
    .selectAll(".bar")
    .data(bins)
    .enter()
    .append("g")
    .attr("class", "bar")
    .attr("transform", function(d) {
      return "translate(" + x(d.x0) + "," + y(d.length) + ")";
    });

  bar
    .append("rect")
    .attr("x", 1)
    .attr("width", x(bins[0].x1) - x(bins[0].x0) - 1)
    .attr("height", function(d) {
      return height - y(d.length);
    });

  bar
    .append("text")
    .attr("dy", ".75em")
    .attr("y", 6)
    .attr("x", (x(bins[0].x1) - x(bins[0].x0)) / 2)
    .attr("text-anchor", "middle")
    .text(function(d) {
      return formatCount(d.length);
    });

  svg
    .append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height + ")")
    .call(
      d3.axisBottom(x)
    );

  // d3.select(d3n.document.querySelector("#chart")).append("span"); // insert span tag into #chart
  // d3n.html(); // output: <html><body><div id="container"><div id="chart"><span></span></div></div></body></html>
  // d3n.chartHTML(); // output: <div id="chart"><span></span></div>
  // console.log(csvResult)
  response.set("Content-Type", "text/html");
  response.send(d3n.html());
});

// send the default array of dreams to the webpage
app.get("/basic-line", (request, response) => {
  // https://bl.ocks.org/d3noob/b3ff6ae1c120eea654b5
  // Latest version - --> https://bl.ocks.org/d3noob/0e276dc70bb9184727ee47d6dd06e915
  // https://www.sitepoint.com/creating-simple-line-bar-charts-using-d3-js/
  // https://bl.ocks.org/gordlea/27370d1eea8464b04538e6d8ced39e89 
  // express helps us take JS objects and send them as JSON
  var file = fs.readFileSync("./views/index.html").toString();
    const styles = `
.line {
    fill: none;
    stroke: #ffab00;
    stroke-width: 3;
}
  
.overlay {
  fill: none;
  pointer-events: all;
}

/* Style the dots by assigning a fill and stroke */
.dot {
    fill: #ffab00;
    stroke: #fff;
}
  
.focus circle {
  fill: none;
  stroke: steelblue;
}`;

  const options = {
    selector: "#chart",
    container: file,
    styles: styles,
    d3Module: d3Actual
  };
  const d3n = new D3Node(options);
  const d3 = d3n.d3;
  var weekOfEmails = [
    {
      emailCount: 65,
      date: "2021-02-27"
    },
    {
      emailCount: 126,
      date: "2021-02-26"
    },
    {
      emailCount: 245,
      date: "2021-02-25"
    },
    {
      emailCount: 80,
      date: "2021-02-24"
    },
    {
      emailCount: 100,
      date: "2021-02-23"
    },
    {
      emailCount: 121,
      date: "2021-02-22"
    },
    {
      emailCount: 24,
      date: "2021-02-21"
    }
  ];
  var margin = {top: 80, right: 20, bottom: 50, left: 50},
    width = 450 - margin.left - margin.right,
    height = 278 - margin.top - margin.bottom;
  // https://github.com/d3/d3-time-format 
  // var parseDate = d3.timeFormat("%Y-%m-%d").parse;
  var parseTime = d3.timeParse("%Y-%m-%d");
  // Set the ranges
  var x = d3.scaleTime().range([0, width]);
  var y = d3.scaleLinear().range([height, 0]);
  
  var svg = d3
    .select(d3n.document.querySelector("#chart"))
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("padding-bottom", margin.bottom)
    .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top/2 + ")");
  
  weekOfEmails.forEach(function(d){
    d.date = parseTime(d.date);
  })
  
  // Load Object Data - https://stackoverflow.com/questions/35910649/how-to-load-a-json-object-instead-of-json-file
  // x.domain(weekOfEmails.map(function(d) { return parseDate(d.date) }));
  // y.domain(weekOfEmails.map(function(d) { return d.emailCount }));
  
  x.domain(d3.extent(weekOfEmails, function(d) { return d.date; }));
  y.domain([0, d3.max(weekOfEmails, function(d) { return d.emailCount; })]);
  
  // Define the line
  var valueline = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.emailCount); })
    .curve(d3.curveMonotoneX);  
  
  // Add the valueline path.
  svg.append("path")
      .attr("class", "line")
      .attr("d", valueline(weekOfEmails));

  // Add the X Axis
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x)
              .tickFormat(d3.timeFormat("%Y-%m-%d"))
              .ticks(7)
           )
      .selectAll("text")	
        .style("text-anchor", "end")
        .attr("transform", "translate(-10,10)rotate(-45)");
  
  // Add the Y Axis
  svg.append("g")
      .attr("class", "y axis")
      .call(d3.axisLeft(y));
  

  svg.selectAll(".dot")
    .data(weekOfEmails)
    .enter().append("circle") // Uses the enter().append() method
    .attr("class", "dot") // Assign a class for styling
    .attr("cx", function(d, i) { return x(d.date) })
    .attr("cy", function(d) { return y(d.emailCount) })
    .attr("r", 5)  
  
  // d3-node is supposed to do this, but it doesn't seem to be
  svg.append('defs')
      .append('style')
      .attr('type', 'text/css')
      .text(`<![CDATA[ ${styles} ]]>`)

  response.set("Content-Type", "text/html");
  response.send(d3n.html());
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
