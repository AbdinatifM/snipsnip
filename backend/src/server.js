import 'dotenv/config'
import app from './app.js'
import urlRoutes from './routes/urlRoutes.js'
import redirectRoutes from './routes/redirectRoutes.js'



app.use("/api/urls", urlRoutes);

app.use("/", redirectRoutes);

app.get('/', (req, res) => {
    res.send('snipsnip API is running.');
})




app.listen(4000, () => {
    console.log("Server running on: http://localhost:4000");
})