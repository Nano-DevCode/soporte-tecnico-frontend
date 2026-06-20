interface TextHighlighterProps {
    text: string;
    search?: string;
}

const accentMap: Record<string, string> = {
    a: '[aáàäâ]',
    e: '[eéèëê]',
    i: '[iíìïî]',
    o: '[oóòöô]',
    u: '[uúùüû]',
};

// 1. ¡Movimos la función pura AFUERA del componente!
const escapeRegExp = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const TextHighlighter = ({ text, search }: TextHighlighterProps) => {
    if (!text || !search || search.trim() === '') {
        return <>{text}</>;
    }

    const cleanSearch = search.replace(/[¿?.,!¡"']/g, '').trim();

    const searchWords = cleanSearch
        .split(/\s+/)
        .filter((word) => word.length > 2);

    if (searchWords.length === 0) {
        return <>{text}</>;
    }

    const regexParts = searchWords.map((word) => {
        return escapeRegExp(word)
            .toLowerCase()
            .replace(/[aeiou]/g, (match) => accentMap[match] || match);
    });

    const regexStr = regexParts.join('|');
    const splitRegex = new RegExp(`(${regexStr})`, 'gi');
    const matchRegex = new RegExp(`^(${regexStr})$`, 'i');

    const parts = text.split(splitRegex);

    return (
        <>
            {parts.map((part, index) => {
                // 2. Creamos una key estable combinando el texto y la posición
                const uniqueKey = `${part}-${index}`; 

                if (matchRegex.test(part)) {
                    return (
                        <mark
                            key={uniqueKey}
                            className="bg-yellow-200 text-yellow-900 rounded-[2px] px-0.5 font-medium dark:bg-yellow-500/30 dark:text-yellow-200"
                        >
                            {part}
                        </mark>
                    );
                }
                return <span key={uniqueKey}>{part}</span>;
            })}
        </>
    );
};