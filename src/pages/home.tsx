import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import ImageCard from '@/components/ui/image-card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/useToast';
import gemini from '@/lib/gemini';
import { useEffect, useRef, useState } from 'react';
import {
  PiBrain,
  PiCheese,
  PiPawPrint,
  PiSmiley,
  PiSmileyWink,
  PiTerminal
} from 'react-icons/pi';
import { LiaPoopSolid } from 'react-icons/lia';
import { motion, AnimatePresence } from 'motion/react';
import Header from '@/components/header';

type ScreenshotType = {
  url: string;
  caption: string;
};

type ResponseType = {
  title: string;
  icon: React.ReactNode;
  color: string;
  shadowColor: string;
};

const RESPONSE_TYPES: ResponseType[] = [
  {
    title: 'Cheesy',
    icon: <PiCheese className="size-6 fill-black" />,
    color: '#FFD93D',
    shadowColor: '#F4C430'
  },
  {
    title: 'Flirty',
    icon: <PiSmileyWink className="size-6 fill-black" />,
    color: '#FB7185',
    shadowColor: '#E11D48'
  },
  {
    title: 'Dirty',
    icon: <LiaPoopSolid className="size-6 fill-black" />,
    color: '#A0522D',
    shadowColor: '#8B4513'
  },
  {
    title: 'Cute',
    icon: <PiPawPrint className="size-6 fill-black" />,
    color: '#C084FC',
    shadowColor: '#9333EA'
  },
  {
    title: 'Funny',
    icon: <PiSmiley className="size-6 fill-black" />,
    color: '#38BDF8',
    shadowColor: '#0284C7'
  },
  {
    title: 'Smart',
    icon: <PiBrain className="size-6 fill-black" />,
    color: '#4ADE80',
    shadowColor: '#22C55E'
  },
  {
    title: 'Manipulative',
    icon: <PiBrain className="size-6 fill-white" />,
    color: '#0F0F0F',
    shadowColor: '#050505'
  }
];

const LOADING_MESSAGES = [
  'Sending your messages to THE RIZZLER',
  'THE RIZZLER has recieved your messages',
  'THE RIZZLER is gooning to your messages',
  'Your messages are arriving from THE RIZZ UNIVERSITY'
];

