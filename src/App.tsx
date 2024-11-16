import { useRef, useState } from 'react'
import { saveAs } from 'file-saver'
import { xmfa2paf } from './xmfa2paf'
import { parseSmallFasta } from './parseSmallFasta'

function App() {
  const xmfa = useRef<HTMLInputElement>(null)
  const f1 = useRef<HTMLInputElement>(null)
  const f2 = useRef<HTMLInputElement>(null)
  const [val, setVal] = useState('')
  return (
    <div>
      <h1>XMFA to PAF</h1>
      <div>
        Converts XMFA from progressiveMauve for example to PAF. Only works with
        two sequences currently and does NOT "work" with multi-FASTA e.g. where
        the sequences you align contains multiple chromosomes (Mauve handles
        this by concatenating the multi-FASTA chromosomes into a single long
        sequence, and we can't really split this back very well)
      </div>
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
        <input type="submit" value="Submit" />
      </form>
      <div style={{ marginTop: 100 }}>
        {!val ? (
          <div style={{ color: '#ccc' }}>
            Will be populated once you submit form...
          </div>
        ) : null}
        <div>
          <button
            disabled={!val}
            onClick={() => {
              saveAs(
                new Blob([val], {
                  type: 'text/plain;charset=utf-8',
                }),
                'out.paf',
              )
            }}
          >
            Save file...
          </button>
        </div>
        <textarea disabled={!val} value={val} readOnly rows={100} cols={150} />
      </div>
    </div>
  )
}

export default App
