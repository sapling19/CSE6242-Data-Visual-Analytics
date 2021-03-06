var w = 900;
var h = 500;
var padding = 50;
var feature25 = [];
d3.csv('diabetes.csv', 
    function(d) {
        return { pregnant_times: +d.pregnant_times,
                 plasma_glucose: +d.plasma_glucose,
                 blood_pressure: +d.blood_pressure,
                 skin_thickness: +d.skin_thickness,
                 insulin:        +d.insulin,
                 bmi:            +d.bmi,
                 pedigree:       +d.pedigree,
                 age:            +d.age,
                 class:          +d.class,};
                },
    function(error, rows) {
        rows.map(function(d) {
            feature25.push([d.plasma_glucose, d.insulin, d.class]);
                             });
        var xmax = d3.max(feature25, function(d) { return d[0]; });
        var xmin = d3.min(feature25, function(d) { return d[0]; });
        var ymax = d3.max(feature25, function(d) { return d[1]; });
        var ymin = d3.min(feature25, function(d) { return d[1]; });

        var xscale = d3.scale.linear()
                             .domain([xmin, xmax])
                             .range([padding*2, w-padding]);
        var yscale = d3.scale.log()
                             .domain([5, ymax])
                             .range([h-padding, padding]);
        yscale.clamp(true)
        var rscale = d3.scale.linear()
                       .domain([xmin, xmax])
                       .range([3, 3]);

        var mysvg = d3.select('#C_log')
                      .append('svg')
                      .attr('width', w)
                      .attr('height', h);

        var feature25_nt = feature25.filter(function(d) {
                                 return d[2] == 0; });
        feature25_nt.push([10, 600]);

        var feature25_pt = feature25.filter(function(d) {
                                 return d[2] == 1; });
        feature25_pt.push([10, 430]);

        var circles = mysvg.selectAll('circle')
                           .data(feature25_nt)
                           .enter()
                           .append('circle');
        circles.attr('cx', function(d) { return xscale(d[0]); })
               .attr('cy', function(d) { return yscale(d[1]); })
               .attr('r', function(d) { return rscale(d[0]); })
               .attr('stroke', 'rgb(0, 0, 255)')
               .attr('stroke-width', '1')
               .attr('fill', 'none');

        var triangles = mysvg.selectAll('polygon')
                             .data(feature25_pt)
                             .enter()
                             .append('polygon');
        triangles.attr('points', function(d) {
            var point1 = [xscale(d[0]) - 2*Math.sqrt(3), yscale(d[1]) + 2].join(',');
            var point2 = [xscale(d[0]), yscale(d[1]) - 4].join(',');
            var point3 = [xscale(d[0]) + 2*Math.sqrt(3), yscale(d[1]) + 2].join(',');
            return [point1, point2, point3].join(' ');
                                             })
                 .attr('stroke', 'rgb(255, 0, 0)')
                 .attr('stroke-width', '1')
                 .attr('fill', 'none');

        var xAxis = d3.svg.axis()
                      .scale(xscale)
                      .orient('bottom');
        mysvg.append('g')
             .attr('class', 'axis')
             .attr('transform', 'translate(0,' + (h - padding) + ')')
             .call(xAxis);

        var yAxis = d3.svg.axis()
                      .scale(yscale)
                      .orient('left');
        mysvg.append('g')
             .attr('class', 'axis')
             .attr('transform', 'translate(' + padding*2 + ',0)')
             .call(yAxis);

        mysvg.append('text')                // Figure Title
             .attr('x', (w + padding) / 2)
             .attr('y', padding / 2)
             .attr('text-anchor', 'middle')  
             .style('font-size', '24px') 
             .text('Plasma Glucose vs. Insulin (log-scaled)');
        mysvg.append('text')                // Figure Legend
             .attr('x', xscale(12))
             .attr('y', yscale(560))
             .attr('text-anchor', 'left')  
             .style('font-size', '16px') 
             .text('Negative');
        mysvg.append('text')                // Figure Legend
             .attr('x', xscale(12))
             .attr('y', yscale(410))
             .attr('text-anchor', 'left')  
             .style('font-size', '16px') 
             .text('Positive');
        mysvg.append('text')                // X Label
             .attr('x', (w + padding) / 2)
             .attr('y', h - padding / 10)
             .attr('text-anchor', 'middle')  
             .style('font-size', '20px') 
             .text('Plasma Glucose');
        mysvg.append('text')                // Y Label
             .attr('y', padding*1.0)
             .attr('x', - h / 2)
             .attr('transform', 'rotate(-90)')
             .attr('text-anchor', 'middle')  
             .style('font-size', '20px') 
             .text('Insulin');
       });