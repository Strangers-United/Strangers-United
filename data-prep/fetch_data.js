const p = require('phin');
const Gun = require('gun');

const gun = Gun();

(async function(){
    const res = await p({
        'url': 'https://ipfs.io/ipfs/QmTn16U9YtbMeGkYWtRFZ5XrNA7tiKQYyRSgX4Es3TWouB',
        'parse': 'json'
    })
    
    return res.body;
})().then((data) => {

    let name = data.name.split('.json')[0]
    let sips = data.sips
    let date = data.dateCreated;
    let provenance = data.provenance;
    let version = data.version;
    let reference = data.metadata.reference;

    let all = [name, sips, date, provenance, version, reference];
    console.table(all);

    gun.get(name).get('sips').put(JSON.stringify(sips));
    gun.get(name).get('date').put(date);
    gun.get(name).get('source').put(provenance);
    gun.get(name).get('version').put(version);
    gun.get(name).get('reference').put(reference)

})
