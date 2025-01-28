import twemoji from 'twemoji';

function Twemoji({ text }: { text: string }) {
  return (
    <span
      dangerouslySetInnerHTML={{
        __html: twemoji.parse(text, {
          folder: 'svg',
          ext: '.svg',
          base: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/'
        })
      }}
    />
  );
}

export default Twemoji;
