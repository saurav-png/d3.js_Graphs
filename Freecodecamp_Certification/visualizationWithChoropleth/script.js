let USeducationURL="https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json"
let UScountyURL="https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json"

let countyData
let educationData

// draw the canvas to display svg

const sizeOfSVG={
    width: 1100,
    height: 600,
    padding: 60
};

const canvas=()=>{
    return d3.select('main')
                .append('svg')
                .attr('width',sizeOfSVG.width)
                .attr('height',sizeOfSVG.height)
}

// create map
const mapCreation=() => {


    // for color grading
    const bachelorHighLowVal = d3.extent(educationData.map(d=>d.bachelorsOrHigher))
     // console.log(bachelorHighLowVal);
    const low = bachelorHighLowVal[0];
    const high = bachelorHighLowVal[1];

    const colors = d3.scaleThreshold()
                        .domain(d3.range(low, high, (high-low)/9))
                        .range(d3.schemeGreens[9]);
                    
    // tooltip
    const tooltip = d3.select('body')
                        .append('div')
                        .attr('id','tooltip')
                        .style('opacity', 0)
   
    svg.selectAll('path')
        .data(countyData)
        .enter()
            .append('path')
            .attr('d', d3.geoPath())
            .attr('class','county')
            .attr('fill', (d)=>{
                let id_GEOJSON= d.id
                let eduMatch = educationData.filter((data)=>data.fips === id_GEOJSON);
                if(eduMatch[0]){
                return colors(eduMatch[0].bachelorsOrHigher)
                }
                return 0;
            })
            .attr('data-fips', (d)=> d.id)
            .attr('data-education',(d) =>{
                let id_GEOJSON= d.id
                let eduMatch=educationData.find((data) =>{      // same thing as color grading but using different function
                    return data.fips === id_GEOJSON
                })
                return gradPercentage= eduMatch.bachelorsOrHigher
            })
            
            
            .on('mouseover', function(e,d){

                let data_education = d3.select(this).attr('data-education')
                tooltip.style('opacity', 1)
                        .style('left', e.pageX + 5 + 'px')
                        .style('top', e.pageY + 5 + 'px')
                        .attr('data-education',data_education)
                        .html(()=>{
                        let eduMatch = educationData.filter(data=>data.fips==d.id);
                        if(eduMatch[0]){return `${eduMatch[0].area_name}, ${eduMatch[0].state}<br/> ${eduMatch[0].bachelorsOrHigher}%`}
                        })
            })
                
            .on('mouseout', (d)=>{
            tooltip.style('opacity', 0)
            .style('left', 0)
            .style('top', 0)
            })

            // create state border
            svg.append('path')
                .datum({ type: 'FeatureCollection', features: stateFeatures })
                .attr('class', 'states')
                .attr('d', d3.geoPath())

    // For color scaling
    // set color scale
        const xScale = d3.scaleLinear()
                            .domain([low, high])
                            .range([sizeOfSVG.padding, sizeOfSVG.width / 2 - sizeOfSVG.padding]);

    const xAxis = d3.axisBottom(xScale)
                    .tickSize(25)
                    .tickFormat(d => Math.round(d) + '%')
                    .tickValues(colors.domain());

    const legendSvg = d3.select('main')
                        .append('svg')
                        .attr('width', sizeOfSVG.width)
                        .attr('height', sizeOfSVG.padding * 2);
    
    // append colors
    legendSvg.append('g')
                .attr('id', 'x-axis')
                .attr('transform', 'translate(' + (sizeOfSVG.padding + sizeOfSVG.width / 3) + ',' + (sizeOfSVG.padding)* 1.3 + ')')
                .call(xAxis)
                .select('.domain')
                .remove();

    legendSvg.append('g')
            .attr('id', 'legend')
            .selectAll('rect')
            .data(colors.range().map(d => d))
            .enter()
            .append('rect')
            .attr('height', 15)
            .attr('width', (sizeOfSVG.width / 2 - sizeOfSVG.padding * 2) / 9)
            .attr('fill', d => d)
            .attr('x', (d, i) => (sizeOfSVG.padding + sizeOfSVG.width / 2.578) + i * ((sizeOfSVG.width / 2 - sizeOfSVG.padding * 2) / 9))
            .attr('y', sizeOfSVG.padding * 1.3);

    legendSvg.append('g')
                .attr('id', 'source')
                .append('text')
                .html('Source: <a href="https://www.ers.usda.gov/data-products/county-level-data-sets/county-level-data-sets-download-data/" target="_blank">USDA Economic Research Service</a>')
                .attr('x', sizeOfSVG.padding)
                .attr('y', sizeOfSVG.padding)
}

d3.json(UScountyURL).then(      //this method converts the JSON into js object automatically
    (data,error) =>{
        if(error){
            console.log(error)
        }else{
            countyData=topojson.feature(data, data.objects.counties).features // topojson's feature to convert it to geojson for map creation. `.features` is to just select the features value from the array
            stateFeatures = topojson.feature(data, data.objects.states).features
            // console.log(countyData)

            d3.json(USeducationURL).then(
                (data,error) =>{
                    if(error){
                        console.log(error)
                    }else{
                        educationData=data
                        // console.log(educationData)
                        svg=canvas()
                        mapCreation()
                    }
                }
            )
        }
    }
)



// create Heading & Description of the project
const title=d3.select('main')
                .append('div')
                .attr('id','title')
                .append('h1')
                .text("United States Educational Attainment")

const description=d3.select('main')
                    .append('div')
                    .attr('id','description')
                    .append('h3')
                    .text("Percentage of adults age 25 and older with a bachelor's degree or higher (2010-2014)")