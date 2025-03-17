import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import ImageCard from '@/components/ui/image-card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/useToast';
import gemini from '@/lib/gemini';
import { useEffect, useRef, useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  PiBrain,
  PiCheese,
  PiGlobeStand,
  PiPawPrint,
  PiSmiley,
  PiSmileyWink,
  PiTerminal,
  PiTranslate
} from 'react-icons/pi';
import { LiaPoopSolid } from 'react-icons/lia';
import { RiNetflixLine } from 'react-icons/ri';
import { motion, AnimatePresence } from 'motion/react';
import Header from '@/components/header';
import Twemoji from '@/utils/twemoji';
import { SparklesText } from '@/components/ui/sparkle-text';

type ScreenshotType = {
  url: string;
  caption: string;
};

type LanguageType = {
  title: string;
  icon: React.ReactNode;
  color: string;
  shadowColor: string;
};

type ResponseType = {
  title: string;
  icon: React.ReactNode;
  color: string;
  shadowColor: string;
  instructions: string;
};

const LANGUAGES: LanguageType[] = [
  {
    title: 'Auto',
    icon: <PiTranslate className="size-6 fill-black" />,
    color: '#ffffff',
    shadowColor: '#d0d0d0'
  },
  {
    title: 'UK/US English',
    icon: <PiGlobeStand className="size-6 fill-black" />,
    color: '#0d76bd',
    shadowColor: '#0660a9'
  },
  {
    title: 'Romanized Nepali',
    icon: <RiNetflixLine className="size-6 fill-black" />,
    color: '#db0000',
    shadowColor: '#831010'
  }
];

const RESPONSE_TYPES: ResponseType[] = [
  {
    title: 'Flirty',
    icon: <PiSmileyWink className="size-6 fill-black" />,
    color: '#FB7185',
    shadowColor: '#E11D48',
    instructions:
      'Create a flirty and teasing response that is subtly suggestive but not too forward. Use playful banter and compliments to engage the other person, keeping the tone light and fun. Aim to build a sense of attraction and intrigue.'
  },
  {
    title: 'Cheesy',
    icon: <PiCheese className="size-6 fill-black" />,
    color: '#FFD93D',
    shadowColor: '#F4C430',
    instructions:
      'Generate a cheesy and playful response that is light-hearted and fun. Use classic pickup lines or create new ones that are charming and humorous. Keep the tone casual and friendly, aiming to make the other person smile or laugh.'
  },
  {
    title: 'Dirty',
    icon: <LiaPoopSolid className="size-6 fill-black" />,
    color: '#CD853F',
    shadowColor: '#A0522D',
    instructions:
      'Generate a very unfiltered, dirty, and naughty response that is seductive and provocative. Use explicit language and imagery to create a sense of intimacy and desire. Make sure the response is tailored to the context and the person you are chatting with.'
  },
  {
    title: 'Cute',
    icon: <PiPawPrint className="size-6 fill-black" />,
    color: '#C084FC',
    shadowColor: '#9333EA',
    instructions:
      'Create a cute and adorable response that is sweet and endearing. Use playful language and imagery, such as animals or baby talk, to evoke a sense of warmth and affection. Keep the tone light and cheerful.'
  },
  {
    title: 'Funny',
    icon: <PiSmiley className="size-6 fill-black" />,
    color: '#38BDF8',
    shadowColor: '#0284C7',
    instructions:
      'Generate a funny and humorous response that is witty and entertaining. Use jokes, puns, or clever wordplay to make the other person laugh. Keep the tone light and casual, aiming to create a fun and enjoyable conversation.'
  },
  {
    title: 'Smart',
    icon: <PiBrain className="size-6 fill-black" />,
    color: '#4ADE80',
    shadowColor: '#22C55E',
    instructions:
      'Create a smart and intellectual response that is thoughtful and insightful. Use clever reasoning or interesting facts to engage the other person in a meaningful conversation. Keep the tone respectful and engaging.'
  },
  {
    title: 'Manipulative',
    icon: <PiBrain className="size-6 fill-white" />,
    color: '#0F0F0F',
    shadowColor: '#050505',
    instructions:
      'Generate a manipulative response that subtly shifts the blame to the other person while making yourself appear innocent or virtuous. Use persuasive language and emotional appeals to influence the other person’s perception. Keep the tone calm and calculated.'
  }
];

