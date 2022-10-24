const express = require('express'); //REQUIRING (notes p3) express framework so it can be used
const axios = require('axios'); //REQURING axios so it can be used (notes p-5)
const bodyParser = require('body-parser')
const app = express(); //This allows the app to run express
const port = process.env.PORT || 3000 //Our website will run on this port

app.use(bodyParser.urlencoded({extended:true})); //HELPS US TO USE THE BODY PARSER

app.use(express.static("public")); //HELPS TO USE FILES IN THE PUBLIC FOLDER
app.set("view engine","ejs"); //USING THE EJS TEMPLATE



//The stuff inside this function will be rendered in the home route which is the default route when a site is loaded (notes p4)
app.get('/',(req,res)=>{
    res.render('index')
})


//THIS PAGE IS RENDERRED IF AN INCORRECT CITY IS PASSED IN THE INPUT
app.post('/error',(req,res)=>{
    res.redirect('/')
})

app.post('/city',(req,respond)=>{

    const cities = ["mumbai","jaipur","panaji","ahmedabad","kochi","bangalore","udaipur","varanasi","srinagar","shillong","darjeeling","hyderabad","chennai","chandigarh","pune"]
    city = ((req.body.city__name).toLowerCase()).trim();
    // city = "mumbai";

    if (cities.includes(city) == false){
        respond.render('error');
    }

    async function odsRequest(){
        const config = {
            method:'get',
            url:"https://api.openweathermap.org/geo/1.0/direct?q="+city+"&limit=5&appid=3115bec6b72386cd6eb2cb9ccef50041"
        }
        let res = await axios(config)
        lat = res.data[0].lat;
        lon = res.data[0].lon;

        //NOW WE USE THESE LATITUDES AND LONGITUDES TO GET THE WEATHER INFORMATION FOR THOSE CO-ORDINATES..
        async function weatherRequest(){
            const config = {
                method:'get',
                url:"https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon+"&units=metric&exclude=hourly,minutely&appid=3115bec6b72386cd6eb2cb9ccef50041"
            }
            let res = await axios(config)
            //DEFINING VARIABLES TO STORE DYNAMIC WEATHER DATA

            //TEMPERATURE
            const temp = Math.round(res.data.current.temp);
            //WEATHER STATUS ICON
            const icon = "http://openweathermap.org/img/wn/"+res.data.current.weather[0].icon+"@2x.png";
            //WEATHER DESCRIPTION
            const description = res.data.current.weather[0].description;

            //CALLING OUR OWN API WHICH FETCHES US THE TOURIST DATA
            async function dataReq(){
                const config = {
                    method:'get',
                    url: 'https://tourist-api-data.herokuapp.com/api/'+city
                }
                let res = await axios(config)
                //ASSIGNING VARIABLES TO THE DATA OF THE TOURIST WEBSITE SO IT CAN BE RENDERED
                const displayed_city = res.data.name;
                const maplink = res.data.maplink;
                const link = res.data.link;
                const description = res.data.description;
                const city_description = res.data.city_description;

                const place1_img = res.data.places.place1_img;
                const place1 = res.data.places.place1;
                const place2_img = res.data.places.place2_img;
                const place2 = res.data.places.place2;
                const place3_img = res.data.places.place3_img;
                const place3 = res.data.places.place3;

                const food1_img = res.data.foods.food1_img;
                const food1 = res.data.foods.food1;
                const food2_img = res.data.foods.food2_img;
                const food2 = res.data.foods.food2;


                respond.render('main',{
                    cityname:displayed_city,
                    weatherimg:icon,
                    weatherdesc:description,
                    temperature:temp,
                    maplink:maplink,
                    link:link,
                    city_description:city_description,

                    place1_img:place1_img,
                    place1:place1,
                    place2_img:place2_img,
                    place2:place2,
                    place3_img:place3_img,
                    place3:place3,

                    food1_img:food1_img,
                    food1:food1,
                    food2_img:food2_img,
                    food2:food2


                });
    
            }
            dataReq();
            
        }
        weatherRequest();

        
    }
    odsRequest();
});

//     async function makeRequest() { 
//         const config = { 
//         method: 'get', 
//         url: 'http://localhost:4000/api/'+city 
//         } 

//         let res = await axios(config) 
//         const lol = res.data.name;

//         respond.render('main',
//         {
//             cityname:lol
//         });
//     }
//     makeRequest(); 

// })

app.get('/contact',(req,res)=>{
    res.render('contact');
})

app.get('/about',(req,res)=>{
    res.render('about');
})


//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function(req, res){
    res.status(404).send('Invalid Route Bruh');
});


//THIS IS EXECUTED TO SHOW YOU THAT YOUR SERVER HAS BEEN RUNNING WITHOUT ANY ERRORS
app.listen(port,()=>{
    console.log("Your website is running on Port "+port)
})

