const { handler } = require('./test-pdf.js');

const req = {
    method: 'POST',
    body: { html: '<h1>Test</h1>' }
};

const res = {
    setHeader: () => { },
    status: (code) => { console.log('Status:', code); return res; },
    send: (data) => { console.log('Success, buffer length:', data.length); process.exit(0); },
    json: (data) => { console.log('Error:', data); process.exit(1); }
};

handler(req, res).catch(err => {
    console.error(err);
    process.exit(1);
});
