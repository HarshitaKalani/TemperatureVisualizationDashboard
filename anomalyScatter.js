// Plot constants
const MARGIN = { LEFT: 100, RIGHT: 50, TOP: 50, BOTTOM: 50 };
const WIDTH = 450 - MARGIN.LEFT - MARGIN.RIGHT;
const HEIGHT = 300 - MARGIN.TOP - MARGIN.BOTTOM;

let svg,
  g,
  colorScale,
  distScale,
  title,
  yearText,
  line,
  scatter,
  boundary;

let currYear = 1901;

// Domain data
const domLow = -1.5,
  domHigh = 2.5,
  axisTicks = [-1, 0, 1];

function initChart(canvasElement) {
  // Visualization canvas
  svg = d3
    .select(canvasElement)
    .append("svg")
    .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
    .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM);

  g = svg
    .append("g")
    .attr("transform", `translate(${MARGIN.LEFT},${MARGIN.TOP})`);

  // Base the color scale on average temperature extremes
  colorScale = d3
    .scaleLinear()
    .domain([domLow, (domLow + domHigh) / 2, domHigh])
    .range(["#1788de", "#ffff8c", "#CE241C"]);

  // Scale for the heights of the bar
  distScale = d3.scaleLinear().range([0, HEIGHT]).domain([domHigh, domLow]);

  // Title
  title = g
    .append("text")
    .attr("class", "title")
    .attr("x", WIDTH / 2)
    .attr("y", -20)
    .attr("text-anchor", "middle")
    .text("Temperature Anomaly");

  // Add axes
  const xAxis = d3.axisBottom().scale(distScale).ticks(1).tickValues(axisTicks);
  g.append("g").attr("class", "x-axis").attr("transform", `translate(0,${HEIGHT})`).call(xAxis);

  // Add year in center
  yearText = g
    .append("text")
    .attr("class", "yearText")
    .attr("text-anchor", "middle")
    .attr("x", WIDTH / 2)
    .attr("y", HEIGHT + 40);

  // Scatter plot group
  scatter = g.append("g").attr("class", "scatter");

  // Add boundary
  boundary = g
    .append("rect")
    .attr("class", "boundary")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", WIDTH)
    .attr("height", HEIGHT)
    .style("stroke", "black")
    .style("stroke-width", 1)
    .style("fill", "none");
}

function updateChart(data, nextYear) {
  if (nextYear < currYear) {
    const circles = scatter.selectAll("circle").data([]);
    circles.exit().remove();
  } else if (nextYear > currYear) {
    const yearData = data.get(String(nextYear));

    const circles = scatter.selectAll("circle").data(yearData);

    circles.exit().remove();

    circles
      .enter()
      .append("circle")
      .attr("r", 5)
      .attr("cx", (d) => distScale(d.Anomaly))
      .attr("cy", HEIGHT / 2)
      .style("fill", (d) => colorScale(d.Anomaly))
      .merge(circles)
      .transition()
      .duration(500)
      .attr("cx", (d) => distScale(d.Anomaly))
      .attr("cy", HEIGHT / 2);
  }

  yearText.text(nextYear);
  currYear = nextYear;
}

export { initChart, updateChart };
