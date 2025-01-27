type Props = {
  imageUrl: string;
  caption: string;
};

export default function ImageCard({ imageUrl, caption }: Props) {
  return (
    <figure className="h-[450px] w-full overflow-hidden rounded-base border-2 border-border bg-primary font-body shadow-shadow motion-blur-in motion-duration-1000">
      <img
        className="aspect-[9/16] w-full object-cover"
        src={imageUrl}
        alt="image"
      />
      <figcaption className="border-t-2 border-border p-4 text-mutedText">
        {caption}
      </figcaption>
    </figure>
  );
}
