// sizes
    const sizeOfSVG={
        width: 1200,
        height: 600
    };

    const padding= 80

// create Heading of the project
    const title=d3.select('main')
                    .append('h1')
                    .attr('id','title')
                    .text("Monthly Global Land-Surface Temperature")

// create description title
    const description=(baseTemperature) =>{
        return d3.select('main')
                    .append('h2')
                    .attr('id','description')
                    .text(`1753 - 2015: Base Temperature ${baseTemperature}°C`)
}

// draw the canvas to display svg
    const canvas=()=>{
        return d3.select('main')
                    .append('svg')
                    .attr('width',sizeOfSVG.width)
                    .attr('height',sizeOfSVG.height)
}

// tooltip
let tooltip=d3.select('body')
                .append('div')
                .attr('id','tooltip')
                .style('position', 'absolute')

// generate scales
    let xScale
    let yScale
    let minYear
    let maxYear
    scales=() =>{
        minYear= d3.min(monthlyVariance,(d) =>{
            return d.year
        })
        maxYear= d3.max(monthlyVariance,(d)=>{
            return d.year
        })
        xScale=d3.scaleLinear()
                    .domain([minYear, maxYear + 1]) // +1 was added as one column of rectangles was outside of the x-axis
                    .range([padding, sizeOfSVG.width -padding])
        yScale= d3.scaleTime()
                    .domain([new Date(0, 0, 0, 0, 0, 0, 0), new Date(0, 12, 0, 0, 0, 0, 0)])
                    .range([padding, sizeOfSVG.height-padding])
    }

// draw bars
    drawBars= () =>{
        svg.selectAll('rect')
            .data(monthlyVariance)
            .enter()
                .append('rect')
                .attr('class','cell')
                .attr('fill',(d) =>{
                    variance=d.variance
                    if (variance <= -5) {
                        return 'rgb(69, 117, 180)';
                    } else if (variance <= -3.7) {
                        return 'rgb(116, 173, 209)';
                    } else if (variance <= -3) {
                        return 'rgb(171, 217, 233)';
                    } else if (variance < -1.6) {
                        return 'rgb(224, 243, 248)';
                    } else if (variance < -0.2) {
                        return 'rgb(255, 255, 191)';
                    } else if (variance < 0.7) {
                        return 'rgb(254, 224, 144)';
                    } else if (variance < 1.7) {
                        return 'rgb(253, 174, 97)';
                    } else if (variance < 2.5) {
                        return 'rgb(244, 109, 67)';
                    } else {
                        return 'Crimson';
                    }
                })
                .attr('data-year',(d) =>{
                    return d.year
                })
                .attr('data-month',(d) =>{
                    return d.month -1
                })
                .attr('data-temp',(d) =>{
                    return baseTemperature + d.variance
                })

                .attr('data-variance',(d) =>{
                    return  d.variance
                })
                    .attr('height', (sizeOfSVG.height -(2 * padding)) / 12)
                .attr('y', (d) =>{
                    return yScale(new Date(0, d.month -1, 0, 0, 0, 0, 0))
                })
                .attr('width',(d) =>{
                    let numberOfYears=maxYear - minYear
                    return (sizeOfSVG.width - (2 * padding)) / numberOfYears
                })
                .attr('x',(d) =>{
                    return xScale(d.year)
                })

                .on('mouseover', function(e) {
                    tooltip.transition()
                            .style('visibility','visible')
                    let monthNames=[
                        'January',
                        'February',
                        'March',
                        'April',
                        'May',
                        'June',
                        'July',
                        'August',
                        'September',
                        'October',
                        'November',
                        'December'
                    ]
                    
                    let year = d3.select(this).attr('data-year');
                    let month = d3.select(this).attr('data-month');
                    let temperature = d3.select(this).attr('data-temp')
                    let variance = d3.select(this).attr('data-variance')

                    temperature = parseFloat(temperature).toFixed(1);
                    variance = parseFloat(variance).toFixed(1);

                    let tooltipText = `<p>${year} ${monthNames[month]} </p><p>Temperature: ${temperature}</p><p>Variance: ${variance}</p>`;

                    tooltip.html(tooltipText)
                            .style('left', e.pageX + 5 + 'px')
                            .style('top', e.pageY + 5 + 'px')
                            .attr('data-year',year)
                })
                .on('mouseout',(d) => {
                    tooltip.transition()
                            .style('visibility','hidden')
                            .style('left',0)
                            .style('top',0)
                });
    }

