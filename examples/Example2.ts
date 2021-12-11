// cd ~/proj/leerraum.js/
// tsc -w
// node js/examples/Example2.js
// evince /tmp/example.pdf

import * as leer from '../lib/Leerraum';

const oswald = 'fonts/Oswald-Light.ttf';
const abel = 'fonts/Abel-Regular.ttf';
const austin = 'fonts/Austin.ttf';

const leading = 24;

function rgb(r, g, b) {
  return '#' + ('0' + r.toString(16)).slice(-2) + ('0' + g.toString(16)).slice(-2) + ('0' + b.toString(16)).slice(-2);
}

const gridTexts = `
In Pengerrand there is a Serkaiba, an Arken neighborhood. It has the
shape of a triangle. Its boundaries are now fairly fixed. It's only
the youths who fight about the borders. Then again, it's also the
Penger youths who venture curiously into the temple of Yailo, and the
Wuchka, the domed screaming-house, and participate (tentatively or
enthusiastically) in the sessions there, which to them are exotic.

It begins with silence, and ends with silence: it is mysterious how
the beginning and end of the noise is negotiated within the gathered
crowd. The chants are formed of nonsense syllables. Some have loose
conventional meanings, as musical scales have feelings. "Ha" is
sadness, "Io" and "ia" are neutral. "Ze" is the expansive spirit of
Yailo, the universal bird, that which contradicts the present-centric
contemplation of bissholmi. It celebrates centrifugal motion, noise,
exploration.

Rhythms intersect and overlap. A given speaker may explore a theme
consisting of patterns distributed across a pair of shouted syllables.
A pair of participants improvise off of one another. The end of a
session --- usually about a third of a medis, often even less ---
ideally involves a crescendo and an abrupt, perfectly coordinated
silence, during which the acoustics of the dome provide a resonant
finish.
`.replace(/ "/g, ' “').replace(/" /g, '” ').split('\n\n');
const gridText2 = '...';

const s: leer.Span =
{
  fontFamily: austin,
  fontSize: 12,

  hyphenate: true,
  text: '',
  style: {
    fillColor: '#000',
  },
};

const p: leer.Paragraph =
{
  align: 'left',
  leading: leading,
  paragraphLeading: 0,
  tolerance: 10,
  spans: []
};

function gap(leading_?): leer.Renderer {
  return leer.renderParagraph(
    {
      ...p,
      leading: 0,
      paragraphLeading: leading_ !== undefined ? leading_ : leading * 2,
      spans: [s]
    });
}

function title(title: string): leer.Paragraph {
  const titleSize = 60;
  return {
    ...p,
    leading: titleSize,
    paragraphLeading: leading,
    spans:
      [
        {
          ...s,
          fontFamily: austin,
          hyphenate: false,
          fontSize: titleSize,
          text: title,
        },
      ]
  };
}

function subtitle(subtitle: string): leer.Paragraph {
  return {
    ...p,
    align: 'justify',
    paragraphLeading: leading,
    spans:
      [
        {
          ...s,
          fontSize: 21,
          text: subtitle,
        },
      ],
  };
}

function normalPara(text: string): leer.Text {
  return [
    {
      ...p,
      align: 'justify',
      leftIndentation: x => x < 5 ? 12 * (5 - x) : 0,
      rightIndentation: x => x < 5 ? 12 * (5 - x) : 0,
      paragraphLeading: leading,
      spans:
        [
          {
            ...s,
            fontSize: 12,
            text: text,
          },
        ],
    },
  ];
}

function text(emphasized: string, text: string): leer.Text {
  return [
    {
      ...p,
      align: 'justify',
      paragraphLeading: leading * 3,
      spans:
        [
          {
            ...s,
            style: { fillColor: 'blue' },
            fontFamily: oswald,
            fontSize: 36,
            text: emphasized,
          },
          {
            ...s,
            fontSize: 12,
            text: text,
          },
        ],
    },
  ];
}

function fillerText(text: string, lines: number): leer.Renderer {
  return leer.renderText(Array(lines).fill(0).map((_, line) => {
    return {
      ...p,
      tolerance: 20,
      spans: [{ ...s, text: text }]
    };
  }));
}

function regularPolygon(edges: number, offseta: number, offsetx: number, offsety: number, scale: number) {
  const step = 360 / edges;

  return Array(edges).fill(0).map((_, a) => {
    return {
      x: offsetx + Math.cos((a * step + offseta) * Math.PI / 180) * scale,
      y: offsety + Math.sin((a * step + offseta) * Math.PI / 180) * scale
    }
  });
}

const paras = gridTexts.flatMap(t => [
  leer.renderText(normalPara(t)),
]);

leer.renderToPDF('/tmp/example.pdf', leer.formats.LETTER, [
  {
    bboxes: leer.columnsWithMargins(leer.formats.LETTER, 32, 32, 32, 32, 32),
    renderer: leer.vertically(
      [
        leer.renderParagraph(title('Serkaiba')),

        ...paras,

        leer.renderText(text('Other Heading', gridText2)),
        leer.renderParagraph(subtitle('Polygons')),

        leer.renderPolygon(regularPolygon(3, 0, 100, 100, 100), { fillColor: '#f07' }),

        leer.renderText(text('Another Heading', gridText2)),

      ])
  }
]);
