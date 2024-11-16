import fs from 'fs'
import { xmfa2paf } from './convert'

const data = fs.readFileSync(process.argv[2], 'utf8')
console.log(xmfa2paf(data.split('\n').filter(f => !!f)).lcbs[0])
