import * as leer from '../lib/Leerraum';

const oswald = 'fonts/Oswald-Light.ttf';
const abel = 'fonts/Abel-Regular.ttf';
const austin = 'fonts/Austin.ttf';

const leading = 24;

function rgb(r, g, b) {
  return '#' + ('0' + r.toString(16)).slice(-2) + ('0' + g.toString(16)).slice(-2) + ('0' + b.toString(16)).slice(-2);
}

const gridText = ' a grid is a structure (usually two-dimensional) made up of a series of intersecting straight (vertical, horizontal, and angular) or curved guide lines used to structure content. The grid serves as an armature or framework on which a designer can organize graphic elements (images, glyphs, paragraphs, etc.) in a rational, easy-to-absorb manner.';
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

leer.renderToPDF('example.pdf', leer.formats.LETTER, [
  {
    bboxes: leer.columnsWithMargins(leer.formats.LETTER, 1, 32, 32, 32, 32),
    renderer: leer.vertically(
      [
        leer.renderParagraph(title('GRIDS')),

        leer.renderText(text('In graphic design,', gridText)),


        gap(leading),

        leer.renderText(text('Whil grid systems', gridText2)),
        leer.renderParagraph(subtitle('Polygons')),



        leer.renderPolygon(regularPolygon(8, 0, 100, 100, 100), { fillColor: '#770' }),



        leer.renderText(text('Whil grid systems', gridText2)),

      ])
  }
]);
