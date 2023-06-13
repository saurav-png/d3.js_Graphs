let USeducationURL="https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json"
let UScountyURL="https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json"

let countyData
let educationData

// draw the canvas to display svg

const sizeOfSVG={
    width: 1100,
    height: 600
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

}

d3.json(UScountyURL).then(      //this method converts the JSON into js object automatically
    (data,error) =>{
        if(error){
            console.log(error)
        }else{
            countyData=topojson.feature(data, data.objects.counties).features // topojson's feature to convert it to geojson for map creation. `.features` is to just select the features value from the array
            console.log(countyData)

            d3.json(USeducationURL).then(
                (data,error) =>{
                    if(error){
                        console.log(error)
                    }else{
                        educationData=data
                        console.log(educationData)
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