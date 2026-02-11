"use client";

import { toast } from "sonner";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, FileText, Type, Image as ImageIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import AnalyzeButton from "@/components/smart-add/analyze-button";
import { motion, AnimatePresence } from "framer-motion";

interface SmartAddInputProps {
    onAnalyze: (file: File | null, text: string | null) => Promise<void>;
    isAnalyzing: boolean;
}

type InputMode = "upload" | "text";

export default function SmartAddInput({
    onAnalyze,
    isAnalyzing,
}: SmartAddInputProps) {
    const t = useTranslations("SmartAddPage");
    const [file, setFile] = useState<File | null>(null);
    const [inputMode, setInputMode] = useState<InputMode>("upload");
    const [textInput, setTextInput] = useState("");

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            const selectedFile = acceptedFiles[0];
            if (selectedFile) {
                if (selectedFile.size > 10 * 1024 * 1024) {
                    toast.error(t("fileSizeLimitExceeded"));
                    return;
                }
                setFile(selectedFile);
            }
        },
        [t],
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        maxFiles: 1,
        accept: {
            "image/jpeg": [],
            "image/png": [],
            "image/webp": [],
            "image/heic": [],
            "image/heif": [],
            "application/pdf": [],
            "text/plain": [],
        },
    });

    const removeFile = (e: React.MouseEvent) => {
        e.stopPropagation();
        setFile(null);
    };

    const handleAnalyze = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (inputMode === "upload" && !file) return;
        if (inputMode === "text" && !textInput.trim()) return;

        await onAnalyze(
            inputMode === "upload" ? file : null,
            inputMode === "text" ? textInput : null,
        );
    };

    const switchToMode = (mode: InputMode) => {
        setInputMode(mode);
        if (mode === "text") {
            setFile(null);
        } else {
            setTextInput("");
        }
    };

    const canAnalyze =
        inputMode === "upload" ? !!file : textInput.trim().length > 0;

    return (
        <div className="mx-auto min-h-[450px] w-full max-w-xl space-y-8">
            <div className="flex justify-center gap-2">
                <button
                    onClick={() => switchToMode("upload")}
                    disabled={isAnalyzing}
                    className={`flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-sm font-medium tracking-wider transition-all duration-300 ${isAnalyzing ? "cursor-not-allowed opacity-50" : ""} ${
                        inputMode === "upload"
                            ? "bg-subflow-600 text-subflow-50"
                            : "bg-subflow-800/50 text-subflow-400 hover:bg-subflow-800 hover:text-subflow-300"
                    }`}
                >
                    <Upload size={16} strokeWidth={2.5} />
                    {t("uploadTab")}
                </button>
                <button
                    onClick={() => switchToMode("text")}
                    disabled={isAnalyzing}
                    className={`flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-sm font-medium tracking-wider transition-all duration-300 ${isAnalyzing ? "cursor-not-allowed opacity-50" : ""} ${
                        inputMode === "text"
                            ? "bg-subflow-600 text-subflow-50"
                            : "bg-subflow-800/50 text-subflow-400 hover:bg-subflow-800 hover:text-subflow-300"
                    }`}
                >
                    <Type size={16} strokeWidth={2.5} />
                    {t("textTab")}
                </button>
            </div>

            <AnimatePresence mode="wait">
                {inputMode === "upload" ? (
                    <motion.div
                        key="upload-mode"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div
                            {...getRootProps()}
                            className={`group relative flex h-[300px] w-full cursor-pointer flex-col items-center justify-center rounded-3xl border-3 border-dashed transition-all duration-300 ease-in-out ${isDragActive ? "border-subflow-400 bg-subflow-800/50" : "border-subflow-700 bg-subflow-800/20 hover:border-subflow-500 hover:bg-subflow-800/30"} `}
                        >
                            <input {...getInputProps()} />

                            <AnimatePresence mode="wait">
                                {!file ? (
                                    <motion.div
                                        key="upload-prompt"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="flex flex-col items-center justify-center space-y-4 p-8 text-center"
                                    >
                                        <div className="bg-subflow-800 rounded-full p-4 shadow-xl shadow-black/20 transition-transform duration-300 group-hover:scale-110">
                                            <Upload className="text-subflow-300 group-hover:text-subflow-100 h-8 w-8" />
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-subflow-200 text-xl font-medium">
                                                {isDragActive
                                                    ? t("dropHere")
                                                    : t("uploadPrompt")}
                                            </p>
                                            <p className="text-subflow-500 text-sm">
                                                {t("dragDropHint")}
                                            </p>
                                        </div>
                                        <div className="text-subflow-600 flex gap-2 pt-4 font-mono text-xs">
                                            <span className="bg-subflow-900/50 rounded px-2 py-1">
                                                JPG
                                            </span>
                                            <span className="bg-subflow-900/50 rounded px-2 py-1">
                                                PNG
                                            </span>
                                            <span className="bg-subflow-900/50 rounded px-2 py-1">
                                                PDF
                                            </span>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="file-preview"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="relative flex h-full w-full flex-col items-center justify-center p-4"
                                    >
                                        <button
                                            onClick={removeFile}
                                            disabled={isAnalyzing}
                                            className={`bg-subflow-700/50 text-subflow-100 absolute top-4 right-4 z-10 cursor-pointer rounded-full p-2 transition-colors ${isAnalyzing ? "cursor-not-allowed opacity-50" : "hover:bg-subflow-700/70 hover:text-subflow-100"}`}
                                        >
                                            <X size={20} />
                                        </button>

                                        <div className="flex flex-col items-center">
                                            {file.type.startsWith("image/") ? (
                                                <ImageIcon className="text-subflow-400 mb-3 h-16 w-16" />
                                            ) : (
                                                <FileText className="text-subflow-400 mb-3 h-16 w-16" />
                                            )}
                                            <p className="text-subflow-200 max-w-[250px] truncate text-center font-medium">
                                                {file.name}
                                            </p>
                                            <p className="text-subflow-500 mt-1 text-xs">
                                                {(file.size / 1024).toFixed(1)}{" "}
                                                KB
                                            </p>
                                        </div>

                                        <div className="mt-8">
                                            <AnalyzeButton
                                                onClick={handleAnalyze}
                                                isAnalyzing={isAnalyzing}
                                                disabled={!file}
                                                text={t("analyze")}
                                                analyzingText={t("analyzing")}
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="text-mode"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="border-subflow-700 bg-subflow-800/20 relative flex w-full flex-col rounded-3xl border-3 border-dashed p-4 sm:p-6"
                    >
                        <div className="text-subflow-400 mb-4 flex items-center gap-2">
                            <Type size={20} strokeWidth={2.5} />
                            <p className="text-sm tracking-wider">
                                {t("textInputHint")}
                            </p>
                        </div>

                        <div
                            className={`border-subflow-700 focus-within:border-subflow-500 overflow-hidden rounded-xl border-2 transition-colors ${isAnalyzing ? "cursor-not-allowed opacity-50" : ""}`}
                        >
                            <textarea
                                value={textInput}
                                onChange={(e) => setTextInput(e.target.value)}
                                placeholder={t("textInputPlaceholder")}
                                disabled={isAnalyzing}
                                className="bg-subflow-900/50 text-subflow-100 placeholder-subflow-600 custom-scrollbar min-h-[180px] w-full resize-none p-3 tracking-wider focus:outline-none"
                            />
                        </div>

                        <div className="mt-6 flex justify-center">
                            <AnalyzeButton
                                onClick={handleAnalyze}
                                isAnalyzing={isAnalyzing}
                                disabled={!canAnalyze}
                                text={t("analyze")}
                                analyzingText={t("analyzing")}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
