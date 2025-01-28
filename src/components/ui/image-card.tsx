type Props = {
  imageUrl: string;
  caption: string;
};

export default function ImageCard({ imageUrl, caption }: Props) {
  return (
    <figure className="w-full overflow-hidden rounded-base border-2 border-border bg-primary font-body shadow-shadow motion-blur-in motion-duration-1000">
      <div className="h-[400px]">
        <img
          className="h-full w-full object-cover object-top"
          src={imageUrl}
          alt={caption}
        />
      </div>
      <figcaption className="border-t-2 border-border p-4 text-mutedText">
        {caption}
      </figcaption>
    </figure>
  );
}
