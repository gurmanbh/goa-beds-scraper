const io = require('indian-ocean')
const cheerio = require('cheerio')
const request = require('request')
const time = require('d3-time-format')
const parse = time.timeParse('%d/%m/%y %I:%M%p')
const format = time.timeFormat('%d/%m/%y %I:%M%p')
const _ = require('lodash');

const url = 'https://goaonline.gov.in/beds'
const data = io.readDataSync('data/combined-data.csv')

request(url, async function (err, response, body) {
	    if (!err && response.statusCode == 200){
	    	// get the body
	        var $ = cheerio.load(body);
	        // get the response
	        const children = $('#cphBody_gvBedsAvailable > tbody').children('tr')
	        const header = []
	        $(children[0]).children('th').each((i,d)=> header.push($(d).text().trim()))
	        let max
	        for (let index = 1; index < children.length; index++){
	        	
	        	const o = {}
	        	$(children[index]).children('td').each((i,d)=> {if (i>0){ o[header[i]] = $(d).text().trim()}})
	        	if (index===1){
	        		o[header[header.length-1]] = o[header[header.length-1]].toUpperCase().toUpperCase() 
	        		max = parse(o[header[header.length-1]])
	        	} else {
	        		o[header[header.length-1]] = o[header[header.length-1]].toUpperCase().toUpperCase() 
	        		let p = parse(o[header[header.length-1]])
	        		if (max < p){
	        			p = max
	        		}
	        	}


	        	if (o[header[1]]=='TOTAL'){
	        		o[header[header.length-1]] = format(max)
	        	}
	        	
	        	if (o[header[1]].length>1) data.push(o)
	        	
	        	data = _.uniqWith(data, _.isEqual);

	        }
	    	io.writeDataSync('data/combined-data.csv', data)
		} else {
			console.log('Page down')
		}
	})