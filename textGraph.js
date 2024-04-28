// Plot constants
const MARGIN = { LEFT: 50, RIGHT: 50, TOP: 40, BOTTOM: 50 };
const WIDTH = 500 - MARGIN.LEFT - MARGIN.RIGHT;
const HEIGHT = 400 - MARGIN.TOP - MARGIN.BOTTOM;

let svg, g, title, subtitle;

function initChart(canvasElement) {
  // Visualization canvas
  svg = d3
    .select(canvasElement)
    .append("svg")
    .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
    .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM);

  g = svg.append("g")
    .attr("transform", "translate(" + MARGIN.LEFT + "," + MARGIN.TOP + ")");

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
}

function updateChart(data) {
  // Calculate average temperature
  const averageTemperature = d3.mean(data, d => d.Temperature);

  // Remove existing text elements
  g.selectAll(".text-label").remove();

  // Add text label for average temperature
  g.append("text")
    .attr("class", "text-label")
    .attr("x", WIDTH / 2)
    .attr("y", HEIGHT / 2)
    .style("text-anchor", "middle")
    .text("Average Temperature: " + averageTemperature.toFixed(2) + "℃");

  // Update titles
  title.text("Temperature Information");
  subtitle.text("Average Temperature in the Country for a Year");
}

export { initChart, updateChart };
