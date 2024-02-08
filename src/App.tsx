import { ChangeEvent, useState } from "react";
import logo from "./assets/logo-nlw-expert.svg";
import NewNoteCard from "./components/new-note-card";
import NoteCard from "./components/note-card";

interface Note {
  id: string;
  date: Date;
  content: string;
}

function App() {
  const [search, setSearch] = useState<string>("");
  const [notes, setNotes] = useState<Note[]>(() => {
    const notesOnStorage = localStorage.getItem("notes");

    if (notesOnStorage) {
      return JSON.parse(notesOnStorage);
    } else {
      return [];
    }
  });

  const onNoteCreate = (content: string) => {
    const newNote = {
      id: crypto.randomUUID(),
      date: new Date(),
      content,
    };

    const notesArray = [newNote, ...notes];

    setNotes(notesArray);

    localStorage.setItem("notes", JSON.stringify(notesArray));
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;

    setSearch(query);
  };

  const filteredNotes =
    search != ""
      ? notes.filter((note) =>
          note.content.toLocaleLowerCase().includes(search.toLocaleLowerCase())
        )
      : notes;

      const handleDeleteNote = (id: string) =>{
          const notesArray = notes.filter((note) => {
            return note.id !== id
          })

          setNotes(notesArray)

          localStorage.setItem("notes", JSON.stringify(notesArray))
      }

  return (
    <div className="mx-auto max-w-6xl my-12 space-y-6 px-5">
      <img src={logo} alt="logo" />

      <form>
        <input
          type="text"
          placeholder="Busque por uma nota..."
          className="w-full bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder:text-slate-500"
          onChange={handleSearch}
          value={search}
        />
      </form>

      <div className="h-px bg-slate-700" />

      <div className="grid grid-col-1 md:grid-col-2 lg:grid-cols-3 gap-6 auto-rows-[250px]">
        <NewNoteCard handleClick={onNoteCreate} />

        {filteredNotes.map((note) => (
          <NoteCard note={note} key={note.id} handleClick={handleDeleteNote} />
        ))}
      </div>
    </div>
  );
}

export default App;
