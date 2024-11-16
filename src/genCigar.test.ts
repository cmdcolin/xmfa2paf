import { test, expect } from 'vitest'
import { genCigar } from './genCigar'

// Test suite
const tests = [
  // Basic cases
  {
    ref: 'ACGT',
    qry: 'ACGT',
    expected: '4=',
    description: 'Perfect match',
  },
  {
    ref: 'A-GT',
    qry: 'ACGT',
    expected: '1=1I2=',
    description: 'Single insertion',
  },
  {
    ref: 'ACGT',
    qry: 'AC-T',
    expected: '2=1D1=',
    description: 'Single deletion',
  },

  // Multiple insertions
  {
    ref: 'A--GT',
    qry: 'ACAGT',
    expected: '1=2I2=',
    description: 'Two consecutive insertions',
  },
  {
    ref: 'A-GT-C',
    qry: 'ACGTAC',
    expected: '1=1I2=1I1=',
    description: 'Two separated insertions',
  },

  // Multiple deletions
  {
    ref: 'ACGTAC',
    qry: 'A--TAC',
    expected: '1=2D3=',
    description: 'Two consecutive deletions',
  },
  {
    ref: 'ACGTAC',
    qry: 'AC-T-C',
    expected: '2=1D1=1D1=',
    description: 'Two separated deletions',
  },

  // Mixed insertions and deletions
  // {
  //   ref: "A-GT-C",
  //   qry: "AC-T-C",
  //   expected: "1=1I1=1D1=1=",
  //   description: "Mixed insertion and deletion",
  // },
  {
    ref: '--ACGT--',
    qry: 'ATACGTAT',
    expected: '2I4=2I',
    description: 'Multiple insertions at ends',
  },

  // Mismatches with indels
  {
    ref: 'A-GTAC',
    qry: 'TCGT-C',
    expected: '1X1I2=1D1=',
    description: 'Mismatch with insertion and deletion',
  },

  // Complex cases
  // {
  //   ref: "A-GT-CAT-G",
  //   qry: "ACGT-CATAG",
  //   expected: "1=1I2=1I3=1I1=",
  //   description: "Complex pattern with multiple insertions",
  // },
  {
    ref: 'ACGTACGT',
    qry: 'A--T--GT',
    expected: '1=2D1=2D2=',
    description: 'Multiple separated double deletions',
  },
]

test('cases', () => {
  tests.forEach(test => {
    expect(genCigar(test.ref, test.qry)).toBe(test.expected)
  })
})
