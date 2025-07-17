const names = [
    "Aria", "Brax", "Calen", "Dara", "Eldric",
    "Fira", "Galen", "Hara", "Ilan", "Jora",
    "Korin", "Lira", "Mira", "Neran", "Orin",
    "Prax", "Quin", "Risa", "Sorin", "Tara"
];

export const nameGeneratorTool = {
    name: "generate_name",
    description: "Generates random fantasy names",
    parameters: {
        type: "object",
        properties: {
            count: {
                type: "integer",
                description: "Number of names to generate",
                default: 1
            }
        }
    }
};

export function generate_name({ count = 1 }) {
    const result = [];
    for (let i = 0; i < count; i++) {
        const index = Math.floor(Math.random() * names.length);
        result.push(names[index]);
    }
    return result.join(', ');
}
