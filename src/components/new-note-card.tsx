import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { ChangeEvent, MouseEvent, useState } from "react";
import { toast } from "sonner";

interface NewNoteCardProps {
  handleClick: (content: string) => void;
}

const NewNoteCard = ({ handleClick }: NewNoteCardProps) => {
  const [shouldShowOnBoarding, setShouldShowOnBoarding] =
    useState<boolean>(true);
  const [content, setContent] = useState<string>("");
  const [isRecording, setIsRecording] = useState<boolean>(false);

  useState<boolean>(false);
  const handleStartEditor = () => {
    setShouldShowOnBoarding(false);
  };

  const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault();

    setContent(e.target.value);

    if (e.target.value === "") {
      setShouldShowOnBoarding(true);
    }
  };

  let speechRecognition: SpeechRecognition | null = null;

  const handleStartRecording = () => {
    const isSpeechRecognitionAPIAvaliable =
      "SpeechRecognition" in window || "webkitSpeechRecognition" in window;

    if (!isSpeechRecognitionAPIAvaliable) {
      alert("Infelizmente seu navegador não suporta API de fala!");
      return;
    }

    setIsRecording(true);
    setShouldShowOnBoarding(false);

    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    speechRecognition = new SpeechRecognitionAPI();

    (speechRecognition.lang = "pt-BR"),
      (speechRecognition.continuous = true),
      (speechRecognition.maxAlternatives = 1),
      (speechRecognition.interimResults = true),
      (speechRecognition.onresult = (event) => {
        const transcription = Array.from(event.results).reduce(
          (text, result) => {
            return text.concat(result[0].transcript);
          },
          ""
        );
        setContent(transcription);
      });

    speechRecognition.onerror = (event) => {
      console.error(event);
    };

    speechRecognition.start();
  };

  const stopRecording = () => {
    setIsRecording(false);

    if (speechRecognition != null) {
      speechRecognition.stop();
    }
  };

  const handleSaveNote = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (content === "") {
      return;
    }
    handleClick(content);
    setContent("");
    setShouldShowOnBoarding(true);
    toast.success("Nota Salva com sucesso");
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="flex flex-col text-left rounded-md bg-slate-700 p-5 gap-3">
          <span className="text-sm font-medium text-slate-300">
            Adicionar Nota
          </span>
          <p>
            Grave uma nota em um áudio que será convertida para texto
            automaticamente
          </p>
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="inset-0 fixed bg-black/50" />
        <Dialog.Content className="fixed overflow-hidden inset-0 md:inset-auto  md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] md:w-full bg-slate-700 md:rounded-md flex flex-col outline-none h-[60vh]">
          <Dialog.Close className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100">
            <X className="size-5" />
          </Dialog.Close>

          <form className="flex flex-col flex-1">
            <div className="flex flex-col flex-1 gap-3 p-5">
              <span className="text-sm font-medium text-slate-300 ">
                Adicionar nota
              </span>
              {shouldShowOnBoarding ? (
                <p>
                  Comece{" "}
                  <button
                    type="button"
                    className="font-medium text-lime-400 hover:underline"
                    onClick={handleStartRecording}
                  >
                    gravando uma nota
                  </button>{" "}
                  em áudio ou se preferir{" "}
                  <button
                    type="button"
                    className="font-medium text-lime-400 hover:underline"
                    onClick={handleStartEditor}
                  >
                    utilize apenas texto
                  </button>
                  .
                </p>
              ) : (
                <textarea
                  autoFocus
                  className="text-sm leading-6 text-slate-400 bg-transparent flex-1 flex outline-none"
                  onChange={handleContentChange}
                  name="content"
                  value={content}
                />
              )}
            </div>
            {isRecording ? (
              <button
                type="button"
                className="w-full bg-slate-900 py-4 text-center text-sm text-slate-300 outline-none font-medium hover:text-slate-100 flex items-center justify-center gap-2"
                onClick={stopRecording}
              >
                <div className="size-3 rounded-full bg-red-600 animate-pulse" />
                Gravando! (Clique para interromper)
              </button>
            ) : (
              <button
                type="button"
                className="w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none font-medium hover:bg-lime-500"
                onClick={handleSaveNote}
              >
                Salvar Nota
              </button>
            )}
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default NewNoteCard;