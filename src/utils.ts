export function formatTime(time: number): string {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export function truncate(str: string, length: number): string {
    str = str.trim();
    return str.length > length ? str.substring(0, length) + '...' : str;
}

export function selectRandom<T>(arr: T[], count: number): T[] {
    const copy = [...arr];
    const result: T[] = [];

    while (result.length < count && copy.length > 0) {
        const index = Math.floor(Math.random() * copy.length);
        result.push(copy[index]);
        copy.splice(index, 1);
    }

    return result;
}
