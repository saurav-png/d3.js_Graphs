let USeducationURL="https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json"
let UScountyURL="https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json"

let countyData
let educationData

// draw the canvas to display svg

const sizeOfSVG={
    width: 1200,
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