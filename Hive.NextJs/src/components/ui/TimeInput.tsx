import { Clock } from "lucide-react";
type TimeInputProps = {
    value: string | undefined;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    error?: string;
    className?: string;
};

export function TimeInput({
    value,
    onChange,
    placeholder = "08:00",
    error,
    className = "",
}: TimeInputProps) {
    return (
        <div className={`${className} relative w-[80px] sm:w-[100px] md:w-[100px] lg:w-[120px] xl:w-[150px] 2xl:w-[180px]`}>
            <input
                type="time"
                step={60}
                className={`w-full border rounded px-0 py-2 ${error ? "border-red-500" : "border-gray-300"
                    } ${!value ? "text-transparent" : "text-gray-900"}`}
                value={value || ""}
                onChange={onChange}
                aria-invalid={!!error}
                aria-describedby={error ? "error-msg" : undefined}
                placeholder=""
            />

            {!value && (
                <>
                    <span className="pointer-events-none absolute left-1 top-1/2 -translate-y-1/2 text-gray-400">
                        {placeholder}
                    </span>
                    <span className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2">

                        <Clock className="text-primary w-4 h-4" />
                    </span>
                </>
            )}

            {error && (
                <p
                    id="error-msg"
                    className="mt-1 text-sm text-red-600 absolute left-0 top-full"
                    role="alert"
                >
                    {error}
                </p>
            )}
        </div>
    );
}