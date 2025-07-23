export function percentile(data, value){
        if(!data || !data.length) return 0;
        const sorted = data.slice().sort((a, b) => a - b);
        const index = sorted.findIndex(v => v >= value);
        return index === -1 ? 100 : (index / sorted.length) * 100;
}

export function ranking(data, value){
        if(!data || !data.length) return 0;
        const sorted = data.slice().sort((a, b) => a - b);
        const index = sorted.findIndex(v => v >= value);
        return index === -1 ? sorted.length : index + 1;
}