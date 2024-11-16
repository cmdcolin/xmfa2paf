import fs from 'fs'
import yargs from 'yargs/yargs'
import { hideBin } from 'yargs/helpers'
// locals
import { parseSmallFasta } from './parseSmallFasta'
import { xmfa2paf } from './xmfa2paf'

const ret = yargs(hideBin(process.argv))
  .options({
    xmfa: {
      type: 'string',
      demandOption: true,
      description: 'xmfa file outputted from progressivemauve/mauve',
    },
    fasta1: {
      type: 'string',
      demandOption: true,
      description: 'first fasta that was aligned',
    },
    fasta2: {
      type: 'string',
      demandOption: true,
      description: 'second fasta that was aligned',
    },
  })
  .parseSync()

const data = fs.readFileSync(ret.xmfa, 'utf8')
const f1 = parseSmallFasta(fs.readFileSync(ret.fasta1, 'utf8'))
const f2 = parseSmallFasta(fs.readFileSync(ret.fasta2, 'utf8'))
const { lcbs } = xmfa2paf(data.split('\n'), [f1, f2])
for (const row of lcbs) {
  console.log(
    [
      row.qname,
      row.qlen,
      row.qstart,
      row.qend,
      row.strand,
      row.tname,
      row.tlen,
      row.tstart,
      row.tend,
      1,
      1,
      1,
      `cg:Z:${row.CIGAR}`,
    ].join('\t'),
  )
}
