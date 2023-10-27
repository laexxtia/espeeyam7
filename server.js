const express = require('express');
const app = express();
const path = require('path');

app.use('/admin', express.static(path.join(__dirname, 'Admin UI')));
app.use('/login', express.static(path.join(__dirname, 'Login UI')));
app.use('/staff', express.static(path.join(__dirname, 'Staff UI')));
app.use('/config', express.static(path.join(__dirname, 'config')));

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
