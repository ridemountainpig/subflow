interface AnalyzeButtonProps {
    onClick: (e: React.MouseEvent) => void;
    isAnalyzing: boolean;
    disabled?: boolean;
    text: string;
    analyzingText: string;
}

export default function AnalyzeButton({
    onClick,
    isAnalyzing,
    disabled,
    text,
    analyzingText,
}: AnalyzeButtonProps) {
    return (
        <button
            onClick={onClick}
            disabled={disabled || isAnalyzing}
            className={`text-subflow-50 flex cursor-pointer items-center gap-2 rounded-full px-6 py-2 font-bold transition-all duration-300 ${
                disabled || isAnalyzing
                    ? "bg-subflow-600/50 cursor-not-allowed"
                    : "bg-subflow-600 hover:bg-subflow-500 shadow-subflow-900/20 shadow-lg hover:scale-105"
            }`}
        >
            {isAnalyzing ? (
                <span className="tracking-wider">{analyzingText}</span>
            ) : (
                <span className="tracking-wider">{text}</span>
            )}
        </button>
    );
}
