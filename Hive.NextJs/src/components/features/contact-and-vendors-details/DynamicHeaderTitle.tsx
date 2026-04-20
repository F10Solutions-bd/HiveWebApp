interface DynamicHeader {
    title: string;
}

export default function DynamicHeaderTitle({ title }: DynamicHeader) {
    return (
        <h3 className="text-2xl font-bold text-white text-center bg-cyan-700 py-1 shadow pl-4">
            {title}
        </h3>
    );
}
