// function buildGauge(wfreq){

//   // pie chart converted to gauge chart
//   let traceGauge = {
//     type: 'pie',
//     showlegend: false,
//     hole: 0.4,
//     rotation: 90,
//     values: [180/9, 180/9, 180/9, 180/9, 180/9, 180/9, 180/9, 180/9, 180/9, 180],
//     text: ['0-1','1-2','2-3','3-4','4-5','5-6','6-7','7-8','8-9'],
//     direction: 'clockwise',
//     textinfo: 'text',
//     textposition: 'inside',
//     marker: {
//       colors: ['#F8F3EC','#F4F1E5','#E9E6CA','#E2E4B1','#D5E49D','#B7CC92','#8CBF88','#8ABB8F','#85B48A','white'],
//       labels: ['0-1','1-2','2-3','3-4','4-5','5-6','6-7','7-8','8-9',''],
//       hoverinfo: "label"
//     },
//     hoverinfo: "skip"
//   }

//   // the dot where the needle "originates"
//   let dot = {
//     type: 'scatter',
//     x: [0],
//     y: [0],
//     marker: {
//       size: 14,
//       color:'#850000'
//     },
//     showlegend: false,
//     hoverinfo: "skip"
//   }

//   // the needle (triangular version)

//     // add weights to the degrees to correct needle
//   let weight = 0;
//   if (wfreq == 2 || wfreq == 3){
//     weight = 3;
//   } else if (wfreq == 4){
//     weight = 1;
//   } else if (wfreq == 5){
//     weight = -.5;
//   } else if (wfreq == 6){
//     weight = -2;
//   } else if (wfreq == 7){
//     weight = -3;
//   }

//   let degrees = 180-(20 * wfreq + weight); // 20 degrees for each of the 9 gauge sections
//   let radius = .5;
//   let radians = degrees * Math.PI / 180;
//   let aX = 0.025 * Math.cos((radians) * Math.PI / 180);
//   let aY = 0.025 * Math.sin((radians) * Math.PI / 180);
//   let bX = -0.025 * Math.cos((radians) * Math.PI / 180);
//   let bY = -0.025 * Math.sin((radians) * Math.PI / 180);
//   let cX = radius * Math.cos(radians);
//   let cY = radius * Math.sin(radians);

//   // draw the triangle
//   let path = 'M ' + aX + ' ' + aY +
//             ' L ' + bX + ' ' + bY +
//             ' L ' + cX + ' ' + cY +
//             ' Z';

//   let gaugeLayout = {
//     title: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week",
//     shapes:[{
//         type: 'path',
//         path: path,
//         fillcolor: '#850000',
//         line: {
//           color: '#850000'
//         }
//       }],
//     xaxis: {zeroline:false, 
//             showticklabels:false,
//             showgrid: false, 
//             range: [-1, 1],
//             fixedrange: true
//           },
//     yaxis: {zeroline:false, 
//             showticklabels:false,
//             showgrid: false, 
//             range: [-1, 1],
//             fixedrange: true
//           }
//   };

//   Plotly.newPlot("gauge", [traceGauge, dot], gaugeLayout);
// }

// async function buildMetadata(sample) {

//   // Use `d3.json` to fetch the metadata for a sample
//   const url = "/metadata/" + sample;
//   let data = await d3.json(url);

//   // Use d3 to select the panel with id of `#sample-metadata`
//   let panel = d3.select('#sample-metadata');

//   // Use `.html("") to clear any existing metadata
//   panel.html("");

//   // Use `Object.entries` to add each key and value pair to the panel
//   let data_pairs = Object.entries(data);
//   data_pairs.forEach(pair => panel.append("text").text(pair[0] + ": " + pair[1] + "\n").append("br"));

//   // BONUS: Build the Gauge Chart
//   buildGauge(data.WFREQ);
  
// }

// async function buildCharts(sample) {

//   // Use `d3.json` to fetch the sample data for the plots
//   const url = "/samples/" + sample;
//   let data = await d3.json(url);

//   // Build a Pie Chart using top 10 values for sample_values, 
//   // otu_ids, and labels (10 each).
//   let sample_values = data.sample_values;
//   let otu_ids = data.otu_ids;
//   let otu_labels = data.otu_labels;

//   let pie_data = {
//     values: sample_values.slice(0,10),
//     labels: otu_ids.slice(0,10),
//     type: 'pie',
//     hovertext: otu_labels.slice(0,10)
//   }

//   let pie_layout = {
//     title: "Top 10 OTU_ID Counts"
//   }

//   Plotly.newPlot("pie", [pie_data], pie_layout);
  
//   // Build a Bubble Chart using the sample data
//   let bubble_data = {
//     type:"scatter",
//     x: otu_ids,
//     y: sample_values,
//     mode: 'markers',
//     marker: {
//               color: otu_ids, 
//               size: sample_values.map(d => d)
//             },
//     hovertext: otu_labels
//   }

//   let bubble_layout = {
//     title: "OTU_IDs in Sample",
//     xaxis: {
//       title: {
//         text: 'OTU ID',
//       }
//     }
//   };

