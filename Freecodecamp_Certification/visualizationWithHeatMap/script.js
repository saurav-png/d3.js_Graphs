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