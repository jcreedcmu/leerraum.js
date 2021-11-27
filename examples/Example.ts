import * as leer from '../lib/Leerraum';
import * as T from '../lib/Types';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';

const format = { width: 500, height: 500 };
const poly: T.RenderNode = {
  "type": "polygon", x: 300, y: 300,
  points: [{ x: 50, y: 50 }, { x: 150, y: 100 }, { x: 50, y: 150 }],
  style: { fillColor: "#f07" }
};
const stext: T.RenderNode = {
  "type": "text", x: 50, y: 750,
  span: {
    fontFamily: "fonts/Oswald-Light.ttf",
    fontSize: 36,
    text: 'some text',
  },
  text: "some text"
};

const doc = new PDFDocument({
  layout: 'portrait',
  size: [format.width, format.height]
});

doc.pipe(fs.createWriteStream('example.pdf'));

leer.renderToPages(doc, format, [[poly, stext]], undefined);

doc.end();