// generate axes
let svg
    axes=() =>{
        let xAxis= d3.axisBottom(xScale)
                        .tickValues(d3.range(minYear, maxYear +1, 10))
                        .tickFormat(d3.format('d'))
        let yAxis= d3.axisLeft(yScale)
                        .tickFormat(d3.timeFormat('%B'))
        
        svg.append('g')
                .call(xAxis)
                .attr('id','x-axis')
                .attr('transform',`translate(0, ${sizeOfSVG.height - padding})`)

        svg.append('g')
            .call(yAxis)
            .attr('id','y-axis')
            .attr('transform',`translate(${padding},0)`)

        svg.append('text')
        .attr('class', 'axis-label')
        .attr('text-anchor', 'middle')
        .attr('x', sizeOfSVG.width / 2)
        .attr('y', sizeOfSVG.height - padding / 2.5)
        .text('Years');
        
        svg.append('text')
            .attr('class', 'axis-label')
            .attr('text-anchor', 'middle')
            .attr('x', -sizeOfSVG.height / 2)
            .attr('y', padding / 5)
            .attr('transform', 'rotate(-90)')
            .text('Months');
    }

// Define the legend data
const legendData = [
    { color: 'rgb(69, 117, 180)', value: '>= -5' },
    { color: 'rgb(116, 173, 209)', value: '>= -3.7' },
    { color: 'rgb(171, 217, 233)', value: '>= -3' },
    { color: 'rgb(224, 243, 248)', value: '>= -1.6' },
    { color: 'rgb(255, 255, 191)', value: '>= -0.2' },
    { color: 'rgb(254, 224, 144)', value: '>= 0.7' },
    { color: 'rgb(253, 174, 97)', value: '>= 1.7' },
    { color: 'rgb(244, 109, 67)', value: '>= 2.5' },
    { color: 'Crimson', value: '2.5+' }
];

// Define the dimensions of the legend
const legendWidth = 550;
const legendHeight = 70;
const rectWidth = legendWidth / legendData.length;

// Create the SVG container for the legend
const svgLegend = d3.select("div.legendStorage")
  .append("svg")
  .attr('id','legend')
  .attr("width", legendWidth)
  .attr("height", legendHeight);

// Add the "Variance level" text
svgLegend.append("text")
  .attr("x", legendWidth / 2)
  .attr("y", 20)
  .attr("dy", "0.35em")
  .style("text-anchor", "middle")
  .text("Variance level:");

// Create the rectangles and text elements for the legend
const legend = svgLegend.selectAll(".legend")
  .data(legendData)
  .enter()
  .append("g")
  .attr("class", "legend")
  .attr("transform", (d, i) => "translate(" + (i * rectWidth) + ",30)");

// Create the color rectangles
legend.append("rect")
  .attr("width", rectWidth)
  .attr("height", legendHeight - 25)
  .style("fill", d => d.color);

// Create the text labels
legend.append("text")
  .attr("x", rectWidth / 2)
  .attr("y", (legendHeight - 25) / 2)
  .attr("dy", "0.35em")
  .style("text-anchor", "middle")
  .text(d => d.value);
  

let baseTemperature
let monthlyVariance=[]
// fetching data
    let requestData=new XMLHttpRequest();
        const url="https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";
        requestData.open("GET",url,true)
        requestData.onload = ()=>{
            let dataset=JSON.parse(requestData.responseText)
            baseTemperature=dataset.baseTemperature
            monthlyVariance=dataset.monthlyVariance
            console.log(baseTemperature)
            console.log(monthlyVariance)
            description(baseTemperature)
            svg=canvas()
            scales()
            drawBars()
            axes()
        }
        requestData.send()