import { Buffer } from 'buffer';

export const generateMetroStationLogoUrl = (fillColor: string | undefined) => {
  if (!fillColor) {
    return '';
  }

  const fill = `#${fillColor}`;
  const svgElement = `   <svg width='24' height='24' viewBox='0 0 24 24' fill='#FF0000' xmlns='http://www.w3.org/2000/svg'>
        <path
          fill-rule='evenodd'
          clip-rule='evenodd'
          d='M12 18.3392L14.9248 13.2556L16.1391 16.6987H15.1586V18.2139H21V16.6987H19.8851L15.689 5.66083L12 12.4567L8.31098 5.66083L4.11494 16.6987H3V18.2139H8.84144V16.6987H7.86092L9.07523 13.2556L12 18.3392Z'
          fill='#CD0505'
          fill-opacity='0.6'
        />
      </svg>`;
  const colorisedSvgString = svgElement.replace(/(?<=<path\b[^<>]*)\s*\bfill=(["']).*?\1/, ` fill="${fill}"`);

  const buff = new Buffer(colorisedSvgString);
  const base64data = buff.toString('base64');

  return `data:image/svg+xml;base64,${base64data}`;
};
