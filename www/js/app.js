

// When the browser window is resized, responsify() is called.
d3.select(window).on("resize", makeResponsive);

// When the browser loads, makeResponsive() is called.
makeResponsive();

// The code for the chart is wrapped inside a function
// that automatically resizes the chart
function makeResponsive() {
        d3.csv('data/data.csv').then(function(data) {
            // if the SVG area isn't empty when the browser loads, remove it
            // and replace it with a resized version of the chart

            var svgArea = d3.select("body").select("svg");
            if (!svgArea.empty()) {
                svgArea.remove();
            }

            // SVG wrapper dimensions are determined by the current width
            // and height of the browser window.
            var svgWidth = window.innerWidth / 1.5;
            var svgHeight = window.innerHeight / 2;

            var margin = {
                top: 50,
                right: 50,
                bottom: 50,
                left: 50
            };
            var chartHeight = svgHeight - margin.top - margin.bottom;
            var chartWidth = svgWidth - margin.left - margin.right;

            var poverty = []
            data.forEach(elment => poverty.push(+elment['poverty']))
            var healthcare = []
            data.forEach(elment => healthcare.push(+elment['healthcare']))
            var state = []
            data.forEach(elment => state.push(elment['state']))
            var abbr = []
            data.forEach(elment => abbr.push(elment['abbr']))

            console.log('poverty: ',poverty)
            console.log('healthcare: ',healthcare)
            // append svg and group
            var svg = d3.select(".chart")
                .append("svg")
                .attr("height", svgHeight)
                .attr("width", svgWidth);

            var chartGroup = svg.append("g")
                .attr("transform", `translate(${margin.left}, ${margin.top})`);

            // scales
            var xScale = d3.scaleLinear()
                .domain([d3.min(poverty), d3.max(poverty)])
                .range([0, chartWidth]);
            console.log(d3.max(healthcare))
            var yScale = d3.scaleLinear()
                .domain([d3.min(healthcare), d3.max(healthcare)])
                .range([chartHeight, 0]);

            // create axes
            var yAxis = d3.axisLeft(yScale);
            var xAxis = d3.axisBottom(xScale);

                // set x to the bottom of the chart
            chartGroup.append("g")
                    .attr("transform", `translate(0, ${chartHeight})`)
                    .call(xAxis);

                // set y to the y axis
            chartGroup.append("g")
                    .call(yAxis);

            // append circles to data points
            var circlesGroup = chartGroup.selectAll("circle")
                .data(healthcare)
                .enter()
                .append("circle")
                .attr("cx", (d, i) => xScale(poverty[i]))
                .attr("cy", d => yScale(d))
                .attr("r", "10")
                .attr("fill", "steelblue");

            var daG = chartGroup.append("g");

            // append circles to data points
            var textGroup = daG.selectAll("text")
                .data(healthcare)
                .enter()
                .append("text")
                .attr("x", (d, i) => xScale(poverty[i]) - 3)
                .attr("y", d => yScale(d) + 1)
                .attr("font-size", "0.5em")
                .text( function (d, z, s) { 
                    console.log("processing (" + z + ")::"+ healthcare[z]); 
                    return abbr[z]; 
                });

            // Step 1: Append a div to the body to create tooltips, assign it a class
            //= ======================================================
            var toolTip = d3.select("body").append("div")
                .attr("class", "tooltip");

            //Step 2: Add an onmouseover event to display a tooltip
            //= =======================================================
            circlesGroup.on("mouseover", function(d, i) {
                toolTip.style("display", "block");
                toolTip.html(`<strong>${state[i]}: healthcare ${healthcare[i]}% poverty ${poverty[i]}%</strong>`)
                .style("left", d3.event.pageX + "px")
                .style("top", d3.event.pageY + "px")
                .style("opacity", 1);
            })



            // Step 3: Add an onmouseout event to make the tooltip invisible
            .on("mouseout", function() {
                toolTip.style("display", "none");
            });

        })
}
