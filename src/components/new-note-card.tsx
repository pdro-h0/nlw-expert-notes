import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { ChangeEvent, MouseEvent, useState } from "react";
import { toast } from "sonner";

interface Content {
  content: string;
}

interface NewNoteCardProps {
  handleClick: (content: string) => void;
}

const NewNoteCard = ({ handleClick }: NewNoteCardProps) => {
  const [shouldShowOnBoarding, setShouldShowOnBoarding] =
    useState<boolean>(true);
  const [content, setContent] = useState<Content>({
    content: "",
  });
  const [isRecording, setIsRecording] = useState<boolean>(false);

  const handleStartEditor = () => {
    setShouldShowOnBoarding(false);
  };

  const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault();

    setContent((prevContent) => {
      return { ...prevContent, [e.target.name]: e.target.value };
    });

    if (e.target.value === "") {
      setShouldShowOnBoarding(true);
    }
  };

  const handleStartRecording = () => {
    setIsRecording(true);
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  const handleSaveNote = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if(content.content === ""){
      return
    }
    handleClick(content.content);
    setContent({ content: "" });
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
            Grave uma nota em um áudio que sera convertida para texto
            automaticamente
          </p>
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="inset-0 fixed bg-black/50" />
        <Dialog.Content className="fixed overflow-hidden  left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[640px] w-full bg-slate-700 rounded-md flex flex-col outline-none h-[60vh]">
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
                  value={content.content}
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
