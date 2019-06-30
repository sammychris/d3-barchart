
const Canvas = (dataset) => {
  const h = 500;
  const w = 900;
  const max = d3.max(dataset, d => d[1]);
  const min = d3.min(dataset, d => d[0]);
  
  const yearMax = new Date( d3.max(dataset, d => d[0]) );
  const yearMin = new Date( d3.min(dataset, d => d[0]) );

  const width = 700;
  const height = 400;
  const barWidth = width/dataset.length;

  const yScale = d3.scaleLinear()
    .domain([0, max])
    .range([ height, 0 ]);
  
  const xScale = d3.scaleTime()
    .domain([yearMin, yearMax])
    .range([0, width]);
 
  const yAxis = d3.axisLeft(yScale);
  const xAxis = d3.axisBottom(xScale);
  

  const Container = d3.select('main');
  
  Container.append('h1')
    .attr('id', 'title')
    .text('United State GDP')
  
  const displayItem = Container.append('div')
    .style('opacity', 0)
    .attr('id', 'tooltip');

  
  const svg = Container.append('svg')
    .attr('width', w)
    .attr('height', h);
  
  const centerSvg = svg.append('g')
  .attr('transform', 'translate(100,  50)');
  
  let years = dataset.map( item => {
    let temp = item[0].substring(5, 7);
    let list = {'01':'Q1', '04':'Q2', '07':'Q3', '10':'Q4'};
    return `${item[0].replace(/-.+/,'')} ${list[temp]}`;
  });
  
  let GDP = dataset.map( item => item[1] );
  
  var svgDefs = centerSvg.append('defs');

  var mainGradient = svgDefs.append('linearGradient')
    .attr('id', 'mainGradient')
    .attr("x1", "0%")
    .attr("x2", "100%")
    .attr("y1", "0%")
    .attr("y2", "100%");

  
  mainGradient.append('stop')
      .attr('stop-color', 'black')
      .attr('offset', '0%')

  mainGradient.append('stop')
      .attr('stop-color', '#32acff')
      .attr('offset', '100%')
  
  centerSvg.selectAll('rect')
  .data(dataset)
  .enter()
  .append('rect')
  .attr('fill', 'url(#mainGradient)')
  .attr('x', d => xScale(new Date(d[0])))
  .attr('y', d => yScale(d[1]))
  .attr('width', barWidth)
  .attr('height', d => height  - yScale(d[1]))
  .attr('class', 'bar')
  .attr('data-date', d => d[0])
  .attr('data-gdp', d => d[1])
  .on('mouseover', (d, i) => {
    displayItem.transition()
        .duration(200)
        .style('opacity', .9);
    displayItem.html(years[i] + '<br>' + '$' + GDP[i].toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + ' Billion')
        .attr('data-date', d[0])
        .style('left', (i * barWidth) + 30 + 'px')
        .style('top', h - 100 + 'px')
        .style('transform', 'translateX(100px)')
  })
  .on('mouseout', (d, i) => {
    displayItem.transition()
        .duration(200)
        .style('opacity', 0);
  });

  
  centerSvg.append('g')
  .attr('id', 'y-axis')
  .attr('class', 'tick')
  .call(yAxis)
  
  .append('text')
  .attr("transform", "rotate(-90)")
  .attr('x', -50)
  .attr('y', 20)
  .attr('fill', 'black')
  .attr('font-size', '16px')
  .text('Gross Domestic Product');
  
  
centerSvg.append('g')
  .attr('id', 'x-axis')
  .attr('class', 'tick')
  .attr("transform", `translate(0, ${height}) `)
  .call(xAxis);
  
d3.select('#x-axis')
  .selectAll('text')
  .attr('x', -30)
  .attr('y', 2)
  .attr('transform', 'rotate(-45)')
  
d3.selectAll('text')
  .attr('class', 'text')

}

fetch('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json')
  .then(d => d.json())
  .then(d => {
    Canvas(d.data);
});