const LOADING_MESSAGES = [
  'Sending your application to THE RIZZ UNIVERSITY',
  'THE RIZZLER has received your application',
  'THE RIZZLER is gooning to your application',
  'Your results are coming in from THE RIZZ UNIVERSITY'
];

function Starter() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [previews, setPreviews] = useState<ScreenshotType[]>([]);
  const [selectedType, setSelectedType] = useState<ResponseType>(
    RESPONSE_TYPES[0]
  );
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageType>(
    LANGUAGES[0]
  );
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [response, setResponse] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const gender = localStorage.getItem('therizzbook-gender') || 'female';

  useEffect(() => {
    async function checkForSeenStatus() {
      const name = localStorage.getItem('therizzbook-name');
      const hasSeenStarterDialog = localStorage.getItem(
        'therizzbook-hasSeenStarterDialog'
      );

      if (!hasSeenStarterDialog && name) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setOpen(true);
        localStorage.setItem('therizzbook-hasSeenStarterDialog', 'true');
      }
    }

    checkForSeenStatus();
  }, []);

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
      previews.length > 0 ||
      (isLoading === false && error) ||
      (isLoading === false && response)
    ) {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [previews, isLoading]);

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

  async function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    setPreviews([]);

    const files = event.target.files;

    if (textareaRef.current) {
      textareaRef.current.value = '';
    }

    setError(null);
    setResponse(null);

    if (files) {
      const fileArray = Array.from(files);

      const previewPromises = fileArray.map((file) => {
        return new Promise<{ url: string; caption: string }>((resolve) => {
          const reader = new FileReader();

          reader.onloadend = () => {
            resolve({
              url: reader.result as string,
              caption:
                file.name.length > 25
                  ? file.name.slice(0, 25) + '...'
                  : file.name
            });
          };

          reader.readAsDataURL(file);
        });
      });

      const newPreviews = await Promise.all(previewPromises);
      setPreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
    }
  }

  async function getPickUpLines(type = selectedType) {
    const context = textareaRef.current?.value.toString() || '';
    const resType = type.title;
    const instructions = type.instructions;
    const images = previews.length;
    const language = selectedLanguage.title;

    if (images === 0) {
      navigator.vibrate(200);
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 250));

      setIsLoading(true);
      setError(null);
      setResponse(null);

      const imageParts = previews.map((preview) => ({
        inlineData: {
          data: preview.url.split(',')[1],
          mimeType: 'image/jpeg'
        }
      }));

      const prompt = `You are an expert in analyzing images, understanding social cues, and generating engaging conversation starters. Your task is to create a response that is **${instructions}** and aligns with the **${resType.toLowerCase()}** tone. The response should be fresh, unique, and tailored to the context of the uploaded image (e.g., profile, screenshot, or photo).

      ### Guidelines:
      1. **Image Analysis**: Carefully analyze the uploaded image to gather details such as:
         - The person's name, appearance, style, or interests (e.g., hobbies, fashion, location).
         - Any visible text, captions, or context in the image.
         - The overall mood or vibe of the images (e.g., professional, casual, playful).
      
      2. **Tone**: Ensure the response matches the **${resType.toLowerCase()}** tone (e.g., cheesy, flirty, dirty, etc.). Even if the tone is not specified, make sure to add some cheeky flirt to every response.
      
      3. **Language**: The response can include **4 ${language.toLowerCase() === 'auto' ? 'English' : language} messages** and **1 ${language.toLowerCase() === 'auto' ? 'Romanized Nepali' : language.toLowerCase() === 'english' ? 'Romanized Nepali' : 'English'} message** (not actual Nepali script). When writing in romanized Nepali, don't add extra English translations.
      
      4. **Context**: Use the visual and contextual data from the image to personalize the response. ${context.length > 0 ? `Here is additional context about the person you are chatting with: **${context}**. Use this to make the response more relevant and engaging.` : ''}
      
      5. **Emojis**: Use emojis sparingly. Only include them if they add value to the message.
      
      6. **Output Format**: Return the responses in the following JSON format:
         ["1st Response", "2nd Response", "3rd Response", "4th Response", "5th Response"]

      ### Important Notes:
      - If the conversation is in **Romanized Nepali**, ensure the responses are contextually appropriate and match the tone of the original message & do not add extra English translations.
      - Keep the responses engaging and tailored to impress the recipient.
      - Warning: Do not return response in actual nepali script like (क ख ग घ ङ) only respond in english or romanized nepali.
      - Do not use pickup lines or anything that are not relevant to the conversation.
      - Try to use some wordplay and pickup lines using the messages or user's name if and only if it's applicable in that scenario and while doing that take the language used in message or name into consideration as well.
      - Only return response in Array<string> JSON format`;

      const result = await gemini.generateContent([...imageParts, prompt]);

      const responseText = result.response.text().replace(/```json|```/g, '');

      const parsedResponse = JSON.parse(responseText);

      setResponse(parsedResponse);
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
      <Header title="Convo Starter" />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="sm:max-w-[425px]"
          onEscapeKeyDown={(e) => e.preventDefault()}
          onPointerDown={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>CONVERSATIONAL RIZZ</DialogTitle>
            <DialogDescription>
              In this page you can upload multiple screenshots of your future{' '}
              {gender === 'male' ? 'kitten' : 'sigma'}'s profile, images,
              socials etc. to generate the rizziest conversation starters.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => {
                setOpen(false);
              }}
            >
              Understood Rizzly Bear
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <main className="p-2 pb-16 pt-[4.2rem] motion-blur-in motion-opacity-in motion-duration-1000">
        {previews.length > 0 ? (
          <div className="pb-4">
            <label className="font-heading text-2xl font-bold">
              Screenshots{' '}
              <span className="font-body text-xs">
                (more screenshots === better rizz)
              </span>
            </label>

            <Carousel className="w-full">
              <CarouselContent>
                {previews.map((preview, index) => (
                  <CarouselItem key={index}>
                    <ImageCard
                      imageUrl={preview.url}
                      caption={preview.caption}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        ) : (
          <div className="select-none">
            <img
              src="/illustration2.svg"
              className="w-full"
              alt="Multi-Image Upload Illustration"
            />
          </div>
        )}

        {previews.length > 0 && (
          <div>
            <label className="font-heading text-2xl font-bold">
              Language{' '}
              <span className="font-body text-xs">
                (the lingo you want the starters in)
              </span>
            </label>
            <div className="flex gap-4 overflow-x-scroll pb-4 pr-2">
              {LANGUAGES.map((type) => (
                <button
                  key={type.title}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-6 py-3 font-heading font-bold duration-500 active:scale-95"
                  onClick={() => {
                    if (navigator.vibrate) {
                      navigator.vibrate(50);
                    }

                    setSelectedLanguage(type);
                  }}
                  style={{
                    backgroundColor: type.color,
                    opacity: selectedLanguage.title === type.title ? 1 : 0.3,
                    border: '3px solid black',
                    boxShadow: `4px 4px 0 0 ${type.shadowColor}, 8px 8px 0 0 black`,
                    borderRadius: '8px'
                  }}
                >
                  <span>{type.icon}</span>
                  <span
                    className="whitespace-nowrap text-xl text-black"
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
        )}

        <div>
          <label className="font-heading text-2xl font-bold">
            Starter Type{' '}
            <span className="font-body text-xs">
              (gives {RESPONSE_TYPES[0].title.toLowerCase()} starters by
              default)
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

                  if (response) {
                    getPickUpLines(type);
                  }
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
            placeholder="E.g. He is the topper of my class and is into books and anime. Suggest something that would make a good conversation starter."
          />
        </div>

        {response && !isLoading ? (
          <>
            <label className="font-heading text-2xl font-bold">
              Rizz {gender === 'male' ? 'her' : 'him'} Up{' '}
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
                      <Twemoji text={line} />
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
              <AlertTitle>Rizz Application Rejected</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}

        {previews.length > 0 && (
          <div className="pb-4">
            <Button
              className={`${isLoading && 'animate-pulse'} animated-background w-full bg-gradient-to-r from-blue-500 to-fuchsia-500 py-8 font-heading`}
              onClick={() => {
                getPickUpLines(selectedType);
              }}
              disabled={isLoading}
            >
              <SparklesText
                text={
                  error ? 'Please help me be a rizz god' : 'Make me a rizz god'
                }
              />
            </Button>
          </div>
        )}

        <div className="relative pb-4">
          <input
            type="file"
            accept="image/*"
            multiple={true}
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
              {previews.length > 0
                ? 'Upload new screenshots'
                : `Upload ${gender === 'male' ? 'her' : 'his'} screenshots`}
            </Button>
          </label>
        </div>
      </main>
    </>
  );
}

export default Starter;
