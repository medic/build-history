// set the dimensions and margins of the graph
const margin = { top: 10, right: 30, bottom: 30, left: 60 };
const width = 460 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

const svg = d3.select("#file-size")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

const formatRow = row => {
  const date = (new Date(parseInt(row.date + '000')));
  return {
    date: date,
    value: row.filesize
  }
};

d3.csv('https://raw.githubusercontent.com/medic/build-history-data/main/build-history/filesize.csv', formatRow)
  .then(data => {
    var x = d3.scaleTime()
      .domain(d3.extent(data, function(d) { return d.date; }))
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) { return +d.value; })])
      .range([ height, 0 ]);
    svg.append("g")
      .call(d3.axisLeft(y));

    // Add the line
    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d) { return x(d.date) })
        .y(function(d) { return y(d.value) })
      )
  });
