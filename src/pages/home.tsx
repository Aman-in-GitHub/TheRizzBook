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
  instructions: string;
};

const RESPONSE_TYPES: ResponseType[] = [
  {
    title: 'Cheesy',
    icon: <PiCheese className="size-6 fill-black" />,
    color: '#FFD93D',
    shadowColor: '#F4C430',
    instructions:
      'Generate a cheesy and playful response that is light-hearted and fun. Use classic pickup lines or create new ones that are charming and humorous. Keep the tone casual and friendly, aiming to make the other person smile or laugh.'
  },
  {
    title: 'Flirty',
    icon: <PiSmileyWink className="size-6 fill-black" />,
    color: '#FB7185',
    shadowColor: '#E11D48',
    instructions:
      'Create a flirty and teasing response that is subtly suggestive but not too forward. Use playful banter and compliments to engage the other person, keeping the tone light and fun. Aim to build a sense of attraction and intrigue.'
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
  'Sending your messages to THE RIZZLER',
  'THE RIZZLER has recieved your messages',
  'THE RIZZLER is gooning to your messages',
  'Your messages are arriving from THE RIZZ UNIVERSITY'
];

function Home() {
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<ScreenshotType | null>(null);
  const [selectedType, setSelectedType] = useState<ResponseType>(
    RESPONSE_TYPES[0]
  );
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
    const instructions = selectedType.instructions;
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

      const prompt = `
      You are an expert in conversations, relationship advice, and pickup lines. Your task is to generate a response that is **${instructions}** and aligns with the **${type.toLowerCase()}** tone. The response should be fresh, casual, and tailored to the context of the screenshot image provided.
      
      ### Guidelines:
      1. **Tone**: Ensure the response matches the **${type.toLowerCase()}** tone (e.g., cheesy, flirty, dirty, etc.).
      2. **Language**: The response can include **3 English messages** and **2 romanized Nepali messages** (not actual Nepali script). When writing response in romanized nepali don't add extra english translation with it.
      3. **Context**: Carefully analyze the context of the conversation in the screenshot. ${context.length > 0 ? `Here is additional context about the person you are chatting with: **${context}**. Use this very important context to make the response more personalized and relevant.` : ''}
      4. **Emojis**: Use emojis sparingly. Only include them if they add value to the message.
      5. **Output Format**: Return the responses in the following JSON format:
         ["1st Response", "2nd Response", "3rd Response", "4th Response", "5th Response"]
         Do not include any additional text, explanations, or prefacing remarks. Only return the JSON array.
      
      ### Important Notes:
      - If the conversation is in **romanized Nepali**, ensure the responses are contextually appropriate and match the tone of the original message.
      - Avoid extreme or inappropriate content unless explicitly requested (e.g., for the "Dirty" type).
      - Keep the responses engaging and tailored to impress the recipient.
      - Only return response in Array<string> JSON format
      `;

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
              (gives {RESPONSE_TYPES[0].title.toLowerCase()} response by
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
            placeholder="E.g. We had a fight last night. She loves BTS boy band & sleeping & eating and sleeping again. Try something fun to cheer her up."
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
              className={`${isLoading && 'animate-pulse'} animated-background w-full bg-gradient-to-r from-blue-500 via-yellow-500 to-rose-500 py-8 font-heading text-2xl font-bold`}
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
