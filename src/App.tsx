import { useRef, useState } from 'react'
import { xmfa2paf } from './xmfa2paf'
import { parseSmallFasta } from './parseSmallFasta'

function App() {
  const xmfa = useRef<HTMLInputElement>(null)
  const f1 = useRef<HTMLInputElement>(null)
  const f2 = useRef<HTMLInputElement>(null)
  const [val, setVal] = useState('')
  return (
    <div>
      <form
        onSubmit={event => {
          event.preventDefault()
          ;(async () => {
            try {
              const r0 = xmfa.current?.files?.[0]
              const r1 = f1.current?.files?.[0]
              const r2 = f2.current?.files?.[0]
              if (r0 && r1 && r2) {
                const xmfaText = await r0.text()
                const fasta1Text = parseSmallFasta(await r1.text())
                const fasta2Text = parseSmallFasta(await r2.text())
                let result = ''

                const { lcbs } = xmfa2paf(xmfaText.split('\n'), [
                  fasta1Text,
                  fasta2Text,
                ])
                for (const row of lcbs) {
                  result +=
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
                    ].join('\t') + '\n'
                }
                setVal(result)
              } else {
                alert('please supply all of xmfa, fasta 1, and fasta 2')
              }
            } catch (e) {
              alert('error: ' + e)
            }
          })()
        }}
      >
        <div>XMFA to PAF</div>
        <div>
          <label htmlFor="xmfa">XMFA: </label>
          <input ref={xmfa} type="file" id="xmfa" />
        </div>
        <div>
          <label htmlFor="f1">FASTA 1: </label>
          <input ref={f1} type="file" id="f1" />
        </div>
        <div>
          <label htmlFor="f2">FASTA 2: </label>
          <input ref={f2} type="file" id="f2" />
        </div>
        <input type="submit">Submit</input>
      </form>
      <div>{val ? <textarea value={val} readOnly /> : null}</div>
    </div>
  )
}

export default App
