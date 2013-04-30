
function draw(data) {
    "use strict";

    // pictures
    d3.select('#hackers')
        .selectAll('img')
        .data(data.nodes)
        .enter()
        .append('img')
        .attr('height', '30px')
        .attr('width', '30px')
        .attr('src', function(d) {return d.avatar_url})
        .attr('title', function(d) {return d.login})
        //.on('click', function(x) {x} ); //selectHacker); 
        .on('click', function(d) {selectHacker(d, data.links, data.nodes, xfunc, yfunc)}); 

    // main body
    var margin = 50,
        height = 400,
        width = 600,
        x_extent = d3.extent(data.nodes, function(d) { return d.pc0 }),
        y_extent = d3.extent(data.nodes, function(d) { return d.pc1 });

    var x_scale = d3.scale.sqrt()
        .range([margin, width-margin])
        .domain(x_extent);

    var y_scale = d3.scale.sqrt()
        .range([height-margin, margin]) // margin-height to reverse direction
        .domain(y_extent);

    var xfunc = function(d) {return x_scale(d.pc0)};
    var yfunc = function(d) {return y_scale(d.pc1)};

    d3.select('#graph')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    var x_axis = d3.svg.axis().scale(x_scale);
    var y_axis = d3.svg.axis().scale(y_scale).orient('left');

    d3.select('svg')
    .append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + (height-margin) + ')')
    .call(x_axis);

    d3.select('svg')
    .append('g')
    .attr('class', 'y axis')
    .attr('transform', 'translate(' + margin + ',0)')
    .call(y_axis);

    // nodes
    drawNodes(data, xfunc, yfunc);

}


function selectHacker(hacker, links, nodes, xfunc, yfunc) {

    var id = hacker.id;
    var filteredlinks = _.filter(links,
            function(l) {
                return l.source == id || l.target == id;
            });

    drawLinks(filteredlinks, nodes, xfunc, yfunc);

    var hackerIDs = _.union(
            _.map(filteredlinks, function(l) {return l.source}),
            _.map(filteredlinks, function(l) {return l.target}));

    hackerIDs = [id].concat(_.without(hackerIDs, id));

    console.log(hackerIDs);

    var hackers = _.map(hackerIDs, function(n) {return nodes[n]});

    d3.select('#collaborators')
        .selectAll('div')
        .data([])
        .exit()
        .remove();

    var divs = d3.select('#collaborators')
        .selectAll('div')
        .data(hackers)
        .enter()
        .append('div')
        .attr('class', 'collaborator')
        .attr('height', '40px')
        .attr('width', '200px')

        divs.append('img')
        .attr('class', 'collaborator-image')
        .attr('height', '30px')
        .attr('width', '30px')
        .attr('vertical-align', 'center')
        .attr('src', function(d) {return d.avatar_url})
        .attr('title', function(d) {return d.login})

        divs.append('div')
        .attr('class', 'collaborator-name')
        .append('span')
        .text(function(d) {return d.login});

}


function drawLinks(links, nodes, xfunc, yfunc) {

    var lines = d3.select('svg')
        .selectAll('line')
        .data([])
        .exit()
        .remove();

    var lines = d3.select('svg')
        .selectAll('line')
        .data(links)
        .enter()
        .append('svg:line')
        .attr('x1', function(d) {return xfunc(nodes[d.source])})
        .attr('y1', function(d) {return yfunc(nodes[d.source])})
        .attr('x2', function(d) {return xfunc(nodes[d.target])})
        .attr('y2', function(d) {return yfunc(nodes[d.target])})
        .style('stroke', 'rgb(0, 52, 72)')
        .style('alpha', 1)
        .style('stroke-width', 1);

} 


function drawNodes(data, xfunc, yfunc) {

    d3.select('svg')
        .selectAll('circle')
        .data(data.nodes)
        .enter()
        .append('circle')
        .attr('cx', function(d) {return xfunc(d)})
        .attr('cy', function(d) {return yfunc(d)})
        .attr('r', function(d) {return 6})
        .on('click', function(d) {selectHacker(d, data.links, data.nodes, xfunc, yfunc)})
        .append("svg:title")
        .text(function(d) { return d.login; });

}

