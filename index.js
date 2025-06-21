import express from 'express';

const app = express();
const port = 3000;      
   
app.use(express.json());

let tmpArray = [];
let nextId = 1;

// add a new data
app.post('/data', (req, res) => {
    const {name ,price} = req.body;
    const newData = {
        id: nextId++,
        name: name,
        price: price
    };
    tmpArray.push(newData);
    res.status(201).send(newData);

});

// get all data
app.get('/data', (req, res) => {
   res.status(200).send(tmpArray);
});


//get particular data by id
app.get('/data/:id', (req, res) => {
   if(isNaN(req.params.id)) {
       return res.status(400).send({error: 'Invalid ID format'});   
}
   const data=tmpArray.find(item => item.id === parseInt(req.params.id)); 
   if(!data) {
       return res.status(404).send({error: 'Data not found'});
   }else {
       res.status(200).send(data);
   }
});

// update data by id
app.put('/data/:id', (req, res) => {
   if(isNaN(req.params.id)) {
       return res.status(400).send({error: 'Invalid ID format'});   
   }
   const dataIndex = tmpArray.findIndex(item => item.id === parseInt(req.params.id));
   if(dataIndex === -1) {
       return res.status(404).send({error: 'Data not found'});
   }
   const {name, price} = req.body;
   tmpArray[dataIndex] = {id: parseInt(req.params.id), name, price};
   res.status(200).send(tmpArray[dataIndex]);
});

// delete data by id
app.delete('/data/:id', (req, res) => {
   if(isNaN(req.params.id)) {
       return res.status(400).send({error: 'Invalid ID format'});   
   }
   const dataIndex = tmpArray.findIndex(item => item.id === parseInt(req.params.id));
   if(dataIndex === -1) {
       return res.status(404).send({error: 'Data not found'});
   }
   tmpArray.splice(dataIndex, 1);
   console.log(`Data with ID ${req.params.id} deleted successfully`);
   res.status(202).send('Data deleted successfully');
});

// handle 404 for undefined routes
app.use((req, res) => {
  res.status(404).send({error: 'Not Found'});
});

// handle errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({error: 'Internal Server Error'});
});

// start server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});