const app = require('../index');
const syncDB = require('./sync-db');

// promise라서 then 사용 가능
syncDB().then(_=> {
    console.log('Sync database!');
    app.listen(3000, () => {
        console.log('Server is running on 3000 port');
    })
})
