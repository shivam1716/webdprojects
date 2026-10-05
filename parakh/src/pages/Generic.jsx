export default function Generic({title,eyebrow='Parakh'}){
 return <div><div className="eyebrow">{eyebrow}</div><h1 className="serif text-5xl mt-2">{title}</h1><div className="panel p-10 mt-7 max-w-3xl min-h-[280px] flex items-center justify-center text-center"><div><div className="serif text-3xl">No {title.toLowerCase()} yet.</div><p className="text-muted text-sm mt-2">Run a workflow to bring real results into this view.</p></div></div></div>
}
