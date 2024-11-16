import { genCigar } from './genCigar'
import { FastaSequence } from './parseSmallFasta'
import { doesIntersect2 } from './range'

export interface Entry {
  seq: string
  idx: number
  strand: number
  start: number
  end: number
}

export function xmfa2paf(lines: string[], fastas: FastaSequence[][]) {
  let seqCount = 0
  let lcb = [] as Entry[]
  let currentSeq = undefined as Entry | undefined
  const lcbs = [] as Entry[][]
  const header = [] as string[]
  for (const line of lines) {
    const c = line.charAt(0)
    if (c === '=') {
      if (currentSeq && currentSeq.start !== 0 && currentSeq.end !== 0) {
        lcb.push(currentSeq)
        if (Object.keys(currentSeq).length !== 0) {
          lcbs.push(lcb)
        }
      }
      lcb = []
      currentSeq = undefined
    } else if (c === '#') {
      if (line.includes('#Sequence') && line.includes('Format\t')) {
        seqCount += 1
      }
      if (line.startsWith('#Sequence') && line.includes('File\t')) {
        header.push(line.split('\t')[1]!)
      }
    } else if (c === '>') {
      // push any previous sequences we have
      if (currentSeq && Object.keys(currentSeq).length !== 0) {
        if (currentSeq.start !== 0 && currentSeq.end !== 0) {
          lcb.push(currentSeq)
        }
      }
      const linedata0 = line.split(' ')
      const linedata1 = linedata0[1]!.split(':')
      const linedata2 = linedata1[1]!.split('-')
      // Store metadata about the current block of the lcb
      currentSeq = {
        start: +linedata2[0]!,
        end: +linedata2[1]!,
        strand: linedata0[2] === '-' ? -1 : 1,
        idx: +linedata1[0]!,
        seq: '',
      }
      // Reset just in case
    } else if (currentSeq) {
      currentSeq.seq += line.replace(/\n/g, '')
    }
  }

  return {
    lcbs: lcbs
      .map(lcb => {
        const q = lcb[0]
        const t = lcb[1]
        const r1 = findRefName(q.start, q.end, fastas[q.idx])
        const r2 = findRefName(q.start, q.end, fastas[t.idx])
        return r1 && r2
          ? {
              qname: r1.refName,
              qstart: r1.start,
              qend: r1.end,
              strand: lcb[0].strand !== lcb[1].strand ? -1 : 1,
              tname: r2.refName,
              tstart: r2.start,
              end: r2.end,
              CIGAR: genCigar(q.seq, t.seq),
            }
          : undefined
      })
      .filter(f => !!f),
    header,
  }
}

function findRefName(start: number, end: number, entries: FastaSequence[]) {
  for (let i = 0; i < entries.length; i++) {
    if (doesIntersect2(start, end, entries[i].start, entries[i].end)) {
      return {
        refName: entries[i].id,
        start: start - entries[i].start,
        end: end - entries[i].start,
      }
    }
  }
  return undefined
}
