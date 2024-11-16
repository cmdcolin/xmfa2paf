export function genCigar(ref: string, qry: string) {
  if (ref.length !== qry.length) {
    throw new Error('unequal length')
  }

  const cigar = [] as [number, string][]

  for (let i = 0; i < ref.length; i++) {
    const r = ref[i]
    const q = qry[i]

    if (r === '-' && q === '-') {
      throw new Error('both gaps')
    }

    let op: string
    if (r === q) {
      op = '='
    } else if (r === '-') {
      op = 'D'
    } else if (q === '-') {
      op = 'I'
    } else {
      op = 'X'
    }

    if (cigar.length > 0 && cigar[cigar.length - 1][1] === op) {
      cigar[cigar.length - 1]![0]! += 1
    } else {
      cigar.push([1, op])
    }
  }

  return cigar.map(x => `${x[0]}${x[1]}`).join('')
}
