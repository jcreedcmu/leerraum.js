import { LinkedList, Node } from './linkedlist';

export const infinity = 10000;

/**
 * @preserve Knuth and Plass line breaking algorithm in JavaScript
 *
 * Licensed under the new BSD License.
 * Copyright 2009-2010, Bram Stein
 * All rights reserved.
 */

type Demerits = {

}

type Candidate = {
  active?: Breakpoint,
  demerits: Demerits,
  ratio?: number,
}

type Breakpoint = {
  position: any,
  demerits: number,
  ratio: number,
  line: any,
  fitnessClass: any,
  totals: any,
  previous: any,
}

function remove<T>(xs: T[], x: T): T[] {
  const i = xs.findIndex(y => y === x);
  if (i == -1) {
    throw `couldn't find it`;
  }
  return xs.splice(i);
}

function findNext<T>(xs: T[], x: T): T | null {
  const i = xs.findIndex(y => y === x);
  if (i == -1 || i == xs.length - 1) {
    return null;
  }
  return xs[i + 1];
}

function insertBefore<T>(xs: T[], x: T, newx: T): void {
  const i = xs.findIndex(y => y === x);
  const j = i == -1 ? 0 : i;
  xs.splice(j, 0, newx);
}

function first<T>(xs: T[]): T | null {
  return xs.length > 0 ? xs[0] : null;
}

