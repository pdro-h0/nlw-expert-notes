const NoteCard = () => {
  return (
    <button className="text-left outline-none rounded-md bg-slate-800 p-5 space-y-3 hover:ring-2 hover:ring-slate-700 focus-visible:ring-2 focus-visible:ring-lime-400">
      <span className="text-sm font-medium text-slate-200">Há 7 dias</span>

      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias, vel.
      </p>
    </button>
  );
};

export default NoteCard;
