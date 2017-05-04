function createSoccerViz() {
    d3.csv("worldcup.csv", function (data) {
        overallTeamViz(data);


        var dataKeys = d3.keys(data[0]).filter(function (el) {
            return el !== "team" && el !== "region";
        })

        d3.select("#controls")
            .selectAll("button.teams")
            .data(dataKeys)
            .enter()
            .append("button")
            .on("click", buttonClick)
            .html(function (d) {
                return d;
            })

        function buttonClick(datapoint) {
            var max = d3.max(data, function (d) {
                return +d[datapoint];
            });

            var radiusScale = d3.scale.linear()
                .domain([0, max])
                .range([2, 20])
            // var ybRamp = d3.scale.linear()
            //     .interpolate(d3.interpolateHsl)
            //     .domain([0, max])
            //     .range(["yellow", "blue"])

            // var tenColorScale = d3.scale
            //     .category10(["UEFA", "CONMEBOL", "CAF", "AFC"])

            var colorQuantize = d3.scale.quantize()
                .domain([0, max])
                .range(colorbrewer.Reds[5])
            d3.selectAll("g.overallG")
                .select("circle")
                .transition()
                .delay(200)
                .duration(1000)
                .attr("r", function (d) {
                    return radiusScale(+d[datapoint]);
                })
                .style("fill", function(d){
                    return colorQuantize(+d[datapoint])
                })
        }
    })

    function overallTeamViz(data) {
        d3.select("svg")
            .append("g")
            .attr("id", "teamsG")
            .attr("transform", "translate(50, 300)")
            .selectAll("g")
            .data(data)
            .enter()
            .append("g")
            .classed("overallG", true)
            .attr("transform", function (d, i) {
                return "translate(" + (i * 50) + ", 0)";
            })

        var teamG = d3.selectAll("g.overallG")

        // teamG.append("circle")
        //     .attr("r", 20)
        //     .style("fill", "pink")
        //     .style("stroke", "black")
        //     .style("stroke-width", "1px");
        teamG
            .append("circle").attr("r", 0)
            .transition()
            .delay(function (d, i) { return i * 100 })
            .duration(500)
            .attr("r", 40)
            .transition()
            .duration(500)
            .attr("r", 20);
        teamG.append("text")
            .style("text-anchor", "middle")
            .attr("y", 30)
            .text(function (d) {
                return d.team;
            });

        teamG
            .on("mouseover", function (d) {
                var teamColor = d3.rgb("pink");
                d3.select(this)
                    .select("text")
                    .classed("active", true)
                    .attr("y", 10)
                d3.selectAll("g.overallG")
                    .select("circle")
                    .each(function (data) {
                        d.region == data.region ?
                        d3.select(this).style("fill", teamColor.darker(.75)) : 
                        d3.select(this).style("fill", teamColor.brighter(.5));
                    })

                this.parentElement.appendChild(this);
            })
            .on("mouseout", function () {
                d3.select(this)
                    .select("text")
                    .classed("active", false)
                    .attr("y", 30)

                d3.selectAll("circle")
                    .style("fill", "pink")
            })
        //之前已使用过selectAll
        teamG
            .select("text")
            .style("pointer-events", "none")
        
        teamG
            .insert("image", "text") // 在第二个元素前添加
            .attr("xlink:href", function(d){
                return "Netherlands.png";
            })
            .attr("width", "45px")
            .attr("height", "20px")
            .attr("x", "-22")
            .attr("y", "-10")

        // 获取实际DOM元素
        d3.select("circle")
            .each(function (d, i) {
                console.log(d);
                console.log(i);
                console.log(this);
            })
        d3.select("circle")
            .node()
    }
}