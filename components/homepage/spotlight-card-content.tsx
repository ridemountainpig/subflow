interface SpotlightCardContentProps {
    icon: React.ReactNode;
    title: string;
    description: string | React.ReactNode;
}

export default function SpotlightCardContent({
    icon,
    title,
    description,
}: SpotlightCardContentProps) {
    return (
        <div className="flex flex-col gap-y-4">
            <div className="bg-subflow-900 flex h-12 w-12 items-center justify-center rounded-xl p-2">
                {icon}
            </div>
            <h3 className="text-subflow-200 text-2xl font-bold tracking-widest select-none">
                {title}
            </h3>
            <p className="text-subflow-50 text-base font-bold tracking-widest select-none">
                {description}
            </p>
        </div>
    );
}
