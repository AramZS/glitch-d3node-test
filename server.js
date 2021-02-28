// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
var fs = require("fs");
const app = express();
if (typeof fetch !== 'function') {
    global.fetch = require('node-fetch-polyfill');
}

const D3Node = require("d3-node");
const csv = require('d3-fetch').csv;

const d3Actual = require('d3')
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
}`

  const options = { 
    selector: "#chart", 
    container: file, 
    styles: styles, 
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
    .attr("data-started", true)
    // .append("g")
    // .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
var data = d3.range(1000).map(d3.randomBates(10))

var formatCount = d3.format(',.0f')

var margin = {top: 10, right: 30, bottom: 30, left: 30}
var width = 960 - margin.left - margin.right
var height = 500 - margin.top - margin.bottom

var x = d3.scaleLinear()
  .rangeRound([0, width])

var bins = d3.histogram()
  .domain(x.domain())
  .thresholds(x.ticks(20))(data)

var y = d3.scaleLinear()
  .domain([0, d3.max(bins, function (d) { return d.length })])
  .range([height, 0])

const svgWidth = width + margin.left + margin.right
const svgHeight = height + margin.top + margin.bottom

var svg = d3n.createSVG(svgWidth, svgHeight)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

var bar = svg.selectAll('.bar')
  .data(bins)
  .enter().append('g')
  .attr('class', 'bar')
  .attr('transform', function (d) { return 'translate(' + x(d.x0) + ',' + y(d.length) + ')' })

bar.append('rect')
  .attr('x', 1)
  .attr('width', x(bins[0].x1) - x(bins[0].x0) - 1)
  .attr('height', function (d) { return height - y(d.length) })

bar.append('text')
  .attr('dy', '.75em')
  .attr('y', 6)
  .attr('x', (x(bins[0].x1) - x(bins[0].x0)) / 2)
  .attr('text-anchor', 'middle')
  .text(function (d) { return formatCount(d.length) })

svg.append('g')
  .attr('class', 'axis axis--x')
  .attr('transform', 'translate(0,' + height + ')')
  .call(d3.axisBottom(x))

  // d3.select(d3n.document.querySelector("#chart")).append("span"); // insert span tag into #chart
  // d3n.html(); // output: <html><body><div id="container"><div id="chart"><span></span></div></div></body></html>
  // d3n.chartHTML(); // output: <div id="chart"><span></span></div>
  // console.log(csvResult)
  response.set("Content-Type", "text/html");
  response.send(d3n.html());
});

// send the default array of dreams to the webpage
app.get("/dreams", (request, response) => {
  // express helps us take JS objects and send them as JSON
  response.json(dreams);
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
