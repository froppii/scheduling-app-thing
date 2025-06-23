import { Note } from "../types/Note";
import { ForceGraph2D } from "react-force-graph";

function extractLinks(notes: Note[]) {
    const links: { source: string; target: string }[] = [];
    const idMap = new Set(notes.map((n) => n.title || n.id));

    notes.forEach((note) => {
        const matches = note.content.match(/\[\[(.*?)\]\]/g);
        if (matches) {
            matches.forEach((match: string) => {
                const target = match.replace("[[", "").replace("]]", "");
                if (idMap.has(target)) {
                    links.push({ source: note.title || note.id, target });
                }
            });
        }
    });

    return links;
}

export default function GraphView({ notes }: { notes: Note[] }) {
    const nodes = notes.map((note) => ({ id: note.title || note.id }));
    const links = extractLinks(notes);

    return (
        <div className="w-full h-full">
            <ForceGraph2D
            graphDate={{ nodes, links }}
            nodeLabel="id"
            nodeAutoColorBy="id"
            width={window.innerWidth - 80}
            height={window.innerHeight - 40}
            />
        </div>
    );
}