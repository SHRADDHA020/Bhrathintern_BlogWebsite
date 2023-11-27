const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 30;

// Connect to MongoDB (replace 'your_mongodb_uri' with your actual MongoDB URI)
mongoose.connect('your_mongodb_uri', { useNewUrlParser: true, useUnifiedTopology: true });

// Create a Mongoose schema and model
const postSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Post = mongoose.model('Post', postSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/posts/:postId', (req, res) => {
  const postId = req.params.postId;
  Post.findById(postId, (err, foundPost) => {
    if (!err) {
      res.render('post', { post: foundPost });
    } else {
      console.log(err);
      res.redirect('/');
    }
  });
});

app.post('/compose', (req, res) => {
  const { title, content } = req.body;

  const newPost = new Post({
    title,
    content,
  });

  newPost.save((err) => {
    if (!err) {
      res.redirect('/');
    } else {
      console.log(err);
      res.redirect('/');
    }
  });
});

// Server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
