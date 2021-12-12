type Break<L> = {
  fold: (x: L) => L,
  initLine: L,
}

type TableEntry = {
  slack: number,
  // table[i].penalty = cumulative penalties for all material earlier than
  // break i, if we force a break at break i
  penalty: number,
  // table[i].prevBreak = index of previous optimal break in order to
  // achieve optimal penalty, or -1 if this is the first break.
  prevBreak: number,
  line: string,
}

type BreakSpec<L> = {
  remap(x: number): number,
  slack(line: L): number,
  breaks: Break<L>[]
}

function buildTable(spec: BreakSpec<PlainLine>): TableEntry[] {
  const { remap, slack, breaks } = spec;
  const table: TableEntry[] = [];
  for (let i = 0; i < breaks.length; i++) {
    let line = breaks[i].initLine;
    let prevBreak = i - 1;
    const sl = slack(line);
    if (sl == Infinity) {
      console.error('already cant fit');
      table[i] = { slack: sl, penalty: remap(sl), prevBreak, line: line.join(',') }; // XXX consider smaller penalty, as this break can't be helped?
    }
    else {
      console.log(`finding best for break ${i}`);
      let best = { slack: sl, penalty: remap(sl), prevBreak, line: line.join(',') };
      while (prevBreak >= 0) {
        line = breaks[prevBreak].fold(line);
        prevBreak--;
        const sl = slack(line);
        const penaltyHere = remap(sl);
        const penaltyBefore = prevBreak == -1 ? 0 : table[prevBreak].penalty;
        const penalty = penaltyHere + penaltyBefore;
        const attempt = { slack: sl, penalty, prevBreak, line: line.join(',') };
        if (attempt.slack == Infinity) break;
        if (attempt.penalty < best.penalty) {
          best = attempt;
        }

      }
      console.log(JSON.stringify(best));
      table[i] = best;
    }
  }
  return table;
}

type PlainLine = number[];

function numsToBreaks(xs: number[]): Break<PlainLine>[] {
  return xs.map(x => ({
    fold: line => [x].concat(line),
    initLine: [x],
  }));
}

const plainSpec: BreakSpec<PlainLine> = {
  breaks: numsToBreaks([201, 102, 303, 204, 105, 306, 207, 108, 309, 110, 111, 112, 113, 114]),
  slack(line: number[]) {
    const len = line.reduce((a, b) => a + b, 0);
    const overfull = len - 820;
    if (overfull > 150) return Infinity;
    if (overfull < -1000) return -Infinity;
    return overfull;
  },
  remap(slack: number) {
    return slack * slack;
  }
}

buildTable(plainSpec);

// function optimalBreaks<L>(spec: BreakSpec<L>): boolean[] {
//   const { breaks } = spec;
//   const table = buildTable(spec);
//   const rv: boolean[] = breaks.map(x => false);

//   for (let i = table.length - 1; i != -1; i = table[i].prevBreak) {
//     rv[i] = true;
//   }

//   return rv;
// }
