// Plot constants
const MARGIN = { LEFT: 50, RIGHT: 50, TOP: 40, BOTTOM: 50 };
const WIDTH = 500 - MARGIN.LEFT - MARGIN.RIGHT;
const HEIGHT = 300 - MARGIN.TOP - MARGIN.BOTTOM;

let svg, g, x, y, colorScale, xAxisGroup, yAxisGroup, title, subtitle, tooltip, tipData;
let hovered = false;
const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

function initChart(canvasElement) {
  // Visualization canvas
  svg = d3
    .select(canvasElement)
    .append("svg")
    .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
    .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM);

  g = svg.append("g")
    .attr("transform", "translate(" + MARGIN.LEFT + "," + MARGIN.TOP + ")");

  // Scales
  x = d3.scaleBand()
    .range([0, WIDTH])
    .padding(0.1)
    .domain(monthNames);

  y = d3.scaleLinear()
    .range([HEIGHT, 0])
    .domain([-40, 35]);

  // Color scale
  colorScale = d3.scaleSqrt()
    .domain([-30, 0, 35])
    .range(["#1788de", "#ffff8c", "#CE241C"]);

  // Axes initialization
  xAxisGroup = g.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + HEIGHT + ")")
    .call(d3.axisBottom(x));

  yAxisGroup = g.append("g")
    .attr("class", "y axis")
    .call(d3.axisLeft(y));

  svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "middle")
    .attr("transform", "translate(" + (MARGIN.LEFT / 2) + "," + (HEIGHT / 2) + ")rotate(-90)")
    .text("Temperature(℃)");

  title = g.append("text")
    .attr("class", "title")
    .attr("x", WIDTH / 2)
    .attr("y", -20)
    .style("text-anchor", "middle");

  subtitle = g.append("text")
    .attr("x", WIDTH / 2)
    .attr("y", -5)
    .style("text-anchor", "middle")
    .style("font-size", "0.8em")
    .style("opacity", 0.6);

  // Tooltip placeholder
  tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
}

function updateChart(data) {
  // Define line function
  const line = d3.line()
    .x((d) => x(d.Statistics.slice(0, 3)) + x.bandwidth() / 2)
    .y((d) => y(d.Temperature));

  // Update title and subtitle
  title.text(data[0].ISO3);
  subtitle.text(data[0].Year);

  // Update the line path
  const linePath = g.selectAll(".line").data([data]);
  linePath.exit().remove();

  linePath.enter().append("path")
    .attr("class", "line")
    .merge(linePath)
    .attr("fill", "none")
    .attr("stroke", "#CE241C")
    .attr("stroke-width", 2)
    .attr("d", line);

  // Update points on the line
  const points = g.selectAll(".point").data(data);
  points.exit().remove();

  points.enter().append("circle")
    .attr("class", "point")
    .attr("r", 4)
    .attr("cx", (d) => x(d.Statistics.slice(0, 3)) + x.bandwidth() / 2)
    .attr("cy", (d) => y(d.Temperature))
    .attr("fill", "#CE241C")
    .on("mouseover", function (event, d) {
      hovered = true;
      tooltip.transition()
        .duration(200)
        .style("opacity", 0.9);
      tooltip.html(d.Statistics + "<br/>" + d.Temperature + "℃")
        .style("left", (event.pageX) + "px")
        .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", function () {
      hovered = false;
      tooltip.transition()
        .duration(500)
        .style("opacity", 0);
    })
    .merge(points)
    .transition()
    .duration(400)
    .attr("cx", (d) => x(d.Statistics.slice(0, 3)) + x.bandwidth() / 2)
    .attr("cy", (d) => y(d.Temperature));
}

export { initChart, updateChart };
