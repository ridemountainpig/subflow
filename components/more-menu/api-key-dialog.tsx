"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { KeyRound, LoaderCircle, Copy, Check, Trash2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

import { createApiKey, listApiKeys, revokeApiKey } from "@/app/actions/api-key";

export interface ApiKeyDialogProps {
    setDropdownMenuOpen: (open: boolean) => void;
    autoOpen?: boolean;
}

interface ApiKeyItem {
    _id: string;
    name: string;
    keyPrefix: string;
    lastUsedAt?: string;
    createdAt: string;
}

export default function ApiKeyDialog({
    setDropdownMenuOpen,
    autoOpen = false,
}: ApiKeyDialogProps) {
    const t = useTranslations("MoreMenu.apiKeyDialog");
    const [open, setOpen] = useState(autoOpen);

    const [keyName, setKeyName] = useState("");
    const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>([]);
    const [createdKey, setCreatedKey] = useState<string | null>(null);
    const [creating, setCreating] = useState(false);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const fetchApiKeys = useCallback(async () => {
        setLoading(true);
        try {
            const keys = await listApiKeys();
            setApiKeys(keys);
        } catch {
            toast.error(t("fetchFailed"));
        } finally {
            setLoading(false);
        }
    }, [t]);

    useEffect(() => {
        if (open) {
            fetchApiKeys();
            setCreatedKey(null);
            setKeyName("");
            setCopied(false);
        }
    }, [open, fetchApiKeys]);

    const handleCreate = async () => {
        if (creating || !keyName.trim()) return;
        setCreating(true);
        try {
            const result = await createApiKey(keyName.trim());
            if ("error" in result) {
                if (result.error === "LIMIT_REACHED") {
                    toast.error(t("limitReached"));
                } else {
                    toast.error(t("createFailed"));
                }
                return;
            }
            setCreatedKey(result.secretKey);
            setKeyName("");
            await fetchApiKeys();
            toast.success(t("createSuccess"));
        } catch {
            toast.error(t("createFailed"));
        } finally {
            setCreating(false);
        }
    };

    const handleCopy = async () => {
        if (!createdKey) return;
        await navigator.clipboard.writeText(createdKey);
        setCopied(true);
        toast.success(t("copied"));
        setTimeout(() => setCopied(false), 2000);
    };

    const handleRevoke = async (id: string) => {
        setDeletingId(id);
        try {
            const result = await revokeApiKey(id);
            if ("error" in result) {
                toast.error(t("revokeFailed"));
                return;
            }
            setApiKeys((prev) => prev.filter((k) => k._id !== id));
            toast.success(t("revokeSuccess"));
        } catch {
            toast.error(t("revokeFailed"));
        } finally {
            setDeletingId(null);
        }
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(open) => {
                setOpen(open);
                if (!open) {
                    setDropdownMenuOpen(false);
                }
            }}
        >
            <DialogTrigger title="API Keys">
                <DropdownMenuItem
                    className="cursor-pointer"
                    onSelect={(e) => {
                        e.preventDefault();
                        setOpen(true);
                    }}
                >
                    <KeyRound
                        strokeWidth={2.8}
                        className="h-5 w-5 text-black"
                    />
                    <span>{t("title")}</span>
                </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="bg-subflow-900 border-subflow-100 w-120 rounded-2xl border-[3px] p-3 select-none sm:p-4">
                <DialogHeader className="text-left">
                    <DialogTitle className="text-subflow-50 text-lg tracking-widest">
                        {t("title")}
                    </DialogTitle>
                    <DialogDescription className="text-subflow-300 text-xs tracking-widest sm:text-sm">
                        {t("description")}
                    </DialogDescription>

                    {/* Created Key Display */}
                    {createdKey && (
                        <div className="bg-subflow-800 border-subflow-500 mt-2 rounded-lg border p-3">
                            <p className="text-subflow-200 mb-1 text-xs tracking-widest">
                                {t("createdKeyWarning")}
                            </p>
                            <div className="bg-subflow-700 mt-2 flex items-center gap-2 rounded-lg px-2 py-2">
                                <code className="text-subflow-50 flex-1 overflow-x-auto text-xs break-all select-text">
                                    {createdKey}
                                </code>
                                <button
                                    onClick={handleCopy}
                                    className="text-subflow-200 hover:text-subflow-50 cursor-pointer transition-colors"
                                >
                                    {copied ? (
                                        <Check size={16} />
                                    ) : (
                                        <Copy size={16} />
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Create New Key */}
                    <div className="mt-2 flex gap-2">
                        <Input
                            type="text"
                            placeholder={t("namePlaceholder")}
                            maxLength={50}
                            className="text-subflow-800 bg-subflow-100 h-10 flex-1 rounded-md text-xs tracking-widest sm:text-base"
                            value={keyName}
                            onChange={(e) => setKeyName(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleCreate();
                            }}
                        />
                        <button
                            className={`bg-subflow-600 text-subflow-50 h-10 rounded-md px-4 text-xs tracking-widest sm:text-base ${
                                creating || !keyName.trim()
                                    ? "cursor-not-allowed opacity-50"
                                    : "cursor-pointer"
                            }`}
                            onClick={handleCreate}
                            disabled={creating || !keyName.trim()}
                        >
                            {creating ? (
                                <LoaderCircle
                                    className="animate-spin"
                                    size={18}
                                    strokeWidth={3}
                                />
                            ) : (
                                t("create")
                            )}
                        </button>
                    </div>

                    {/* Key List */}
                    <div className="custom-scrollbar mt-3 max-h-60 overflow-y-auto">
                        {loading ? (
                            <div className="flex items-center justify-center py-4">
                                <LoaderCircle
                                    className="text-subflow-300 animate-spin"
                                    size={24}
                                    strokeWidth={3}
                                />
                            </div>
                        ) : apiKeys.length === 0 ? (
                            <div className="border-subflow-500 flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed py-8">
                                <KeyRound
                                    className="text-subflow-300"
                                    size={20}
                                    strokeWidth={2.2}
                                />
                                <p className="text-subflow-400 text-center text-sm tracking-widest">
                                    {t("noKeys")}
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                {apiKeys.map((key) => (
                                    <div
                                        key={key._id}
                                        className="bg-subflow-800 flex items-center justify-between rounded-lg px-3 py-2"
                                    >
                                        <div className="text-subflow-50 min-w-0 flex-1">
                                            <p className="truncate text-sm tracking-widest">
                                                {key.name}
                                            </p>
                                            <div className="flex items-center gap-2 text-xs">
                                                <code>{key.keyPrefix}</code>
                                                <span>·</span>
                                                <code>
                                                    {formatDate(key.createdAt)}
                                                </code>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() =>
                                                handleRevoke(key._id)
                                            }
                                            disabled={deletingId === key._id}
                                            className="text-subflow-400 ml-2 cursor-pointer transition-colors hover:text-red-400"
                                        >
                                            {deletingId === key._id ? (
                                                <LoaderCircle
                                                    className="animate-spin"
                                                    size={16}
                                                    strokeWidth={3}
                                                />
                                            ) : (
                                                <Trash2 size={16} />
                                            )}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