//   Plotly.newPlot("bubble", [bubble_data], bubble_layout);

// }

// function init() {
//   // Grab a reference to the dropdown select element
//   let selector = d3.select("#selDataset");

//   // Use the list of sample names to populate the select options
//   d3.json("/names").then((sampleNames) => {
//     sampleNames.forEach((sample) => {
//       selector
//         .append("option")
//         .text(sample)
//         .property("value", sample);
//     });

//     // Use the first sample from the list to build the initial plots
//     const firstSample = sampleNames[0];
//     buildCharts(firstSample);
//     buildMetadata(firstSample);
//   });
// }

// function optionChanged(newSample) {
//   // Fetch new data each time a new sample is selected
//   buildCharts(newSample);
//   buildMetadata(newSample);
// }

// // Initialize the dashboard
// init();

// Creating function for Data plotting (Bar, gauge, bubble)
function getPlot(id) {
    // getting data from the json file
    d3.json("samples.json").then((data)=> {
        console.log(data)
  
        var wfreq = data.metadata.map(d => d.wfreq)
        console.log(`Washing Freq: ${wfreq}`)
        
        // filter sample values by id 
        var samples = data.samples.filter(s => s.id.toString() === id)[0];
        
        console.log(samples);
  
        // Getting the top 10 
        var samplevalues = samples.sample_values.slice(0, 10).reverse();
  
        // get only top 10 otu ids for the plot OTU and reversing it. 
        var OTU_top = (samples.otu_ids.slice(0, 10)).reverse();
        
        // get the otu id's to the desired form for the plot
        var OTU_id = OTU_top.map(d => "OTU " + d)
  
      //   console.log(`OTU IDS: ${OTU_id}`)
  
  
        // get the top 10 labels for the plot
        var labels = samples.otu_labels.slice(0, 10);
  
      //   console.log(`Sample Values: ${samplevalues}`)
      //   console.log(`Id Values: ${OTU_top}`)
        // create trace variable for the plot
        var trace = {
            x: samplevalues,
            y: OTU_id,
            text: labels,
            marker: {
              color: 'rgb(142,124,195)'},
            type:"bar",
            orientation: "h",
        };
  
        // create data variable
        var data = [trace];
  
        // create layout variable to set plots layout
        var layout = {
            title: "Top 10 OTU",
            yaxis:{
                tickmode:"linear",
            },
            margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 30
            }
        };
  
        // create the bar plot
        Plotly.newPlot("bar", data, layout);
  
        //console.log(`ID: ${samples.otu_ids}`)
      
        // The bubble chart
        var trace1 = {
            x: samples.otu_ids,
            y: samples.sample_values,
            mode: "markers",
            marker: {
                size: samples.sample_values,
                color: samples.otu_ids
            },
            text: samples.otu_labels
  
        };
  
        // set the layout for the bubble plot
        var layout_b = {
            xaxis:{title: "OTU ID"},
            height: 600,
            width: 1000
        };
  
        // creating data variable 
        var data1 = [trace1];
  
        // create the bubble plot
        Plotly.newPlot("bubble", data1, layout_b); 
  
        // The guage chart
  
        var data_g = [
          {
          domain: { x: [0, 1], y: [0, 1] },
          value: parseFloat(wfreq),
          title: { text: `Weekly Washing Frequency ` },
          type: "indicator",
          
          mode: "gauge+number",
          gauge: { axis: { range: [null, 9] },
                   steps: [
                    { range: [0, 2], color: "yellow" },
                    { range: [2, 4], color: "cyan" },
                    { range: [4, 6], color: "teal" },
                    { range: [6, 8], color: "lime" },
                    { range: [8, 9], color: "green" },
                  ]}
              
          }
        ];
        var layout_g = { 
            width: 700, 
            height: 600, 
            margin: { t: 20, b: 40, l:100, r:100 } 
          };
        Plotly.newPlot("gauge", data_g, layout_g);
      });
  }  
// create the function to get the necessary data
function getInfo(id) {
    // read the json file to get data
    d3.json("samples.json").then((data)=> {
        
        // get the metadata info for the demographic panel
        var metadata = data.metadata;

        console.log(metadata)

        // filter meta data info by id
        var result = metadata.filter(meta => meta.id.toString() === id)[0];

        // select demographic panel to put data
        var demographicInfo = d3.select("#sample-metadata");
        
        // empty the demographic info panel each time before getting new id info
        demographicInfo.html("");

        // grab the necessary demographic data data for the id and append the info to the panel
        Object.entries(result).forEach((key) => {   
                demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
        });
    });
}

// create the function for the change event
function optionChanged(id) {
    getPlot(id);
    getInfo(id);
}

// create the function for the initial data rendering
function init() {
    // select dropdown menu 
    var dropdown = d3.select("#selDataset");

    // read the data 
    d3.json("samples.json").then((data)=> {
        console.log(data)

        // get the id data to the dropdwown menu
        data.names.forEach(function(name) {
            dropdown.append("option").text(name).property("value");
        });

        // call the functions to display the data and the plots to the page
        getPlot(data.names[0]);
        getInfo(data.names[0]);
    });
}

init();