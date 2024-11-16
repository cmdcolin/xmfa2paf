export interface FastaSequence {
  start: number
  end: number
  sequence: string
  description: string
  id: string
}

export function parseSmallFasta(text: string) {
  let cumulativeLen = 0
  return text
    .split('>')
    .filter(t => /\S/.test(t))
    .map(entryText => {
      const [defLine, ...seqLines] = entryText.split('\n')
      const [id, ...description] = defLine!.split(' ')
      const sequence = seqLines.join('').replace(/\s/g, '')
      const start = cumulativeLen
      const end = cumulativeLen + sequence.length
      cumulativeLen += sequence.length
      return {
        id,
        description: description.join(' '),
        sequence,
        start,
        end,
      } as const
    })
}