function Home() {
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<ScreenshotType | null>(null);
  const [selectedType, setSelectedType] = useState<ResponseType>({
    title: 'Cheesy',
    icon: <PiCheese className="size-6 fill-black" />,
    color: '#FFD93D',
    shadowColor: '#F4C430'
  });
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [response, setResponse] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isLoading) {
      interval = setInterval(() => {
        setCurrentMessageIndex((prevIndex) => {
          const nextIndex = prevIndex + 1;
          if (nextIndex >= LOADING_MESSAGES.length) {
            if (interval) clearInterval(interval);
            return prevIndex;
          }
          return nextIndex;
        });
      }, 1500);
    } else {
      setCurrentMessageIndex(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoading]);

  useEffect(() => {
    if (
      imagePreview ||
      (isLoading === false && error) ||
      (isLoading === false && response)
    ) {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [imagePreview, isLoading]);

  useEffect(() => {
    async function checkForResponse() {
      if (error) {
        setIsLoading(false);

        if (navigator.vibrate) {
          navigator.vibrate(200);
        }

        return;
      }

      if (response && currentMessageIndex === 3) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        if (navigator.vibrate) {
          navigator.vibrate(50);
        }
        setIsLoading(false);
      }
    }

    checkForResponse();
  }, [currentMessageIndex, response?.length, error]);

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (textareaRef.current) {
      textareaRef.current.value = '';
    }
    setError(null);
    setResponse(null);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log(reader);
        setImagePreview({
          url: reader.result as string,
          caption:
            file.name.length > 25 ? file.name.slice(0, 25) + '...' : file.name
        });
      };
      reader.readAsDataURL(file);
    }
  }

  async function getPickUpLines() {
    const context = textareaRef.current?.value.toString() || '';
    const type = selectedType.title;
    const imageData = imagePreview?.url;

    if (!imageData) {
      navigator.vibrate(200);
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 250));

      setIsLoading(true);
      setError(null);
      setResponse(null);

      const base64Data = imageData.split(',')[1];

      const prompt = `You are a expert in conversation & relationship gossips, you have knowledge of every kind of pickup line in the world. Generate a ${type.toLowerCase() === 'dirty' ? 'Very unfiltered dirty, freaky and naughty response and try to seduce the other person into receiving dirtier texts' : type.toLowerCase() === 'manipulative' ? 'Try to manipulate the other person such that the blame goes to the other person and make myself the good guy make sure its unfiltered and manipulative' : type.toLowerCase()} type of response make sure to make it's a ${type.toLowerCase()} message as I am trying the impress the person keep it fresh and casuals not too extreme and only based on the contents of the screenshot image. The messages can also be in romanized nepali so make sure u understand the correct context of the message it's written in before generating response. ${context?.length > 0 ? 'Addition context of the person I am chatting with:' + context : ''}. Keep the use of emojis as less as possible don't use them if it doesn't make much sense, give 3 response in english and 2 in romanized nepali not actual nepali. Very Important: Make sure you know if the messages are written in english or romanized nepali, understand the context and generate response based on that. Use this JSON schema for the response:
      ["1st Response", "2nd Response", "3rd Response", "4th Response", "5th Response"]
      Return: Array<string> Do not add any preface or any other text or anything just return the JSON response.`;

      const result = await gemini.generateContent([
        {
          inlineData: {
            data: base64Data,
            mimeType: 'image/jpeg'
          }
        },
        prompt
      ]);

      const responseText = result.response.text().replace(/```json|```/g, '');

      const parsedResponse = JSON.parse(responseText);

      setResponse(parsedResponse);

      if (textareaRef.current) {
        textareaRef.current.value = '';
      }
    } catch (error) {
      console.error('Error generating response:', error);

      setError(
        error instanceof Error
          ? error.message
          : 'Error generating rizz, will have to buy some baby oil'
      );
    }
  }

  return (
    <>
      <Header title="The Rizz Book" />

      <main className="p-2 pb-16 pt-[4.2rem] motion-blur-in motion-opacity-in motion-duration-1000">
        {imagePreview ? (
          <div className="pb-4">
            <label className="font-heading text-2xl font-bold">
              Screenshot
            </label>

            <ImageCard
              imageUrl={imagePreview.url}
              caption={imagePreview.caption}
            />
          </div>
        ) : (
          <div className="select-none">
            <img
              src="/illustration.svg"
              className="w-full"
              alt="Image Upload Illustration"
            />
          </div>
        )}
        <div>
          <label className="font-heading text-2xl font-bold">
            Response Type{' '}
            <span className="font-body text-xs">
              (gives cheesy response by default)
            </span>
          </label>
          <div className="flex gap-4 overflow-x-scroll pb-4 pr-2">
            {RESPONSE_TYPES.map((type) => (
              <button
                key={type.title}
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-3 font-heading font-bold duration-500 active:scale-95"
                onClick={() => {
                  if (navigator.vibrate) {
                    navigator.vibrate(50);
                  }

                  setError(null);
                  setResponse(null);
                  setSelectedType(type);
                }}
                style={{
                  backgroundColor: type.color,
                  opacity: selectedType.title === type.title ? 1 : 0.3,
                  border: '3px solid black',
                  boxShadow: `4px 4px 0 0 ${type.shadowColor}, 8px 8px 0 0 black`,
                  borderRadius: '8px'
                }}
              >
                <span>{type.icon}</span>
                <span
                  className="text-xl text-black"
                  style={{
                    color:
                      type.title.toLowerCase() === 'manipulative'
                        ? 'white'
                        : 'black'
                  }}
                >
                  {type.title}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="pb-4">
          <label className="font-heading text-2xl font-bold">
            Add some context{' '}
            <span className="font-body text-xs">
              (leave blank if not needed)
            </span>
          </label>
          <Textarea
            id="context"
            ref={textareaRef}
            placeholder="E.g. We had a fight last night, so she's feeling a bit upset today. Try something thoughtful to cheer her up and make her smile."
          />
        </div>

        {response && !isLoading ? (
          <>
            <label className="font-heading text-2xl font-bold">
              Rizz Her Up{' '}
              <span className="font-body text-xs">
                (tap on the response to copy it)
              </span>
            </label>

            <div className="flex flex-col gap-2 pb-4">
              {response.map((line, index) => {
                return (
                  <div
                    key={index}
                    className="motion-blur-in motion-opacity-in"
                    style={{
                      animationDelay: `${index * 250}ms`
                    }}
                    onClick={async () => {
                      toast({
                        title: `Copied the message to your clipboard`,
                        duration: 750
                      });

                      if (navigator.clipboard && window.isSecureContext) {
                        await navigator.clipboard.writeText(line);
                      } else {
                        const textArea = document.createElement('textarea');
                        textArea.value = line;
                        textArea.style.position = 'fixed';
                        textArea.style.left = '-999999px';
                        textArea.style.top = '-999999px';
                        document.body.appendChild(textArea);
                        textArea.focus();
                        textArea.select();
                        document.execCommand('copy');
                        textArea.remove();
                      }

                      navigator.clipboard.writeText(line);

                      if (navigator.vibrate) {
                        navigator.vibrate(100);
                      }
                    }}
                  >
                    <p
                      className="select-none px-2 py-1 font-heading text-xl font-bold"
                      style={{
                        backgroundColor: selectedType.color,
                        color:
                          selectedType.title.toLowerCase() === 'manipulative'
                            ? 'white'
                            : 'black'
                      }}
                    >
                      {line}
                    </p>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          isLoading &&
          !error && (
            <div className="pb-3">
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentMessageIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                  className="text-center font-heading font-bold"
                >
                  {LOADING_MESSAGES[currentMessageIndex]}
                </motion.p>
              </AnimatePresence>
            </div>
          )
        )}

        {error && (
          <div className="pb-4">
            <Alert variant="destructive">
              <PiTerminal className="size-4" />
              <AlertTitle>Rizz Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}

        {imagePreview && (
          <div className="pb-4">
            <Button
              className={`${isLoading && 'animate-pulse'} animated-background w-full bg-gradient-to-r from-rose-600 via-blue-600 to-emerald-600 py-8 font-heading text-2xl font-bold`}
              onClick={getPickUpLines}
              disabled={isLoading}
            >
              {error ? 'Try Rizzing Up Again' : 'Rizz Up My Screenshot'}
            </Button>
          </div>
        )}

        <div className="relative pb-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            id="fileInput"
            onClick={() => {
              if (navigator.vibrate) {
                navigator.vibrate(50);
              }
            }}
            disabled={isLoading}
          />
          <label htmlFor="fileInput" className="w-full">
            <Button
              className="w-full py-8 font-heading text-2xl font-bold"
              disabled={isLoading}
            >
              {imagePreview ? 'Upload new screenshot' : 'Upload a screenshot'}
            </Button>
          </label>
        </div>
      </main>
    </>
  );
}

export default Home;
