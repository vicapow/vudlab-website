var tj = require('togeojson'),
    fs = require('fs'),
    // node doesn't have xml parsing or a dom. use jsdom
    jsdom = require('jsdom').jsdom;

var kml = jsdom(fs.readFileSync('data/bart.kml', 'utf8'));

var converted = tj.kml(kml);

console.log('hello')

fs.writeFileSync('bartRoutes.json', JSON.stringify(converted));

// var converted_with_styles = tj.kml(kml, { styles: true });