import fs from "fs";
interface Entry {
  seq: string;
  idx: number;
  strand: number;
  start: number;
  end: number;
}

function xmfa2paf(lines: string[]) {
  let seqCount = 0;
  let lcb = [] as Entry[];
  let currentSeq = undefined as Entry | undefined;
  const lcbs = [] as Entry[][];
  const header = [] as string[];
  for (const line of lines) {
    const c = line.charAt(0);
    if (c === "=") {
      if (currentSeq && currentSeq.start !== 0 && currentSeq.end !== 0) {
        lcb.push(currentSeq);
        if (Object.keys(currentSeq).length !== 0) {
          lcbs.push(lcb);
        }
      }
      lcb = [];
      currentSeq = undefined;
    } else if (c === "#") {
      if (line.includes("#Sequence") && line.includes("Format\t")) {
        seqCount += 1;
      }
      if (line.startsWith("#Sequence") && line.includes("File\t")) {
        header.push(line.split("\t")[1]!);
      }
    } else if (c === ">") {
      // push any previous sequences we have
      if (currentSeq && Object.keys(currentSeq).length !== 0) {
        if (currentSeq.start !== 0 && currentSeq.end !== 0) {
          lcb.push(currentSeq);
        }
      }
      const linedata0 = line.split(" ");
      const linedata1 = linedata0[1]!.split(":");
      const linedata2 = linedata1[1]!.split("-");
      // Store metadata about the current block of the lcb
      currentSeq = {
        start: +linedata2[0]!,
        end: +linedata2[1]!,
        strand: linedata0[2] === "-" ? -1 : 1,
        idx: +linedata1[0]!,
        seq: "",
      };
      // Reset just in case
    } else if (currentSeq) {
      currentSeq.seq += line.replace(/\n/g, "");
    }
  }

  return {
    lcbs: lcbs.map((lcb) => {
      const r1 = lcb[0].seq;
      const r2 = lcb[1].seq;
      genCigar;
    }),
    header,
  };
}

const data = fs.readFileSync(process.argv[2], "utf8");
console.log(xmfa2paf(data.split("\n").filter((f) => !!f)).lcbs[0]);
