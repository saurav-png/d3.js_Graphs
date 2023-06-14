const gameDataURL='https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json'

let gameData

// create Heading & Description of the project
const title=d3.select('main')
                .append('div')
                .attr('id','title')
                .append('h1')
                .text("Video Game Sales")

const description=d3.select('main')
                    .append('div')
                    .attr('id','description')
                    .append('h4')
                    .text("Top 100 Most Sold Video Games Grouped by Platform")


// create canvas
const sizeOfCanvas={
    width: 1000,
    height: 600,
};

const canvas=d3.select('main')
                .append('svg')
                .attr('width',sizeOfCanvas.width)
                .attr('height',sizeOfCanvas.height)

treeMapCreate=() =>{

    let ladder=d3.hierarchy(gameData, (node) => node.children)
                 .sum((node) => node.value)
                 .sort((node1, node2) => node2.value - node1.value)
    
    let makeTreeMap = d3.treemap()
                        .size([sizeOfCanvas.width,sizeOfCanvas.height])


    makeTreeMap(ladder)

    gameTiles=ladder.leaves()
    console.log(gameTiles)


    // tooltip section

    const tooltip = d3.select('body')
                        .append('div')
                        .attr('id','tooltip')
                        .style('opacity', 0)


    // define color scale
    let categories = gameTiles.map((d) => {
        return d.data.category;
    });
    
    // Get the unique categories
    let uniqueCategories = [...new Set(categories)];

    let colorScale = d3.scaleOrdinal()
                        .domain(uniqueCategories)
                        .range(["#1f77b4",  //no schemeCategory20 so created our own
                                "#aec7e8",
                                "#ff7f0e",
                                "#ffbb78",
                                "#2ca02c",
                                "#98df8a",
                                "#d62728",
                                "#ff9896",
                                "#9467bd",
                                "#c5b0d5",
                                "#8c564b",
                                "#c49c94",
                                "#e377c2",
                                "#f7b6d2",
                                "#7f7f7f",
                                "#c7c7c7",
                                "#bcbd22",
                                "#dbdb8d",
                                "#17becf",
                                "#9edae5"])


    let rects = canvas.selectAll('g')
                        .data(gameTiles)
                        .enter()
                            .append('g')
    rects.append('rect')
            .attr('class','tile')
            .attr('fill',(d) =>{
                return colorScale(d.data.category)
            })
            .attr('x', (d) => d.x0)
            .attr('y', (d) => d.y0)
            .attr('width', (d) => d.x1 - d.x0)
            .attr('height', (d) => d.y1 - d.y0)
            .attr('data-name', (d) => d.data.name)
            .attr('data-category', (d) => d.data.category)
            .attr('data-value', (d) => d.data.value)
            .attr('stroke', 'white')  // Add the stroke attribute
            .attr('stroke-width', '1px')
            
            // tooltip section
            .on('mousemove', (e,d)=> {

                let data_name = d.data.name;
                let data_category = d.data.category;
                let data_value = d.data.value;
                
                tooltip.style('opacity', 1)
                        .style('left', e.pageX + 10 + 'px')
                        .style('top', e.pageY + 15 + 'px')
                        .html(`Name: ${data_name}<br>Category: ${data_category}<br/>Value: ${data_value}`)
                        .attr('data-value',data_value)
            })
            
            
            .on('mouseout', (d)=>{
                tooltip.style('opacity', 0)
                .style('left', 0)
                .style('top', 0)
                })

                

    rects.append('text')
        .attr('class', 'tile-text')
        .attr('x', (d) => d.x0 + 5)
        .attr('y', (d) => d.y0 + 10)
        .attr('font-size', 11)
        .text((d) => d.data.name)
        

// for legend
    let svgLegend = d3.select('main')
                        .append('div')
                        .attr('class','legendStorage')
                        .append('svg')
                        .attr('width', 500)
                        .attr('height', 400)

    // Create the legend container
    let legend = svgLegend.append("g")
                            .attr("id", "legend")
                            .attr("transform", `translate(200, 30)`)
    
    // Create the legend rectangles and console names
    let legendRectSize = 18;
    let legendSpacing = 4;

    // Split the categories into two arrays for the two columns
    let column1Categories = uniqueCategories.slice(0, 9);
    let column2Categories = uniqueCategories.slice(9);
    
    let column1LegendItems = legend.selectAll(".legend-item-column1")
                                    .data(column1Categories)
                                    .enter()
                                        .append("g")
                                        .attr("class", "legend-item-column1")
                                        .attr("transform", (d, i) => {
                                        let height = legendRectSize + legendSpacing;
                                        let horiz = 0;
                                        let verti = i * height;
                                        return `translate(${horiz} , ${verti})`;
                                        })

    column1LegendItems.append("rect")
                        .attr("class", "legend-item")
                        .attr("width", legendRectSize)
                        .attr("height", legendRectSize)
                        .style("fill", colorScale);

    column1LegendItems.append("text")
                        .attr("x", legendRectSize + legendSpacing)
                        .attr("y", legendRectSize - legendSpacing)
                        .text((d) => { return d; });

    let column2LegendItems = legend.selectAll(".legend-item-column2")
                                    .data(column2Categories)
                                    .enter()
                                        .append("g")
                                        .attr("class", "legend-item-column2")
                                        .attr("transform", (d, i) => {
                                            let height = legendRectSize + legendSpacing;
                                            let horiz = 100;
                                            let verti = i * height
                                            return `translate(${horiz} , ${verti})`
                                        })
    
    column2LegendItems.append("rect")
                        .attr("class", "legend-item")
                        .attr("width", legendRectSize)
                        .attr("height", legendRectSize)
                        .style("fill", colorScale);

    column2LegendItems.append("text")
                        .attr("x", legendRectSize + legendSpacing)
                        .attr("y", legendRectSize - legendSpacing)
                        .text((d) => d);

}


// fetching data
d3.json(gameDataURL).then(
    (data,error) =>{
        if(error){
            console.log(error)
        }else{
            gameData=data
            console.log(gameData)
            treeMapCreate()
        }
    }
)