export function linebreak(nodes, lines, settings) {
  var options = {
    demerits: {
      line: settings && settings.demerits && settings.demerits.line || 10,
      flagged: settings && settings.demerits && settings.demerits.flagged || 100,
      fitness: settings && settings.demerits && settings.demerits.fitness || 3000
    },
    tolerance: settings && settings.tolerance || 2
  },
    activeNodes: Breakpoint[] = [],
    sum = {
      width: 0,
      stretch: 0,
      shrink: 0
    },
    lineLengths = lines,
    breaks: any = [],
    tmp: Breakpoint = {
      fitnessClass: null,
      line: null,
      position: null,
      previous: null,
      ratio: 0,
      totals: null,
      demerits: Infinity
    };

  function breakpoint(position, demerits: number, ratio, line, fitnessClass, totals, previous): Breakpoint {
    return {
      position: position,
      demerits: demerits,
      ratio: ratio,
      line: line,
      fitnessClass: fitnessClass,
      totals: totals || {
        width: 0,
        stretch: 0,
        shrink: 0
      },
      previous: previous
    };
  }

  function computeCost(start, end, active, currentLine) {
    var width = sum.width - active.totals.width,
      stretch = 0,
      shrink = 0,
      // If the current line index is within the list of linelengths, use it, otherwise use
      // the last line length of the list.
      lineLength = lineLengths(currentLine - 1);

    if (lineLength === null) {
      return null;
    }

    if (nodes[end].type === 'penalty') {
      width += nodes[end].width;
    }

    if (width < lineLength) {
      // Calculate the stretch ratio
      stretch = sum.stretch - active.totals.stretch;

      if (stretch > 0) {
        return (lineLength - width) / stretch;
      } else {
        return infinity;
      }

    } else if (width > lineLength) {
      // Calculate the shrink ratio
      shrink = sum.shrink - active.totals.shrink;

      if (shrink > 0) {
        return (lineLength - width) / shrink;
      } else {
        return infinity;
      }
    } else {
      // perfect match
      return 0;
    }
  }


  // Add width, stretch and shrink values from the current
  // break point up to the next box or forced penalty.
  function computeSum(breakPointIndex) {
    var result = {
      width: sum.width,
      stretch: sum.stretch,
      shrink: sum.shrink
    },
      i = 0;

    for (i = breakPointIndex; i < nodes.length; i += 1) {
      if (nodes[i].type === 'glue') {
        result.width += nodes[i].width;
        result.stretch += nodes[i].stretch;
        result.shrink += nodes[i].shrink;
      } else if (nodes[i].type === 'box' || (nodes[i].type === 'penalty' && nodes[i].penalty === -infinity && i > breakPointIndex)) {
        break;
      }
    }
    return result;
  }

  // The main loop of the algorithm
  function mainLoop(node, index, nodes) {
    var active: Breakpoint | null = first(activeNodes),
      next: Breakpoint | null = null,
      ratio: any = 0,
      demerits: number = 0,
      candidates: Candidate[] = [],
      badness,
      currentLine = 0,
      tmpSum,
      currentClass = 0,
      fitnessClass,
      candidate;

    while (active !== null) {
      console.log(`outer loop pass, active is ${active}`);
      candidates = [{
        demerits: Infinity
      }, {
        demerits: Infinity
      }, {
        demerits: Infinity
      }, {
        demerits: Infinity
      }];

      // Iterate through the linked list of active nodes to find new potential active nodes
      // and deactivate current active nodes.
      while (active !== null) {
        console.log(`inner loop pass, active is ${JSON.stringify(active)},...`);
        next = findNext(activeNodes, active);
        console.log(`   next is ${JSON.stringify(next)}`);
        currentLine = active.line + 1;
        ratio = computeCost(active.position, index, active, currentLine);

        if (ratio === null) {
          active = null;
          break;
        }

        // Deactive nodes when the distance between the current active node and the
        // current node becomes too large (i.e. it exceeds the stretch limit and the stretch
        // ratio becomes negative) or when the current node is a forced break (i.e. the end
        // of the paragraph when we want to remove all active nodes, but possibly have a final
        // candidate active node---if the paragraph can be set using the given tolerance value.)
        if (ratio < -1 || (node.type === 'penalty' && node.penalty === -infinity)) {
          remove(activeNodes, active);
        }

        // If the ratio is within the valid range of -1 <= ratio <= tolerance calculate the
        // total demerits and record a candidate active node.
        if (-1 <= ratio && ratio <= options.tolerance) {
          badness = 100 * Math.pow(Math.abs(ratio), 3);

          // Positive penalty
          if (node.type === 'penalty' && node.penalty >= 0) {
            demerits = Math.pow(options.demerits.line + badness, 2) + Math.pow(node.penalty, 2);
            // Negative penalty but not a forced break
          } else if (node.type === 'penalty' && node.penalty !== -infinity) {
            demerits = Math.pow(options.demerits.line + badness, 2) - Math.pow(node.penalty, 2);
            // All other cases
          } else {
            demerits = Math.pow(options.demerits.line + badness, 2);
          }

          if (node.type === 'penalty' && nodes[active.position].type === 'penalty') {
            demerits += options.demerits.flagged * node.flagged * nodes[active.position].flagged;
          }

          // Calculate the fitness class for this candidate active node.
          if (ratio < -0.5) {
            currentClass = 0;
          } else if (ratio <= 0.5) {
            currentClass = 1;
          } else if (ratio <= 1) {
            currentClass = 2;
          } else {
            currentClass = 3;
          }

          // Add a fitness penalty to the demerits if the fitness classes of two adjacent lines
          // differ too much.
          if (Math.abs(currentClass - active.fitnessClass) > 1) {
            demerits += options.demerits.fitness;
          }

          // Add the total demerits of the active node to get the total demerits of this candidate node.
          demerits += active.demerits;

          // Only store the best candidate for each fitness class
          if (demerits < candidates[currentClass].demerits) {
            candidates[currentClass] = {
              active: active,
              demerits: demerits,
              ratio: ratio
            };
          }
        }

        console.log(`bumping, next is ${next}`);
        active = next;

        // Stop iterating through active nodes to insert new candidate active nodes in the active list
        // before moving on to the active nodes for the next line.
        // TODO: The Knuth and Plass paper suggests a conditional for currentLine < j0. This means paragraphs
        // with identical line lengths will not be sorted by line number. Find out if that is a desirable outcome.
        // For now I left this out, as it only adds minimal overhead to the algorithm and keeping the active node
        // list sorted has a higher priority.
        if (active !== null && active.line >= currentLine) {
          break;
        }
      }

      tmpSum = computeSum(index);

      for (fitnessClass = 0; fitnessClass < candidates.length; fitnessClass += 1) {
        candidate = candidates[fitnessClass];

        if (candidate.demerits < Infinity) {
          const newNode = breakpoint(index, candidate.demerits, candidate.ratio,
            candidate.active.line + 1, fitnessClass, tmpSum, candidate.active);
          if (active !== null) {
            insertBefore(activeNodes, active, newNode);
          } else {
            activeNodes.push(newNode);
          }
        }
      }
    }
  }

  // Add an active node for the start of the paragraph.
  activeNodes.push(breakpoint(0, 0, 0, 0, 0, undefined, null));

  nodes.forEach(function(node, index, nodes) {
    if (node.type === 'box') {
      sum.width += node.width;
    } else if (node.type === 'glue') {
      if (index > 0 && nodes[index - 1].type === 'box') {
        mainLoop(node, index, nodes);
      }
      sum.width += node.width;
      sum.stretch += node.stretch;
      sum.shrink += node.shrink;
    } else if (node.type === 'penalty' && node.penalty !== infinity) {
      mainLoop(node, index, nodes);
    }
  });


  if (activeNodes.length !== 0) {
    // Find the best active node (the one with the least total demerits.)
    activeNodes.forEach(function(node: Breakpoint) {
      if (node.demerits < tmp.demerits) {
        tmp = node;
      }
    });

    while (tmp !== null) {
      breaks.push({
        position: tmp.position,
        ratio: tmp.ratio
      });
      tmp = tmp.previous;
    }
    return breaks.reverse();
  }
  return [] as any;
}

export function glue(width, stretch, shrink) {
  return {
    type: 'glue',
    width: width,
    stretch: stretch,
    shrink: shrink
  };
};

export function box(width, value) {
  return {
    type: 'box',
    width: width,
    value: value
  };
};

export function penalty(width, penalty, flagged) {
  return {
    type: 'penalty',
    width: width,
    penalty: penalty,
    flagged: flagged
  };
}
